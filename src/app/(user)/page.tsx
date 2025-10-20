'use client';

import SearchRideLoading from '@/components/passenger/search-ride-loading';
import { useSocket } from '@/libs/hooks/useSocket';
import { User } from '@/libs/models/user';

import { LatLng } from '@/libs/types/coordinate.type';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
const PassengerMap = dynamic(
  () => import('@/components/passenger/passenger-map'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    ),
  },
);

export default function PassengerPage() {
  const [step, setStep] = useState<
    'select-origin' | 'select-destination' | 'show-route' | 'searching-ride' | 'ride-accepted'
  >('select-origin');
  const [origin, setOrigin] = useState<LatLng | null>({
    lat: 35.6892,
    lng: 51.389,
  });

  const [destination, setDestination] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    [number, number][] | null
  >(null);
  const [tripPrice, setTripPrice] = useState<number | null>(null);
  const [tripDistance, setTripDistance] = useState<number | null>(null);
  const [tripDuration, setTripDuration] = useState<number | null>(null);
  const [acceptedDriver, setAcceptedDriver] = useState<User | null>(null);
  const { socket } = useSocket({ namespace: 'passenger' });
  useEffect(() => {
    const status = localStorage.getItem('status');
    if (status === 'searching-ride') {
      setStep('searching-ride');
    }
  }, []);
  useEffect(() => {
    socket?.on('ride.accepted', ({driver}:{driver:User}) => {
      console.log('rideAccepted', driver);
      setAcceptedDriver(driver);
      setStep('ride-accepted');
      localStorage.removeItem('status');
    });
  }, [socket]);
  const handleConfirmOrigin = () => {
    if (origin) {
      setStep('select-destination');
    }
  };

  const handleConfirmDestination = async () => {
    if (destination && origin) {
      socket?.emit(
        'calculate-ride',
        {
          pickupLocation: Object.values(origin).join(','),
          destinationLocation: Object.values(destination).join(','),
        },
        (data: {
          routeCoordinates: LatLng[];
          price: number;
          distance: number;
          duration: number;
        }) => {
          setRouteCoordinates(
            data.routeCoordinates.map((coord: LatLng) => [
              coord.lat,
              coord.lng,
            ]),
          );
          setTripPrice(data.price);
          setTripDistance(data.distance);
          setTripDuration(data.duration);
        },
      );
      setStep('show-route');
    }
  };

  const handleRequestRide = () => {
    if (destination && origin) {
      localStorage.setItem('status', 'searching-ride');
      setStep('searching-ride');
      socket?.emit('request-ride', {
        pickupLocation: Object.values(origin).join(','),
        destinationLocation: Object.values(destination).join(','),
      });
    }
  };

  const handleReset = () => {
    setStep('select-origin');
    setOrigin({
      lat: 35.6892,
      lng: 51.389,
    });
    setDestination(null);
    setRouteCoordinates(null);
    setTripPrice(null);
    setTripDistance(null);
    setTripDuration(null);
    setAcceptedDriver(null);
  };

  const formatDistance = (distance: number | null) => {
    if (!distance) return '0 km';
    return `${distance.toFixed(1)} km`;
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return '0 min';
    const minutes = Math.round(duration);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '0';
    return price.toLocaleString();
  };

  if (step === 'searching-ride') {
    return <SearchRideLoading />;
  }
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 md:hidden">
      {/* Map - 75% of screen */}
      <div className="h-3/4 relative overflow-hidden rounded-b-3xl shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <PassengerMap step={step} origin={origin} destination={destination} setOrigin={setOrigin} setDestination={setDestination} routeCoordinates={routeCoordinates} />
      </div>

      {/* Control Panel - 25% of screen */}
      <div className="h-1/4 bg-gradient-to-t from-gray-900 to-gray-800 p-6 flex flex-col justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-t-3xl"></div>
        <div className="relative z-10">
          {step === 'select-origin' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text ">
                  Select Your Origin
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tap on the map or drag to set your pickup location
              </p>
              <button
                onClick={handleConfirmOrigin}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Confirm Origin
              </button>
            </div>
          )}

          {step === 'select-destination' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text ">
                  Select Your Destination
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Tap on the map or drag to set your drop-off location
              </p>
              <button
                onClick={handleConfirmDestination}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Confirm Destination
              </button>
            </div>
          )}

          {step === 'show-route' && (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                <h3 className="text-white text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text ">
                  Trip Details
                </h3>
              </div>

              {/* Trip Details Card */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 mb-3 border border-gray-600/50 shadow-inner">
                {/* Price */}
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    {formatPrice(tripPrice)} تومان
                  </span>
                </div>

                {/* Distance and Duration */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-700/50 rounded-xl p-2">
                    <div className="text-blue-400 text-sm font-medium">
                      Distance
                    </div>
                    <div className="text-white text-sm font-bold">
                      {formatDistance(tripDistance)}
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-2">
                    <div className="text-orange-400 text-sm font-medium">
                      Duration
                    </div>
                    <div className="text-white text-sm font-bold">
                      {formatDuration(tripDuration)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={handleRequestRide}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                >
                  Request Ride
                </button>
              </div>
            </div>
          )}

          {step === 'ride-accepted' && acceptedDriver && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
                  Ride Accepted!
                </h3>
              </div>

              {/* Driver Info Card */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 mb-3 border border-green-500/30 shadow-inner">
                <div className="flex items-center space-x-3 mb-3">
                  {acceptedDriver.avatarUrl ? (
                    <img
                      src={acceptedDriver.avatarUrl}
                      alt={acceptedDriver.fullname}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-2 border-green-400">
                      <span className="text-white font-bold text-lg">
                        {acceptedDriver.fullname.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold text-lg">
                      {acceptedDriver.fullname}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {acceptedDriver.email}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-medium text-sm">
                    Your driver is on the way!
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start New Ride
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
