# Docker Compose Demo — Notes API

A five-service application built to teach Docker Compose concepts.
The app itself is a simple notes CRUD API. The **point** is the infrastructure around it.

```
Browser / curl
      │
      ▼  :80
  [ nginx ]  ← only container exposed to the host
   │      │
   │      │  path-based routing
   ▼      ▼
[ ui ]  [ api ]  ← Django UI  /  FastAPI JSON API
   │      │
   └──┬───┘
      ▼
    [ db ]  ←── both services share one Postgres instance
    [redis]  ←── cache for the API
```

---

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

| URL | What it is |
|-----|------------|
| http://localhost/ | Django web UI (through Nginx) |
| http://localhost/api/notes | FastAPI JSON API (through Nginx) |
| http://localhost/health | API health check |
| http://localhost:8080 | Adminer — DB browser |
| http://localhost:8001 | Django direct (dev override only) |
| http://localhost:8000 | FastAPI direct (dev override only) |

### Try the API

```bash
# Create a note
curl -s -X POST http://localhost/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello", "content": "Docker Compose is great"}' | python3 -m json.tool

# List all notes
curl -s http://localhost/api/notes | python3 -m json.tool

# Get a single note (replace 1 with the id from above)
curl -s http://localhost/api/notes/1 | python3 -m json.tool

# Delete a note
curl -s -X DELETE http://localhost/api/notes/1
```

### Adminer (database browser)
1. Open http://localhost:8080
2. System: **PostgreSQL**, Server: **db**, Username/Password/Database: from your `.env`

---

### Try the UI

Open http://localhost/ — you'll see a Django-rendered page where you can create and delete notes.
Any note you create here is immediately visible via the JSON API at http://localhost/api/notes (and vice versa), because both services read and write the same `notes` table in the same Postgres container.

---

## Concepts covered

### 1. Service-to-service DNS

Every service name becomes a hostname on the shared Docker network.
In [backend/main.py](backend/main.py) the Redis client connects to host `redis`:

```python
redis_client = redis.Redis(host=os.environ.get("REDIS_HOST", "redis"), ...)
```

And in [nginx/nginx.conf](nginx/nginx.conf) Nginx proxies to `api:8000`:

```nginx
upstream api { server api:8000; }
```

No IP addresses. No `/etc/hosts` editing. It just works.

---

### 2. `depends_on` + healthchecks — startup ordering

Without ordering, the API starts before Postgres is ready and crashes.
Docker Compose solves this with `condition: service_healthy`:

```yaml
api:
  depends_on:
    db:
      condition: service_healthy   # waits for db's healthcheck to pass
    redis:
      condition: service_healthy
```

Each service defines its own healthcheck:

```yaml
db:
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
    interval: 5s
    retries: 10
```

**Experiment:** Remove the `healthcheck` block from `db` and see what happens.

---

### 3. Named volumes — persistent storage

```yaml
db:
  volumes:
    - db_data:/var/lib/postgresql/data

volumes:
  db_data:   # Docker manages this, not a host directory
```

```bash
docker compose down        # stops containers — data survives
docker compose up          # data is still there

docker compose down -v     # -v removes named volumes — data gone
```

**Experiment:** Create a note, run `docker compose down`, run `docker compose up` again — is the note still there?

---

### 4. Network isolation

Two networks enforce a security boundary:

```
frontend network:  nginx  ←→  api
backend network:          api  ←→  db  ←→  redis
```

`db` and `redis` are **not** on the frontend network. Nginx cannot reach them even if misconfigured.

**Experiment:** Add `nginx` to the `backend` network in the compose file. Then try to curl Postgres from inside the Nginx container. Now remove it again — observe the connection is refused.

---

### 5. `env_file` — secrets out of compose files

```yaml
api:
  env_file: .env
```

The `.env` file is loaded by Docker Compose — never commit it.
`.env.example` is the committed template. This is the standard pattern for secrets in Compose projects.

---

### 6. Multiple services, one database

Django and FastAPI both connect to `db:5432` and use the same `notes` table.

```
# ui/config/settings.py
"HOST": "db",   ← same service name

# backend/database.py / .env
DATABASE_URL=postgresql://...@db:5432/notesdb   ← same
```

Neither service owns the database — they co-exist on it. This is a real pattern (read replicas, sidecars, migration jobs) and Compose makes wiring it up trivial.

**Experiment:** Create a note via the Django UI at `localhost/`, then fetch it via `curl localhost/api/notes` — same data, two services.

---

### 7. Nginx path-based routing

One Nginx listens on port 80 and routes to two backends by URL prefix:

```nginx
location /api/ { proxy_pass http://api/; }   # FastAPI
location /     { proxy_pass http://ui; }      # Django
```

This is how most production systems work — a single public entry point, multiple internal services.

---

### 9. The override file — dev vs prod

`docker-compose.override.yml` is **automatically merged** when you run `docker compose up`.

It adds:
- **Hot reload** (`--reload` flag + source code volume mount)
- **Exposed ports** for direct debugging (`db:5432`, `api:8000`)

```bash
# Dev (override applied automatically)
docker compose up

# Simulate production (no override)
docker compose -f docker-compose.yml up
```

**Experiment:** Edit [backend/main.py](backend/main.py) while the stack is running (dev mode). The API reloads automatically without rebuilding the image.

---

### 10. Multi-stage Dockerfile

[backend/Dockerfile](backend/Dockerfile) uses a two-stage build:

```dockerfile
FROM python:3.12-slim AS deps   # installs dependencies
...
FROM python:3.12-slim           # clean final image, copies only what's needed
```

This keeps the production image lean (no build tools, no cache).

```bash
docker images | grep docker-compose-tutorial
```

---

## Useful commands

```bash
# See all running containers and their status
docker compose ps

# Follow logs from all services
docker compose logs -f

# Follow logs from one service only
docker compose logs -f api

# Open a shell inside the api container
docker compose exec api bash

# Run a one-off command (e.g. check redis)
docker compose exec redis redis-cli ping

# Rebuild only the api image (after changing backend code)
docker compose up --build api

# Scale the api to 3 replicas (requires removing fixed port in override)
docker compose up --scale api=3

# Stop everything and remove volumes
docker compose down -v
```

---

## Project structure

```
.
├── docker-compose.yml          # production service definitions
├── docker-compose.override.yml # dev overrides (auto-applied)
├── .env.example                # template — copy to .env
├── backend/                    # FastAPI JSON API
│   ├── Dockerfile              # multi-stage build
│   ├── requirements.txt
│   ├── main.py                 # routes + Redis caching
│   └── database.py             # SQLAlchemy models
├── ui/                         # Django web UI
│   ├── Dockerfile
│   ├── entrypoint.sh           # runs migrate then runserver
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/                 # Django project settings & urls
│   └── notes/                  # notes app (models, views, templates)
└── nginx/
    └── nginx.conf              # path-based routing to ui + api
```
