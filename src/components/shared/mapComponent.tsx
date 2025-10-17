'use client';

import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRideRoute } from '@/libs/services/ride-service';
import { LatLng } from "@/libs/types/coordinate.type";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for origin and destination
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocateButton() {
    const map = useMap();
  
    const handleClick = () => {
      map.locate({ setView: true, maxZoom: 16 });
    };
  
    return (
      <button
        onClick={handleClick}
        className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-[1000] border-2 border-white/20"
      >
        <Navigation2 className="w-6 h-6 text-white drop-shadow-sm" />
      </button>
    );
}

function MapController({ 
  step, 
  setOrigin, 
  setDestination 
}: { 
  step: 'select-origin' | 'select-destination' | 'show-route',
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

interface MapComponentProps {
  step: 'select-origin' | 'select-destination' | 'show-route';
  origin: LatLng | null;
  destination: LatLng | null;
  setOrigin: (origin: LatLng) => void;
  setDestination: (destination: LatLng) => void;
  routeCoordinates: [number, number][] | null;
}
export default function MapComponent({ step, origin, destination, setOrigin, setDestination, routeCoordinates }: MapComponentProps) {
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