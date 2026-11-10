import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private host = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products`);
  }

  deleteProduct(p: Product): Observable<void> {
    return this.http.delete<void>(`${this.host}/products/${p.id}`);
  }

  saveProduct(p: Product): Observable<Product> {
    return this.http.post<Product>(`${this.host}/products`, p);
  }

  updateProduct(p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.host}/products/${p.id}`, p);
  }
}
