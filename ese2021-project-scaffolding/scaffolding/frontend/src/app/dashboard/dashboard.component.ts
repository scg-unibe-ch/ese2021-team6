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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User | undefined;
  isAdmin: boolean | undefined;

  order: Order = new Order(0, '', '', '', 0, '', '', 0);
  orders: Order[] = []
  userSpecificOrders: Order[] = []

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog, 
    private router: Router,
    public productOrderService: ProductOrderService,
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
      console.log(lists)
      lists.forEach((list: any) => {

        this.orders.push(new Order(list.orderId, list.username, list.deliveryAdress, list.city, list.zipcode, list.paymentMethod,
          list.orderStatus, list.productId));

        if (list.username == this.userService.getUser()?.username) {
          this.userSpecificOrders.push(new Order(list.orderId, list.username, list.deliveryAdress, list.city, list.zipcode, list.paymentMethod,
            list.orderStatus, list.productId));
        }
      });
    });
  }
}