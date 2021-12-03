import { Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { DialogComponent } from './dialog/dialog.component';
import { ConditionalExpr } from '@angular/compiler';
import { UserComponent } from './user/user.component';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  user: User | undefined;
  loggedIn: boolean | undefined;
  isAdmin: boolean | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {
    // Set up Icons
    this.matIconRegistry.addSvgIcon(
      "menu_button",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/menu-button.svg")
    );
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
    this.checkUserStatus();
    this.goToForum("Forum")
  }

  goToForum(pageName: string) {
    this.router.navigate([`${pageName}`])
  }

  goToShop(pageName: string) {
    this.router.navigate([`${pageName}`])
  }

  goToProfile(pageName: string) {
    if (this.loggedIn) {
      this.router.navigate([`${pageName}`])
    }
    else {
      const dialogRef = this.dialog.open(UserComponent, {
        width: '550px',
        height: '310px',
        data: { value: "login" },
      });
    }
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  
    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
    this.userService.setIsAdmin(false)
  }

  openLoginWindow() {
    const dialogRef = this.dialog.open(UserComponent, {
      width: '550px',
      height: '310px',
      data: { value: "login" },
    });
  }

  openRegisterWindow() {
    const dialogRef = this.dialog.open(UserComponent, {
      width: '550px',
      height: '500px',
      data: { value: "register" },
    });
  }

  checkUserStatus(): void {
    // Get user data from local storage
    const userToken = localStorage.getItem('userToken');

    // Set boolean whether a user is logged in or not
    this.userService.setLoggedIn(!!userToken);

    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.userService.setIsAdmin(true)
      this.isAdmin = this.userService.getIsAdmin()
    }, () => {
      this.userService.setIsAdmin(false)
      this.isAdmin = this.userService.getIsAdmin()
    });
  }
}
