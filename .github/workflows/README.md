# GitHub Actions – Secrets & Variables

Configure these in the repo: **Settings → Secrets and variables → Actions**.  
If workflows fail with database or auth errors, the most common cause is missing or invalid secrets/variables below.

## Secret (required)

| Name           | Description                    |
|----------------|--------------------------------|
| `DATABASE_URL` | Full DB URL (e.g. MySQL). Used by unit, integration, and e2e. |

## Variables (recommended)

Set these as **Variables** (not secrets) so workflows can use them. Values match your `.env` / `.env.example`.

| Variable               | Example / note                    |
|------------------------|-----------------------------------|
| `NODE_ENV`             | `test` or `development`           |
| `PORT`                 | `4000`                            |
| `FRONTEND_URL`         | `http://localhost:3000`          |
| `JWT_ACCESS_SECRET`    | Min 32 chars                      |
| `JWT_REFRESH_SECRET`   | Min 32 chars                      |
| `JWT_ACCESS_EXPIRES`   | `1h`                              |
| `JWT_REFRESH_EXPIRES_DAYS` | `30`                         |
| `MAX_FAILED_LOGINS`    | `5`                               |
| `LOCKOUT_MINUTES`      | `15`                              |
| `COOKIE_REFRESH_NAME`  | `refreshToken`                    |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:4000` (client) |
| `SMTP_HOST`            | Optional                          |
| `SMTP_PORT`            | Optional                          |
| `SMTP_USER`            | Optional                          |
| `SMTP_PASS`            | Optional                          |
| `SMTP_FROM`            | Optional                          |

Workflows use fallbacks for optional fields (e.g. `NODE_ENV`, `PORT`) so CI can run with only **`DATABASE_URL`** (secret) and **`JWT_ACCESS_SECRET`** / **`JWT_REFRESH_SECRET`** (variables) set; add the rest as needed.
