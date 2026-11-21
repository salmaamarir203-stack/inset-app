import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Products } from './products/products';
import { Customers } from './customers/customers';
import { Invoices } from './invoices/invoices';
import { InvoiceDetail } from './invoices/invoice-detail';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'products', component: Products },
  { path: 'customers', component: Customers },
  { path: 'invoices', component: Invoices },
  { path: 'invoices/:id', component: InvoiceDetail },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
