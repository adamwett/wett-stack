'use client';

import { cn } from '@repo/ui/utils';
import localFont from 'next/font/local';

export const font = localFont({ src: '../../../../public/fonts/PressStart2P.ttf' });

export default function RetroText({
  children,
  className,
  color,
}: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <div
      className={cn(font.className, 'whitespace-nowrap text-center text-md md:text-xl lg:text-2xl', className)}
      style={{ color: color ? `var(--${color})` : 'white' }}
    >
      {children}
    </div>
  );
}
