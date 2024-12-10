import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export const Select = ({ className, error, icon, children, ...props }: SelectProps) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <select
      className={cn(
        'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2',
        'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        'disabled:bg-gray-50 disabled:text-gray-500',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
        icon && 'pl-10',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
);