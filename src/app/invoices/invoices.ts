import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Customer } from '../model/customer.model';
import { Invoice } from '../model/invoice.model';
import { Product } from '../model/product.model';
import { CustomerService } from '../services/customer';
import { InvoiceService } from '../services/invoice';
import { ProductService } from '../services/product';

interface InvoiceLineForm {
  productId: number | null;
  quantity: number;
}

@Component({
  selector: 'app-invoices',
  imports: [FormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class Invoices implements OnInit {
  invoices = signal<Invoice[]>([]);
  customers = signal<Customer[]>([]);
  products = signal<Product[]>([]);
  loading = signal(true);
  customersLoading = signal(true);
  productsLoading = signal(true);
  error = signal('');
  creating = signal(false);
  customerId: number | null = null;
  lines: InvoiceLineForm[] = [{ productId: null, quantity: 1 }];

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadCustomers();
    this.loadProducts();
  }

  loadInvoices(): void {
    this.loading.set(true);
    this.invoiceService.getAll().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Impossible de charger les factures.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.customersLoading.set(false);
      },
      error: (err) => {
        this.customersLoading.set(false);
        this.error.set('Impossible de charger les clients nécessaires à la création.');
        console.error(err);
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.productsLoading.set(false);
      },
      error: (err) => {
        this.productsLoading.set(false);
        this.error.set('Impossible de charger les produits nécessaires à la création.');
        console.error(err);
      }
    });
  }

  addLine(): void {
    this.lines = [...this.lines, { productId: null, quantity: 1 }];
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) this.lines.splice(index, 1);
  }

  canCreate(): boolean {
    return !!this.customerId &&
      this.lines.length > 0 &&
      this.lines.every((line) => line.productId !== null && line.quantity > 0);
  }

  create(): void {
    if (!this.canCreate()) return;
    this.creating.set(true);
    this.error.set('');
    const request = {
      customerId: this.customerId as number,
      items: this.lines.map((line) => ({
        productId: line.productId as number,
        quantity: line.quantity
      }))
    };

    this.invoiceService.create(request).subscribe({
      next: (invoice) => {
        this.creating.set(false);
        this.customerId = null;
        this.lines = [{ productId: null, quantity: 1 }];
        this.loadInvoices();
        if (invoice.id != null) this.invoices.update((list) => [invoice, ...list]);
      },
      error: (err) => {
        this.creating.set(false);
        this.error.set('Impossible de créer la facture. Vérifiez les données et les stocks.');
        console.error(err);
      }
    });
  }

  invoiceDate(invoice: Invoice): string | undefined {
    return invoice.date || invoice.createdAt || invoice.invoiceDate;
  }

  invoiceTotal(invoice: Invoice): number {
    if (invoice.totalAmount != null) return invoice.totalAmount;
    if (invoice.total != null) return invoice.total;
    const lines = invoice.items || invoice.invoiceItems || invoice.lines || [];
    return lines.reduce((sum, line) => {
      const unit = line.price ?? line.unitPrice ?? line.product?.price ?? 0;
      return sum + (line.amount ?? line.total ?? unit * line.quantity);
    }, 0);
  }
}
