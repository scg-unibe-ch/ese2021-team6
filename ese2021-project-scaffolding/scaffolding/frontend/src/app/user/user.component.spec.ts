import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserComponent } from './user.component';
import { User } from '../models/user.model';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} },
        UserComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('html check', () => {
    const data=fixture.nativeElement;
    expect(data.querySelector(".logintext").textContent).toContain("Login");
  });*/

  it('correct @ in email check', () => {
    component.userinformationToRegister.email = "blabla";
    expect(component.checkCorrectMail()).toBeFalsy();
  });

  it('correct @ in email check2', () => {
    component.userinformationToRegister.email = "blabl@";
    expect(component.checkCorrectMail()).toBeTruthy();
  });

  it('check username and email not empty', () => {
    component.userinformationToRegister.email = "";
    expect(component.checkNoEmptyFields()).toBeFalsy();
  });

  it('check that password longer than 7 symbols', () => {
    component.userToRegister.password =  "Pass2!";
    expect(component.checkPasswordConditions()).toBeFalsy();
  });

  it('check that password contains number', () => {
    component.userToRegister.password =  "Passwordddddd!";
    expect(component.checkPasswordConditions()).toBeFalsy();
  });

  it('check that password contains special character', () => {
    component.userToRegister.password =  "Password12222";
    expect(component.checkPasswordConditions()).toBeFalsy();
  });

  it('check that password contains Uppercase letter', () => {
    component.userToRegister.password =  "password12!";
    expect(component.checkPasswordConditions()).toBeFalsy();
  });

  it('check that password contains Lowercase letter', () => {
    component.userToRegister.password =  "WWW4!WWWWWW";
    expect(component.checkPasswordConditions()).toBeFalsy();
  });

  it('check that correct password is accepted', () => {
    component.userToRegister.password =  "NewPerson1!";
    expect(component.checkPasswordConditions()).toBeTruthy();
  });

});

