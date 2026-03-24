# 🚀 Full Stack DevOps Engineering — CSA326

> All coursework, lab work, assignments, and in-class material for **CSA326 – Full Stack DevOps Engineering** at Rishihood University is maintained in this repository.

---

## Course Info

| Field           | Details                            |
| --------------- | ---------------------------------- |
| **Course Code** | CSA326                             |
| **Instructor**  | Tanmay Balwa                       |
| **Program**     | B.Tech. CS & AI / B.Tech. CS & DS  |
| **Semester**    | Even Semester, 2025–2026           |
| **Credits**     | 4                                  |
| **Mode**        | Regular                            |

---

## What's in This Repo

This repo contains everything done throughout the course — from week 1 lectures to the final capstone project. All lab exercises, assignments, bash scripts, CI/CD workflows, Dockerfiles, Kubernetes manifests, Terraform configs, and monitoring setups are tracked here.

---

## Repository Structure

```text
devops/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
├── Github_to_AWS/          # Static HTML + workflow to deploy to AWS EC2/Nginx
├── lab4/                   # Lab 4 — Bash scripts (EC2 health check, etc.)
├── resources/              # Course materials (e.g. PDFs, links)
├── shopsmart/              # Capstone — full-stack ShopSmart app
│   ├── client/             # Next.js frontend (React, App Router)
│   ├── server/             # Express.js REST API + Prisma
│   └── e2e/                # Playwright end-to-end tests
├── static/                 # Static site deployed to GitHub Pages
├── webhooks/               # Demo Express webhook server (e.g. for events)
├── myscript.sh             # Utility/bash scripts
└── README.md
```

### Directory Overview

