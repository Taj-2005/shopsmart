# Client — Tests

This document lists all **tests** for the ShopSmart Next.js frontend.

**Run tests:**

```bash
cd client
npm install
npm run test           # run once
npm run test:watch     # watch mode
```

**Config:** `jest.config.js` (ts-jest, jsdom), `jest.setup.ts` (@testing-library/jest-dom), `@/` → `<rootDir>/` alias.

---

## Test files and coverage

| Test file | Description |
|-----------|-------------|
| **context/__tests__/auth-context.test.tsx** | **AuthProvider / useAuth:** Unauthenticated state; login/logout buttons; login success updates user and role. Two tests skipped: “clears user when logout” (async mock timing), “sets error when login fails” (unhandled rejection from context rethrow). Mocks: `@/api/auth.api`, `next/navigation`, `@/lib/auth-token`. |
| **context/__tests__/useIsAdmin.test.tsx** | **useIsAdmin / useIsSuperAdmin:** Returns false when not authenticated; returns true for admin when user role is ADMIN; returns true for both when user role is SUPER_ADMIN. Mocks auth.api (refresh resolves with user). |
| **components/auth/__tests__/protected-route.test.tsx** | **ProtectedRoute / AdminRoute (unauthenticated):** Redirect to login when not authenticated; AdminRoute redirects and does not render children. Mocks: `next/navigation`, `@/context/auth-context` (user: null). |
| **components/auth/__tests__/protected-route.authenticated.test.tsx** | **ProtectedRoute (authenticated):** Renders children when user is authenticated (customer). Mocks: `next/navigation`, `@/context/auth-context` (authenticated customer). |
| **components/auth/__tests__/admin-route.authenticated.test.tsx** | **AdminRoute (authenticated admin):** Renders children when user has admin role. Mocks: `next/navigation`, `@/context/auth-context` (role: admin). |
| **api/__tests__/auth.api.test.ts** | **authApi:** Exposes `login`, `register`, `logout`, `refresh`, `me`, `forgotPassword`, `resetPassword`. |
| **api/__tests__/user.api.test.ts** | **userApi:** Exposes `list`, `getById`, `update`, `delete`, `getOrders`, `getCart`. |
| **api/__tests__/product.api.test.ts** | **productApi:** Exposes `list`, `getById`, `getReviews`, `create`, `update`, `delete`, `getAnalytics`. |
| **api/__tests__/cart.api.test.ts** | **cartApi:** Exposes `get`, `add`, `updateItem`, `removeItem`. |
| **api/__tests__/axios.test.ts** | **toApiError:** Returns status/message/code from Axios error response; returns 500 and generic message for non-Axios error. Mocks `axios.isAxiosError`. |

---

## Summary

- **Total:** 18 tests (16 run, 2 skipped).
- **Focus:** Auth context, protected/admin routes, API module exports, axios error parsing.
- **Skipped:** Logout flow and login error display (see comments in `auth-context.test.tsx`).
