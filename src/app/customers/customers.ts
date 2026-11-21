import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer } from '../model/customer.model';
import { CustomerService } from '../services/customer';

@Component({
  selector: 'app-customers',
  imports: [FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {
  customers = signal<Customer[]>([]);
  loading = signal(true);
  error = signal('');
  saving = signal(false);
  editing = signal<Customer | null>(null);
  form: Customer = { name: '', email: '', phone: '', address: '' };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Impossible de charger les clients.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  edit(customer: Customer): void {
    this.editing.set(customer);
    this.form = { ...customer };
  }

  cancel(): void {
    this.editing.set(null);
    this.form = { name: '', email: '', phone: '', address: '' };
  }

  save(): void {
    if (!this.form.name.trim()) return;
    this.saving.set(true);
    this.error.set('');
    const request = this.editing()
      ? this.customerService.update(this.form)
      : this.customerService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.cancel();
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set("Impossible d'enregistrer le client.");
        console.error(err);
      }
    });
  }

  delete(customer: Customer): void {
    if (!confirm(`Supprimer le client ${customer.name} ?`)) return;
    this.customerService.delete(customer).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error.set('Impossible de supprimer le client.');
        console.error(err);
      }
    });
  }
}
