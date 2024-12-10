export const APP_CONFIG = {
  name: 'SimplERP',
  version: '1.0.0',
  storage: {
    prefix: 'erp_',
    version: 1
  },
  formats: {
    date: {
      display: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      } as const,
      input: 'YYYY-MM-DD'
    },
    currency: {
      locale: 'en-IN',
      code: 'INR'
    }
  }
} as const;