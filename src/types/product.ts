export interface Product {
  id: string;
  brand: string;
  name: string;
  art: string;
  design: string;
  colour: string;
  uom: string;
  hsnCode: string;
  hsnDetails?: {
    sgstRate: number;
    cgstRate: number;
    igstRate: number;
    cessRate?: number;
    description?: string;
  };
  mrp: number;
  salesPrice: number;
  purchasePrice: number;
  stock: number;
}