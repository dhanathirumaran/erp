export interface Purchase {
  id: string;
  date: string;
  contactId: string;
  items: {
    productId: string;
    quantity: number;
    costPrice: number;
    priceUpdates?: {
      mrp?: number;
      salesPrice?: number;
    };
  }[];
  total: number;
}