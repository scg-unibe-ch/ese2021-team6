import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PostItem } from '../../models/post-item.model';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent {

  @Input()
  postItem: PostItem = new PostItem(0, 0, '', '', false);

  @Output()
  update = new EventEmitter<PostItem>();

  @Output()
  delete = new EventEmitter<PostItem>();

  updateItem(): void {
    // Emits event to parent component that PostItem got updated
    this.update.emit(this.postItem);
  }

  deleteItem(): void {
    // Emits event to parent component that PostItem got deleted
    this.delete.emit(this.postItem);
  }
}
