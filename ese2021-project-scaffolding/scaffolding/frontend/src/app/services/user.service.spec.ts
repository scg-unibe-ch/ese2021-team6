import { TestBed } from '@angular/core/testing';
import { User } from '../models/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let user: User

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    user = new User(1, "newUser", "newPassword")
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setting a user should work', () => {
    service.setUser(user)
    expect(service.getUser()).toEqual(user);
  });

  it('setting a userId should work', () => {
    service.setUserId(5)
    expect(service.getUserId()).toEqual(5);
  });

  it('setting a userName should work', () => {
    service.setUserName("userName")
    expect(service.getUserName()).toEqual("userName");
  });
});
