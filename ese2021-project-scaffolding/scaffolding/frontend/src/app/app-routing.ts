import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CommentComponent } from './post/comment/comment.component';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
    {path:'Shop', component: ShopComponent},
    {path:'Forum', component: PostComponent},
    {path:'Comments', component: CommentComponent},
    {path:'Profile', component: ProfileComponent}
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }