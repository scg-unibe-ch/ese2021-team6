import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { findLast } from '@angular/compiler/src/directive_resolver';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {

  user: User | undefined;

  userInfo: any | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
  }
}
