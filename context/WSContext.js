'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const WSContext = createContext(null);

export function WSProvider({ children }) {
  const wsRef = useRef(null);
  const listenersRef = useRef(new Map()); // Map<eventType, Set<callbacks>>
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onclose = () => setConnected(false);

    ws.onerror = (err) => console.error('WSProvider: errore', err);

    ws.onmessage = async (event) => {
      let data;
      if (event.data instanceof Blob) {
        const text = await event.data.text();
        data = JSON.parse(text);
      } else {
        data = JSON.parse(event.data);
      }

      const listeners = listenersRef.current.get(data.type);
      if (listeners) {
        listeners.forEach((cb) => cb(data.data));
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [queryClient]);

  const sendMessage = (msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.warn('WS non aperto');
      return false;
    }
    return true;
  };

  const subscribe = (type, callback) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set());
    }
    listenersRef.current.get(type).add(callback);

    return () => {
      listenersRef.current.get(type)?.delete(callback);
    };
  };

  return (
    <WSContext.Provider value={{ sendMessage, subscribe, connected }}>
      {children}
    </WSContext.Provider>
  );
}

export const useWS = () => useContext(WSContext);
