import { Customer } from './customer.model';
import { Product } from './product.model';

export interface InvoiceItem {
  id?: number;
  productId?: number;
  product?: Product;
  quantity: number;
  price?: number;
  unitPrice?: number;
  amount?: number;
  total?: number;
}

export interface Invoice {
  id?: number;
  customerId?: number;
  customer?: Customer;
  date?: string;
  createdAt?: string;
  invoiceDate?: string;
  items?: InvoiceItem[];
  invoiceItems?: InvoiceItem[];
  lines?: InvoiceItem[];
  totalAmount?: number;
  total?: number;
}

export interface InvoiceCreateRequest {
  customerId: number;
  items: Array<{ productId: number; quantity: number }>;
}
