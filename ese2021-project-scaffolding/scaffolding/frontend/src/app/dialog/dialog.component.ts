import { Component, Input, Output, EventEmitter, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  postTitle: string = '';
  postText: string = '';

  @Output()
  addTitle = new EventEmitter<string>();

  @Output()
  createPost = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>
    ){}

  publishPost(): void {
    this.addTitle.emit(this.postTitle);
    this.createPost.emit(this.postText);
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
