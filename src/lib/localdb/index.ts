import { AppState } from '@/types';

const DB_KEY = 'erp_db';
const DB_VERSION = 1;

interface DBSchema {
  version: number;
  data: AppState;
  lastUpdated: string;
}

export class LocalDB {
  private static instance: LocalDB;
  private dbKey: string;

  private constructor() {
    this.dbKey = DB_KEY;
    this.initializeDB();
  }

  public static getInstance(): LocalDB {
    if (!LocalDB.instance) {
      LocalDB.instance = new LocalDB();
    }
    return LocalDB.instance;
  }

  private initializeDB() {
    try {
      const stored = localStorage.getItem(this.dbKey);
      if (!stored) {
        const initialState: DBSchema = {
          version: DB_VERSION,
          data: {
            products: [],
            transactions: [],
            purchases: [],
            contacts: [],
            quotations: [],
            attendance: [],
            salesReturns: [],
            purchaseReturns: []
          },
          lastUpdated: new Date().toISOString()
        };
        this.saveState(initialState);
      } else {
        // Handle migrations if needed
        const current: DBSchema = JSON.parse(stored);
        if (current.version < DB_VERSION) {
          // Perform migration
          current.version = DB_VERSION;
          this.saveState(current);
        }
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }

  private saveState(state: DBSchema): void {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.dbKey, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
      throw new Error('Failed to save data');
    }
  }

  public getData(): AppState {
    try {
      const stored = localStorage.getItem(this.dbKey);
      if (!stored) {
        throw new Error('Database not initialized');
      }
      const state: DBSchema = JSON.parse(stored);
      return state.data;
    } catch (error) {
      console.error('Failed to get data:', error);
      throw new Error('Failed to retrieve data');
    }
  }

  public updateData(newData: AppState): void {
    try {
      const current = localStorage.getItem(this.dbKey);
      if (!current) {
        throw new Error('Database not initialized');
      }
      
      const state: DBSchema = JSON.parse(current);
      state.data = newData;
      
      this.saveState(state);
    } catch (error) {
      console.error('Failed to update data:', error);
      throw new Error('Failed to update data');
    }
  }

  public clearDB(): void {
    try {
      localStorage.removeItem(this.dbKey);
      this.initializeDB();
    } catch (error) {
      console.error('Failed to clear database:', error);
      throw new Error('Failed to clear database');
    }
  }

  public getLastUpdated(): string {
    try {
      const stored = localStorage.getItem(this.dbKey);
      if (!stored) {
        throw new Error('Database not initialized');
      }
      const state: DBSchema = JSON.parse(stored);
      return state.lastUpdated;
    } catch (error) {
      console.error('Failed to get last updated timestamp:', error);
      throw new Error('Failed to get last updated timestamp');
    }
  }

  public export(): string {
    try {
      const stored = localStorage.getItem(this.dbKey);
      if (!stored) {
        throw new Error('Database not initialized');
      }
      return stored;
    } catch (error) {
      console.error('Failed to export database:', error);
      throw new Error('Failed to export database');
    }
  }

  public import(data: string): void {
    try {
      const state: DBSchema = JSON.parse(data);
      if (!state.version || !state.data) {
        throw new Error('Invalid database format');
      }
      this.saveState(state);
    } catch (error) {
      console.error('Failed to import database:', error);
      throw new Error('Failed to import database');
    }
  }
}