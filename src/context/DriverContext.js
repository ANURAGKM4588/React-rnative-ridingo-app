import React, { createContext, useContext, useState } from 'react';

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
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [earningsHistory, setEarningsHistory] = useState([
    { id: '1', date: 'Today, 2:30 PM', fare: 320, tip: 30, pickup: 'HSR Layout', dropoff: 'Koramangala' },
    { id: '2', date: 'Today, 11:15 AM', fare: 540, tip: 50, pickup: 'Electronic City', dropoff: 'MG Road' },
    { id: '3', date: 'Yesterday', fare: 1590, tip: 120, pickup: '4 Trips completed', dropoff: 'City Center' },
  ]);

  // Handle toggling driver online status
  const toggleOnline = () => {
    setIsOnline(prev => {
      const nextState = !prev;
      setDriver(d => ({ ...d, status: nextState ? 'online' : 'offline' }));
      
      // Simulate incoming ride request after going online
      if (nextState && !incomingRequest && !currentTrip) {
        setTimeout(() => {
          setIncomingRequest(SAMPLE_DRIVER_REQUESTS[0]);
        }, 3500);
      } else {
        setIncomingRequest(null);
      }
      return nextState;
    });
  };

  const acceptRequest = (req) => {
    setCurrentTrip({
      ...req,
      status: 'arriving_at_pickup',
      otp: '4821',
    });
    setIncomingRequest(null);
  };

  const declineRequest = () => {
    setIncomingRequest(null);
  };

  const advanceTripStep = () => {
    if (!currentTrip) return;
    if (currentTrip.status === 'arriving_at_pickup') {
      setCurrentTrip(t => ({ ...t, status: 'in_progress' }));
    } else if (currentTrip.status === 'in_progress') {
      // Complete trip
      const earnedFare = currentTrip.fare;
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
          pickup: currentTrip.pickup,
          dropoff: currentTrip.dropoff,
        },
        ...prev,
      ]);
      setCurrentTrip(null);
    }
  };

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
