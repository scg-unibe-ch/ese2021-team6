import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { UserService } from '../../services/user.service';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post } from 'src/app/models/post.model';
import { PostCommentService } from 'src/app/services/post-comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  comment: Comment = new Comment(0, '', 0, 0, 0, 0);
  post: Post = new Post(0, '', '', 0, 0, 0, 0, [], '', '');

  @Output()
  updateEvent = new EventEmitter<Comment>();

  @Output()
  deleteEvent = new EventEmitter<Comment>();

  constructor(
    public userService: UserService,
    public dialog: MatDialog,
    public httpClient: HttpClient,
    public postCommentService: PostCommentService
  ) {
     // Listen for changes
     postCommentService.post$.subscribe(res => this.post = res);

     // Current value
     this.post = postCommentService.getPost();
  }

  // Opens the popup to write a comment to the post
  openCommentWindow(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "comment" },
    });
     const commentEvent = dialogRef.componentInstance.createComment.subscribe(result => {
      this.createComment(result);
    })
  }

  // CREATE - Comment
  createComment(text: string): void {
    this.httpClient.post(environment.endpointURL + "comment", {
      commentId: 0,
      text: text,
      upvoteCount: 0,
      downvoteCount:0,
      postId: this.post.postId,
      userId: this.userService.getUser()?.userId
    }).subscribe((item: any) => {
      this.post.comments.push(new Comment(item.commentId, item.text, item.upvoteCount
        ,item.downvoteCount, item.postId, item.userId));
    });
  }

   // Opens the popup to edit a post
   openEditPopUp(comment: Comment): void {
    this.comment = comment
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "editComment" },
    });
    var editEvent = dialogRef.componentInstance.editComment.subscribe(result => {
      this.editComment(result);
    })
  }

  // Only the user that created a certain comment is able to edit.
  editComment(text: string) {
    this.httpClient.put(environment.endpointURL + "comment/" + this.comment.commentId, {
      text: text
    }).subscribe(res => {
      this.comment.text = text
    });
  }

  // DELETE - Comment
  deleteComment(comment: Comment): void {
     this.httpClient.delete(environment.endpointURL + "comment/" + comment.commentId).subscribe(() => {
      this.post.comments.splice(this.post.comments.indexOf(comment), 1);
    });
  }
}
