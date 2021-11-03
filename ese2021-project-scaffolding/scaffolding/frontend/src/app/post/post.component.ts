import { Component, Input, Output, EventEmitter, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  postTitle: string = '';

  title: string = '';

  @Input()
  post: Post = new Post(0, '', '', 0, 0, 0, 0, []);

  @Output()
  create = new EventEmitter<string>();

  @Output()
  updateEvent = new EventEmitter<Post>();

  @Output()
  deleteEvent = new EventEmitter<Post>();

  @Output()
  upvoteEvent = new EventEmitter<Post>();

  @Output()
  downvoteEvent = new EventEmitter<Post>();

  constructor(
    public httpClient: HttpClient,
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

  createComment(): void {

  }

  /*
  // CREATE - Comment
  createItem(): void {
    this.httpClient.post(environment.endpointURL + "comment", {
      name: this.newCommentName,
      done: false,
      postId: this.post.postId
    }).subscribe((item: any) => {
      this.post.comments.push(new Comment(item.commentId, item.postId, item.name, '', item.done));
      this.newCommentName = '';
    });
  }

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
