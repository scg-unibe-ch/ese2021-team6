import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { findLast } from '@angular/compiler/src/directive_resolver';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user: User | undefined;

  userInfo: any | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.user = userService.getUser();

    // Gets all users from database
    this.httpClient.get(environment.endpointURL + "user").subscribe((res: any) => {
      // Filters to current user
      this.userInfo = res.filter((info: any) => info.userId === this.user?.userId)
    },)
  }
}
