import { z } from 'zod';

export const schemas = {
  product: z.object({
    brand: z.string().min(1, 'Brand is required'),
    name: z.string().min(1, 'Name is required'),
    art: z.string().min(1, 'Art is required'),
    design: z.string().min(1, 'Design is required'),
    colour: z.string().min(1, 'Colour is required'),
    uom: z.string().min(1, 'Unit of Measure is required'),
    hsnCode: z.string().min(1, 'HSN Code is required'),
    mrp: z.number().min(0.01, 'MRP must be greater than 0'),
    salesPrice: z.number().min(0.01, 'Sales price must be greater than 0'),
    purchasePrice: z.number().min(0.01, 'Purchase price must be greater than 0'),
    stock: z.number().min(0, 'Stock cannot be negative')
  }).refine(data => data.salesPrice <= data.mrp, {
    message: "Sales price cannot be greater than MRP",
    path: ["salesPrice"]
  }),

  contact: z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['customer', 'supplier', 'employee']),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    gstn: z.string().optional()
  }),

  quotation: z.object({
    contactId: z.string().min(1, 'Customer is required'),
    validUntil: z.string().min(1, 'Valid until date is required'),
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0)
    })).min(1, 'At least one item is required'),
    notes: z.string().optional()
  })
};