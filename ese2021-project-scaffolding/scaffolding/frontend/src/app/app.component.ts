import { Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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

  navigateTo: string | null = "Forum"

  constructor(
    public httpClient: HttpClient,
    public httpClientmodule: HttpClientModule,
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

    if (localStorage.getItem('navigation') != null) {
      this.navigateTo = localStorage.getItem('navigation');
    }

    switch ( this.navigateTo ) {
      case "Forum":
        this.goToForum("Forum")
        break;
      case "Shop":
        this.goToShop("Shop")
        break;
      case "Dashboard":
        this.goToDashboard("Dashboard")
        break;
      case "Profile":
        this.goToProfile("Profile")
        break;
      default: 
        this.goToForum("Forum")
        break;
   }
  }

  goToForum(pageName: string) {
    localStorage.setItem('navigation', 'Forum');
    this.router.navigate([`${pageName}`])
  }

  goToShop(pageName: string) {
    localStorage.setItem('navigation', 'Shop');
    this.router.navigate([`${pageName}`])
  }

  goToDashboard(pageName: string) {
    if (this.loggedIn) {
      localStorage.setItem('navigation', "Dashboard");
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

  goToProfile(pageName: string) {
    if (this.loggedIn) {
      localStorage.setItem('navigation', "Profile");
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

  /**   
   * Checks the data from the local storage on the user device
   * and saves them into the Backend and Frontend.
   * */
  checkUserStatus(): void {
    // Get user data from local storage
    const userToken = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    // Save the data from the local storage into the Frontend and Backend
    if (userId != null) {
      this.userService.setUserId(parseInt(userId))
    }
    if (userName != null) {
      this.userService.setUserName(userName)
    }
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
