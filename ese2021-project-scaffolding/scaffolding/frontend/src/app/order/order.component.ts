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

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  product: Product = new Product(0, '', '', '', 0, 0, 0, '');

  user: User | undefined;
  userInfo: any | undefined;

  isLinear = true
  addressFormGroup!: FormGroup
  paymentFormGroup!: FormGroup

  address: string = ''
  city: string = ''
  zipCode: number = 0
  paymentMethod = ''

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private _formBuilder: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public productOrderService: ProductOrderService
  ) {
     // Set up Icons
     this.matIconRegistry.addSvgIcon( 
      "edit_button",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/edit.svg")
    );
     userService.user$.subscribe(res => this.user = res);
     this.user = userService.getUser();

    // Gets all users from database
    this.httpClient.get(environment.endpointURL + "user").subscribe((res: any) => {
      // Filters to current user
      this.userInfo = res.filter((info: any) => info.userId === this.user?.userId)

      this.address = this.userInfo[0]?.address
      this.city = this.userInfo[0]?.city
      this.zipCode = this.userInfo[0]?.zipCode
    },)

    // Listen for changes
    productOrderService.product$.subscribe(res => this.product = res);

    // Current value
    this.product = productOrderService.getProduct();
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

  purchase() {
    this.address = this.addressFormGroup.controls.addressCtrl.value
    this.paymentMethod = this.paymentFormGroup.controls.invoiceCtrl.value

    console.log(this.address)
    console.log(this.paymentMethod)

    this.httpClient.post(environment.endpointURL + "order", {
      orderId: 0,
      username: this.userService.getUser()?.username,
      deliveryAdress: this.address,
      paymentMethod: this.paymentMethod,
      orderStatus: "pending",
      productId: this.product.productId
    }).subscribe((list: any) => {
       console.log("CREATED ORDER")
    })
  }
}
