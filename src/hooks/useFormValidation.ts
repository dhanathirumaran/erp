import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useFormValidation = <T extends z.ZodSchema>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>
) => {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  return {
    ...form,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors
  };
};