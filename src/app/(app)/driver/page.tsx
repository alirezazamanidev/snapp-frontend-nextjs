'use client';

import { useRef, useState, useEffect } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
  Polyline,
} from 'react-leaflet';

import useGeolocation from '@/libs/hooks/useGeolocation';
import { getRideRoute } from '@/libs/services/ride-service';
import dynamic from 'next/dynamic';
import DriverControllPanel from '@/components/driver/driverControllPanel';
const DirverMap = dynamic(() => import('@/components/driver/dirverMap'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface RideRequest {
  id: string;
  passengerName: string;
  origin: [number, number];
  destination: [number, number];
  distance: string;
  estimatedTime: string;
  fare: string;
}

export default function DriverPage() {
  const { userLocation, isLoadingLocation, getUserLocation } = useGeolocation();
  const [driverStatus, setDriverStatus] = useState<
    'offline' | 'waiting' | 'ride-request' | 'accepted'
  >('offline');
  const [currentRideRequest, setCurrentRideRequest] =
    useState<RideRequest | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [initialPosition] = useState<[number, number]>([35.6892, 51.389]);

  // شبیه‌سازی درخواست سفر
  const simulateRideRequest = () => {
    if (!userLocation) return;

    // موقعیت تصادفی برای مسافر در نزدیکی راننده
    const offsetLat = (Math.random() - 0.5) * 0.02; // حدود 2 کیلومتر
    const offsetLng = (Math.random() - 0.5) * 0.02;
    const passengerOrigin: [number, number] = [
      userLocation[0] + offsetLat,
      userLocation[1] + offsetLng,
    ];

    const destOffsetLat = (Math.random() - 0.5) * 0.04; // حدود 4 کیلومتر
    const destOffsetLng = (Math.random() - 0.5) * 0.04;
    const passengerDestination: [number, number] = [
      passengerOrigin[0] + destOffsetLat,
      passengerOrigin[1] + destOffsetLng,
    ];

    const mockRequest: RideRequest = {
      id: Math.random().toString(36).substr(2, 9),
      passengerName: 'احمد محمدی',
      origin: passengerOrigin,
      destination: passengerDestination,
      distance: '3.2 km',
      estimatedTime: '8 min',
      fare: '25,000 تومان',
    };

    setCurrentRideRequest(mockRequest);
    setDriverStatus('ride-request');
  };

  const handleGoOnline = () => {
    if (userLocation) {
      setDriverStatus('waiting');
      // شبیه‌سازی درخواست بعد از 3 ثانیه
      setTimeout(() => {
        simulateRideRequest();
      }, 3000);
    }
  };

  const handleAcceptRide = async () => {
    if (!currentRideRequest || !userLocation) return;

    setIsLoadingRoute(true);
    setDriverStatus('accepted');

    try {
      // دریافت مسیر از موقعیت راننده تا مبدا مسافر
      const route = await getRideRoute(userLocation, currentRideRequest.origin);
      setRouteCoordinates(route);
    } catch (error) {
      console.error('Failed to get route:', error);
      setRouteCoordinates([userLocation, currentRideRequest.origin]);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const handleRejectRide = () => {
    setCurrentRideRequest(null);
    setDriverStatus('waiting');
    setRouteCoordinates([]);
    // شبیه‌سازی درخواست جدید بعد از 5 ثانیه
    setTimeout(() => {
      simulateRideRequest();
    }, 5000);
  };

  const handleGoOffline = () => {
    setDriverStatus('offline');
    setCurrentRideRequest(null);
    setRouteCoordinates([]);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getStatusTitle = () => {
    switch (driverStatus) {
      case 'offline':
        return 'آفلاین';
      case 'waiting':
        return 'در انتظار مسافر...';
      case 'ride-request':
        return 'درخواست سفر جدید';
      case 'accepted':
        return 'سفر پذیرفته شده';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* نقشه */}
      <div className="w-full h-3/4">
        <DirverMap />
      </div>

      <DriverControllPanel />
    </div>
  );
}
