import { useState } from "react";

export default function useGeolocation() {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
    const getUserLocation = () => {
      setIsLoadingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setIsLoadingLocation(false);
            alert('Unable to get your location. Please check your browser settings.');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      } else {
        setIsLoadingLocation(false);
        alert('Geolocation is not supported by this browser.');
      }
    };
  
    return { userLocation, isLoadingLocation, getUserLocation, setUserLocation };
  }
  