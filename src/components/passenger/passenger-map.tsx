'use client';

import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LatLng } from "@/libs/types/coordinate.type";
import { destinationIcon, LocateButton, originIcon } from "../shared/map";

function MapController({ 
  step, 
  setOrigin, 
  setDestination 
}: { 
  step: 'select-origin' | 'select-destination' | 'show-route' | 'searching-ride',
  setOrigin: (origin: LatLng) => void,
  setDestination: (destination: LatLng) => void
}) {
  const map = useMapEvents({
    click: (e) => {
      if(step === 'select-origin') {
        setOrigin({ lat: e.latlng.lat, lng: e.latlng.lng });
      } else if(step === 'select-destination') {
        setDestination({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
    move: () => {
      const center = map.getCenter();
       if(step === 'select-origin') {
        setOrigin({ lat: center.lat, lng: center.lng });
       } else if(step === 'select-destination') {
        setDestination({ lat: center.lat, lng: center.lng });
       }
    }
  });

  return null;
}

interface PassengerMapProps {
  step: 'select-origin' | 'select-destination' | 'show-route' | 'searching-ride';
  origin: LatLng | null;
  destination: LatLng | null;
  setOrigin: (origin: LatLng) => void;
  setDestination: (destination: LatLng) => void;
  routeCoordinates: [number, number][] | null;
}
export default function PassengerMap({ step, origin, destination, setOrigin, setDestination, routeCoordinates }: PassengerMapProps) {
  return (
    <div className="w-full h-full relative">
      
      <MapContainer
        center={[35.6892, 51.3890]} // Tehran coordinates
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      > 
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon} />
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} />
        )}
        {routeCoordinates && (
          <Polyline
            positions={routeCoordinates}
            color="#22c55e"
            weight={4}
            opacity={0.8}
          />
        )}

        <MapController 
          step={step} 
          setOrigin={setOrigin}
          setDestination={setDestination}
        />
        <LocateButton />
      </MapContainer>
    </div>
  );
}