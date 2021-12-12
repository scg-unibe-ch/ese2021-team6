import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  private loggedIn: boolean | undefined;

  private user: User | undefined;

  private isAdmin: boolean | undefined;

  private userId: number | undefined

  private userName: string | undefined

  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private loggedInSource = new Subject<boolean>();
  private userSource = new Subject<User>();
  private isAdminSource = new Subject<boolean>();
  private userIdSource = new Subject<number>();
  private userNameSource = new Subject<string>();

  // Observable Streams
  loggedIn$ = this.loggedInSource.asObservable();
  user$ = this.userSource.asObservable();
  isAdmin$ = this.isAdminSource.asObservable();
  userId$ = this.userIdSource.asObservable();
  userName$ = this.userNameSource.asObservable();

  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getLoggedIn(): boolean | undefined {
    return this.loggedIn;
  }

  getUser(): User | undefined {
    return this.user;
  }

  getIsAdmin(): boolean | undefined {
    return this.isAdmin;
  }

  getUserId(): number | undefined {
    return this.userId;
  }

  getUserName(): string | undefined {
    return this.userName;
  }

  /*******************************************************************************************************************
   * SETTERS
   ******************************************************************************************************************/

  setLoggedIn(loggedIn: boolean | undefined): void {
    this.loggedInSource.next(loggedIn);
  }

  setUser(user: User | undefined): void {
    this.userSource.next(user);
  }

  setIsAdmin(isAdmin: boolean | undefined): void {
    this.isAdminSource.next(isAdmin);
  }

  setUserId(userId: number | undefined): void {
    this.userIdSource.next(userId);
  }

  setUserName(userName: string | undefined): void {
    this.userNameSource.next(userName);
  }

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor() {
    // Observer
    this.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user$.subscribe(res => this.user = res);
    this.isAdmin$.subscribe(res => this.isAdmin = res);
    this.userId$.subscribe(res => this.userId = res);
    this.userName$.subscribe(res => this.userName = res);
  
    // Default values
    this.setLoggedIn(false);
    this.setIsAdmin(false);
    this.setUserId(0);
    this.setUserName('');
  }
}
