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
  userName: string | undefined
  userSpecificName: string | undefined

  changingStatus: Boolean = false
  currOrderId: Number = 0

  products: Product[] = []
  order: Order = new Order(0, '', '', '', 0, '', '', 0, '', 0);
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
    userService.userName$.subscribe(res => this.userName);
    userService.userName$.subscribe(res => this.userSpecificName);
    userService.userName$.subscribe((res) => console.log("CHANGED", res));

    // Current value
    this.user = userService.getUser();
    this.isAdmin = userService.getIsAdmin();
    this.userName = userService.getUserName();
  }

  ngOnInit(): void {
    this.readLists();
  }
  /**
   * Saves the orders from the backend/database to the frontend array orders
   */
  readLists(): void {
    this.httpClient.get(environment.endpointURL + "order").subscribe((lists: any) => {
      console.log(lists)
      lists.forEach((list: any) => {

        this.httpClient.get(environment.endpointURL + "product").subscribe((products: any) => {

          products.forEach((product: any) => {
            if (product.productId == list.productId) {
              this.orders.push(new Order(list.orderId, list.username, list.deliveryAdress, list.city, list.zipcode, list.paymentMethod,
                list.orderStatus, list.productId, product.title, product.price));

              if (list.username == this.userName) {
                this.userSpecificOrders.push(new Order(list.orderId, list.username, list.deliveryAdress, list.city, list.zipcode, list.paymentMethod,
                  list.orderStatus, list.productId, product.title, product.price));
              }
            }
          })
        })
      });
    });
  }

  // A user can cancel its order in his dashboard
  cancelOrder(order: Order) {
    this.terminateOrder(order)
  }

  /**
   * A admin can set the status of an order to shipped to tell the user, that its order is on the way
   * @param order The order that is being shipped
   */
  resolveOrder(order: Order) {
    if(order.orderStatus == "pending"){
      this.httpClient.put(environment.endpointURL + "order/" + order.orderId, {
        orderStatus: "shipped"
      }).subscribe(res => {
        order.orderStatus = "shipped"
      });
    }
  }

  /**
   * Changing the status of a order can be unwanted, thus it need to be confirmed.
   * @param order The relevant order
   */
  askForPermission(order: Order) {
    this.currOrderId = order.orderId
    this.changingStatus = true
  }

  terminateProcess() {
    this.changingStatus = false
  }

  /**
   * The user that set up the order can terminate it
   * @param order that is terminated
   */
  terminateOrder(order: Order) {
    if(order.orderStatus != "shipped"){
      this.changingStatus = false
      this.httpClient.delete(environment.endpointURL + "order/" + order.orderId).subscribe(() => {
      console.log("Terminated")
      this.userSpecificOrders.splice(this.userSpecificOrders.indexOf(order), 1);
    })
    }
  }
}
