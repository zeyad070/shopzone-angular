import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: false,
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private sub?: Subscription;

  constructor(
    readonly auth: AuthService,
    readonly cart: CartService,
    readonly theme: ThemeService,
    readonly wishlist: WishlistService,
  ) {}

  ngOnInit(): void {
    this.syncAuthUi();
    this.sub = this.auth.authState$.subscribe(() => {
      this.syncAuthUi();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  logout(): void {
    this.auth.logout();
  }

  private syncAuthUi(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    const userId = this.auth.getUserId();
    this.cart.refreshCount(userId);
    if (userId) {
      this.wishlist.getWishlist(userId);
    }
  }
}
