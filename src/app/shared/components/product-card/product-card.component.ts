import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  standalone: false,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() showAddButton = true;
  @Input() adding = false;

  @Input() inWishlist = false;
  @Input() togglingWishlist = false;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();

  onAdd(): void {
    this.addToCart.emit(this.product);
  }

  onToggleWishlist(): void {
    this.toggleWishlist.emit(this.product);
  }

  onDetailsClick(event: Event): void {
    if (this.product.stock <= 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  stockLabel(): 'out' | 'low' | 'ok' {
    if (this.product.stock <= 0) return 'out';
    if (this.product.stock <= 5) return 'low';
    return 'ok';
  }
}
