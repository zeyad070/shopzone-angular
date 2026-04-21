import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noAuth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./pages/Landing-Page/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./pages/product-list/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./pages/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/cart/cart.module').then((m) => m.CartModule),
  },
  {
    path: 'wishlist',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/wishlist/wishlist.module').then((m) => m.WishlistModule),
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./components/not-found/not-found.module').then((m) => m.NotFoundModule),
  },
];
