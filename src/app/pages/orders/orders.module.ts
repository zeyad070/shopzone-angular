import { NgModule } from '@angular/core';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [OrdersComponent],
  imports: [SharedModule, OrdersRoutingModule],
})
export class OrdersModule {}
