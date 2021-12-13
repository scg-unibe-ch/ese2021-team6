import {ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderComponent } from './order/order.component';
import { CommentComponent } from './post/comment/comment.component';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopComponent } from './shop/shop.component';
import { Location } from '@angular/common';

const routes: Routes = [
  {path:'Shop', component: ShopComponent},
  {path:'Forum', component: PostComponent},
  {path:'Comments', component: CommentComponent},
  {path:'Profile', component: ProfileComponent},
  {path: 'Order', component: OrderComponent},
  {path:'Dashboard', component: DashboardComponent},
];

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        MatDialogModule,
        MatMenuModule
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    location = TestBed.get(Location);
    router = TestBed.get(Router);
    router.initialNavigation();

  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('navigate to "Forum" takes you to /Forum', fakeAsync(() => {
    router.navigate(['Forum']);
    tick();
    expect(location.path()).toBe('/Forum')
  }));

  it('navigate to "Shop" takes you to /Shop', fakeAsync(() => {
    router.navigate(['Shop']);
    tick();
    expect(location.path()).toBe('/Shop')
  }));

  it('navigate to "Dashboard" takes you to /Dashboard', fakeAsync(() => {
    router.navigate(['Dashboard']);
    tick();
    expect(location.path()).toBe('/Dashboard')
  }));
});
