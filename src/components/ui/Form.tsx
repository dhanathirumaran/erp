import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  className?: string;
}

export const Form = ({ onSubmit, children, className }: FormProps) => (
  <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
    {children}
  </form>
);

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const FormSection = ({ title, description, children, className }: FormSectionProps) => (
  <div className={cn('space-y-4', className)}>
    {(title || description) && (
      <div>
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

interface FormRowProps {
  children: ReactNode;
  className?: string;
}

export const FormRow = ({ children, className }: FormRowProps) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
    {children}
  </div>
);

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

export const FormField = ({ 
  label, 
  error, 
  hint,
  required,
  fullWidth,
  children, 
  className 
}: FormFieldProps) => (
  <div className={cn(
    'flex flex-col gap-1.5',
    fullWidth && 'md:col-span-2',
    className
  )}>
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    {children}
    {hint && !error && (
      <p className="text-sm text-gray-500">{hint}</p>
    )}
    {error && (
      <div className="flex items-center gap-1.5 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export const FormActions = ({ children, className }: FormActionsProps) => (
  <div className={cn(
    'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0',
    className
  )}>
    {children}
  </div>
);