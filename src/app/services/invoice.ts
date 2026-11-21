import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { Invoice, InvoiceCreateRequest } from '../model/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private host: string) {}

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.host}/invoices`);
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.host}/invoices/${id}`);
  }

  create(request: InvoiceCreateRequest): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.host}/invoices`, request);
  }
}
