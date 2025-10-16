import { useState } from "react";

export default function useRideState() {
    const [step, setStep] = useState<'origin' | 'destination' | 'complete'>('origin');
    const [originPosition, setOriginPosition] = useState<[number, number] | null>([35.6892, 51.389]);
    const [destinationPosition, setDestinationPosition] = useState<[number, number] | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
    return {
      step,
      setStep,
      originPosition,
      setOriginPosition,
      destinationPosition,
      setDestinationPosition,
      routeCoordinates,
      setRouteCoordinates,
      isLoadingRoute,
      setIsLoadingRoute,
    };
  }