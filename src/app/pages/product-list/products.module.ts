import { NgModule } from '@angular/core';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductListComponent } from './product-list.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent],
  imports: [SharedModule, ProductsRoutingModule],
})
export class ProductsModule {}
