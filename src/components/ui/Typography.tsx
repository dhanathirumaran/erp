import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export const PageTitle = ({ children, className }: TypographyProps) => (
  <h1 className={cn('text-2xl font-bold text-gray-800', className)}>
    {children}
  </h1>
);

export const SectionTitle = ({ children, className }: TypographyProps) => (
  <h2 className={cn('text-xl font-semibold text-gray-700', className)}>
    {children}
  </h2>
);