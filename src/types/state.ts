import { Product } from './product';
import { Transaction } from './transaction';
import { Purchase } from './purchase';
import { Contact } from './contact';
import { Quotation } from './quotation';
import { MonthlyAttendance } from './attendance';
import { SalesReturn, PurchaseReturn } from './returns';

export interface AppState {
  products: Product[];
  transactions: Transaction[];
  purchases: Purchase[];
  contacts: Contact[];
  quotations: Quotation[];
  attendance: MonthlyAttendance[];
  salesReturns: SalesReturn[];
  purchaseReturns: PurchaseReturn[];
}