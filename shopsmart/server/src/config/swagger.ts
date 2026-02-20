/**
 * OpenAPI 3.0 specification for ShopSmart API.
 * Served at /api-docs via swagger-ui-express.
 */
import pathsJson from "./swagger-paths.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const spec: Record<string, any> = {
  openapi: "3.0.0",
  info: {
    title: "ShopSmart API",
    version: "1.0.0",
    description: `
## Overview

This is the **ShopSmart API**: the backend for the ShopSmart eCommerce app. It is a REST API: you send HTTP requests (GET, POST, PATCH, DELETE) to the URLs below; responses are JSON.

**What each section does:**

- **Health** — Check if the API is running (no login required).
- **Auth** — Register, log in, refresh token, log out. Login returns a JWT; you send that token with any request that requires a logged-in user.
- **Users** — Get or update the current user profile. Admins can list and manage users.
- **Categories** — List product categories. Admins can create or update categories.
- **Products** — List and get products (and their reviews). Admins can create, update, or delete products.
- **Cart** — Add, update, or remove items in the current user's cart (requires login).
- **Orders** — Create an order and list the current user's orders (requires login). Admins can update order status.
- **Reviews** — Add a product review (requires login). Admins can delete reviews.
- **Admin** — Dashboard, stats, revenue, logs. Only admin and super_admin roles can use these.

Endpoints that require a logged-in user are marked with a lock. For those you must send a valid JWT in the \`Authorization\` header.

---

## Authentication (how to get and use a token)

**1. What you need**  
Endpoints with a lock icon require a **JWT**. You get it by logging in, then send it on every request that needs authentication.

**2. Get a token**  
Call **POST /api/auth/login** with a JSON body containing \`email\` and \`password\`. The response includes \`accessToken\` and \`expiresIn\` (seconds). Use \`accessToken\` as your JWT.

**Example (cURL):**

\`\`\`bash
curl -X POST http://localhost:4000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"customer@shopsmart.com","password":"Customer1!"}'
\`\`\`

**3. Send the token**  
Add this header to your request:

\`\`\`
Authorization: Bearer <paste your accessToken here>
\`\`\`

**4. In Swagger UI**  
Click **Authorize**, paste only the token value (do not type "Bearer"), then Authorize. Swagger will send the token for all locked endpoints.

**5. Test accounts**  
These users exist after running the database seed. Use them to log in and try the API:

| Role        | Email                    | Password   |
| ----------- | ------------------------- | ---------- |
| Customer    | customer@shopsmart.com    | Customer1! |
| Admin       | admin@shopsmart.com       | Admin123!  |
| Super Admin | super_admin@shopsmart.com | Admin123!  |
    `.trim(),
  },
  servers: [
    { url: "http://localhost:4000", description: "Local development" },
    { url: "/", description: "Current host" },
  ],
  tags: [
    { name: "Health", description: "Health check" },
    { name: "Auth", description: "Authentication and account" },
    { name: "Users", description: "User management" },
    { name: "Categories", description: "Product categories" },
    { name: "Products", description: "Product catalog" },
    { name: "Cart", description: "Shopping cart" },
    { name: "Orders", description: "Orders" },
    { name: "Reviews", description: "Product reviews" },
    { name: "Admin", description: "Admin dashboard and management" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT access token from login or register. Use: Authorization: Bearer <token>",
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", description: "Human-readable error message" },
          code: { type: "string", description: "Error code", example: "UNAUTHORIZED" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
          email: { type: "string", format: "email", example: "user@example.com" },
          fullName: { type: "string", example: "Jane Doe" },
          role: { type: "string", enum: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"], example: "CUSTOMER" },
          avatarUrl: { type: "string", nullable: true },
          emailVerified: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthResponse: {
        type: "object",
        required: ["success", "accessToken", "expiresIn", "user"],
        properties: {
          success: { type: "boolean", example: true },
          accessToken: { type: "string", description: "JWT access token" },
          expiresIn: { type: "integer", description: "Token TTL in seconds", example: 3600 },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Electronics" },
          slug: { type: "string", example: "electronics" },
          description: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Wireless Mouse" },
          slug: { type: "string", example: "wireless-mouse" },
          description: { type: "string", nullable: true },
          price: { type: "number", example: 29.99 },
          originalPrice: { type: "number", nullable: true, example: 39.99 },
          image: { type: "string", example: "https://example.com/image.jpg" },
          categoryId: { type: "string", format: "uuid" },
          category: { $ref: "#/components/schemas/Category" },
          inStock: { type: "boolean", example: true },
          stockQty: { type: "integer", example: 100 },
          active: { type: "boolean", example: true },
          isNew: { type: "boolean", example: false },
          isDeal: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          quantity: { type: "integer", example: 2 },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      Cart: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", nullable: true },
          items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          quantity: { type: "integer" },
          price: { type: "number" },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
            example: "PENDING",
          },
          subtotal: { type: "number" },
          discount: { type: "number" },
          shipping: { type: "number" },
          total: { type: "number" },
          addressId: { type: "string", format: "uuid", nullable: true },
          items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          body: { type: "string", nullable: true },
          user: { type: "object", properties: { id: { type: "string" }, fullName: { type: "string" } } },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      RegisterBody: {
        type: "object",
        required: ["email", "password", "fullName"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: {
            type: "string",
            minLength: 8,
            example: "SecurePass1!",
            description: "Min 8 chars, 1 upper, 1 lower, 1 number or special",
          },
          fullName: { type: "string", minLength: 2, example: "Jane Doe" },
          roleRequest: { type: "string", enum: ["admin"], description: "Optional; request admin role" },
        },
      },
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", example: "SecurePass1!" },
        },
      },
      RefreshBody: {
        type: "object",
        properties: {
          refreshToken: { type: "string", description: "Optional if sent via cookie" },
        },
      },
      VerifyEmailBody: {
        type: "object",
        required: ["token"],
        properties: { token: { type: "string" } },
      },
      ForgotPasswordBody: {
        type: "object",
        required: ["email"],
        properties: { email: { type: "string", format: "email" } },
      },
      ResetPasswordBody: {
        type: "object",
        required: ["token", "newPassword"],
        properties: {
          token: { type: "string" },
          newPassword: { type: "string", minLength: 8 },
        },
      },
      CreateCategoryBody: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Electronics" },
          slug: { type: "string", example: "electronics" },
          description: { type: "string" },
        },
      },
      CreateProductBody: {
        type: "object",
        required: ["name", "price", "categoryId"],
        properties: {
          name: { type: "string", example: "Wireless Mouse" },
          slug: { type: "string", example: "wireless-mouse" },
          description: { type: "string" },
          price: { type: "number", example: 29.99 },
          originalPrice: { type: "number", nullable: true },
          image: { type: "string" },
          categoryId: { type: "string", format: "uuid" },
          inStock: { type: "boolean", default: true },
          stockQty: { type: "integer", default: 0 },
          active: { type: "boolean", default: true },
          isNew: { type: "boolean", default: false },
          isDeal: { type: "boolean", default: false },
        },
      },
      UpdateUserBody: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          avatarUrl: { type: "string" },
        },
      },
      AddCartBody: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: { type: "string", format: "uuid" },
          quantity: { type: "integer", default: 1 },
        },
      },
      UpdateCartItemBody: {
        type: "object",
        required: ["quantity"],
        properties: { quantity: { type: "integer" } },
      },
      CreateOrderBody: {
        type: "object",
        required: ["items"],
        properties: {
          addressId: { type: "string", format: "uuid" },
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { type: "string", format: "uuid" },
                quantity: { type: "integer" },
              },
            },
          },
        },
      },
      CreateReviewBody: {
        type: "object",
        required: ["productId", "rating"],
        properties: {
          productId: { type: "string", format: "uuid" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          body: { type: "string" },
        },
      },
      UpdateOrderStatusBody: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
          },
        },
      },
      CreateAdminBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          fullName: { type: "string" },
        },
      },
    },
  },
  paths: pathsJson as Record<string, unknown>,
};

export default spec;
