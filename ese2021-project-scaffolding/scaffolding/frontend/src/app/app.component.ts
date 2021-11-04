import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Post } from './models/post.model';
import { Comment } from './models/comment.model';
import { PostComponent } from './post/post.component';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = ''
  text: string = ''
  imageId: number = 0

  posts: Post[] = [];

  loggedIn: boolean | undefined;

  user: User | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog, 
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

  openPopUp(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "post" },
    });
    const sub = dialogRef.componentInstance.createPost.subscribe(result => {
      this.createList(result);
    })
    const subTitle = dialogRef.componentInstance.addTitle.subscribe(result => {
      this.title = result;
    })
  }

  // CREATE - Post
  // Mach das man nur posten kann wenn man eingeloggt ist!
  createList(text: string) {
    this.httpClient.post(environment.endpointURL + "post", {
      postId: 0, 
      title: this.title,
      text: text,
      imageId: 0,
      upvoteCount: 0,
      downvoteCount:0,
      userId: 0 //this.userService.getUser()?.userId
    }).subscribe((list: any) => {
      this.posts.push(new Post(list.postId, list.title, list.text, list.imageId, 
        list.upvoteCount, list.downvoteCount, list.userId, []));
    })
  }
  
 // DELETE - Post
 deleteList(post: Post): void {
  this.httpClient.delete(environment.endpointURL + "post/" + post.postId).subscribe(() => {
    this.posts.splice(this.posts.indexOf(post), 1);
  });
}

upvotePost(post: Post): void {
  this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
    upvoteCount: post.upvoteCount + 1
  }).subscribe(res => {
    post.upvoteCount += 1
  });
 }

downvotePost(post: Post): void {
  this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
    downvoteCount: post.downvoteCount + 1
  }).subscribe(res => {
    post.downvoteCount += 1
  });
 }

  checkUserStatus(): void {
    // Get user data from local storage
    const userToken = localStorage.getItem('userToken');

    // Set boolean whether a user is logged in or not
    this.userService.setLoggedIn(!!userToken);
  }

  // READ - Post, Comment
  readLists(): void {
    this.httpClient.get(environment.endpointURL + "post").subscribe((lists: any) => {
      lists.forEach((list: any) => {

        const comments: Comment[] = [];

        list.comments.forEach((item: any) => {
          comments.push(new Comment(0, '', 0, 0, 0, 0));
        });

        this.posts.push(new Post(list.postId, list.title, list.text, list.imageId, 
          list.upvoteCount, list.downvoteCount, list.userId, comments))
      });
    });
  }
}
