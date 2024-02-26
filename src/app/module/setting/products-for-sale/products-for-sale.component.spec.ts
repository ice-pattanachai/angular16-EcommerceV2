import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsForSaleComponent } from './products-for-sale.component';

describe('ProductsForSaleComponent', () => {
  let component: ProductsForSaleComponent;
  let fixture: ComponentFixture<ProductsForSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsForSaleComponent]
    });
    fixture = TestBed.createComponent(ProductsForSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
