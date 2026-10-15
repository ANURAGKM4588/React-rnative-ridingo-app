import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext(null);

export const DEFAULT_USER = {
  id: 'RDU-10001',
  name: 'Arjun Menon',
  phone: '+91 98401 23456',
  email: 'arjun.menon@example.com',
  rating: 4.9,
  walletBalance: 850,
  sosContacts: [{ name: 'Priya Menon', relation: 'Spouse', phone: '+91 98401 98765' }],
  preferences: {
    quietRide: true,
    acMode: 'Chill (22°C)',
    preCool: true,
  }
};

export const SAMPLE_TRIPS = [
  {
    id: 'TRIP-9081',
    date: 'Today, 2:45 PM',
    status: 'Completed',
    fare: 340,
    vehicle: 'Sedan (Honda City)',
    driverName: 'Ravi Kumar',
    driverRating: 4.95,
    pickup: 'Indiranagar 100ft Road',
    dropoff: 'MG Road Metro Station',
    paymentMethod: 'UPI (PhonePe)'
  },
  {
    id: 'TRIP-8842',
    date: 'Yesterday, 8:15 PM',
    status: 'Completed',
    fare: 520,
    vehicle: 'SUV (Innova Crysta)',
    driverName: 'Suresh Raina',
    driverRating: 4.88,
    pickup: 'Koramangala 4th Block',
    dropoff: 'Kempegowda Int. Airport',
    paymentMethod: 'Ridingo Wallet'
  }
];

export function UserProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [trips, setTrips] = useState(SAMPLE_TRIPS);
  const [activeRide, setActiveRide] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('Indiranagar, Bangalore');
  const [dropLocation, setDropLocation] = useState('Whitefield IT Park, Bangalore');
  const [selectedRideType, setSelectedRideType] = useState('prime_sedan');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: '50% Cashback Added', time: '1h ago', read: false },
    { id: '2', title: 'Driver Ravi Kumar accepted your booking', time: '3h ago', read: true },
  ]);

  // Sync recent trips from Supabase if table exists
  useEffect(() => {
    async function loadTrips() {
      try {
        const { data } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (data && data.length > 0) {
          // Merge with sample trips for rich presentation
          setTrips(prev => [...data, ...prev]);
        }
      } catch (e) {
        console.log('[UserContext] Supabase trips fetch notice:', e.message);
      }
    }
    loadTrips();
  }, []);

  const bookRide = (rideOption) => {
    const newRide = {
      id: 'TRP-' + Math.floor(1000 + Math.random() * 9000),
      status: 'finding_driver',
      rideType: rideOption?.name || 'Prime Sedan',
      fare: rideOption?.price || 280,
      pickup: pickupLocation,
      dropoff: dropLocation,
      driver: {
        name: 'Ravi Kumar',
        rating: 4.96,
        vehicle: 'White Swift Dzire (KA 03 MB 4421)',
        phone: '+91 94471 23456',
        etaMinutes: 4,
      },
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString()
    };
    setActiveRide(newRide);
    setIsBookingOpen(false);
    setIsLiveTrackingOpen(true);
  };

  const cancelActiveRide = () => {
    setActiveRide(null);
    setIsLiveTrackingOpen(false);
  };

  const topupWallet = (amount) => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        trips,
        activeRide,
        setActiveRide,
        pickupLocation,
        setPickupLocation,
        dropLocation,
        setDropLocation,
        selectedRideType,
        setSelectedRideType,
        isBookingOpen,
        setIsBookingOpen,
        isLiveTrackingOpen,
        setIsLiveTrackingOpen,
        notifications,
        setNotifications,
        bookRide,
        cancelActiveRide,
        topupWallet,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
