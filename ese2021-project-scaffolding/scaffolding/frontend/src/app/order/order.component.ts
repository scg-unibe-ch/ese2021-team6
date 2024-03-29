import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { zip } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductOrderService } from '../services/product-order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {

  product: Product = new Product(0, '', '', '', 0, 0, '', 0, '');

  user: User | undefined;
  userInfo: any | undefined;
  userId: number | undefined;
  userName: string | undefined;

  isLinear = true
  addressFormGroup!: FormGroup
  paymentFormGroup!: FormGroup

  address: string = ''
  city: string = ''
  zipCode: number = 0
  paymentMethod = "invoice"

  purchaseErrorMsg: string = '';

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private _formBuilder: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public productOrderService: ProductOrderService,
    private router: Router
  ) {
     // Set up Icons
     this.matIconRegistry.addSvgIcon(
      "edit_button",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/edit.svg")
    );
     userService.user$.subscribe(res => this.user = res);
     this.user = userService.getUser();

    // Listen for changes
    productOrderService.product$.subscribe(res => this.product = res);
    userService.userId$.subscribe(res => this.userId);
    userService.userName$.subscribe(res => this.userName);

    // Current value
    this.product = productOrderService.getProduct();
    this.userId = userService.getUserId();
    this.userName = userService.getUserName();

    // Gets all users from database
    this.httpClient.get(environment.endpointURL + "user").subscribe((res: any) => {
      // Filters to current user
      this.userInfo = res.filter((info: any) => info.userId === this.userId)

      this.address = this.userInfo[0]?.address
      this.city = this.userInfo[0]?.city
      this.zipCode = this.userInfo[0]?.zipCode
    },)
  }

  ngOnInit() {
    this.addressFormGroup = this._formBuilder.group({
      addressCtrl: [],
      cityCtrl: [],
      zipCodeCtrl: [],
    });
    this.paymentFormGroup = this._formBuilder.group({
      invoiceCtrl: [],
    });
  }

  closePurchase() {
    this.router.navigateByUrl("Shop")
  }

  /**
   * if a user filled in the buy form the purchase is done and will show on his dashboard
   * @returns nothing is returned but the buy process is avoided becasue not all requiered fields are filled out
   */
  purchase() {
    // Parses the content of the fill order
    this.purchaseErrorMsg = '';
    if (this.addressFormGroup.controls.addressCtrl.value != null) {
      this.address = this.addressFormGroup.controls.addressCtrl.value
    }
    if (this.addressFormGroup.controls.cityCtrl.value != null) {
      this.city = this.addressFormGroup.controls.cityCtrl.value
    }
    if (this.addressFormGroup.controls.zipCodeCtrl.value != null) {
      this.zipCode = this.addressFormGroup.controls.zipCodeCtrl.value
    }
    if (this.paymentFormGroup.controls.invoiceCtrl.value != null) {
      this.paymentMethod = this.paymentFormGroup.controls.invoiceCtrl.value
    }
    // Checks whether everything is filled out or not
    if(this.address == '' || this.city == '' || this.zipCode == 0 || this.address == null || this.city == null || this.zipCode == null){
      this.purchaseErrorMsg = "Please fill out all the required fields";
      return;
    }
    // Saves the order in the database
    this.httpClient.post(environment.endpointURL + "order", {
      orderId: 0,
      username: this.userName,
      deliveryAdress: this.address,
      city: this.city,
      zipcode: this.zipCode,
      paymentMethod: this.paymentMethod,
      orderStatus: "pending",
      productId: this.product.productId
    }).subscribe((res: any) => {
      //Redirects the User to the Dashboard
       this.router.navigateByUrl("Dashboard")
    })
  }
}
