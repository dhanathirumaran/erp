export interface Return {
  id: string;
  date: string;
  originalId: string; // ID of original transaction/purchase
  contactId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    reason: string;
  }[];
  total: number;
  notes?: string;
}

export interface SalesReturn extends Return {
  type: 'sales';
}

export interface PurchaseReturn extends Return {
  type: 'purchase';
}