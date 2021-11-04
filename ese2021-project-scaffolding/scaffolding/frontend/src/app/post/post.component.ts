import { Component, Input, Output, EventEmitter, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment.model';
import { DialogComponent } from '../dialog/dialog.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  //Event Emitters to interact with Backend
  @Input()
  post: Post = new Post(0, '', '', 0, 0, 0, 0, []);

  @Output()
  updateEvent = new EventEmitter<Post>();

  @Output()
  deleteEvent = new EventEmitter<Post>();

  @Output()
  upvoteEvent = new EventEmitter<Post>();

  @Output()
  downvoteEvent = new EventEmitter<Post>();

  commentText: string = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog, 
  ) {}

  // EVENT - Update Post
  updateList(): void {
    // Emits event to parent component that Post got updated
    this.updateEvent.emit(this.post);
  }

  // EVENT - Delete Post
  deleteList(): void {
    console.log(this.post);
    // Emits event to parent component that Post got delete
    this.deleteEvent.emit(this.post);
  }

  upVote(): void {
    this.upvoteEvent.emit(this.post);
  }

  downVote(): void {
    this.downvoteEvent.emit(this.post);
  }
  // Opens the popup to write a comment to the post
  openPopUp(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "comment" },
    });
     const commentEvent = dialogRef.componentInstance.createComment.subscribe(result => {
      // console.log("EVENT RECEIVED")
      this.createComment(result);
    })
  }

// CREATE - Comment
  createComment(text: string): void {
    console.log(text)
    this.httpClient.post(environment.endpointURL + "comment", {
      commentId: 0, 
      text: text,
      upvoteCount: 0,
      downvoteCount:0,
      postId: this.post.postId,
      userId: 0 //this.userService.getUser()?.userId
    }).subscribe((item: any) => {
      this.post.comments.push(new Comment(item.commentId, item.text, item.upvoteCount 
        ,item.downvoteCount, item.postId, item.userId));
    });
  }

// DELETE - Comment
  deleteComment(comment: Comment): void {
    console.log(comment.commentId)
     this.httpClient.delete(environment.endpointURL + "comment/" + comment.commentId).subscribe(() => {
      this.post.comments.splice(this.post.comments.indexOf(comment), 1);
    });
  }

  /*
  // READ - Comment
  // Not required since all Comments of a Post are provided with the list itself

  // UPDATE - Comment
  updateItem(comment: Comment): void {
    this.httpClient.put(environment.endpointURL + "comment/" + comment.commentId, {
      name: comment.name,
      done: comment.done,
      postId: comment.postId
    }).subscribe();
  }

  // DELETE - Comment
  deleteItem(comment: Comment): void {
    this.httpClient.delete(environment.endpointURL + "comment/" + comment.commentId).subscribe(() => {
      this.post.comments.splice(this.post.comments.indexOf(comment), 1);
    });
  }
  */
}
