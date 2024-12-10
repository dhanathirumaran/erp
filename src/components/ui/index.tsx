import { ButtonHTMLAttributes, ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { AlertCircle, LucideIcon } from 'lucide-react';

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: LucideIcon;
  children: ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700'
} as const;

export const Button = ({ 
  variant = 'primary',
  icon: Icon,
  children,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    className={`
      inline-flex items-center justify-center gap-2 
      px-4 py-2 rounded-lg transition-colors
      disabled:opacity-50 ${variantClasses[variant]} ${className}
    `}
    {...props}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>{children}</div>
);

// Input Components
interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps) => (
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

export const Input = ({ 
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`rounded-lg border p-2 ${props.disabled ? 'bg-gray-50' : ''} ${className}`}
    {...props}
  />
);

export const Select = ({ 
  children,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`rounded-lg border p-2 ${props.disabled ? 'bg-gray-50' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);

// Table Components
interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function Table<T>({ columns, data, emptyMessage = 'No data available' }: TableProps<T>) {
  if (!data.length) return <div className="text-center p-4 text-gray-500">{emptyMessage}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="text-left p-4 text-sm font-medium text-gray-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col, j) => (
                <td key={j} className="p-4">
                  {typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Page Title Component
interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => (
  <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
);