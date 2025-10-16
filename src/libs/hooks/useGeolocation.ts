import { useState } from "react";

export default function useGeolocation() {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
    const getUserLocation = () => {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    };
  
    return { userLocation, isLoadingLocation, getUserLocation, setUserLocation };
  }