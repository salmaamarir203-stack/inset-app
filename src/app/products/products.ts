import { Component, OnInit, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products = signal<Product[]>([]);
  keyword = signal('');
  loading = signal(true);
  error = signal('');
  newProduct: Product = { name: '', price: 0, quantity: 1, selected: false };

  filteredProducts = computed(() => {
    const k = this.keyword().toLowerCase();
    return this.products().filter((p) => p.name.toLowerCase().includes(k));
  });

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.loading.set(true);
    this.error.set('');
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Impossible de charger les produits.');
        this.loading.set(false);
        console.error('Erreur de chargement :', err);
      }
    });
  }

  handleDelete(p: Product) {
    if (confirm('Voulez-vous vraiment supprimer ' + p.name + ' ?')) {
      this.productService.deleteProduct(p).subscribe({
        next: () => this.getProducts(),
        error: (err) => console.error('Erreur de suppression :', err)
      });
    }
  }

  handleAdd() {
    if (!this.newProduct.name.trim()) return;
    this.productService.saveProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = { name: '', price: 0, quantity: 1, selected: false };
        this.getProducts();
      },
      error: (err) => console.error("Erreur d'ajout :", err)
    });
  }

  toggleSelected(p: Product) {
    const updated = { ...p, selected: !p.selected };
    this.productService.updateProduct(updated).subscribe({
      next: () =>
        this.products.update((list) => list.map((x) => (x.id === p.id ? updated : x))),
      error: (err) => console.error('Erreur de mise à jour :', err)
    });
  }
}
