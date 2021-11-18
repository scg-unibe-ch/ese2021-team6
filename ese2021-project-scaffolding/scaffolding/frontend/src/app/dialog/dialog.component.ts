import { flatten } from '@angular/compiler';
import { Component, Input, Output, EventEmitter, Inject, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  postTitle: string = '';
  text: string = '';

  @Output()
  addTitle = new EventEmitter<string>();

  @Output()
  createPost = new EventEmitter<string>();

  @Output()
  createComment = new EventEmitter<string>();

  @Output()
  addImage = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {value: string}
    ){}

  publishPost(): void {
    this.addTitle.emit(this.postTitle);
    this.createPost.emit(this.text);
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    const file:File = event.target.files[0];

    console.log(file)
    this.addImage.emit(file)
  }

  publishComment(): void {
    this.createComment.emit(this.text);
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
