'use client';
import { useState, useEffect, useRef } from 'react';

export default function SkeletonWrapper({ skeleton, children, delay = 50 }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), delay);
    ref.current.remove();
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div className="relative">
      <div
        className={`relative transition-opacity duration-500 h-full z-1 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
      </div>
      <div
        ref={ref}
        className={`absolute top-0 left-0 w-full h-full z-0 transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
      >
        {skeleton}
      </div>
    </div>
  );
}
