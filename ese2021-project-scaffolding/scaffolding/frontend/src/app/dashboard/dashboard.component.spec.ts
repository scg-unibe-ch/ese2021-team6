import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { Order } from '../models/order.model';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let order: Order

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        RouterTestingModule
      ],
      declarations: [
        DashboardComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    order = new Order(0, '', '', '', 0, '', '', 0, '', 0);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set changingStatus to true when askedForPermission gets called', () => {
    component.askForPermission(order)
    expect(component.changingStatus).toBeTruthy();
  });
});
