import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';
import { API_BASE_URL } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private host: string) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products`);
  }

  deleteProduct(p: Product): Observable<void> {
    return this.http.delete<void>(`${this.host}/products/${p.id}`);
  }

  saveProduct(p: Product): Observable<Product> {
    const { selected, ...payload } = p;
    return this.http.post<Product>(`${this.host}/products`, payload);
  }

  updateProduct(p: Product): Observable<Product> {
    const { selected, ...payload } = p;
    return this.http.put<Product>(`${this.host}/products/${p.id}`, payload);
  }
}
