import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { Userinformation } from '../models/userinformation.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  loggedIn: boolean | undefined;

  user: User | undefined;

  userToRegister: User = new User(0, '', '');

  userinformationToRegister: Userinformation = new Userinformation('', '', '', '', 0, '', 0, 0);

  userToLogin: User = new User(0, '', '');

  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';

  loginErrorMsg: string = '';
  registerErrorMsg: string = '';

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
  }

  checkPasswordConditions(): boolean {
    this.registerErrorMsg = '';
    console.log(this.userToRegister.password);

    let userPassword = this.userToRegister.password;
    let hasANumber = false;
    let hasACapitalLetter = false;
    let hasASmallLetter = false;
    let hasASpecialCharacter = false;

    console.log(this.registerErrorMsg);
    // Password condition check
    if (userPassword.length > 7) {
      for (let i = 0; i < userPassword.length; i++) {
        // Checks that character is a ASCII character
        if (userPassword.charCodeAt(i) > 31 && userPassword.charCodeAt(i) < 127) {
          if (userPassword.charCodeAt(i) > 47 && userPassword.charCodeAt(i) < 58) {
            hasANumber = true;
            continue;
          }
          if (userPassword.charCodeAt(i) > 96 && userPassword.charCodeAt(i) < 123) {
            hasASmallLetter = true;
            continue;
          }
          if (userPassword.charCodeAt(i) > 64 && userPassword.charCodeAt(i) < 91) {
            hasACapitalLetter = true;
            continue;
          }
          hasASpecialCharacter = true;
        }
        else{
          this.registerErrorMsg = "Unknown character usage";
          return false;
        }
      }
      let errorMsg = '';
      if (!hasANumber) {errorMsg += 'Number missing\n'}
      if (!hasASmallLetter) {errorMsg += 'Small letter missing\n'}
      if (!hasACapitalLetter) {errorMsg += 'Capital letter missing\n'}
      if (!hasASpecialCharacter) {errorMsg += 'Special character missing'}
      this.registerErrorMsg = errorMsg;
      if (hasANumber && hasACapitalLetter && hasASmallLetter && hasASpecialCharacter) {
        return true;
      }
      return false;
    }
    else{
      this.registerErrorMsg = 'Password must contain at least 8 characters'
      return false;
    }
  }
  
  registerUser(): void {
    if (this.checkPasswordConditions()) {
      console.log("Password correct");
      this.httpClient.post(environment.endpointURL + "user/register", {
        userName: this.userToRegister.username,
        password: this.userToRegister.password,
        firstName: this.userinformationToRegister.firstname,
        lastName: this.userinformationToRegister.lastname,
        email: this.userinformationToRegister.email,
        address: this.userinformationToRegister.address,
        zipCode: this.userinformationToRegister.zipCode,
        city: this.userinformationToRegister.city,
        birthday: this.userinformationToRegister.birthday,
        phoneNumber: this.userinformationToRegister.phonenumber
      }).subscribe(() => {
        this.registerErrorMsg = '';
  
        this.userToRegister.username = this.userToRegister.password = '';
  
        this.userinformationToRegister.firstname =
        this.userinformationToRegister.lastname =
        this.userinformationToRegister.email =
        this.userinformationToRegister.address =
        this.userinformationToRegister.city = '';
  
        this.userinformationToRegister.zipCode =
        this.userinformationToRegister.birthday =
        this.userinformationToRegister.phonenumber = 0;
      });
    }
  }

  loginUser(): void {
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password
    }).subscribe((res: any) => {
      this.loginErrorMsg = "";
      this.userToLogin.username = this.userToLogin.password = '';

      localStorage.setItem('userName', res.user.userName);
      localStorage.setItem('userToken', res.token);

      this.userService.setLoggedIn(true);
      this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password));
    }, () => {
      this.loginErrorMsg = "Username or password not found!";
      this.userToLogin.username = this.userToLogin.password = '';
    });
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
  }

  accessUserEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "secured").subscribe(() => {
      this.endpointMsgUser = "Access granted";
    }, () => {
      this.endpointMsgUser = "Unauthorized";
    });
  }

  accessAdminEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.endpointMsgAdmin = "Access granted";
    }, () => {
      this.endpointMsgAdmin = "Unauthorized";
    });
  }
}
