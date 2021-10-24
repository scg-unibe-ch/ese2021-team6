import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Post } from './models/post.model';
import { PostItem } from './models/post-item.model';
import { PostComponent } from './post/post.component';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { User } from './models/user.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  posts: Post[] = [];

  newPostName: string = '';

  loggedIn: boolean | undefined;

  user: User | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog, // constructing a popup dialog only one time
    //public dialogRef: MatDialogRef<post>,
  ) {

    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
  }

  ngOnInit() {
    this.readLists();
    this.checkUserStatus();
  }

  // CREATE - Post (Pop-Up)
  createPost(): void {
    //public dialogRef: MatDialogRef<DialogOverviewExampleDialog>
   //@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    const dialogRef = this.dialog.open(PostComponent, {
      width: '750px',
      height: '350px'
    });

    /*
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
    */
  }

  // CREATE - Post
  createList(): void {
    this.httpClient.post(environment.endpointURL + "post", {
      name: this.newPostName
    }).subscribe((list: any) => {
      this.posts.push(new Post(list.postId, list.name, []));
      this.newPostName = '';
    })
  }

  // READ - Post, PostItem
  readLists(): void {
    this.httpClient.get(environment.endpointURL + "post").subscribe((lists: any) => {
      lists.forEach((list: any) => {
        const postItems: PostItem[] = [];

        list.postItems.forEach((item: any) => {
          postItems.push(new PostItem(item.postItemId, item.postId, item.name, item.itemImage, item.done));
        });

        this.posts.push(new Post(list.postId, list.name, postItems))
      });
    });
  }

  // UPDATE - Post
  updateList(post: Post): void {
    this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
      name: post.name
    }).subscribe();
  }

  // DELETE - Post
  deleteList(post: Post): void {
    this.httpClient.delete(environment.endpointURL + "post/" + post.postId).subscribe(() => {
      this.posts.splice(this.posts.indexOf(post), 1);
    });
  }

  checkUserStatus(): void {
    // Get user data from local storage
    const userToken = localStorage.getItem('userToken');

    // Set boolean whether a user is logged in or not
    this.userService.setLoggedIn(!!userToken);

  }
}
