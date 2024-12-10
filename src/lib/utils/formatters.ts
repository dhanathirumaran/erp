export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat('en-US', options || defaultOptions)
    .format(typeof date === 'string' ? new Date(date) : date);
};

export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-IN', options).format(number);
};