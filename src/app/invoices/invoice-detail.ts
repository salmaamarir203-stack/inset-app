import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Invoice, InvoiceItem } from '../model/invoice.model';
import { InvoiceService } from '../services/invoice';

@Component({
  selector: 'app-invoice-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css'
})
export class InvoiceDetail implements OnInit {
  invoice = signal<Invoice | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private route: ActivatedRoute, private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.error.set('Identifiant de facture invalide.');
      this.loading.set(false);
      return;
    }
    this.invoiceService.getById(id).subscribe({
      next: (invoice) => {
        this.invoice.set(invoice);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Impossible de charger cette facture.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  lines(): InvoiceItem[] {
    const invoice = this.invoice();
    return invoice ? invoice.items || invoice.invoiceItems || invoice.lines || [] : [];
  }

  total(): number {
    const invoice = this.invoice();
    if (!invoice) return 0;
    if (invoice.totalAmount != null) return invoice.totalAmount;
    if (invoice.total != null) return invoice.total;
    return this.lines().reduce((sum, line) => {
      const unit = line.price ?? line.unitPrice ?? line.product?.price ?? 0;
      return sum + (line.amount ?? line.total ?? unit * line.quantity);
    }, 0);
  }

  date(invoice: Invoice): string | undefined {
    return invoice.date || invoice.createdAt || invoice.invoiceDate;
  }
}
