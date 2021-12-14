import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Post } from '../models/post.model';
import { OrderComponent } from '../order/order.component';
import { ProfileComponent } from '../profile/profile.component';
import { ShopComponent } from '../shop/shop.component';
import { CommentComponent } from './comment/comment.component';
import { Comment } from '@angular/compiler';
import { Location } from '@angular/common';

import { PostComponent } from './post.component';

const routes: Routes = [
  {path:'Shop', component: ShopComponent},
  {path:'Forum', component: PostComponent},
  {path:'Comments', component: CommentComponent},
  {path:'Profile', component: ProfileComponent},
  {path: 'Order', component: OrderComponent},
  {path:'Dashboard', component: DashboardComponent},
];

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let post: Post
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        PostComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    location = TestBed.get(Location);
    router = TestBed.get(Router);
    router.initialNavigation();

    post = new Post(1, "title", "text", 1, "url", 1, 1, 1, [], "category", "now")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to comments', fakeAsync(() => {
    component.showComments(post, "Comments")
    tick();
    expect(location.path()).toBe('/Comments')
  }));
});
