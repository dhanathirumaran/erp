export interface Contact {
  id: string;
  name: string;
  type: 'customer' | 'supplier' | 'employee';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstn?: string;
  dateAdded: string;
}