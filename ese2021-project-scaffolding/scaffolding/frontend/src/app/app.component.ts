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
import { Form } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = ''
  text: string = ''
  category: string = ''
  imageId: number = 0
  file: File | undefined; // Temporary file that is used after post is created to load into db

  posts: Post[] = [];

  loggedIn: boolean | undefined;

  user: User | undefined;

  isAdmin: boolean | undefined;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog, 
  ) {

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
    this.readLists(); 
    this.checkUserStatus();
    console.log("Admin: ", this.userService.getIsAdmin())
    console.log("Logged in: ", this.userService.getLoggedIn())
    console.log("User: ", this.userService.getUser())
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
    const subCategory = dialogRef.componentInstance.addCategory.subscribe(result => {
      this.category = result;
    })
    const subImage = dialogRef.componentInstance.addImage.subscribe(result => {
      console.log("File:")
      console.log(result)

      this.file = result;
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
      userId: this.userService.getUser()?.userId,
      category: this.category
    }).subscribe((list: any) => {

      this.posts.push(new Post(list.postId, list.title, list.text, list.imageId, 
        list.upvoteCount, list.downvoteCount, list.userId, [], list.category, list.createdAt));

        if (this.file != undefined) {
          console.log("Loading image" + this.file + "...with id:" + list.postId)
          this.httpClient.post(environment.endpointURL + "post/" + list.postId + "/image" , 
            this.file, // Check if file is passed correctly
          ).subscribe(() => {
            console.log("Uploaded to database")
            this.file = undefined
          })
        }
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
   
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.userService.setIsAdmin(true)
      this.isAdmin = this.userService.getIsAdmin()
    }, () => {
      this.userService.setIsAdmin(false)
      this.isAdmin = this.userService.getIsAdmin()
    });
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
          list.upvoteCount, list.downvoteCount, list.userId, comments, list.category, list.createdAt))
      });
    });
  }

  accessAdminEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      console.log("Setting to true...")
      this.userService.setIsAdmin(true)
      this.isAdmin = this.userService.getIsAdmin()
    }, () => {
      this.userService.setIsAdmin(false)
      this.isAdmin = this.userService.getIsAdmin()
    });
  }
}
