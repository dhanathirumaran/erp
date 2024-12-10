import { useState, useCallback } from 'react';

export function useForm<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);

  const validate = useCallback((validationRules: Record<keyof T, (value: any) => string | undefined>) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const error = validationRules[key](values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values]);

  return { values, errors, handleChange, reset, validate };
}