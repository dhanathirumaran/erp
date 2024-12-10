import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export const Input = ({ className, error, icon, ...props }: InputProps) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      className={cn(
        'w-full rounded-lg border border-gray-300 bg-white px-3 py-2',
        'placeholder:text-gray-400',
        'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        'disabled:bg-gray-50 disabled:text-gray-500',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
        icon && 'pl-10',
        className
      )}
      {...props}
    />
  </div>
);