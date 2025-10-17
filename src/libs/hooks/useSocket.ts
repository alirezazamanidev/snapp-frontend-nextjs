import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  url?: string;
  namespace: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket:  Socket | null;

  isConnected: boolean;
 
}

export const useSocket = (options: UseSocketOptions): UseSocketReturn => {
  const {
    url = `${process.env.NEXT_PUBLIC_SOCKET_URL}/${options.namespace}`,
    autoConnect = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connect = () => {
    if (!socketRef.current) {
      socketRef.current = io(url, {
        transports: ['websocket'],
        rememberUpgrade: true
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        alert(`Socket connection error: ${error.message || error}`);
        setIsConnected(false);
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
        alert(`Socket error: ${error.message || error}`);
      });
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, autoConnect]);

  return {
    socket: socketRef.current as  Socket | null,
    isConnected,
   
   
  };
};
