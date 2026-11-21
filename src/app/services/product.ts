import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  saveProduct(p: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, p);
  }

  updateProduct(p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${p.id}`, p);
  }
}
