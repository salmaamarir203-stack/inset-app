import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Product } from '../model/product.model';
import { ProductService } from './product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/products';
  const product: Product = { id: 7, name: 'Clavier', price: 49.9, quantity: 3 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lists products through the gateway', () => {
    service.getAllProducts().subscribe((products) => expect(products).toEqual([product]));

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush([product]);
  });

  it('creates a product with the backend contract fields', () => {
    const newProduct = { name: 'Clavier', price: 49.9, quantity: 3 };
    service.saveProduct(newProduct).subscribe((saved) => expect(saved).toEqual(product));

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newProduct);
    request.flush(product);
  });

  it('updates and deletes a product by id through the gateway', () => {
    service.updateProduct(product).subscribe((updated) => expect(updated).toEqual(product));
    const updateRequest = httpMock.expectOne(`${apiUrl}/7`);
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual(product);
    updateRequest.flush(product);

    service.deleteProduct(7).subscribe();
    const deleteRequest = httpMock.expectOne(`${apiUrl}/7`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(null);
  });
});
