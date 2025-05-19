'use client';

import { useEffect, useState } from 'react';

interface BlinkProps {
  children: React.ReactNode;
  interval?: number; // milliseconds between blinks
}

export default function Blink({ children, interval = 1000 }: BlinkProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, interval);

    // Cleanup timer on unmount
    return () => clearInterval(timer);
  }, [interval]);

  return <div style={{ visibility: isVisible ? 'visible' : 'hidden' }}>{children}</div>;
}
