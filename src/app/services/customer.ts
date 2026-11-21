import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { Customer } from '../model/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private host: string) {}

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.host}/customers`);
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.host}/customers/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.host}/customers`, customer);
  }

  update(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.host}/customers/${customer.id}`, customer);
  }

  delete(customer: Customer): Observable<void> {
    return this.http.delete<void>(`${this.host}/customers/${customer.id}`);
  }
}
