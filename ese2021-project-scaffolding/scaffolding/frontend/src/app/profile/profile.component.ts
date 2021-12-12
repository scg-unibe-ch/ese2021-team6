import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { Comment } from '../models/comment.model';
import { findLast } from '@angular/compiler/src/directive_resolver';
import { Post } from '../models/post.model';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  post: Post = new Post(0, '', '', 0, '', 0, 0, 0, [], '', '');
  posts: Post[] = [];
  
  order: Order = new Order(0, '', '', '', 0, '', '', 0, '', 0);
  orders: Order[] = []

  showInfo: boolean = true;
  showPost: boolean = false;
  showOrder: boolean = false;
  showSetting: boolean = false;

  userId: number | undefined
  userInfo: any;

  userName: string = ''
  email: string = ''

  firstName: string = ''
  lastName: string = ''
  address: string = ''
  city: string = ''
  zipCode: string = ''
  birthday: string = ''
  phonenumber: string = ''

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    userService.userId$.subscribe(res => this.userId = res);
    this.userId = userService.getUserId();

    this.httpClient.get(environment.endpointURL + "user").subscribe((res: any) => {
      this.userInfo = res.filter((info: any) => info.userId === this.userId)
      this.checkRegistration()
    },)
  }

  /**
   * Checks that the user is registered and logged in and sets the userinformation to display it in the html
   */
  checkRegistration() {
    this.userName = this.userInfo[0]?.userName
    if (this.userInfo[0]?.firstName != null) {
      this.firstName = this.userInfo[0]?.firstName
    }
    if (this.userInfo[0]?.lastName != null) {
      this.lastName = this.userInfo[0]?.lastName
    }
    if (this.userInfo[0]?.email != null) {
      this.email = this.userInfo[0]?.email
    }
    if (this.userInfo[0]?.address != null) {
      this.address = this.userInfo[0]?.address
    }
    if (this.userInfo[0]?.city != null) {
      this.city = this.userInfo[0]?.city
    }
    if (this.userInfo[0]?.zipCode != null) {
      this.zipCode = this.userInfo[0]?.zipCode.toString()
    }
    if (this.userInfo[0]?.birthday != null) {
      this.birthday = this.userInfo[0]?.birthday
    }
    if (this.userInfo[0]?.phonenumber != null) {
      this.phonenumber = this.userInfo[0]?.phonenumber.toString()
    }
  }

  /**
   * Sets all the show booleans to false
   */
  resetDisplay() {
    this.showInfo = false
    this.showOrder = false
    this.showPost = false
    this.showSetting = false
  }

  /**
   * Shows the account information
   */
  showAccInfo() {
    this.resetDisplay()
    this.showInfo = true
  }

  /**
   * Shows the posts sent
   */
  showPosts() {
    this.resetDisplay()
    this.showPost = true
    
    this.httpClient.get(environment.endpointURL + "post").subscribe((lists: any) => {
      lists.forEach((list: any) => {
        if (list.userId == this.userId) {
          const comments: Comment[] = [];

          list.comments.forEach((comment: any) => {
            comments.push(new Comment(comment.commentId, comment.text, comment.upvoteCount, comment.downvoteCount, comment.postId, comment.userId));
          });
  
          this.httpClient.get(environment.endpointURL + "post/" + list.postId + "/image").subscribe((img: any) => {
            var path = "http://localhost:3000/uploads/" + img.fileName
  
            this.posts.push(new Post(list.postId, list.title, list.text, list.imageId,
              path, list.upvoteCount, list.downvoteCount, list.userId, [], list.category, list.createdAt));
          }, () => {
            console.log("NOT FOUND")
            this.posts.push(new Post(list.postId, list.title, list.text, list.imageId,
              '', list.upvoteCount, list.downvoteCount, list.userId, comments, list.category, list.createdAt))
          });
        }
      });
    });
  }

  /**
   * Shows the orders given to the shop
   */
  showOrders() {
    this.resetDisplay()
    this.showOrder = true
    
    this.httpClient.get(environment.endpointURL + "order").subscribe((lists: any) => {
      lists.forEach((list: any) => {
        if (list.username == this.userName) {
          this.httpClient.get(environment.endpointURL + "product").subscribe((products: any) => {

            products.forEach((product: any) => {
              if (product.productId == list.productId) {
                this.orders.push(new Order(list.orderId, list.username, list.deliveryAdress, list.city, list.zipcode, list.paymentMethod,
                list.orderStatus, list.productId, product.title, product.price));
              }
            })
          })
        }
      })
    })
  }

  /**
   * Shows the settings
   */
  showSettings() {
    this.resetDisplay()
    this.showSetting = true
  }
}
