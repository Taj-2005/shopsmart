# 🚀 Full Stack DevOps Engineering — CSA326

> All coursework, lab work, assignments, and in-class material for **CSA326 – Full Stack DevOps Engineering** at Rishihood University is maintained in this repository.

---

## Course Info


| Field           | Details                           |
| --------------- | --------------------------------- |
| **Course Code** | CSA326                            |
| **Instructor**  | Tanmay Balwa                      |
| **Program**     | B.Tech. CS & AI / B.Tech. CS & DS |
| **Semester**    | Even Semester, 2025–2026         |
| **Credits**     | 4                                 |
| **Mode**        | Regular                           |

---

## What's in This Repo

This repo contains everything done throughout the course — from week 1 lectures to the final capstone project. All lab exercises, assignments, bash scripts, CI/CD workflows, Dockerfiles, Kubernetes manifests, Terraform configs, and monitoring setups are tracked here.

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

---

## Tech Stack

`Node.js` · `React` · `GitHub Actions` · `Docker` · `Kubernetes` · `Terraform` · `AWS (EC2, ECS, S3, CloudFront)` · `HashiCorp Vault` · `Grafana` · `Prometheus` · `Loki` · `Bash` · `Linux`

---

# References

- *The DevOps Handbook* — Kim, Humble et al. (IT Revolution Press, 2021)
- *The Docker Book* — Turnbull (2022)
- *Kubernetes: Up and Running* — Burns et al. (O'Reilly, 3rd Ed., 2023)
- *Terraform: Up & Running* — Brikman (2022)
- Grafana Labs Docs · Prometheus Docs · GitHub Actions Docs

---

## Submissions

All assignments are submitted via **GitHub Classroom**. Lab tasks and notes are organized by week in their respective folders.

---

*Newton School of Technology· CSA326 · 2024–2028 - Semester IV*
