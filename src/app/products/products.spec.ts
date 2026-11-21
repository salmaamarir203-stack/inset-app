import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appConfig } from '../app.config';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product';
import { Products } from './products';

describe('Products', () => {
  let fixture: ComponentFixture<Products>;
  let component: Products;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/products';
  const product: Product = { id: 1, name: 'Clavier', price: 49.9, quantity: 3 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [...appConfig.providers, ProductService, provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('shows loading and empty states while loading products', () => {
    expect(fixture.nativeElement.textContent).toContain('Chargement des produits');
    httpMock.expectOne(apiUrl).flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Votre catalogue est vide');
  });

  it('lists contract-shaped products and switches the form to edit mode', () => {
    httpMock.expectOne(apiUrl).flush([product]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Clavier');
    expect(fixture.nativeElement.textContent).toContain('49,90');

    component.startEdit(product);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Modifier le produit');
    expect(component.productForm).toEqual({ name: 'Clavier', price: 49.9, quantity: 3 });
  });

  it('displays a gateway hint when the product request cannot connect', () => {
    httpMock.expectOne(apiUrl).error(new ProgressEvent('network error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('gateway fonctionne sur le port 8080');
  });
});
