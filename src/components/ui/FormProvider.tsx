import { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface FormContextValue<T extends z.ZodSchema> {
  form: UseFormReturn<z.infer<T>>;
}

const FormContext = createContext<FormContextValue<any> | undefined>(undefined);

export function FormProvider<T extends z.ZodSchema>({ 
  children, 
  form 
}: { 
  children: ReactNode;
  form: UseFormReturn<z.infer<T>>;
}) {
  return (
    <FormContext.Provider value={{ form }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext<T extends z.ZodSchema>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context.form as UseFormReturn<z.infer<T>>;
}