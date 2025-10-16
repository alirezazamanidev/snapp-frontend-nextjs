'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const RideMap = dynamic(() => import('../../components/ride/rideMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
      <div className="text-white">Loading map...</div>
    </div>
  ),
});


export default function SnapApp() {


  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
    
        {/* Map Container */}
        
          <RideMap />
       

    </div>
  );
}
