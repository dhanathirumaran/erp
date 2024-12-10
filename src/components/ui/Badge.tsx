import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800'
} as const;

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span className={cn(
    'px-2 py-1 rounded-full text-xs font-medium',
    variantStyles[variant],
    className
  )}>
    {children}
  </span>
);