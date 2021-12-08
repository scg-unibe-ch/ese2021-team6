import { Component, Input, Output, EventEmitter, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment.model';
import { DialogComponent } from '../dialog/dialog.component';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PostCommentService } from '../services/post-comment.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  post: Post = new Post(0, '', '', 0, 0, 0, 0, [], '', '');
  posts: Post[] = [];

  title: string = ''
  text: string = ''
  category: string = ''
  imageId: number = 0
  file: File | undefined;

  tags = new FormControl();
  selectedTags: string = ""
  tagList: string[] = ['Rpg', 'Memes', 'Help', 'Shooter'];

  constructor(
    public postCommentService: PostCommentService,
    public httpClient: HttpClient,
    public userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkUserStatus()
    this.readPosts();
  }

  checkUserStatus(): void {
    const userToken = localStorage.getItem('userToken');
    this.userService.setLoggedIn(!!userToken);
  }

  // Opens the popup to create a post
  openPostWindow(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "post" },
    });
    const sub = dialogRef.componentInstance.createPost.subscribe(result => {
      this.createPost(result);
    })
    const subTitle = dialogRef.componentInstance.addTitle.subscribe(result => {
      this.title = result;
    })
    const subCategory = dialogRef.componentInstance.addCategory.subscribe(result => {
      this.category = result;
    })
    const subImage = dialogRef.componentInstance.addImage.subscribe(result => {
      this.file = result;
    })
  }

  // Opens the popup to edit a post
  openEditWindow(post: Post): void {
    this.post = post
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "editPost" },
    });
    var editEvent = dialogRef.componentInstance.editPost.subscribe(result => {
      this.editPost(result);
    })
  }

  // CREATE - Post
  createPost(text: string) {
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
          const fd = new FormData();
          fd.append('image', this.file);

          this.httpClient.post(environment.endpointURL + "post/" + list.postId + "/image",fd)
          .subscribe((res: any) => {
            console.log("Uploaded to database")
            console.log(res)
          })
        }
    })
  }

 // DELETE - Post
 deletePost(post: Post): void {
  this.httpClient.delete(environment.endpointURL + "post/" + post.postId).subscribe(() => {
    this.posts.splice(this.posts.indexOf(post), 1);
  })
 }

// UpVote - Post
upvotePost(post: Post): void {
  var votedPost: any |undefined
  this.httpClient.get(environment.endpointURL + "votedPosts").subscribe((res: any) => {
    votedPost = res.filter((info: any) => info.userId === this.userService.getUser()?.userId &&
    info.postId === post.postId)

    if (votedPost[0] == undefined) {
      this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
        upvoteCount: post.upvoteCount + 1
      }).subscribe(res => {
        post.upvoteCount += 1
        this.votePost(post, 1)
      });
    }
    else
      if (votedPost[0].voted == 0) {
      this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
        upvoteCount: post.upvoteCount + 1
      }).subscribe(res => {
        post.upvoteCount += 1
        this.updateVotedPost(votedPost[0].voteId, 1)
      });
    }
    else
      if (votedPost[0].voted == 1) {
        this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
          upvoteCount: post.upvoteCount - 1
        }).subscribe(res => {
          post.upvoteCount -= 1
          this.updateVotedPost(votedPost[0].voteId, 0)
        });
      }
    else
      if (votedPost[0].voted == -1) {
        this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
          upvoteCount: post.upvoteCount + 2
        }).subscribe(res => {
          post.upvoteCount += 2
          this.updateVotedPost(votedPost[0].voteId, 1)
        });
      }
  })
 }

