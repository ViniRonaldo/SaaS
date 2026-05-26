'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg', subtitle: 'text-[10px]' },
    md: { icon: 28, text: 'text-xl', subtitle: 'text-xs' },
    lg: { icon: 40, text: 'text-3xl', subtitle: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-500/20">
          <Heart className="text-white" size={s.icon} strokeWidth={2.5} fill="currentColor" />
        </div>
        <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400 dark:border-gray-900" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold leading-tight tracking-tight text-foreground', s.text)}>
            Fila<span className="text-green-600 dark:text-green-400">Saude</span>
          </span>
          <span className={cn('font-medium leading-tight text-muted-foreground', s.subtitle)}>
            Prefeitura de Bambui - MG
          </span>
        </div>
      )}
    </div>
  );
}
