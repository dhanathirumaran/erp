import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const FormField = ({ label, error, children }: InputProps) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm text-gray-600">{label}</label>}
    {children}
    {error && (
      <div className="flex items-center gap-1 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    )}
  </div>
);

export const FormInput = ({ 
  type = 'text',
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type={type}
    className={`rounded-lg border p-2 ${props.disabled ? 'bg-gray-50' : ''} ${className}`}
    {...props}
  />
);

export const FormSelect = ({ 
  children,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`rounded-lg border p-2 ${props.disabled ? 'bg-gray-50' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);