// DownVote - Post
downvotePost(post: Post): void {
  var votedPost: any |undefined
  this.httpClient.get(environment.endpointURL + "votedPosts").subscribe((res: any) => {
    votedPost = res.filter((info: any) => info.userId === this.userService.getUser()?.userId &&
    info.postId === post.postId)

    if (votedPost[0] == undefined) {
      this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
        downvoteCount: post.downvoteCount + 1
      }).subscribe(res => {
        post.downvoteCount += 1
        this.votePost(post, -1)
      });
    }
    else
      if (votedPost[0].voted == 0) {
      this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
        downvoteCount: post.downvoteCount + 1
      }).subscribe(res => {
        post.downvoteCount += 1
        this.updateVotedPost(votedPost[0].voteId, -1)
      });
    }
    else
      if (votedPost[0].voted == 1) {
        this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
          downvoteCount: post.downvoteCount + 2
        }).subscribe(res => {
          post.downvoteCount += 2
          this.updateVotedPost(votedPost[0].voteId, -1)
        });
      }
    else
      if (votedPost[0].voted == -1) {
        this.httpClient.put(environment.endpointURL + "post/" + post.postId, {
          downvoteCount: post.downvoteCount - 1
        }).subscribe(res => {
          post.downvoteCount -= 1
          this.updateVotedPost(votedPost[0].voteId, 0)
        });
      }
   })
  }
  // A voted post gets updated so the score shows correctly
  updateVotedPost(voteId: number, value: number) {
    this.httpClient.put(environment.endpointURL + "votedPosts/" + voteId, {
      voted: value
    }).subscribe(res => {
      console.log("Updated votes!")
    })
  }

  // A logged in User can either upvote or downvote a post
  votePost(post: Post, value: number) {
    this.httpClient.post(environment.endpointURL + "votedPosts", {
      voteId: 0,
      userId: this.userService.getUser()?.userId,
      postId: post.postId,
      voted: value
    }).subscribe((list: any) => {
      console.log("Voted!")
    })
  }

  // A logged in User can browse the forum by categories
  filterPosts() {
    console.log(this.selectedTags)
    this.posts = []

    this.httpClient.get(environment.endpointURL + "post").subscribe((lists: any) => {
      lists.forEach((list: any) => {

        const comments: Comment[] = [];

        list.comments.forEach((item: any) => {
          comments.push(new Comment(0, '', 0, 0, 0, 0));
        });

        if (this.selectedTags.length>0) {
          for (let tag of this.selectedTags) {
            if (tag == list.category) {
            this.posts.push(new Post(list.postId, list.title, list.text, list.imageId,
              list.upvoteCount, list.downvoteCount, list.userId, comments, list.category, list.createdAt))
            }
          }
        }
        else
          this.posts.push(new Post(list.postId, list.title, list.text, list.imageId,
            list.upvoteCount, list.downvoteCount, list.userId, comments, list.category, list.createdAt))
      });
    });
  }

  // READ - Post, Comment
  readPosts(): void {
    this.httpClient.get(environment.endpointURL + "post").subscribe((lists: any) => {
      lists.forEach((list: any) => {
        const comments: Comment[] = [];

        list.comments.forEach((comment: any) => {
          comments.push(new Comment(comment.commentId, comment.text, comment.upvoteCount, comment.downvoteCount, comment.postId, comment.userId));
        });

        this.posts.push(new Post(list.postId, list.title, list.text, list.imageId,
          list.upvoteCount, list.downvoteCount, list.userId, comments, list.category, list.createdAt))
      });
    });
  }

  // Only the user that created a certain post is able to edit.
  editPost(result: string[]) {
    if (result[0] == "Text") {
      this.httpClient.put(environment.endpointURL + "post/" + this.post.postId, {
        text: result[1]
      }).subscribe(res => {
        this.post.text = result[1]
      });
    }
    if (result[0] == "Title") {
      this.httpClient.put(environment.endpointURL + "post/" + this.post.postId, {
        title: result[1]
      }).subscribe(res => {
        this.post.title = result[1]
      });
    }
    if (result[0] == "Both") {
      this.httpClient.put(environment.endpointURL + "post/" + this.post.postId, {
        title: result[1],
        text: result[2]
      }).subscribe(res => {
        this.post.title = result[1]
        this.post.text = result[2]
      });
    }
  }
  // visualize the comments, that belong to a certain post
  showComments(post: Post, pageName: String) {
    this.post = post
    this.postCommentService.setPost(post)
    this.router.navigate([`${pageName}`])
  }
}
