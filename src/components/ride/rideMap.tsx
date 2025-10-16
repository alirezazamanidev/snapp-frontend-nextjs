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

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapController from './mapController';
import useRideState from '@/libs/hooks/rideState';
import useGeolocation from '@/libs/hooks/useGeolocation';
import { getRideRoute } from '@/libs/services/ride-service';
import RideControlPanel from './RideControlPanel';



// این کامپوننت باید در فایل جداگانه قرار بگیرد: src/components/ride/LocationInput.tsx


// این کامپوننت باید در فایل جداگانه قرار بگیرد: src/components/ride/RideControlPanel.tsx


// این کامپوننت اصلی باید در همین فایل باقی بماند: src/components/ride/RideMap.tsx
export default function RideMap() {
  const {
    step,
    setStep,
    originPosition,
    setOriginPosition,
    destinationPosition,
    setDestinationPosition,
    routeCoordinates,
    setRouteCoordinates,
    isLoadingRoute,
    setIsLoadingRoute,
  } = useRideState();

  const { userLocation, isLoadingLocation, getUserLocation, setUserLocation } = useGeolocation();

  const [initialPosition] = useState<[number, number]>([35.6892, 51.389]);

  // استفاده از موقعیت کاربر به عنوان مبدا
  const handleUserLocationClick = () => {
    if (userLocation && step === 'origin') {
      setOriginPosition(userLocation);
    }
  };

  const handlePositionChange = (position: [number, number]) => {
    if (step === 'origin') {
      setOriginPosition(position);
    } else if (step === 'destination') {
      setDestinationPosition(position);
    }
  };

  const handleConfirmOrigin = () => {
    if (originPosition) {
      // تنظیم موقعیت اولیه مقصد در نزدیکی مبدا
      const offsetLat = 0.01; // حدود 1 کیلومتر
      const offsetLng = 0.01;
      setDestinationPosition([
        originPosition[0] + offsetLat,
        originPosition[1] + offsetLng,
      ]);
      setStep('destination');
    }
  };

  const handleConfirmDestination = async () => {
    if (destinationPosition && originPosition) {
      setIsLoadingRoute(true);
      setStep('complete');

      try {
        // دریافت مسیر واقعی
        const route = await getRideRoute(originPosition, destinationPosition);
        setRouteCoordinates(route);
      } catch (error) {
        console.error('Failed to get route:', error);
        // در صورت خطا، خط مستقیم نمایش بده
        setRouteCoordinates([originPosition, destinationPosition]);
      } finally {
        setIsLoadingRoute(false);
      }
    }
  };

  const handleFindDriver = () => {
    // اینجا می‌توانید منطق پیدا کردن راننده را اضافه کنید
    console.log('Finding driver...', { originPosition, destinationPosition });
  };

  // دریافت موقعیت کاربر هنگام بارگذاری کامپوننت
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <>
      <div className="w-full h-3/4">
        <MapContainer
          center={initialPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController
            step={step}
            originPosition={originPosition}
            destinationPosition={destinationPosition}
            userLocation={userLocation}
            onPositionChange={handlePositionChange}
            onUserLocationClick={handleUserLocationClick}
            routeCoordinates={routeCoordinates}
          />
        </MapContainer>
      </div>

      <RideControlPanel
        step={step}
        originPosition={originPosition}
        destinationPosition={destinationPosition}
        userLocation={userLocation}
        isLoadingRoute={isLoadingRoute}
        isLoadingLocation={isLoadingLocation}
        onConfirmOrigin={handleConfirmOrigin}
        onConfirmDestination={handleConfirmDestination}
        onFindDriver={handleFindDriver}
        onGetUserLocation={getUserLocation}
      />
    </>
  );
}
