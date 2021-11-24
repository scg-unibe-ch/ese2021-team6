import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { UserService } from '../../services/user.service';
import { IEvent } from '../../IEvent';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  constructor(
    public userService: UserService,
    public dialog: MatDialog, 
    public httpClient: HttpClient,
  ) {}

   // Opens the popup to edit a post
   openEditPopUp(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '750px',
      height: '350px',
      data: { value: "editComment" },
    });
    var editEvent = dialogRef.componentInstance.editComment.subscribe(result => {
      this.editComment(result);
    })
  }

  editComment(text: string) {
    this.httpClient.put(environment.endpointURL + "comment/" + this.comment.commentId, {
      text: text
    }).subscribe(res => {
      this.comment.text = text
    });
  }

  update(): void {
    // Emits event to parent component that Comment got updated
    this.updateEvent.emit(this.comment);
  }

  delete(): void {
    // Emits event to parent component that Comment got deleted
    this.deleteEvent.emit(this.comment);
  }
}
