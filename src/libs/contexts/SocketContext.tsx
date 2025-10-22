'use client';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}
export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children,namespace }: { children: React.ReactNode,namespace: string }) => {
    const [isConnected, setIsConnected]=useState(false);
    const socketRef=useRef<Socket | null>(null);
    useEffect(() => {
        if (!socketRef.current) {
          const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/${namespace}`, {
            transports: ['websocket'],
            rememberUpgrade: true,
          });
    
          socket.on('connect', () => {
            setIsConnected(true);
            console.log('Socket connected');
          });
          socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
          });
          socket.on('error', (error) => {
            console.error('Socket error:', error);
            alert(`Socket error: ${error.message || error}`);
            setIsConnected(false);
          });
    
          socketRef.current = socket;
        }
    
        return () => {
          socketRef.current?.disconnect();
          socketRef.current = null;
        };
      }, [namespace]);
      return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
          {children}
        </SocketContext.Provider>

      );
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
      throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}