# ShopSmart

**Smart shopping. Trusted choices.**

ShopSmart is an eCommerce platform with a modern, production-grade UI and a REST API backend. The frontend is a Next.js application focused on performance, accessibility, and SEO; the backend is an Express server written in TypeScript.

---

## Project structure

```
shopsmart/
├── client/          # Next.js 16 (App Router) — UI only
├── server/          # Express + TypeScript — API
├── .github/         # CI workflows
├── render.yaml      # Render deployment config
└── README.md
```

---

## Tech stack

| Part    | Stack |
|---------|--------|
| **Client** | Next.js 16, React 19, Tailwind CSS v4, Framer Motion, TypeScript |
| **Server** | Node.js, Express, TypeScript, dotenv |

---

## Prerequisites

- **Node.js** 18+ (or 20+ recommended)
- **npm** 9+

---

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd shopsmart
```

### 2. Run the client (frontend)

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You’ll see the ShopSmart landing page and can go to `/shop` for the shop UI.

**Client scripts**

| Script   | Command           | Description                    |
|----------|-------------------|--------------------------------|
| `dev`    | `npm run dev`     | Start Next.js dev server       |
| `build` | `npm run build`   | Production build               |
| `start`  | `npm run start`   | Run production build locally   |
| `lint`   | `npm run lint`    | Run ESLint                     |

### 3. Run the server (backend)

```bash
cd server
npm install
cp .env.example .env   # optional — adjust PORT if needed
npm run build
npm run start
```

By default the API listens on [http://localhost:4000](http://localhost:4000).

**Server scripts**

| Script   | Command           | Description                      |
|----------|-------------------|----------------------------------|
| `build`  | `npm run build`   | Compile TypeScript → `dist/`     |
| `dev`    | `npm run dev`     | Run with nodemon + ts-node       |
| `start`  | `npm run start`   | Run compiled `dist/index.js`    |
| `test`   | `npm run test`    | Placeholder (no tests yet)      |

---

## Environment variables

### Server (`server/.env`)

| Variable | Description        | Default |
|----------|--------------------|---------|
| `PORT`   | HTTP server port   | `4000`  |

Copy from `server/.env.example` and change as needed.

### Client

The client is UI-only and has no required env vars for local development.

---

## Client overview

The ShopSmart UI includes:

- **Landing** (`/`) — Hero, value props, categories, features, testimonials, mission, footer
- **Shop** (`/shop`) — Product grid, filters/sort UI, header with cart/wishlist/profile

**Design**

- **Colors**: Deep Charcoal, Cognitive Teal, Cloud White, UI Gray (see `client/app/globals.css`)
- **Typography**: Plus Jakarta Sans (body), Outfit (headings)
- **Favicon**: Custom “S” logo in `client/app/icon.svg`

---

## API

The server exposes a minimal API:

| Method | Path | Description        |
|--------|------|--------------------|
| GET    | `/`  | `{ "message": "ShopSmart API" }` |

*(More endpoints can be added as you implement CRUD and database logic.)*

---

## CI/CD

- **GitHub Actions** (`.github/workflows/build.yml`) runs on push to `main` and builds the **server** (`npm run build` in `server/`).
- **Render** (`render.yaml`) is set up for backend (web) and frontend (static). Adjust `buildCommand` and `staticPublishPath` if you switch from a static build to Next.js on Render or deploy the client elsewhere (e.g. Vercel).

---

## Deployment

- **Backend**: e.g. Render (see `render.yaml`). Set `PORT` in the service environment if Render assigns a different one.
- **Frontend**: e.g. Vercel (connect the repo and set the root to `client/`) or any host that supports Next.js.

---

## License

ISC · Author: Shaik Tajuddin
