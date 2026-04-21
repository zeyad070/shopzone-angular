import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ProductCardComponent,
    OrderCardComponent,
    LoadingOverlayComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    ProductCardComponent,
    OrderCardComponent,
    LoadingOverlayComponent,
  ],
})
export class SharedModule {}
