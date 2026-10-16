import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Platform, AppState, Alert, Vibration } from 'react-native';
import { supabase } from '../lib/supabase';

const DriverContext = createContext(null);

export const DEFAULT_DRIVER = {
  id: 'DRV-5002',
  name: 'Ravi Kumar',
  phone: '+91 94471 23456',
  email: 'ravi.kumar@ridingo.partner',
  rating: 4.96,
  vehicleModel: 'Maruti Suzuki Dzire',
  vehicleNumber: 'KA 03 MB 4421',
  vehicleType: 'Prime Sedan',
  totalTrips: 1420,
  todayEarnings: 2450,
  weekEarnings: 14800,
  walletBalance: 3200,
  status: 'offline', // 'offline' | 'online' | 'on_trip'
  acceptanceRate: '98%',
  cancellationRate: '1.2%',
};

export const SAMPLE_DRIVER_REQUESTS = [
  {
    id: 'REQ-101',
    customerName: 'Pooja Hegde',
    customerRating: 4.9,
    pickup: 'Koramangala Sony World Signal',
    dropoff: 'Indiranagar 12th Main',
    distanceKm: 6.4,
    fare: 260,
    estimatedMinutes: 18,
    paymentMode: 'Cash / UPI Direct',
  }
];

export function DriverProvider({ children }) {
  const [driver, setDriver] = useState(DEFAULT_DRIVER);
  const [isOnline, setIsOnline] = useState(true); // Default to online so requests arrive immediately
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [earningsHistory, setEarningsHistory] = useState([
    { id: '1', date: 'Today, 2:30 PM', fare: 320, tip: 30, pickup: 'HSR Layout', dropoff: 'Koramangala' },
    { id: '2', date: 'Today, 11:15 AM', fare: 540, tip: 50, pickup: 'Electronic City', dropoff: 'MG Road' },
    { id: '3', date: 'Yesterday', fare: 1590, tip: 120, pickup: '4 Trips completed', dropoff: 'City Center' },
  ]);

  const channelRef = useRef(null);
  const pollTimerRef = useRef(null);

  // Safe native module vibration alert with fallback
  const triggerNativeAlert = useCallback(() => {
    try {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        Vibration.vibrate([0, 250, 150, 250]);
      }
    } catch (e) {
      // Non-fatal fallback
    }
  }, []);

  // Sync active trip requests directly from Supabase database
  const syncTripsFromDatabase = useCallback(async () => {
    if (!supabase || typeof supabase.from !== 'function') return;
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'requested')
        .order('when_ts', { ascending: false })
        .limit(5);

      if (!error && Array.isArray(data) && data.length > 0) {
        const latest = data[0];
        // Format incoming request
        const formattedReq = {
          id: latest.id,
          customerName: latest.rider?.name || 'Rider Partner',
          customerRating: 4.9,
          pickup: latest.pickup || 'Current Location',
          dropoff: latest.drop_loc || latest.dropoff || 'Selected Destination',
          distanceKm: latest.distance_km || 5.2,
          fare: Number(latest.fare) || 280,
          estimatedMinutes: latest.duration_mins || 15,
          paymentMode: 'UPI / Cash',
          startOtp: latest.startOtp || '4821',
          endOtp: latest.endOtp || '8392'
        };

        setIncomingRequest(prev => {
          if (!prev || prev.id !== formattedReq.id) {
            triggerNativeAlert();
            return formattedReq;
          }
          return prev;
        });
      } else if (!error && Array.isArray(data) && data.length === 0) {
        // If current incoming request is no longer 'requested', clear it
        setIncomingRequest(prev => {
          if (prev && !prev.id?.startsWith('REQ-')) {
            return null;
          }
          return prev;
        });
      }
    } catch (err) {
      console.log('[DriverContext] Supabase sync notice:', err.message);
    }
  }, [triggerNativeAlert]);

  // Handle toggling driver online status
  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      const nextState = !prev;
      setDriver(d => ({ ...d, status: nextState ? 'online' : 'offline' }));

      if (nextState) {
        syncTripsFromDatabase();
      } else {
        setIncomingRequest(null);
      }
      return nextState;
    });
  }, [syncTripsFromDatabase]);

  // Accept incoming trip request
  const acceptRequest = useCallback(async (req) => {
    const acceptedTrip = {
      ...req,
      status: 'arriving_at_pickup',
      otp: req.startOtp || '4821',
    };
    setCurrentTrip(acceptedTrip);
    setIncomingRequest(null);

    // Update Supabase in background
    try {
      if (supabase && req.id) {
        await supabase
          .from('trips')
          .update({
            status: 'accepted',
            driver: {
              name: driver.name,
              phone: driver.phone,
              vehicleNumber: driver.vehicleNumber,
              vehicleModel: driver.vehicleModel,
              rating: driver.rating
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', req.id);
      }
    } catch (e) {
      console.warn('[DriverContext] Accept update notice:', e.message);
    }
  }, [driver]);

  // Decline incoming ride request
  const declineRequest = useCallback(async (reqId) => {
    const targetId = reqId || incomingRequest?.id;
    setIncomingRequest(null);

    try {
      if (supabase && targetId) {
        await supabase
          .from('trips')
          .update({ status: 'declined', updated_at: new Date().toISOString() })
          .eq('id', targetId);
      }
    } catch (e) {}
  }, [incomingRequest?.id]);

  // Advance trip lifecycle step
  const advanceTripStep = useCallback(async () => {
    if (!currentTrip) return;

    if (currentTrip.status === 'arriving_at_pickup') {
      setCurrentTrip(t => ({ ...t, status: 'in_progress' }));
      try {
        if (supabase && currentTrip.id) {
          await supabase
            .from('trips')
            .update({ status: 'inprogress', updated_at: new Date().toISOString() })
            .eq('id', currentTrip.id);
        }
      } catch (e) {}
    } else if (currentTrip.status === 'in_progress') {
      // Complete trip: 30% platform commission deducted -> Driver receives 70% earnings
      const totalFare = Number(currentTrip.fare) || 280;
      const earnedFare = Math.round(totalFare * 0.70);
      
      // Generate unique 4-character OTP once payment is complete
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let completionOtp = '';
      for (let i = 0; i < 4; i++) {
        completionOtp += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      setDriver(d => ({
        ...d,
        todayEarnings: d.todayEarnings + earnedFare,
        walletBalance: d.walletBalance + earnedFare,
        totalTrips: d.totalTrips + 1,
      }));
      setEarningsHistory(prev => [
        {
          id: Date.now().toString(),
          date: 'Just now',
          fare: earnedFare,
          tip: 20,
          completionOtp,
          pickup: currentTrip.pickup,
          dropoff: currentTrip.dropoff,
        },
        ...prev,
      ]);

      try {
        if (supabase && currentTrip.id) {
          await supabase
            .from('trips')
            .update({
              status: 'completed',
              completion_otp: completionOtp,
              driver_earnings: earnedFare,
              updated_at: new Date().toISOString()
            })
            .eq('id', currentTrip.id);
        }
      } catch (e) {}

      setCurrentTrip(null);
    }
  }, [currentTrip]);

  // Initialize Native Modules and Supabase Realtime Channels
  useEffect(() => {
    let isMounted = true;

    // 1. Initial database sync
    syncTripsFromDatabase();

    // 2. Realtime Broadcast Channel & Database Change Listener
    try {
      if (supabase && typeof supabase.channel === 'function') {
        const channel = supabase.channel('ridingo_dispatch_bus', {
          config: { broadcast: { ack: true } }
        });

        channel
          .on('broadcast', { event: 'dispatch' }, ({ payload }) => {
            if (!isMounted) return;
            const type = payload?.type;
            const data = payload?.data || payload?.payload;

            if (type === 'TRIP_REQUESTED' && data) {
              setIncomingRequest({
                id: data.id,
                customerName: data.rider?.name || 'Rider',
                customerRating: 4.9,
                pickup: data.pickup || 'Pickup Location',
                dropoff: data.drop_loc || data.dropoff || 'Destination',
                distanceKm: data.distanceKm || 5.2,
                fare: Number(data.fare) || 280,
                estimatedMinutes: data.duration_mins || 15,
                paymentMode: 'UPI / Cash',
                startOtp: data.startOtp || '4821',
                endOtp: data.endOtp || '8392'
              });
              triggerNativeAlert();
            } else if (type === 'TRIP_CANCELLED' || type === 'TRIP_DECLINED') {
              setIncomingRequest(prev => (prev?.id === data?.tripId || prev?.id === data?.id ? null : prev));
              setCurrentTrip(prev => (prev?.id === data?.tripId || prev?.id === data?.id ? null : prev));
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
            if (!isMounted) return;
            if (payload.new) {
              const row = payload.new;
              if (row.status === 'requested') {
                setIncomingRequest({
                  id: row.id,
                  customerName: row.rider?.name || 'Rider',
                  customerRating: 4.9,
                  pickup: row.pickup || 'Pickup Location',
                  dropoff: row.drop_loc || row.dropoff || 'Destination',
                  distanceKm: row.distance_km || 5.2,
                  fare: Number(row.fare) || 280,
                  estimatedMinutes: row.duration_mins || 15,
                  paymentMode: 'UPI / Cash',
                  startOtp: row.startOtp || '4821',
                  endOtp: row.endOtp || '8392'
                });
                triggerNativeAlert();
              } else if (row.status === 'cancelled' || row.status === 'declined') {
                setIncomingRequest(prev => (prev?.id === row.id ? null : prev));
                setCurrentTrip(prev => (prev?.id === row.id ? null : prev));
              }
            }
          })
          .subscribe();

        channelRef.current = channel;
      }
    } catch (err) {
      console.warn('[DriverContext] Realtime subscription init:', err);
    }

    // 3. Resilient Polling Interval every 3.5 seconds
    pollTimerRef.current = setInterval(() => {
      if (isMounted) {
        syncTripsFromDatabase();
      }
    }, 3500);

    // 4. AppState listener for app resume from background
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        syncTripsFromDatabase();
      }
    });

    return () => {
      isMounted = false;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (appStateSub && typeof appStateSub.remove === 'function') appStateSub.remove();
      if (channelRef.current && supabase) {
        try { supabase.removeChannel(channelRef.current); } catch (e) {}
      }
    };
  }, [syncTripsFromDatabase, triggerNativeAlert]);

  return (
    <DriverContext.Provider
      value={{
        driver,
        setDriver,
        isOnline,
        toggleOnline,
        incomingRequest,
        acceptRequest,
        declineRequest,
        currentTrip,
        advanceTripStep,
        earningsHistory,
        syncTrips: syncTripsFromDatabase,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  const ctx = useContext(DriverContext);
  if (!ctx) throw new Error('useDriver must be used within DriverProvider');
  return ctx;
}
