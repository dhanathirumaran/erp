import { z } from 'zod';

export const validators = {
  required: (message = 'This field is required') => 
    z.string().min(1, message),
    
  email: (message = 'Invalid email format') => 
    z.string().email(message),
    
  number: (min = 0, message = `Must be greater than ${min}`) => 
    z.number().min(min, message),
    
  phone: (message = 'Invalid phone number') => 
    z.string().regex(/^\+?[\d\s-]{10,}$/, message),
    
  price: (message = 'Price must be greater than 0') => 
    z.number().positive(message),
    
  date: (message = 'Invalid date') => 
    z.string().refine((val) => !isNaN(Date.parse(val)), message)
};

export const validateForm = async <T extends z.ZodSchema>(
  schema: T,
  data: any
): Promise<{ success: boolean; data?: z.infer<T>; errors?: Record<string, string> }> => {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => ({
        ...acc,
        [err.path[0]]: err.message
      }), {});
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Validation failed' } };
  }
};