| Directory              | Description |
| ---------------------- | ----------- |
| **`.github/workflows/`** | GitHub Actions workflow files (`.yml`). Define CI (build, test, lint) and CD (deploy to GitHub Pages, EC2). See [Workflows](#github-actions-workflows) below. |
| **`Github_to_AWS/`**   | Static HTML page (`Image.html`) and assets used by the **Deploy to EC2** workflow. Content is copied via SSH to an Ubuntu EC2 instance and served by Nginx. |
| **`lab4/`**            | Lab 4 (Automation & Scripting). Contains `ec2-health-check.sh` — a Bash script that uses AWS CLI to check EC2 instance system/instance status and prints a simple health table. |
| **`resources/`**      | Course reference materials (e.g. *The DevOps Course Links.pdf* and similar assets). |
| **`shopsmart/`**       | Capstone full-stack eCommerce app. **`client/`** — Next.js 16 frontend (App Router, React 19, Tailwind). **`server/`** — Express API, Prisma ORM, JWT auth, RBAC. **`e2e/`** — Playwright specs (e.g. smoke tests). See `shopsmart/README.md` for setup and architecture. |
| **`static/`**          | Minimal static site (e.g. `index.html`) deployed to **GitHub Pages** when pushing to `main`. Used by the Deploy to GitHub Pages workflow. |
| **`webhooks/`**        | Small Express server that exposes a `/webhook` POST endpoint for receiving webhook payloads (e.g. push events). Used for demos or integration with external systems. |

---

## GitHub Actions Workflows

Workflows live under `.github/workflows/`. Required secrets and variables are documented in [`.github/workflows/README.md`](.github/workflows/README.md).

### Build & Test

| Workflow             | File                    | Trigger | What it does |
| -------------------- | ----------------------- | ------- | ------------ |
| **Server Build**     | `build.yml`             | Push to `main`, or manual (`workflow_dispatch`) | Checks out repo, sets up Node 18, runs `npm install` and `npm run build` in `shopsmart/server`. Validates that the backend compiles. |
| **Unit tests**       | `unit-tests.yml`        | Push/PR to `main` or `develop` when `shopsmart/**` or the workflow file changes | Runs **server** unit tests (Jest, excluding integration) and **client** unit tests in parallel. Uses `DATABASE_URL`, JWT, and other vars from repo secrets/variables. |
| **Integration**      | `integration.yml`       | Push/PR to `main`, or manual | Single job in `shopsmart/server`: lint, test, build. Runs across a **matrix** of Node 18, 20, and 22 to ensure compatibility. |
| **Integration tests**| `integration-tests.yml` | Push/PR to `main` or `develop` when `shopsmart/**` or the workflow file changes | Runs only **integration** tests for the server (`jest --testPathPattern=integration`) with a real DB (Prisma generate + `db push`). Uses same env/secrets as unit tests. |
| **E2E tests**        | `e2e-tests.yml`         | Push/PR to `main` or `develop` when `shopsmart/**` or the workflow file changes | Builds server and client, starts both locally, then runs Playwright E2E from `shopsmart/e2e` (e.g. smoke specs) against the running app. Uses `DATABASE_URL`, JWT, and `NEXT_PUBLIC_API_URL`. |

### Deploy

| Workflow | File | Trigger | What it does |
|----------|------|---------|----------------|
| **Deploy to GitHub Pages** | `deploy_to_GitHub_pages.yml` | Push to `main` | Uses GitHub Actions “Pages” support: uploads the **`static/`** directory as the artifact and deploys it to GitHub Pages. Concurrency group `pages` avoids overlapping deploys. |
| **Deploy Static HTML to AWS EC2** | `deploy_to_EC2.yml` | Push to `main` | SSHs to an EC2 host using `EC2_SSH_KEY` and `EC2_HOST`. Copies `Github_to_AWS/Image.html` to the server, moves it to `/var/www/html/`, sets Nginx permissions, and restarts Nginx. Serves a static “deployment successful” page. |
| **Deploy ShopSmart Server to EC2** | `deploy_shopsmart_server_to_EC2.yml` | Push to `main` (when `shopsmart/server/**` or the workflow changes), or manual; on PR runs build-only check | **On PR:** Builds the server (install, Prisma generate, build) to verify it compiles. **On push to main:** SSHs to EC2, clones/updates repo, copies `.env` from secret `SHOPSMART_SERVER_ENV`, runs `npm ci`, Prisma migrate, build, and starts/restarts the API with **pm2** under `SHOPSMART_DEPLOY_PATH` (e.g. `/opt/shopsmart`). Optional setup of Node 20 and pm2 on the server if missing. |
| **Deploy ShopSmart Server (Docker) to EC2** | `deploy_shopsmart_docker_to_EC2.yml` | Manual only (`workflow_dispatch`) | SSHs to EC2, installs Docker if needed, copies `SHOPSMART_SERVER_ENV` to `/opt/shopsmart-server.env`, pulls the image (default `tajuddinshaik/shopsmart-server:distroless`), stops any existing `shopsmart-api-docker` container and **pm2** `shopsmart-api` to free the port, then runs the container with `-p <host_port>:4000`. Optional `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` for private registry pulls. Ensure the EC2 **security group** allows inbound TCP on the chosen host port (e.g. 4000). |

### Demo / Lab

| Workflow | File | Trigger | What it does |
|----------|------|---------|----------------|
| **lab-actions** | `lab.yml` | Manual only (`workflow_dispatch`) | Demonstrates workflow inputs: prompts for lab **name**, **city**, **country**. Two jobs: **hello-world** (echo inputs, checkout, list repo files) and **weather** (placeholder “weather” message for the given city/country). Used for learning GitHub Actions inputs and multi-job workflows. |

---

## Weekly Breakdown

### Week 1 — Introduction to DevOps Mindset

- Notes on DevOps principles, CI/CD evolution, automation, and shared ownership
- `Lab 1`: SDLC/DevOps pipeline diagram for the **ShopSmart** project

### Week 2 — DevOps Toolchain & GitHub Actions

- Overview of tools: Git, GitHub Actions, Docker, Kubernetes, Terraform
- `Lab 2`: First GitHub Actions CI workflow (`.github/workflows/ci.yml`) with `npm install` and `npm test`

### Week 3 — Linux & Cloud Basics with AWS EC2

- Linux commands, environment variables, SSH, and networking
- `Lab 3`: Launch EC2 instance, install Node.js + MongoDB, run Hello Node.js server

### Week 4 — Automation & Scripting

- Bash scripts for environment setup, idempotency, and service management
- `Lab 4`: Script to install dependencies and start backend + frontend with one command

### Week 5 — Git & GitHub Essentials + CI

- Git branching, PRs, ESLint, GitHub Secrets
- `Lab 5`: CI workflow for backend with linting + tests gating PRs

### Week 6 — Frontend Integration & Deployment

- React build pipeline, connecting to Node.js API, static hosting on S3/GitHub Pages
- `Lab 6`: Full-stack CI/CD with automated frontend deployment
- 🧪 **Midterm Assessment** (Modules 1–6)

### Week 7 — Docker & Containerization

- Docker images, containers, volumes, Compose, GHCR
- `Lab 7`: Dockerize ShopSmart backend + frontend, push images via GitHub Actions

### Week 8 — AWS Deployment Automation

- ECS, IAM, S3 + CloudFront, AWS Secrets Manager
- `Lab 8`: Full cloud deployment pipeline — ECS backend + S3/CloudFront frontend

### Week 9 — Infrastructure as Code + Vault

- Terraform syntax, Docker provider, HashiCorp Vault for secret management
- `Lab 9`: Terraform config for ShopSmart + GitHub Actions CI validation (`fmt`, `validate`)

### Week 10 — Kubernetes Fundamentals

- Pods, deployments, services, ingress, Minikube
- `Lab 10`: Deploy ShopSmart to Minikube with automated manifest application

### Week 11 — Building Complete CI/CD Pipelines

- Multi-job pipelines: build → test → package → deploy
- `Lab 11`: Unified CI/CD pipeline with Docker Compose and self-hosted runner

### Week 12 — Monitoring, Security & Wrap-Up

- Grafana, Prometheus, Loki dashboards and alerts
- Dependabot, GitHub code scanning
- `Lab 12`: Full monitoring setup with post-deployment health checks and Slack/Discord notifications

---

## Capstone Project — ShopSmart

The final capstone project is a complete end-to-end implementation of the **ShopSmart** application featuring:

- ✅ Full-stack app (Node.js backend + React frontend)
- ✅ CI/CD pipeline via GitHub Actions
- ✅ Containerization with Docker + Docker Compose
- ✅ Kubernetes orchestration (Minikube / cloud)
- ✅ Infrastructure as Code with Terraform
- ✅ Secret management with HashiCorp Vault
- ✅ Observability stack: Grafana + Prometheus + Loki
- ✅ Automated health checks and deployment notifications

For architecture, roles, API docs, and local setup, see `shopsmart/README.md`.

---

## Tech Stack

`Node.js` · `React` · `GitHub Actions` · `Docker` · `Kubernetes` · `Terraform` · `AWS (EC2, ECS, S3, CloudFront)` · `HashiCorp Vault` · `Grafana` · `Prometheus` · `Loki` · `Bash` · `Linux`

---

## References

- *The DevOps Handbook* — Kim, Humble et al. (IT Revolution Press, 2021)
- *The Docker Book* — Turnbull (2022)
- *Kubernetes: Up and Running* — Burns et al. (O'Reilly, 3rd Ed., 2023)
- *Terraform: Up & Running* — Brikman (2022)
- Grafana Labs Docs · Prometheus Docs · GitHub Actions Docs

---

## Submissions

All assignments are submitted via **GitHub Classroom**. Lab tasks and notes are organized by week in their respective folders.

---

Newton School of Technology · CSA326 · 2024–2028 - Semester IV
