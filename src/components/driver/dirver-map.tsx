'use client';

import { LatLng } from '@/libs/types/coordinate.type';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { destinationIcon, LocateButton, originIcon } from '../shared/map';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom driver icon
const driverIcon = L.divIcon({
  html: `
    <div style="
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
      animation: pulse 2s infinite;
    ">
      <div style="
        font-size: 18px;
        color: white;
      ">🚗</div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4); }
        50% { transform: scale(1.1); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6); }
        100% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4); }
      }
    </style>
  `,
  className: 'driver-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

interface DriverMapProps {
  currentLocation?: LatLng | null;
  setCurrentLocation: (currentLocation: LatLng) => void;
  origin?: LatLng | null;
  destination?: LatLng | null;
  routeCoordinates?: [number, number][] | null;
}

const MapController = ({
  currentLocation,
  setCurrentLocation,
}: {
  currentLocation?: LatLng | null;
  setCurrentLocation: (currentLocation: LatLng) => void;
}) => {
  const map=useMapEvents({
    click: (e) => {
      setCurrentLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    move: () => {
      const center = map.getCenter();
      setCurrentLocation({ lat: center.lat, lng: center.lng });

    },
  });
  return (
    <>
    {currentLocation && (
      <Marker position={[currentLocation.lat, currentLocation.lng]} icon={driverIcon} />
    )}
    </>
  )
};

export default function DriverMap({
  currentLocation,
  setCurrentLocation,
  origin,
  destination,
  routeCoordinates,
}: DriverMapProps) {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[35.6892, 51.389]} // Tehran coordinates
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} />
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon} />
        )}
        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={destinationIcon}
          />
        )}
        {routeCoordinates && (
          <Polyline
            positions={routeCoordinates}
            color="#22c55e"
            weight={4}
            opacity={0.8}
          />
        )}

        <LocateButton />
      </MapContainer>
    </div>
  );
}
