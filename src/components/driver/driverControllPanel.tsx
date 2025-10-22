'use client';

import { useSocket } from '@/libs/contexts/SocketContext';
import { Ride } from '@/libs/models/ride';
import { User } from '@/libs/models/user';
import { LatLng } from '@/libs/types/coordinate.type';
import { useEffect, useState } from 'react';

export default function DriverControllPanel({
  origin,
  rideRequest=null,
}: {
  origin: LatLng;
  rideRequest?: { ride: Ride; user: User } | null;
}) {
  const { socket } = useSocket();
  const [isWaitingForPassenger, setIsWaitingForPassenger] = useState(false);
  useEffect(()=>{
    setIsWaitingForPassenger(localStorage.getItem('waiting-for-passenger')==='true');
  },[])


  const handleStartWaitingForPassenger = () => {

    socket?.emit('driver-online', {
      location: origin,
    });
    setIsWaitingForPassenger(true);
    localStorage.setItem('waiting-for-passenger', 'true');
  };
  const handleStopWaiting = () => {

    socket?.emit('driver-offline');
    localStorage.removeItem('waiting-for-passenger');
    setIsWaitingForPassenger(false);
    6;
  };
  return (
    <div className="h-1/4 bg-gradient-to-t from-gray-900 to-gray-800 p-6 flex flex-col justify-center relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-yellow-500/5 to-red-500/5 rounded-t-3xl"></div>
      <div className="relative z-10">
        {/* Ride Request UI */}
        {rideRequest ? (
          <RideRequestUI rideRequest={rideRequest} />
        ) : !isWaitingForPassenger ? (
          // Driver Offline State
          <div className="text-center space-y-4">
            {/* Header */}
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse mr-2"></div>
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text">
                Driver Mode
              </h3>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartWaitingForPassenger}
              className="w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              🚗 Start Accepting Passengers
            </button>
          </div>
        ) : (
          // Driver Online/Waiting State
          <div className="text-center space-y-4">
            {/* Header */}
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
                Waiting for Passengers
              </h3>
            </div>
            {/* Status Message */}
            <p className="text-gray-300 text-sm leading-relaxed">
              You are currently ready to receive ride requests
            </p>

            {/* Online Status Card */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 mb-3 border border-green-500/30 shadow-inner">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-green-400 text-sm font-medium">
                  Online and Available
                </span>
              </div>
            </div>

            {/* Stop Button */}
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
  );
}

function RideRequestUI({
  rideRequest,
}: {
  rideRequest: { ride: Ride; user: User };
}) {
  const handleRejectRide = () => {
    // socket?.emit('ride-rejected', { rideId: rideRequest.ride.id });/
  };
  const handleAcceptRide = () => {
    // socket?.emit('ride-accepted', { rideId: rideRequest.ride.id });
  };
  return (
    <div className="text-center space-y-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
        <h3 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text">
          New Ride Request
        </h3>
      </div>

      {/* Passenger Information Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 mb-3 border border-blue-500/30 shadow-inner">
        <div className="flex items-center space-x-3 mb-2">
          {/* Passenger Avatar */}
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
          {/* Passenger Details */}
          <div className="text-left flex-1">
            <p className="text-white font-semibold">
              {rideRequest.user.fullname}
            </p>
            <p className="text-gray-300 text-sm">{rideRequest.user.email}</p>
          </div>
        </div>
        {/* Ride Price */}
        <div className="text-center mt-3">
          <p className="text-green-400 font-bold text-lg">
            {rideRequest.ride.price.toLocaleString()} Toman
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleRejectRide}
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
  );
}
