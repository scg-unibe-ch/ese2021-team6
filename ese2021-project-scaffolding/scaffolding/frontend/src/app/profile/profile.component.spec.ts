import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { zip } from 'rxjs';
import { User } from '../models/user.model';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  let userName: string = "userName"
  let userId: number = 1

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
      ],
      declarations: [
        ProfileComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.showInfo = true
    component.showOrder = true
    component.showPost = true
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset all displays', () => {
    component.resetDisplay()
    expect(component.showInfo).toBeFalsy();
    expect(component.showOrder).toBeFalsy();
    expect(component.showPost).toBeFalsy();
  });
});
