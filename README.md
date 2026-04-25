# 🛒 ShopZone — Angular E-Commerce Application

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21.2-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)
![RxJS](https://img.shields.io/badge/RxJS-7.8-pink?logo=reactivex)
![License](https://img.shields.io/badge/License-MIT-green)

**A fully-featured, single-page e-commerce web application built with Angular 21, featuring user authentication, product browsing, cart management, order tracking, and an admin dashboard.**

[🌐 Live Demo](https://zeyad070.github.io/shopzone-angular/) · [📂 Repository](https://github.com/zeyad070/shopzone-angular)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation & Local Setup](#-installation--local-setup)
- [Deployment](#-deployment)
- [Challenges Solved](#-challenges-solved)
- [Future Improvements](#-future-improvements)

---

## 📖 Project Overview

**ShopZone** is a complete e-commerce Single Page Application (SPA) built with **Angular 21** and backed by **JSON Server** as a mock REST API. It simulates a real-world online store with separate customer and admin experiences.

The project was built as part of the **ITI Full Stack .NET & Generative AI Development** program to demonstrate proficiency in Angular architecture, reactive state management with RxJS, form handling, route protection, and REST API integration.

---

## ✨ Features

### 🔐 Authentication
- User **Login** and **Register** pages built with **Reactive Forms**
- Full client-side form validation with descriptive error messages
- **Auth Guard** protecting private routes (`/cart`, `/orders`, `/profile`)
- Persistent login session using **localStorage**
- Automatic redirect to login for unauthenticated users

### 🛍️ Products
- Product listing page with real-time **search by name**
- **Category filter** to browse by product type
- Detailed **Product Details** page per item
- **Out-of-Stock** indicator with disabled cart button for unavailable items

### 🛒 Shopping Cart
- Add products to cart directly from listing or details page
- **Update quantity** inline with live API sync
- **Remove items** from cart
- **Real-time total price** calculation
- Dynamic **cart badge** in the navbar powered by `BehaviorSubject`

### 📦 Orders
- View all past orders tied to the logged-in user
- Visual **status badges**: Pending · Processing · Delivered · Cancelled

### 👤 User Profile
- Displays authenticated user's data from localStorage
- **Logout** functionality that clears session and redirects to login

### 🛠️ Admin Dashboard *(Custom Enhancement)*
- **Add new products** via a form
- **Delete products** from the store
- **Adjust stock levels** (increase or decrease) per product

### 🎨 UI/UX
- Fully responsive design across desktop, tablet, and mobile devices
- Dark mode support
- Toast notifications using ngx-toastr
- Loading indicators for API requests
- Error handling for failed operations

---

## 🧰 Tech Stack

| Category       | Technology                          |
|----------------|-------------------------------------|
| Framework      | Angular 21.2                        |
| Language       | TypeScript 5.9                      |
| Reactive State | RxJS 7.8 (BehaviorSubject, Observables) |
| Styling        | Bootstrap 5.3, CSS3                 |
| Forms          | Angular Reactive Forms              |
| Routing        | Angular Router + Route Guards       |
| Mock Backend   | JSON Server 1.0 (REST API on db.json) |
| Notifications  | ngx-toastr 20                       |
| Testing        | Vitest                              |
| Code Quality   | Prettier, EditorConfig              |
| Package Manager| npm 11.9                            |

---

## 📁 Folder Structure

```
├── 📁 .angular
├── 📁 public
│   └── 📄 favicon.ico
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 components
│   │   │   ├── 📁 navbar
│   │   │   │   ├── 🎨 navbar.component.css
│   │   │   │   ├── 🌐 navbar.component.html
│   │   │   │   └── 📄 navbar.component.ts
│   │   │   └── 📁 not-found
│   │   │       ├── 📄 not-found-routing.module.ts
│   │   │       ├── 🎨 not-found.component.css
│   │   │       ├── 🌐 not-found.component.html
│   │   │       ├── 📄 not-found.component.ts
│   │   │       └── 📄 not-found.module.ts
│   │   ├── 📁 core
│   │   │   ├── 📁 constants
│   │   │   │   └── 📄 api.constants.ts
│   │   │   ├── 📁 interceptors
│   │   │   │   ├── 📄 error.interceptor.ts
│   │   │   │   └── 📄 loading.interceptor.ts
│   │   │   └── 📁 services
│   │   │       └── 📄 loading.service.ts
│   │   ├── 📁 guards
│   │   │   ├── 📄 auth.guard.ts
│   │   │   └── 📄 noAuth.guard.ts
│   │   ├── 📁 interceptors
│   │   │   └── 📄 auth.interceptor.ts
│   │   ├── 📁 models
│   │   │   ├── 📄 cart-item.model.ts
│   │   │   ├── 📄 entity-id.model.ts
│   │   │   ├── 📄 order-item.model.ts
│   │   │   ├── 📄 order.model.ts
│   │   │   ├── 📄 product.model.ts
│   │   │   ├── 📄 user.model.ts
│   │   │   └── 📄 wishlist-item.model.ts
│   │   ├── 📁 pages
│   │   │   ├── 📁 Landing-Page
│   │   │   │   ├── 📄 home-routing.module.ts
│   │   │   │   ├── 🎨 home.component.css
│   │   │   │   ├── 🌐 home.component.html
│   │   │   │   ├── 📄 home.component.ts
│   │   │   │   └── 📄 home.module.ts
│   │   │   ├── 📁 cart
│   │   │   │   ├── 📄 cart-routing.module.ts
│   │   │   │   ├── 🎨 cart.component.css
│   │   │   │   ├── 🌐 cart.component.html
│   │   │   │   ├── 📄 cart.component.ts
│   │   │   │   └── 📄 cart.module.ts
│   │   │   ├── 📁 login
│   │   │   │   ├── 📄 login-routing.module.ts
│   │   │   │   ├── 🎨 login.component.css
│   │   │   │   ├── 🌐 login.component.html
│   │   │   │   ├── 📄 login.component.ts
│   │   │   │   └── 📄 login.module.ts
│   │   │   ├── 📁 orders
│   │   │   │   ├── 📄 orders-routing.module.ts
│   │   │   │   ├── 🎨 orders.component.css
│   │   │   │   ├── 🌐 orders.component.html
│   │   │   │   ├── 📄 orders.component.ts
│   │   │   │   └── 📄 orders.module.ts
│   │   │   ├── 📁 product-detail
│   │   │   │   ├── 🎨 product-detail.component.css
│   │   │   │   ├── 🌐 product-detail.component.html
│   │   │   │   └── 📄 product-detail.component.ts
│   │   │   ├── 📁 product-list
│   │   │   │   ├── 🎨 product-list.component.css
│   │   │   │   ├── 🌐 product-list.component.html
│   │   │   │   ├── 📄 product-list.component.ts
│   │   │   │   ├── 📄 products-routing.module.ts
│   │   │   │   └── 📄 products.module.ts
│   │   │   ├── 📁 profile
│   │   │   │   ├── 📄 profile-routing.module.ts
│   │   │   │   ├── 🎨 profile.component.css
│   │   │   │   ├── 🌐 profile.component.html
│   │   │   │   ├── 📄 profile.component.ts
│   │   │   │   └── 📄 profile.module.ts
│   │   │   ├── 📁 register
│   │   │   │   ├── 📄 register-routing.module.ts
│   │   │   │   ├── 🎨 register.component.css
│   │   │   │   ├── 🌐 register.component.html
│   │   │   │   ├── 📄 register.component.ts
│   │   │   │   └── 📄 register.module.ts
│   │   │   └── 📁 wishlist
│   │   │       ├── 📄 wishlist-routing.module.ts
│   │   │       ├── 🌐 wishlist.component.html
│   │   │       ├── 📄 wishlist.component.ts
│   │   │       └── 📄 wishlist.module.ts
│   │   ├── 📁 services
│   │   │   ├── 📄 auth.service.ts
│   │   │   ├── 📄 cart.service.ts
│   │   │   ├── 📄 order.service.ts
│   │   │   ├── 📄 product.service.ts
│   │   │   ├── 📄 theme.service.ts
│   │   │   └── 📄 wishlist.service.ts
│   │   ├── 📁 shared
│   │   │   ├── 📁 components
│   │   │   │   ├── 📁 loading-overlay
│   │   │   │   │   ├── 🎨 loading-overlay.component.css
│   │   │   │   │   ├── 🌐 loading-overlay.component.html
│   │   │   │   │   └── 📄 loading-overlay.component.ts
│   │   │   │   ├── 📁 order-card
│   │   │   │   │   ├── 🎨 order-card.component.css
│   │   │   │   │   ├── 🌐 order-card.component.html
│   │   │   │   │   └── 📄 order-card.component.ts
│   │   │   │   └── 📁 product-card
│   │   │   │       ├── 🎨 product-card.component.css
│   │   │   │       ├── 🌐 product-card.component.html
│   │   │   │       └── 📄 product-card.component.ts
│   │   │   ├── 📁 validators
│   │   │   │   └── 📄 password-match.validator.ts
│   │   │   └── 📄 shared.module.ts
│   │   ├── 📄 app-module.ts
│   │   ├── 📄 app-routing-module.ts
│   │   ├── 📄 app.config.ts
│   │   ├── 🎨 app.css
│   │   ├── 🌐 app.html
│   │   ├── 📄 app.routes.ts
│   │   ├── 📄 app.spec.ts
│   │   └── 📄 app.ts
│   ├── 🌐 index.html
│   ├── 📄 main.ts
│   └── 🎨 styles.css
├── ⚙️ .editorconfig
├── ⚙️ .gitignore
├── ⚙️ .prettierrc
├── 📄 LICENSE
├── 📝 README.md
├── ⚙️ angular.json
├── ⚙️ db.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── ⚙️ tsconfig.app.json
├── ⚙️ tsconfig.json
└── ⚙️ tsconfig.spec.json
```

---


## ⚙️ Installation & Local Setup

### Prerequisites

Make sure the following are installed on your machine:
- **Node.js** ≥ 20
- **npm** ≥ 11
- **Angular CLI** — install globally: `npm install -g @angular/cli`

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/zeyad070/shopzone-angular.git
cd shopzone-angular
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the mock API server** *(in a separate terminal)*
```bash
npm run api
# JSON Server runs at http://localhost:3000
```

**4. Start the Angular development server**
```bash
npm start
# App runs at http://localhost:4200
```

> ⚠️ Both the Angular app and JSON Server must be running simultaneously for the application to work correctly.

---

## 🚀 Deployment

The application is deployed on **GitHub Pages** using Angular's static build output.

### Build for Production

```bash
ng build --configuration production
```

This generates an optimized build in the `dist/shopzone/browser/` directory.

### Deploy to GitHub Pages

**Option 1: Using the Angular GitHub Pages package**
```bash
# Install the package
npm install -g angular-cli-ghpages

# Build and deploy in one command
ng deploy --base-href=/shopzone-angular/
```

**Option 2: Manual deployment**
```bash
# Build the project
ng build --configuration production --base-href /shopzone-angular/

# Copy the build output to the gh-pages branch
npx ngh --dir=dist/shopzone/browser
```

> 📌 Note: GitHub Pages only supports static hosting and cannot run JSON Server APIs.  
> Full backend functionality (authentication, cart updates, order actions, admin operations) is fully available when running the project locally.

---

## 🧠 Challenges Solved

### 1. Reactive Cart State Across Components
Managing the cart badge count across unrelated components (Navbar ↔ Cart Page) without a full state management library was solved using a **shared `CartService` with `BehaviorSubject`**. Any component subscribing to the cart observable stays in sync automatically.

### 2. Route Protection Without a Backend Auth Server
Since JSON Server has no built-in auth, a custom **`AuthGuard`** was implemented to read session data from `localStorage` and block navigation to protected routes (`/cart`, `/orders`, `/profile`) if no authenticated user is found.

### 3. Real-Time Search and Filtering
Combining search input and category dropdown filters simultaneously without redundant API calls was achieved by **composing RxJS operators** (`debounceTime`, `combineLatest`, `switchMap`) to reactively filter the product list.

### 4. Admin vs. Customer Role Differentiation
Separating admin and customer views without a role-based backend was handled by storing a role flag in `localStorage` on login and conditionally rendering the admin dashboard route and UI elements based on this flag.

### 5. Quantity Sync on Cart Update
Keeping the UI and API state consistent when changing quantities required **optimistic UI updates** paired with API PATCH calls, with error recovery that reverts the displayed quantity if the request fails.

---

## 🔮 Future Improvements

- [ ] **Backend Integration** — Replace JSON Server with a real ASP.NET Core Web API + SQL Server backend
- [ ] **JWT Authentication** — Implement token-based auth with refresh tokens and HTTP interceptors
- [ ] **NgRx State Management** — Migrate cart and auth state to NgRx Store for scalability
- [ ] **Pagination** — Add server-side pagination to the product listing for large catalogs
- [ ] **Product Image Upload** — Allow admins to upload product images via a form with file input
- [ ] **Checkout Flow** — Build a multi-step checkout with address entry and order confirmation
- [ ] **Unit & E2E Tests** — Expand Vitest coverage and add Cypress end-to-end tests
- [ ] **PWA Support** — Enable Angular service workers for offline capability and installability

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built and maintained by [Zeyad Ahmed](https://github.com/zeyad070)

</div>
