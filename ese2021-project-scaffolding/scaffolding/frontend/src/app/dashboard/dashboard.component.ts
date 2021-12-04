import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { FormControl } from '@angular/forms';
import { UserComponent } from '../user/user.component';
import { Router } from '@angular/router';
import { ProductOrderService } from '../services/product-order.service';
import { Order } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User | undefined;
  isAdmin: boolean | undefined;

  order: Order = new Order(0, '', '', '', '', 0);

  product: Product = new Product(0, '', '', '', 0, 0, 0, '');
  products: Product[] = [];

  constructor(
    public orderService: OrderService,
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog, 
    private router: Router,
    public productOrderService: ProductOrderService
  ) {
    // Listen for changes
    userService.user$.subscribe(res => this.user = res);
    userService.isAdmin$.subscribe(res => this.isAdmin);

    // Current value
    this.user = userService.getUser();
    this.isAdmin = userService.getIsAdmin();
  }

  ngOnInit(): void {
    this.readLists();
  }

  readLists(): void {
    this.httpClient.get(environment.endpointURL + "order").subscribe((lists: any) => {
      lists.forEach((list: any) => {
        const orders: Order[] = [];
        list.orders.forEach((order: any) => {
          orders.push(new Order(list.orderId, list.title, list.description, list.category,
            list.price, list.imageId));
        });
        
        this.products.push(new Product(list.productId, list.title, list.description, list.category,
          list.price, list.imageId, list.userId, list.createdAt))   
      });
    });
  }

  showOrders(product: Product) {
    this.product = product
    this.orderService.setOrder(this.order)
  }
}