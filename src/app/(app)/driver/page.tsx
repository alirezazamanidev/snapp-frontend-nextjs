'use client';

import { useSocket } from '@/libs/hooks/useSocket';
import { LatLng } from '@/libs/types/coordinate.type';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const DriverMap = dynamic(() => import('@/components/driver/dirver-map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function DriverPage() {
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    [number, number][] | null
  >(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [isWaitingForPassenger, setIsWaitingForPassenger] = useState(false);
  const { socket } = useSocket({ namespace: 'driver' });

  useEffect(() => {
    socket?.on('ride.requested',(data)=>{
        console.log('ride found',data);
    })
  }, [socket]);
  useEffect(() => {
    const status = localStorage.getItem('driver-status');
    if (status === 'waiting-for-passenger') {
      setIsWaitingForPassenger(true);
    }
  }, []);

  const handleStartWaitingForPassenger = () => {
    localStorage.setItem('driver-status', 'waiting-for-passenger');
    setIsWaitingForPassenger(true);
    socket?.emit('update-location', {
      latitude: currentLocation?.lat,
      longitude: currentLocation?.lng,
    });
  };

  const handleStopWaiting = () => {
    localStorage.removeItem('driver-status');
    setIsWaitingForPassenger(false);
    socket?.emit('driver-unavailable');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 md:hidden">
      {/* Map - 75% of screen */}
      <div className="h-3/4 relative overflow-hidden rounded-b-3xl shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <DriverMap
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          origin={origin}
          destination={destination}
          routeCoordinates={routeCoordinates}
        />
      </div>

      {/* Control Panel - 25% of screen */}
      <div className="h-1/4 bg-gradient-to-t from-gray-900 to-gray-800 p-6 flex flex-col justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-red-500/5 rounded-t-3xl"></div>
        <div className="relative z-10">
          {!isWaitingForPassenger ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text">
                  Driver Mode
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Set your location and start accepting passenger requests
              </p>
              <button
                onClick={handleStartWaitingForPassenger}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🚗 Start Accepting Rides
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
                  Waiting for Passengers
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                You are now available to receive ride requests
              </p>

              {/* Status Card */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 mb-3 border border-green-500/30 shadow-inner">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span className="text-green-400 text-sm font-medium">
                    Online & Available
                  </span>
                </div>
              </div>

              <button
                onClick={handleStopWaiting}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ⏹️ Stop Accepting Rides
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
