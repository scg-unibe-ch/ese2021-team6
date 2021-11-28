import { Component, Input, Output, EventEmitter, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {

  product: Product = new Product(0, '', '', '', 0, 0, 0, '');

  products: Product[] = [];

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog, 
  ) {}

  ngOnInit() {
    this.readLists();
  }

  readLists(): void {
    this.httpClient.get(environment.endpointURL + "product").subscribe((lists: any) => {
      lists.forEach((list: any) => {

        this.products.push(new Product(list.productId, list.title, list.description, list.category,
          list.price, list.imageId, list.userId, list.createdAt))
      });
    });
  }
}
