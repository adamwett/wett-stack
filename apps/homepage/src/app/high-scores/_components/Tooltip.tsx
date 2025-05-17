'use client';

import { cn } from '@repo/ui/utils';
import type { ReactNode } from 'react';
import RetroText from './RetroText';
interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export default function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className='group relative inline-block'>
      {children}
      <div className='-translate-x-1/2 invisible absolute top-full left-1/2 z-10 mt-2 border border-white bg-black px-3 py-1 text-white text-xs opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 md:text-sm'>
        <RetroText className={cn('whitespace-no-wrap sm:text-xs md:text-sm lg:text-xs xl:text-xs', className)}>
          {content}
        </RetroText>
      </div>
    </span>
  );
}
