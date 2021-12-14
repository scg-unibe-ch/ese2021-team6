import { TestBed } from '@angular/core/testing';
import { Product } from '../models/product.model';

import { ProductOrderService } from './product-order.service';

describe('UserService', () => {
  let service: ProductOrderService;
  let testProduct = new Product(1, 'title', 'desc', 'category', 10, 1, 'url', 1, 'now')

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setting to a product should work', () => {
    service.setProduct(testProduct)
    expect(service.getProduct()).toEqual(testProduct);
  });
});
