'use client';

import DriverControllPanel from '@/components/driver/driverControllPanel';
import { useSocket } from '@/libs/contexts/SocketContext';
import { Ride } from '@/libs/models/ride';
import { User } from '@/libs/models/user';
import { LatLng } from '@/libs/types/coordinate.type';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamic import for DriverMap component with loading state
const DriverMap = dynamic(() => import('@/components/driver/dirver-map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function DriverPage() {
  // State for driver's current location
  const [currentLocation, setCurrentLocation] = useState<LatLng>({
    lat: 35.6892,
    lng: 51.389,
  });
  
  // State for incoming ride requests
  const [rideRequest, setRideRequest] = useState<{
    ride: Ride;
    user: User;
  } | null>(null);
  
  // Socket connection for real-time communication
  const { socket } = useSocket();
  // Socket event listener for incoming ride requests
  useEffect(() => {
    socket?.on('ride.requested', (data: { ride: Ride; user: User }) => {
      console.log('ride found', data);
      setRideRequest(data);
      // Save to localStorage for persistence
      localStorage.setItem('current-ride-request', JSON.stringify(data));
    });
  }, [socket]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 md:hidden">
      {/* Map Section - Takes 75% of screen height */}
      <div className="h-3/4 relative overflow-hidden rounded-b-3xl shadow-2xl">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
       

        {/* Map Component */}
        <DriverMap
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          origin={rideRequest?.ride.pickupLocation || null}
          destination={rideRequest?.ride.destinationLocation || null}
        />
      </div>

      {/* Control Panel - Takes 25% of screen height */}
      <DriverControllPanel origin={currentLocation} rideRequest={rideRequest} />
    </div>
  );
}
