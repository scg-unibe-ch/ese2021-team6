import { flatten } from '@angular/compiler';
import { HttpClientModule } from '@angular/common/http';
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
  category: string = '';
  price: string = '';

  titleErrorMsg: string = '';
  categoryErrorMsg: string = '';
  priceErrorMsg: string = '';
  productInformation: (string|number)[] = []

  @Output()
  addTitle = new EventEmitter<string>();

  @Output()
  createPost = new EventEmitter<string>();

  @Output()
  createProduct = new EventEmitter<(string|number)[]>();

  @Output()
  createComment = new EventEmitter<string>();

  @Output()
  editPost = new EventEmitter<any>();

  @Output()
  editComment = new EventEmitter<string>();

  @Output()
  editProduct = new EventEmitter<(string|number)[]>();

  @Output()
  addImage = new EventEmitter<any>();

  @Output()
  addCategory = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {value: string}
    ){}

  /**
   * Publishes a product or calls the methods to create posts
   * @param value The Value of what is published.
   */
  publish(value: string): void {
    this.titleErrorMsg = '';
    this.categoryErrorMsg = '';
    this.priceErrorMsg = '';

    if( this.checkNoEmptyTitle() && this.checkNoEmptyCategory() ){
      if (value == "product") {
        if (this.checkNoEmptyPrice()) {
          this.productInformation.push(this.postTitle)
          this.productInformation.push(this.text)
          this.productInformation.push(this.category)
          this.productInformation.push(this.price)
          this.createProduct.emit(this.productInformation);
          this.dialogRef.close();
        }
      }
      else {
        this.addTitle.emit(this.postTitle);
        this.addCategory.emit(this.category);      
        this.createPost.emit(this.text);
        this.dialogRef.close();
      }
    }
  }

  /**
   * Checks that the title is not empty
   * @returns true if the title is not empty
   */
  checkNoEmptyTitle(): boolean{
    if(this.postTitle != ''){
      return true;
    }
    this.titleErrorMsg = "Please enter a title";
    return false;
  }

  /**
   * Checks that the price is not zero
   * @returns True if that is the case
   */
  checkNoEmptyPrice(): boolean{
    if(this.price.length > 0){
      if (!Number.isNaN(Number.parseFloat(this.price))) {
        return true;
      }
      else {
        this.priceErrorMsg = "Please enter a number";
        return false
      }
    }
    this.priceErrorMsg = "Please enter a price";
    return false;
  }

  /**
   * Checks that the Category is not empty
   * @returns true if the category is not empty
   */
  checkNoEmptyCategory(): boolean{
    if(this.category != ''){
      return true;
    }
    this.categoryErrorMsg = "Please select a category";
    return false;
  }

  /**
   * Adds the file as an image
   * @param event the file selected from the user to be uploaded
   */
  onFileSelected(event: any): void {
    const file:File = event.target.files[0];

    console.log(file)
    this.addImage.emit(file)
  }

  publishComment(): void {
    this.createComment.emit(this.text);
    this.dialogRef.close();
  }

  /**
   * Opens a window to edit a product
   */
  publishProductEdit(): void {
    if (this.data.value == "editProduct") {
      if (this.postTitle == '' && this.price == '') {
        var editArray = ["Description", this.text]
        this.editProduct.emit(editArray);
      }
      else
        if (this.text == '' && this.price == '') {
          var editArray = ["Title", this.postTitle]
          this.editProduct.emit(editArray);
        }
      else
        if (this.text == '' && this.postTitle == '') {
          var editArray = ["Price", this.price]
          this.editProduct.emit(editArray);
        }
      else
        if (this.text != '' && this.postTitle != '' && this.price != '') {
          var editArray = ["All", this.postTitle, this.text, this.price]
          this.editProduct.emit(editArray)
        }
      }
    this.dialogRef.close();
  }

  /**
   * Publishes the edited product
   */
  publishEdit(): void {
    if (this.data.value == "editPost") {
      if (this.postTitle == '') {
        var editArray = ["Text", this.text]
        this.editPost.emit(editArray);
      }
      else
        if (this.text == '') {
          var editArray = ["Title", this.postTitle]
          this.editPost.emit(editArray);
        }
      else
        if (this.text != '' && this.postTitle != '') {
          var editArray = ["Both", this.postTitle, this.text]
          this.editPost.emit(editArray)
        }
      }
    else
     if (this.data.value == "editComment") {
      this.editComment.emit(this.text);
     }
    this.dialogRef.close();
  }

  /**
   * Closes the dialog popUp
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
