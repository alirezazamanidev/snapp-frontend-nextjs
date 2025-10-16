'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import useGeolocation from '@/libs/hooks/useGeolocation';

// آیکون آبی برای موقعیت راننده
const driverLocationIcon = new L.Icon({
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// کامپوننت برای حرکت نقشه به موقعیت جدید
function MapUpdater({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 15, { animate: true });
    }
  }, [position, map]);
  
  return null;
}

export default function DirverMap({ 
 
}) {
  const { userLocation, isLoadingLocation, getUserLocation } = useGeolocation();
  const [center, setCenter] = useState<[number, number]>([35.6892, 51.389]);

  // به‌روزرسانی مرکز نقشه بر اساس موقعیت کاربر
  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  // دریافت موقعیت کاربر هنگام بارگذاری کامپوننت
  useEffect(() => {
    getUserLocation();
  }, []);
   
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* کامپوننت برای به‌روزرسانی موقعیت نقشه */}
      <MapUpdater position={userLocation} />

      {/* موقعیت راننده */}
      {userLocation && (
        <Marker position={userLocation} icon={driverLocationIcon} />
      )}
    </MapContainer>
  );
}
