import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  @Input()
  comment: Comment = new Comment(0, 0, '', false, 0, 0);

  @Output()
  update = new EventEmitter<Comment>();

  @Output()
  delete = new EventEmitter<Comment>();

  updateItem(): void {
    // Emits event to parent component that Comment got updated
    this.update.emit(this.comment);
  }

  deleteItem(): void {
    // Emits event to parent component that Comment got deleted
    this.delete.emit(this.comment);
  }
}
