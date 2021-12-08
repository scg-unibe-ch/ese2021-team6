import { Component, Input, Output, EventEmitter, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {

  loggedIn: boolean | undefined;
  user: User | undefined;
  isAdmin: boolean | undefined;

  productInformation: (string|number)[] = []

  imageId: number = 0
  file: File | undefined; // Temporary file that is used after post is created to load into db

  product: Product = new Product(0, '', '', '', 0, 0, '', 0, '');

  products: Product[] = [];

  tags = new FormControl();
  selectedTags: string = ""
  tagList: string[] = ['Merch', 'Keyboard', 'Mouse', 'Mousepad'];

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    public productOrderService: ProductOrderService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);
    userService.isAdmin$.subscribe(res => this.isAdmin);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
    this.isAdmin = userService.getIsAdmin();
  }

  ngOnInit() {
    this.readLists();
  }

  // Allows a loged in fan to buy a product from the shop.
  buyProduct(product: Product) {
    if (!this.loggedIn) {
      const dialogRef = this.dialog.open(UserComponent, {
          width: '550px',
          height: '310px',
          data: { value: "login" },
        });
    }
    else {
      this.product = product
      this.productOrderService.setProduct(product)
      this.router.navigate(["Order"])
    }
  }

  // In order to buy a product the fan can fill in a form.
  openPopUp() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "product" },
    });

    const sub = dialogRef.componentInstance.createProduct.subscribe(result => {
      this.productInformation = result
      this.createList(this.productInformation);
    })
    const subImage = dialogRef.componentInstance.addImage.subscribe(result => {
      this.file = result;
    })
  }

  // A logged in Admin can edit the shop products via edit button.
  openEditPopUp(product: Product) {
    this.product = product
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "editProduct" },
    });
    var editEvent = dialogRef.componentInstance.editProduct.subscribe(result => {
      this.edit(result);
    })
  }

  createList(info: (string|number)[]) {
    this.httpClient.post(environment.endpointURL + "product", {
      productId: 0,
      title: info[0],
      description: info[1],
      category: info[2],
      price: info[3],
      imageId: 0,
      userId: this.userService.getUser()?.userId,
    }).subscribe((list: any) => {
      if (this.file != undefined) {
        const fd = new FormData();
        fd.append('image', this.file);

        this.httpClient.post(environment.endpointURL + "product/" + list.productId + "/image",fd)
        .subscribe((res: any) => {
          console.log("Uploaded to database")
          console.log(res)

          var path = "http://localhost:3000/uploads/" + res.fileName

          this.products.push(new Product(list.productId, list.title, list.description, list.category,
            list.price, list.imageId, path, list.userId, list.createdAt))
        })
      }
      else {
        this.products.push(new Product(list.productId, list.title, list.description, list.category,
          list.price, list.imageId, '', list.userId, list.createdAt))
      }
    })
  }

  readLists(): void {
    this.httpClient.get(environment.endpointURL + "product").subscribe((lists: any) => {
      lists.forEach((list: any) => {

        this.httpClient.get(environment.endpointURL + "product/" + list.productId + "/image").subscribe((img: any) => {
          var path = "http://localhost:3000/uploads/" + img.fileName

          this.products.push(new Product(list.productId, list.title, list.description, list.category,
            list.price, list.imageId, path, list.userId, list.createdAt))
        }, () => {
          console.log("NOT FOUND")
          this.products.push(new Product(list.productId, list.title, list.description, list.category,
            list.price, list.imageId, '', list.userId, list.createdAt))
        });

        this.products.push(new Product(list.productId, list.title, list.description, list.category,
          list.price, list.imageId, '', list.userId, list.createdAt))
      });
    });
  }

  // A logged in Admin can delete the shop products via edit button.
  delete(product: Product): void {
  this.product = product
  this.httpClient.delete(environment.endpointURL + "product/" + this.product.productId).subscribe(() => {
    this.products.splice(this.products.indexOf(product), 1);
  })
}
  // How the shop product editing works
  edit(result: (string|number)[]) {
    if (result[0] == "Title") {
      this.httpClient.put(environment.endpointURL + "product/" + this.product.productId, {
        title: result[1]
      }).subscribe(res => {
        this.product.title = result[1].toString()
      });
    }
    if (result[0] == "Description") {
      this.httpClient.put(environment.endpointURL + "product/" + this.product.productId, {
        description: result[1]
      }).subscribe(res => {
        this.product.description = result[1].toString()
      });
    }
    if (result[0] == "Price") {
      this.httpClient.put(environment.endpointURL + "product/" + this.product.productId, {
        title: result[1]
      }).subscribe(res => {
        this.product.price = Number(result[1])
      });
    }
    if (result[0] == "All") {
      this.httpClient.put(environment.endpointURL + "product/" + this.product.productId, {
        title: result[1],
        description: result[2],
        price: result[3]
      }).subscribe(res => {
         this.product.title = result[1].toString()
         this.product.description = result[2].toString()
         this.product.price = Number(result[3])
      });
    }
  }

  // A logged in user can browse the shop and filter its products by categories
  filterProducts() {
    this.products = []

    this.httpClient.get(environment.endpointURL + "product").subscribe((lists: any) => {
     lists.forEach((list: any) => {

       if (this.selectedTags.length>0) {
         for (let tag of this.selectedTags) {
           if (tag == list.category) {
            this.products.push(new Product(list.productId, list.title, list.description, list.category,
              list.price, list.imageId, '', list.userId, list.createdAt))
           }
          }
       }
       else
          this.products.push(new Product(list.productId, list.title, list.description, list.category,
            list.price, list.imageId, '', list.userId, list.createdAt))
     });
   });
  }
}
