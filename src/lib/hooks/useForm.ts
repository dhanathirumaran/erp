import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useForm<T extends z.ZodSchema>(schema: T, defaultValues?: Partial<z.infer<T>>) {
  return useHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  });
}