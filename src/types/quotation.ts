export interface Quotation {
  id: string;
  date: string;
  contactId: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  notes?: string;
}