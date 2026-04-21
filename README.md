# 🛒 ShopZone – Angular E-Commerce App

A complete e-commerce web application built with Angular and JSON Server as a mock backend.

---

## 🚀 Features

### 🔐 Authentication

- Login & Register (Reactive Forms)
- Form validation with error messages
- Auth Guard for protected routes
- Persistent login using localStorage

---

### 🛍️ Products

- Product listing with:
  - Search (real-time)
  - Category filter
- Product details page
- Stock handling (Out of Stock state)

---

### 🛒 Cart

- Add to cart
- Update quantity (auto API update)
- Remove items
- Real-time total calculation
- Cart badge in navbar (BehaviorSubject)

---

### 📦 Orders

- View user orders
- Status badges:
  - Pending
  - Processing
  - Delivered
  - Cancelled

---

### 👤 Profile

- Displays user data from localStorage
- Logout functionality

---

### 🔐 Protected Routes

- `/cart`
- `/orders`
- `/profile`

Redirects to login if not authenticated.

---

## 👨‍💻 Admin Features (Custom Enhancement)

- Add new products
- Delete products
- Update stock (increase / decrease)

---

## 🧠 Tech Stack

- Angular
- TypeScript
- RxJS
- JSON Server (Mock API)
- Bootstrap / CSS

---

## ⚙️ Installation

```bash
git clone https://github.com/YOUR_USERNAME/shopzone-angular.git
cd shopzone-angular
npm install
```
