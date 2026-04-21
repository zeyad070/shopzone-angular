import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { WishlistComponent } from './wishlist.component';

const routes: Routes = [{ path: '', component: WishlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishlistRoutingModule {}
