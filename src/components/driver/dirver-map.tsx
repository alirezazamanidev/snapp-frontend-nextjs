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
      <Marker position={[currentLocation.lat, currentLocation.lng]} icon={originIcon} />
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
