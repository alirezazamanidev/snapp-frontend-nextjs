'use client';

import { useMap, useMapEvents } from 'react-leaflet';
import { Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapControllerProps {
  step: 'origin' | 'destination' | 'complete';
  originPosition: [number, number] | null;
  destinationPosition: [number, number] | null;
  userLocation: [number, number] | null;
  onPositionChange: (position: [number, number]) => void;
  onUserLocationClick: () => void;
  routeCoordinates: [number, number][];
}

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// آیکون آبی برای موقعیت کاربر
const userLocationIcon = new L.Icon({
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

// آیکون سبز برای مبدا
const originIcon = new L.Icon({
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// آیکون قرمز برای مقصد
const destinationIcon = new L.Icon({
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapController({
  step,
  originPosition,
  destinationPosition,
  userLocation,
  onPositionChange,
  onUserLocationClick,
  routeCoordinates,
}: MapControllerProps) {
  const map = useMap();

  // رویداد کلیک روی نقشه
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onPositionChange([lat, lng]);
    },
    move: () => {
      // وقتی نقشه حرکت می‌کند، مارکر فعال را به مرکز نقشه منتقل کن
      const center = map.getCenter();
      onPositionChange([center.lat, center.lng]);
    },
  });

  // نمایش مارکرها
  return (
    <>
      {/* مارکر موقعیت کاربر */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={userLocationIcon}
          eventHandlers={{
            click: onUserLocationClick,
          }}
        />
      )}

      {originPosition && (
        <Marker
          position={originPosition}
          icon={originIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onPositionChange([position.lat, position.lng]);
            },
          }}
        />
      )}

      {(step === 'destination' || step === 'complete') &&
        destinationPosition && (
          <Marker
            position={destinationPosition}
            icon={destinationIcon}
            draggable={step === 'destination'}
            eventHandlers={{
              dragend: (e) => {
                if (step === 'destination') {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  onPositionChange([position.lat, position.lng]);
                }
              },
            }}
          />
        )}

      {step === 'complete' && routeCoordinates.length > 0 && (
        <Polyline
          positions={routeCoordinates}
          color="#10b981"
          weight={6}
          opacity={0.9}
          dashArray="0"
          lineCap="round"
          lineJoin="round"
        />
      )}
    </>
  );
}
