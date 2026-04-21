import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WishlistRoutingModule } from './wishlist-routing.module';
import { WishlistComponent } from './wishlist.component';

@NgModule({
  declarations: [WishlistComponent],
  imports: [CommonModule, WishlistRoutingModule],
})
export class WishlistModule {}
