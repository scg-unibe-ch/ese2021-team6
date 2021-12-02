import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
    {path:'Shop', component: ShopComponent}
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }