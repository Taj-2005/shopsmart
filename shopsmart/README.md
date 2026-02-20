# ShopSmart

**Smart shopping. Trusted choices.**

ShopSmart is an eCommerce platform with a modern, production-grade UI and a REST API backend. The frontend is a Next.js application; the backend is an Express server written in TypeScript with Prisma and MySQL.

---

## Table of contents

1. [Business overview](#business-overview)
2. [User groups & use cases](#user-groups--use-cases)
3. [Data model (schema)](#data-model-schema)
4. [APIs — reference](#apis--reference)
5. [Project structure & tech stack](#project-structure--tech-stack)
6. [Getting started](#getting-started)
7. [Environment variables](#environment-variables)
8. [Tests](#tests)
9. [CI/CD & deployment](#cicd--deployment)

---

## Business overview

ShopSmart enables:

- **Customers** — Browse products and categories, manage cart, place orders, write reviews, manage profile and addresses.
- **Admins** — Manage products, categories, orders, users, view dashboard and analytics, moderate reviews.
- **Super Admins** — Everything admins can do, plus create other admin accounts and full system oversight.

The system uses **JWT access + refresh tokens** (refresh in httpOnly cookie), **role-based access**, and standard eCommerce flows: registration, login, cart, checkout, order lifecycle, and reviews.

---

## User groups & use cases

| Role | Description | Main use cases |
|------|-------------|----------------|
| **CUSTOMER** | Shopper | Register, login, browse products/categories, add to cart, place orders, view order history, write reviews, update profile, forgot/reset password, verify email. |
| **ADMIN** | Store manager | All customer capabilities (if they have an account); manage products (CRUD), categories, order status; view dashboard (users, products, orders, revenue), user/product/order stats, audit logs. |
| **SUPER_ADMIN** | System owner | All admin capabilities; create new admin users. |

**Use case summary**

- **Auth:** Register, login, logout, refresh token, get current user, verify email, forgot password, reset password.
- **Catalog:** List/get categories; list/get products; get product reviews; (admin) product analytics.
- **Cart:** Get cart, add item, update quantity, remove item (authenticated).
- **Orders:** Create order, list my orders, get order; (admin) update order status.
- **Users:** Get/update/delete self; (admin) list users, get user, get user orders/cart.
- **Reviews:** Create review; (admin) delete review.
- **Admin panel:** Dashboard, revenue, user/product/order stats, create admin, audit logs.

---

## Data model (schema)

**Core entities (Prisma / MySQL):**

- **User** — id, email, passwordHash, fullName, avatarUrl, emailVerified, roleId, active, failedLogins, lockedUntil, reset tokens, timestamps, soft delete.
- **Role** — id, name (CUSTOMER | ADMIN | SUPER_ADMIN), description.
- **RefreshToken** — id, tokenHash, userId, expiresAt, revoked.
- **Category** — id, name, slug, description.
- **Product** — id, name, slug, description, price, originalPrice, image, images (JSON), categoryId, inStock, stockQty, active, isNew, isDeal.
- **Cart** / **CartItem** — cart per user; items (productId, quantity).
- **Address** — userId, line1, line2, city, state, postalCode, country, isDefault.
- **Order** / **OrderItem** — userId, status (PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED), subtotal, discount, shipping, total, addressId; items (productId, quantity, price).
- **Review** — userId, productId, rating (1–5), body, status (e.g. pending/approved).
- **AuditLog** — userId, action, resource, resourceId, ip, userAgent, metadata.

Full schema: `server/prisma/schema.prisma`.

---

## APIs — reference

**Base URL:** `http://localhost:4000/api`  
**Auth:** Protected routes use header `Authorization: Bearer <accessToken>`. Refresh token via cookie `refreshToken` or body where noted.

**Standard success:** `{ "success": true, "data": ... }` or `{ "success": true, "message": "..." }`.  
**Standard error:** `{ "success": false, "message": "...", "code": "ERROR_CODE" }`.

---

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |

**Example response (200):**

```json
{ "success": true, "message": "ShopSmart API" }
```

---

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new customer |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | Cookie or body | Refresh access token |
| POST | `/api/auth/logout` | No | Logout (clear refresh) |
| POST | `/api/auth/verify-email` | No | Verify email with token |
| POST | `/api/auth/forgot-password` | No | Request password reset email |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| GET | `/api/auth/me` | Yes | Current user profile |

**POST /api/auth/register**  
Request body:

```json
{
  "email": "user@example.com",
  "password": "SecurePass1!",
  "fullName": "Jane Doe",
  "roleRequest": "admin"
}
```

- Validation: email valid; password min 8 chars, 1 upper, 1 lower, 1 number/special; fullName min 2 chars.  
- Response **201**:

```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "role": "CUSTOMER",
    "avatarUrl": null,
    "emailVerified": false,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

- Error **409:** email already exists.

**POST /api/auth/login**  
Request body:

```json
{ "email": "user@example.com", "password": "SecurePass1!" }
```

- Response **200:** same shape as register; sets `refreshToken` cookie.  
- Errors: **401** invalid credentials, **423** account locked.

**POST /api/auth/refresh**  
- Body optional: `{ "refreshToken": "string" }`; else cookie `refreshToken`.  
- Response **200:** same as login.  
- Error **400** no token, **401** invalid/expired.

**POST /api/auth/logout**  
- Response **200:**

```json
{ "success": true, "message": "Logged out" }
```

**POST /api/auth/verify-email**  
Body: `{ "token": "string" }`.  
Response **200:** `{ "success": true, "user": { ... } }`.

**POST /api/auth/forgot-password**  
Body: `{ "email": "string" }`.  
Response **200:** `{ "success": true, "message": "If an account exists..." }`.

**POST /api/auth/reset-password**  
Body: `{ "token": "string", "newPassword": "string" }`.  
Response **200:** `{ "success": true, "message": "Password has been reset." }`.

**GET /api/auth/me**  
Headers: `Authorization: Bearer <accessToken>`.  
Response **200:** `{ "success": true, "user": { "id", "email", "fullName", "role", "avatarUrl", "emailVerified", "createdAt" } }`.

---

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users` | Admin | List users |
| GET | `/api/users/:id` | Self or Admin | Get user |
| PATCH | `/api/users/:id` | Self or Admin | Update user |
| DELETE | `/api/users/:id` | Self or Admin | Soft-delete user |
| GET | `/api/users/:id/orders` | Self or Admin | User's orders |
| GET | `/api/users/:id/cart` | Self or Admin | User's cart |

**PATCH /api/users/:id**  
Body: `{ "fullName": "string?", "avatarUrl": "string?" }`.  
Response **200:** `{ "success": true, "data": user }`.

**DELETE /api/users/:id**  
Response **200:** `{ "success": true, "message": "User deleted" }`.

---

### Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories` | No | List categories |
| POST | `/api/categories` | Admin | Create category |

**POST /api/categories**  
Body: `{ "name": "Electronics", "slug": "electronics", "description": "..." }`.  
Response **201:** `{ "success": true, "data": { "id", "name", "slug", "description", ... } }`.

---

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | No | List products |
| GET | `/api/products/:id` | No | Get product |
| GET | `/api/products/:id/reviews` | No | Product reviews |
| GET | `/api/products/:id/analytics` | Admin | Product analytics |
| POST | `/api/products` | Admin | Create product |
| PATCH | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

**POST /api/products**  
Body (required: name, price, categoryId):

```json
{
  "name": "Wireless Mouse",
  "slug": "wireless-mouse",
  "description": "...",
  "price": 29.99,
  "originalPrice": 39.99,
  "image": "https://...",
  "categoryId": "uuid",
  "inStock": true,
  "stockQty": 100,
  "active": true,
  "isNew": true,
  "isDeal": false
}
```

Response **201:** `{ "success": true, "data": product }`.

---

### Cart

All require authentication.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cart` | Yes | Get my cart |
| POST | `/api/cart` | Yes | Add to cart |
| PATCH | `/api/cart/item/:id` | Yes | Update item quantity |
| DELETE | `/api/cart/item/:id` | Yes | Remove item |

**POST /api/cart**  
Body: `{ "productId": "uuid", "quantity": 1 }`.  
Response **201:** `{ "success": true, "data": cartWithItems }`.

**PATCH /api/cart/item/:id**  
Body: `{ "quantity": 2 }`. If quantity ≤ 0, item is removed.

---

### Orders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/orders` | Yes | Create order |
| GET | `/api/orders` | Yes | My orders |
| GET | `/api/orders/:id` | Yes | Get order |
| PATCH | `/api/orders/:id/status` | Admin | Update status |

**POST /api/orders**  
Body:

```json
{
  "addressId": "uuid",
  "items": [
    { "productId": "uuid", "quantity": 2 }
  ]
}
```

Response **201:** `{ "success": true, "data": order }` (subtotal, discount, shipping, total, items).

**PATCH /api/orders/:id/status**  
Body: `{ "status": "CONFIRMED" }`. Allowed: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED.

---

### Reviews

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/reviews` | Yes | Create review |
| DELETE | `/api/reviews/:id` | Admin | Delete review |

**POST /api/reviews**  
Body: `{ "productId": "uuid", "rating": 5, "body": "Great product!" }`. Rating 1–5.  
Response **201:** `{ "success": true, "data": review }`.

---

### Admin

All require Admin or Super Admin unless noted.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Dashboard counts & revenue |
| GET | `/api/admin/revenue` | Admin | Total revenue |
| GET | `/api/admin/users/stats` | Admin | User stats by role |
| GET | `/api/admin/products/stats` | Admin | Product counts |
| GET | `/api/admin/orders/stats` | Admin | Orders by status |
| POST | `/api/admin/create-admin` | Super Admin | Create admin user |
| GET | `/api/admin/logs` | Admin | Audit logs |

**GET /api/admin/dashboard**  
Response **200:**

```json
{
  "success": true,
  "data": {
    "users": 150,
    "products": 42,
    "orders": 320,
    "revenue": 12500.50
  }
}
```

**POST /api/admin/create-admin** (Super Admin only)  
Body: `{ "email": "admin@example.com", "password": "SecurePass1!", "fullName": "Admin User" }`.  
Response **201:** `{ "success": true, "data": user }`.

---

## Project structure & tech stack

```
shopsmart/
├── client/          # Next.js 16 (App Router) — UI
├── server/          # Express + TypeScript + Prisma — API
├── .github/         # CI workflows
├── render.yaml      # Render deployment
└── README.md
```

| Part | Stack |
|------|--------|
| **Client** | Next.js 16, React 19, Tailwind CSS v4, Framer Motion, TypeScript, Axios |
| **Server** | Node.js, Express, TypeScript, Prisma, MySQL, JWT, bcrypt, express-validator |

---

## Getting started

**Prerequisites:** Node.js 18+ (20+ recommended), npm 9+, MySQL (for server).

### 1. Clone and install

```bash
git clone <repository-url>
cd shopsmart
```

### 2. Server

```bash
cd server
npm install
cp .env.example .env   # set DATABASE_URL, JWT secrets, etc.
npx prisma migrate dev # or deploy
npm run build
npm run start
```

API: [http://localhost:4000](http://localhost:4000). Health: [http://localhost:4000/api/health](http://localhost:4000/api/health).

### 3. Client

```bash
cd client
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_API_URL=http://localhost:4000` if needed (e.g. in `.env.local`).

**Scripts**

| App | Script | Command | Description |
|-----|--------|---------|-------------|
| Server | build | `npm run build` | Compile TypeScript |
| Server | dev | `npm run dev` | Nodemon + ts-node |
| Server | start | `npm run start` | Run dist |
| Server | test | `npm run test` | Jest |
| Client | dev | `npm run dev` | Next.js dev |
| Client | build | `npm run build` | Next.js build |
| Client | start | `npm run start` | Next.js start |
| Client | test | `npm run test` | Jest |

---

## Environment variables

### Server (`server/.env`)

| Variable | Description | Default / note |
|----------|-------------|----------------|
| `PORT` | HTTP port | `4000` |
| `DATABASE_URL` | MySQL connection string | Required |
| `JWT_ACCESS_SECRET` | Access token signing | Required in prod |
| `JWT_REFRESH_SECRET` | Refresh token signing | Required in prod |
| `JWT_ACCESS_EXPIRES` | Access token TTL | `1h` |
| `JWT_REFRESH_EXPIRES_DAYS` | Refresh cookie age (days) | `30` |
| `FRONTEND_URL` | CORS origin | `http://localhost:3000` |
| `COOKIE_REFRESH_NAME` | Refresh cookie name | `refreshToken` |
| `MAX_FAILED_LOGINS` | Lockout threshold | `5` |
| `LOCKOUT_MINUTES` | Lockout duration | `15` |
| SMTP_* | Email (verification, reset) | Optional |

Copy from `server/.env.example`.

### Client

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base URL (e.g. `http://localhost:4000`) |

---

## Tests

- **Server:** `cd server && npm run test` — unit (hash, jwt, errorHandler, authorize, auth service) + integration (health, auth flows). See **server/TEST.md** for full API and test list.
- **Client:** `cd client && npm run test` — auth context, protected/admin routes, API modules, axios. See **client/TEST.md** for test list.

---

## CI/CD & deployment

- **GitHub Actions** (`.github/workflows/build.yml`): on push to `main`, builds the server.
- **Render** (`render.yaml`): backend (web) and frontend (static). Set env vars (e.g. `DATABASE_URL`, JWT secrets) on the service. For Next.js on Render or Vercel, adjust build command and publish path as needed.

---

## License

ISC · Author: Shaik Tajuddin
