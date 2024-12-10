import { z } from 'zod';
import { validators } from '../utils/validators';

export const schemas = {
  product: z.object({
    brand: validators.required('Brand is required'),
    name: validators.required('Name is required'),
    art: validators.required('Art is required'),
    design: validators.required('Design is required'),
    colour: validators.required('Colour is required'),
    uom: validators.required('Unit of Measure is required'),
    hsnCode: validators.required('HSN Code is required'),
    mrp: validators.price('MRP must be greater than 0'),
    salesPrice: validators.price('Sales price must be greater than 0'),
    purchasePrice: validators.price('Purchase price must be greater than 0'),
    stock: validators.number(0, 'Stock cannot be negative')
  }).refine(data => data.salesPrice <= data.mrp, {
    message: "Sales price cannot exceed MRP",
    path: ["salesPrice"]
  }),

  contact: z.object({
    name: validators.required('Name is required'),
    type: z.enum(['customer', 'supplier', 'employee']),
    email: validators.email(),
    phone: validators.phone(),
    address: validators.required('Address is required'),
    city: validators.required('City is required'),
    state: validators.required('State is required'),
    gstn: z.string().optional()
  }),

  quotation: z.object({
    contactId: validators.required('Customer is required'),
    validUntil: validators.date(),
    items: z.array(z.object({
      productId: z.string(),
      quantity: validators.number(1, 'Quantity must be at least 1'),
      price: validators.price()
    })).min(1, 'At least one item is required'),
    notes: z.string().optional()
  })
};

export type ProductSchema = typeof schemas.product;
export type ContactSchema = typeof schemas.contact;
export type QuotationSchema = typeof schemas.quotation;