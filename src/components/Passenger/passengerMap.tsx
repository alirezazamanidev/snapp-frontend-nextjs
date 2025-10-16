'use client';

import useGeolocation from "@/libs/hooks/useGeolocation";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents, Polyline } from "react-leaflet";
import * as L from 'leaflet';
import { getRideRoute } from '@/libs/services/ride-service';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for origin and destination
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

// MapClickHandler Component
interface MapClickHandlerProps {
  onMapClick: (location: [number, number]) => void;
  onMapMove: (location: [number, number]) => void;
  isSelectingOrigin: boolean;
}

function MapClickHandler({ onMapClick, onMapMove, isSelectingOrigin }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
    move: (e) => {
      const center = e.target.getCenter();
      onMapMove([center.lat, center.lng]);
    },
  });
  return null;
}

export default function PassengerMap() {
  const { position } = useGeolocation();
  const [centerPosition, setCenterPosition] = useState<[number, number]>(position || [35.6892, 51.389]);
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [step, setStep] = useState<'select-origin' | 'select-destination' | 'route-shown'>('select-origin');
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>(position || [35.6892, 51.389]);

  useEffect(() => {
    if (position) {
      setCenterPosition(position);
      setCurrentMapCenter(position);
    }
  }, [position]);

  const handleMapMove = (location: [number, number]) => {
    setCurrentMapCenter(location);
  };

  const handleMapClick = async (location: [number, number]) => {
    if (step === 'select-origin') {
      setOrigin(currentMapCenter);
      setStep('select-destination');
    } else if (step === 'select-destination') {
      setDestination(currentMapCenter);
      setStep('route-shown');
      
      // Get actual route from service
      if (origin) {
        try {
          const route = await getRideRoute(origin, currentMapCenter);
          setRouteCoordinates(route);
        } catch (error) {
          console.error('Error getting route:', error);
          // In case of error, show straight line
          setRouteCoordinates([origin, currentMapCenter]);
        }
      }
    }
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  const getStatusMessage = () => {
    switch (step) {
      case 'select-origin':
        return 'Move map to position pickup marker, then click to confirm';
      case 'select-destination':
        return 'Move map to position destination marker, then click to confirm';
      case 'route-shown':
        return origin && destination ? `Distance: ${calculateDistance(origin, destination)} km` : '';
      default:
        return '';
    }
  };

  const handleRequestRide = () => {
    // اینجا منطق درخواست سفر اضافه می‌شود
    console.log('درخواست سفر ارسال شد');
    console.log('مبدا:', origin);
    console.log('مقصد:', destination);
  };

  const resetSelection = () => {
    setOrigin(null);
    setDestination(null);
    setRouteCoordinates([]);
    setCurrentMapCenter(position || [35.6892, 51.389]);
    setStep('select-origin');
  };

  return (
    <div className="relative h-full w-full">
      <div className="h-3/4 w-full">
      <MapContainer
        center={centerPosition}
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler 
          onMapClick={handleMapClick} 
          onMapMove={handleMapMove}
          isSelectingOrigin={step === 'select-origin'}
        />
        
        {/* نمایش مارکر مرکز نقشه برای انتخاب مبدا */}
        {step === 'select-origin' && (
          <Marker position={currentMapCenter} icon={originIcon} />
        )}
        
        {/* نمایش مارکر مرکز نقشه برای انتخاب مقصد */}
        {step === 'select-destination' && (
          <Marker position={currentMapCenter} icon={destinationIcon} />
        )}
        
        {/* نمایش مارکر مبدا پس از انتخاب */}
        {origin && <Marker position={origin} icon={originIcon} />}
        
        {/* نمایش مارکر مقصد پس از انتخاب */}
        {destination && <Marker position={destination} icon={destinationIcon} />}
        
        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            color="blue" 
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
      
      </div>
      {/*  control panel */}
      <div className="h-1/4 w-full  bg-gray-900 p-6 shadow-2xl border-t border-gray-700">
        <div className="flex flex-col h-full justify-between">
          {/* Current Status */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-2">
              {step === 'select-origin' && 'Step 1: Select Pickup'}
              {step === 'select-destination' && 'Step 2: Select Destination'}
              {step === 'route-shown' && 'Route Calculated'}
            </h3>
            <p className="text-sm text-gray-300">
              {getStatusMessage()}
            </p>
          </div>

          {/* Location Information */}
          <div className="flex-1 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-green-500 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-lg shadow-green-500/50"></div>
                  <span className="text-sm font-semibold text-gray-200">Pickup</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {origin ? `${origin[0].toFixed(4)}, ${origin[1].toFixed(4)}` : 
                   step === 'select-origin' ? `${currentMapCenter[0].toFixed(4)}, ${currentMapCenter[1].toFixed(4)}` : 'Not selected'}
                </p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-red-500 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/50"></div>
                  <span className="text-sm font-semibold text-gray-200">Destination</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {destination ? `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}` : 
                   step === 'select-destination' ? `${currentMapCenter[0].toFixed(4)}, ${currentMapCenter[1].toFixed(4)}` : 'Not selected'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {step === 'route-shown' && (
              <>
                <button
                  onClick={resetSelection}
                  className="flex-1 py-3 px-4 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 border border-gray-600 hover:border-gray-500"
                >
                  Reset
                </button>
                <button
                  onClick={handleRequestRide}
                  className="flex-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                >
                  Request Ride
                </button>
              </>
            )}
            
            {step === 'select-origin' && (
              <button
                onClick={() => handleMapClick(currentMapCenter)}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-600/25 hover:shadow-green-600/40"
              >
                Confirm Pickup Location
              </button>
            )}
            
            {step === 'select-destination' && (
              <button
                onClick={() => handleMapClick(currentMapCenter)}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
              >
                Confirm Destination
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}