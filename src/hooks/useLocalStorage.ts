import { useState, useEffect, useCallback } from 'react';
import { LocalDB } from '@/lib/localdb';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const db = LocalDB.getInstance();
  const [data, setData] = useState<T>(() => {
    try {
      return db.getData() as T;
    } catch {
      return initialValue;
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = useCallback((newData: T) => {
    setIsLoading(true);
    setError(null);
    try {
      db.updateData(newData as any);
      setData(newData);
    } catch (err) {
      setError('Failed to save changes');
      console.error(`Storage error:`, err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    data, 
    setData: updateData, 
    error, 
    isLoading,
    lastUpdated: db.getLastUpdated()
  };
}