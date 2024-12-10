export const formatDate = (date: string): string => 
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));

export const formatCurrency = (amount: number): string => 
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);

export const generateId = (): string => Date.now().toString();

export const validateNumber = (value: string | number, min = 0): string | undefined => {
  const num = Number(value);
  if (isNaN(num)) return 'Must be a number';
  if (num < min) return `Must be at least ${min}`;
};

export const validateRequired = (value: any): string | undefined =>
  !value || (typeof value === 'string' && !value.trim()) 
    ? 'This field is required' 
    : undefined;

export const validateEmail = (value: string): string | undefined => {
  if (!value) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
};