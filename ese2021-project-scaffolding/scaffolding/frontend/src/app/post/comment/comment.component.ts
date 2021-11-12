import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { IEvent } from '../../IEvent';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements IEvent{

  @Input()
  comment: Comment = new Comment(0, '', 0, 0, 0, 0);

  @Output()
  updateEvent = new EventEmitter<Comment>();

  @Output()
  deleteEvent = new EventEmitter<Comment>();

  update(): void {
    // Emits event to parent component that Comment got updated
    this.updateEvent.emit(this.comment);
  }

  delete(): void {
    // Emits event to parent component that Comment got deleted
    this.deleteEvent.emit(this.comment);
  }
}
