'use client';

import { useSocket } from '@/libs/hooks/useSocket';
import { Ride } from '@/libs/models/ride';
import { User } from '@/libs/models/user';
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
  const [rideRequest, setRideRequest] = useState<{
    ride: Ride;
    user: User;
  } | null>(null);
  const { socket } = useSocket({ namespace: 'driver' });

  // Load ride request from localStorage on component mount
  useEffect(() => {
    const savedRideRequest = localStorage.getItem('current-ride-request');
    if (savedRideRequest) {
      const parsedRequest = JSON.parse(savedRideRequest);
      setRideRequest(parsedRequest);
      setOrigin(parsedRequest.ride.pickupLocation);
      setDestination(parsedRequest.ride.destinationLocation);
    }
    const status = localStorage.getItem('driver-status');
    if (status === 'waiting-for-passenger') {
      setIsWaitingForPassenger(true);
    }
  }, []);

  useEffect(() => {
    socket?.on('ride.requested', (data: { ride: Ride; user: User }) => {
      console.log('ride found', data);
      setRideRequest(data);
      setOrigin(data.ride.pickupLocation);
      setDestination(data.ride.destinationLocation);
      // Save to localStorage
      localStorage.setItem('current-ride-request', JSON.stringify(data));
    });

    return () => {
      socket?.off('ride.requested');
    };
  }, [socket]);

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

  const handleAcceptRide = () => {
    if (rideRequest) {
      socket?.emit('ride-accepted', { rideId: rideRequest.ride.id });
      setRideRequest(null);
      // Remove from localStorage
      localStorage.removeItem('current-ride-request');
    }
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
          {rideRequest ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text">
                  New Ride Request
                </h3>
              </div>

              {/* Passenger Info Card */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 mb-3 border border-blue-500/30 shadow-inner">
                <div className="flex items-center space-x-3 mb-2">
                  {rideRequest.user.avatarUrl ? (
                    <img
                      src={rideRequest.user.avatarUrl}
                      alt={rideRequest.user.fullname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {rideRequest.user.fullname.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold">
                      {rideRequest.user.fullname}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {rideRequest.user.email}
                    </p>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <p className="text-green-400 font-bold text-lg">
                    ${rideRequest.ride.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  // onClick={handleRejectRide}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Reject
                </button>
                <button
                  onClick={handleAcceptRide}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Accept Ride
                </button>
              </div>
            </div>
          ) : !isWaitingForPassenger ? (
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
