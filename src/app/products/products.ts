import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product';

type ProductForm = Pick<Product, 'name' | 'price' | 'quantity'>;

const emptyProductForm = (): ProductForm => ({ name: '', price: 0, quantity: 1 });

@Component({
  selector: 'app-products',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly keyword = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly deletingId = signal<number | null>(null);
  readonly editingId = signal<number | null>(null);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  productForm: ProductForm = emptyProductForm();

  readonly filteredProducts = computed(() => {
    const keyword = this.keyword().trim().toLocaleLowerCase();
    return this.products().filter((product) =>
      product.name.toLocaleLowerCase().includes(keyword),
    );
  });

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.productService
      .getAllProducts()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (products) => this.products.set(products),
        error: (error: unknown) =>
          this.errorMessage.set(this.describeError(error, 'Impossible de charger les produits.')),
      });
  }

  startEdit(product: Product): void {
    if (product.id === undefined) {
      return;
    }

    this.editingId.set(product.id);
    this.productForm = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.productForm = emptyProductForm();
    this.errorMessage.set('');
  }

  saveProduct(): void {
    const name = this.productForm.name.trim();
    if (!name || this.saving()) {
      return;
    }

    const product: Product = {
      name,
      price: Number(this.productForm.price),
      quantity: Number(this.productForm.quantity),
    };
    const id = this.editingId();
    const request = id === null
      ? this.productService.saveProduct(product)
      : this.productService.updateProduct({ ...product, id });

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (savedProduct) => {
        if (id === null) {
          this.products.update((products) => [...products, savedProduct]);
          this.successMessage.set('Le produit a été ajouté.');
        } else {
          this.products.update((products) =>
            products.map((current) => (current.id === id ? savedProduct : current)),
          );
          this.successMessage.set('Le produit a été modifié.');
        }
        this.cancelEdit();
      },
      error: (error: unknown) =>
        this.errorMessage.set(this.describeError(error, 'Impossible d’enregistrer le produit.')),
    });
  }

  deleteProduct(product: Product): void {
    if (product.id === undefined || this.deletingId() !== null) {
      return;
    }
    if (!window.confirm(`Voulez-vous vraiment supprimer « ${product.name} » ?`)) {
      return;
    }

    this.deletingId.set(product.id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.productService
      .deleteProduct(product.id)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe({
        next: () => {
          this.products.update((products) => products.filter((item) => item.id !== product.id));
          this.successMessage.set('Le produit a été supprimé.');
          if (this.editingId() === product.id) {
            this.cancelEdit();
          }
        },
        error: (error: unknown) =>
          this.errorMessage.set(this.describeError(error, 'Impossible de supprimer le produit.')),
      });
  }

  private describeError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }
      if (error.status === 0) {
        return 'Le serveur est inaccessible. Vérifiez que le gateway fonctionne sur le port 8080.';
      }
      return fallback;
    }
    return fallback;
  }
}
