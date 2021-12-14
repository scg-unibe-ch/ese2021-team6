import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderComponent } from '../order/order.component';
import { Location } from '@angular/common';

import { ShopComponent } from './shop.component';
import { Product } from '../models/product.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostComponent } from '../post/post.component';
import { CommentComponent } from '../post/comment/comment.component';
import { ProfileComponent } from '../profile/profile.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

const routes: Routes = [
  {path:'Shop', component: ShopComponent},
  {path:'Forum', component: PostComponent},
  {path:'Comments', component: CommentComponent},
  {path:'Profile', component: ProfileComponent},
  {path: 'Order', component: OrderComponent},
  {path:'Dashboard', component: DashboardComponent},
];


describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;
  let router: Router;
  let location: Location;
  let testProduct: Product

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        RouterTestingModule.withRoutes(routes),
        BrowserAnimationsModule
      ],
      declarations: [
        ShopComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    location = TestBed.get(Location);
    router = TestBed.get(Router);
    router.initialNavigation();

    testProduct = new Product(1, 'title', 'desc', 'category', 10, 1, 'url', 1, 'now')
    component.loggedIn = true
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('logged in and trying to buy should redirect to order', fakeAsync(() => {
    component.buyProduct(testProduct)
    tick();
    expect(location.path()).toBe('/Order')
  }));
  
  it('logged in and trying to buy should set this.product to testProduct', fakeAsync(() => {
    component.buyProduct(testProduct)
    tick()
    expect(component.product).toEqual(testProduct)
  }));
});
