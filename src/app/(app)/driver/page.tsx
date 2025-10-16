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
