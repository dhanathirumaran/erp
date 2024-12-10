import { useCallback, useEffect, useState } from 'react';
import { AppState, Product, Transaction, Purchase, Contact, Quotation, MonthlyAttendance, SalesReturn, PurchaseReturn } from '../types';

const STORAGE_KEY = 'erp_data';

const initialState: AppState = {
  products: [],
  transactions: [],
  purchases: [],
  contacts: [],
  quotations: [],
  attendance: [],
  salesReturns: [],
  purchaseReturns: []
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialState;
    } catch {
      return initialState;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save state:', err);
      setError('Failed to save changes');
    }
  }, [state]);

  const updateProducts = useCallback(async (products: Product[]) => {
    try {
      setIsLoading(true);
      setError(null);
      setState(prev => ({ ...prev, products }));
    } catch (err) {
      setError('Failed to update products');
      console.error('Error updating products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateContacts = useCallback(async (contacts: Contact[]) => {
    try {
      setIsLoading(true);
      setError(null);
      setState(prev => ({ ...prev, contacts }));
    } catch (err) {
      setError('Failed to update contacts');
      console.error('Error updating contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transaction: Transaction) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update transactions
      setState(prev => ({
        ...prev,
        transactions: [...prev.transactions, transaction],
        // Update product stock
        products: prev.products.map(p => {
          const item = transaction.items.find(i => i.productId === p.id);
          return item ? {...p, stock: p.stock - item.quantity} : p;
        })
      }));
    } catch (err) {
      setError('Failed to add transaction');
      console.error('Error adding transaction:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPurchase = useCallback(async (purchase: Purchase) => {
    try {
      setIsLoading(true);
      setError(null);

      setState(prev => ({
        ...prev,
        purchases: [...prev.purchases, purchase],
        products: prev.products.map(p => {
          const item = purchase.items.find(i => i.productId === p.id);
          if (!item) return p;
          
          return {
            ...p,
            stock: p.stock + item.quantity,
            ...(item.priceUpdates?.mrp && { mrp: item.priceUpdates.mrp }),
            ...(item.priceUpdates?.salesPrice && { salesPrice: item.priceUpdates.salesPrice }),
            purchasePrice: item.costPrice
          };
        })
      }));
    } catch (err) {
      setError('Failed to add purchase');
      console.error('Error adding purchase:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addQuotation = useCallback(async (quotation: Quotation) => {
    try {
      setIsLoading(true);
      setError(null);
      setState(prev => ({
        ...prev,
        quotations: [...prev.quotations, quotation]
      }));
    } catch (err) {
      setError('Failed to add quotation');
      console.error('Error adding quotation:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuotation = useCallback(async (quotationId: string, updates: Partial<Quotation>) => {
    try {
      setIsLoading(true);
      setError(null);
      setState(prev => ({
        ...prev,
        quotations: prev.quotations.map(q => 
          q.id === quotationId ? { ...q, ...updates } : q
        )
      }));
    } catch (err) {
      setError('Failed to update quotation');
      console.error('Error updating quotation:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAttendance = useCallback(async (attendance: MonthlyAttendance[]) => {
    try {
      setIsLoading(true);
      setError(null);
      setState(prev => ({ ...prev, attendance }));
    } catch (err) {
      setError('Failed to update attendance');
      console.error('Error updating attendance:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSalesReturn = useCallback(async (salesReturn: SalesReturn) => {
    try {
      setIsLoading(true);
      setError(null);

      setState(prev => ({
        ...prev,
        salesReturns: [...prev.salesReturns, salesReturn],
        // Update product stock for returns
        products: prev.products.map(p => {
          const item = salesReturn.items.find(i => i.productId === p.id);
          return item ? {...p, stock: p.stock + item.quantity} : p;
        })
      }));
    } catch (err) {
      setError('Failed to process sales return');
      console.error('Error processing sales return:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPurchaseReturn = useCallback(async (purchaseReturn: PurchaseReturn) => {
    try {
      setIsLoading(true);
      setError(null);

      setState(prev => ({
        ...prev,
        purchaseReturns: [...prev.purchaseReturns, purchaseReturn],
        // Update product stock for returns
        products: prev.products.map(p => {
          const item = purchaseReturn.items.find(i => i.productId === p.id);
          return item ? {...p, stock: p.stock - item.quantity} : p;
        })
      }));
    } catch (err) {
      setError('Failed to process purchase return');
      console.error('Error processing purchase return:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    state,
    error,
    isLoading,
    updateProducts,
    updateContacts,
    addTransaction,
    addPurchase,
    addQuotation,
    updateQuotation,
    updateAttendance,
    addSalesReturn,
    addPurchaseReturn
  };
};