'use client';
import { useEffect, useState } from "react";

export default function useGeolocation() {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
       navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);
        setPosition([position.coords.latitude, position.coords.longitude]);
       },(error)=>{
        setError(error.message);
       },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
       });
    },[]);
    return { position, error, loading };
}