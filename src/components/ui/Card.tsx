import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn('bg-white rounded-lg shadow-sm', className)}>
    {children}
  </div>
);