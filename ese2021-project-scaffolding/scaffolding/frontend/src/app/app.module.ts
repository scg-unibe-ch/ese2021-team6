import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {MatSelectModule} from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './post/comment/comment.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { DialogComponent } from './dialog/dialog.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import { ShopComponent } from './shop/shop.component';
import { OrderComponent } from './orders/order.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    CommentComponent,
    ShopComponent,
    UserComponent,
    ProfileComponent,
    DialogComponent,
    OrderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule,
    MatCheckboxModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    /*
    {
      provide: MatDialogRef,
      useValue: {}
    }
    */
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
