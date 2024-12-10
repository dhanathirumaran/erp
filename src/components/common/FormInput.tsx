import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  type?: string;
  label?: string;
  value: string | number;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

const FormInput = ({ 
  type = 'text',
  label,
  value,
  placeholder,
  error,
  onChange,
  min,
  max,
  step
}: FormInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-600">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-lg border p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
      />
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;