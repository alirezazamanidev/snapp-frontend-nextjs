'use client';

import 'leaflet/dist/leaflet.css';
 
import dynamic from 'next/dynamic';
const PassengerMap = dynamic(() => import('@/components/Passenger/passengerMap'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});







// Main PassengerPage Component
export default function PassengerPage() {
  
  return (
    <div className="h-screen  bg-gray-900">
      {/* Map */}
   
        <PassengerMap />


    </div>
  );
}
