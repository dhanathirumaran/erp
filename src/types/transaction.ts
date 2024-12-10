export interface Transaction {
  id: string;
  date: string;
  contactId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}