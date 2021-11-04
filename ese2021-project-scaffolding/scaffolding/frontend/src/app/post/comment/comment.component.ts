import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {

  @Input()
  comment: Comment = new Comment(0, '', 0, 0, 0, 0);

  @Output()
  updateEvent = new EventEmitter<Comment>();

  @Output()
  deleteEvent = new EventEmitter<Comment>();

  updateComment(): void {
    // Emits event to parent component that Comment got updated
    this.updateEvent.emit(this.comment);
  }

  deleteComment(): void {
    // Emits event to parent component that Comment got deleted
    this.deleteEvent.emit(this.comment);
  }
}
