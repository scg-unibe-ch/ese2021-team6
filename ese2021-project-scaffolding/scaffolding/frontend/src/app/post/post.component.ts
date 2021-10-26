import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { PostItem } from '../models/post-item.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  newPostItemName: string = '';

  @Input()
  post: Post = new Post(0, '', []);

  @Output()
  update = new EventEmitter<Post>();

  @Output()
  delete = new EventEmitter<Post>();

  constructor(
    public httpClient: HttpClient,
    public dialogRef: MatDialogRef<PostComponent> // Connects to the popup in the postcomponent
  ) {}

  closePopUp(): void {
    this.dialogRef.close();
  }

  // EVENT - Update Post
  updateList(): void {
    // Emits event to parent component that Post got updated
    this.update.emit(this.post);
  }

  // EVENT - Delete Post
  deleteList(): void {
    // Emits event to parent component that Post got delete
    this.delete.emit(this.post);
  }

  // CREATE - PostItem
  createItem(): void {
    this.httpClient.post(environment.endpointURL + "post-item", {
      name: this.newPostItemName,
      done: false,
      postId: this.post.postId
    }).subscribe((item: any) => {
      this.post.postItems.push(new PostItem(item.postItemId, item.postId, item.name, '', item.done));
      this.newPostItemName = '';
    });
  }

  // READ - PostItem
  // Not required since all PostItems of a Post are provided with the list itself

  // UPDATE - PostItem
  updateItem(postItem: PostItem): void {
    this.httpClient.put(environment.endpointURL + "post-item/" + postItem.postItemId, {
      name: postItem.name,
      done: postItem.done,
      postId: postItem.postId
    }).subscribe();
  }

  // DELETE - PostItem
  deleteItem(postItem: PostItem): void {
    this.httpClient.delete(environment.endpointURL + "post-item/" + postItem.postItemId).subscribe(() => {
      this.post.postItems.splice(this.post.postItems.indexOf(postItem), 1);
    });
  }
}
