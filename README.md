# Melbourne Open Playground (MOP)

A Next.js web application that showcases Melbourne's open data, datasets, case studies, and interactive content. It includes a fully featured public site with multilingual support and a role-based admin dashboard for content management.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Docker](#docker)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Git Contributions](#git-contributions)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Primary Database | PostgreSQL via Supabase |
| Secondary Database | MongoDB (legacy use cases) |
| Auth | JWT + bcryptjs |
| Storage / Realtime | Firebase |
| Error Tracking | Sentry |
| Testing | Jest + Cypress |
| i18n | next-intl (8 languages) |
| CI/CD | Jenkins + Google Cloud (Build → Artifact Registry → Cloud Run) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A PostgreSQL database (Supabase recommended)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd next_webapp

# 2. Install dependencies
npm install

# 3. Set up environment variables (see section below)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000) by default.

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the project root. The required variables are:

```env
# PostgreSQL / Supabase
SUPABASE_URL=
SUPABASE_API_KEY=
DATABASE_URL=postgresql://user:password@host:port/dbname
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# MongoDB (legacy use cases)
MONGODB_URI=mongodb+srv://...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# JWT
JWT_SECRET=

# Email (Nodemailer / SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

# Error Tracking
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## Running Tests

```bash
# Unit and integration tests (Jest)
npm test

# Lint
npm run lint

# End-to-end tests (Cypress) — requires the dev server to be running
npx cypress open
```

---

## Docker

```bash
# Build the image
docker build -t mop-app .

# Run the container
docker run -p 3000:3000 --env-file .env.local mop-app
```

---

## Features

### Public Site

| Feature | Description |
|---|---|
| **Home** | Landing page with featured content and data highlights |
| **Categories** | Browse and filter Melbourne open datasets by category |
| **Use Cases** | Case studies showing how open data is applied in practice |
| **Blog** | Articles and announcements with rich-text content |
| **Gallery** | Image gallery with lightbox and server-side pagination |
| **Search** | Full-text search with category filters, sort options, and pagination |
| **Statistics** | Charts and visualisations of dataset metrics by category and trimester |
| **EV Infrastructure** | Information on Melbourne's EV charging network |
| **Cafes & Restaurants** | Directory page for cafes and restaurants |
| **Contact / FAQ** | Contact form submission and frequently asked questions |
| **Chatbot** | AI-powered chatbot for user assistance |

### Internationalisation

Eight supported languages with locale-prefixed routes:

| Code | Language |
|---|---|
| `en` | English (default) |
| `cn` | Chinese |
| `es` | Spanish |
| `el` | Greek |
| `ar` | Arabic |
| `it` | Italian |
| `hi` | Hindi |
| `vi` | Vietnamese |

Translation files are located in `messages/[locale].json`.

### Authentication

- Email/password registration and login
- JWT sessions with 7-day expiry (stored in localStorage)
- OTP verification for new accounts
- Password reset via email
- Role-based access control — roles: `admin`, `editor`, `viewer`

### Admin Dashboard

| Feature | Description |
|---|---|
| **Dashboard** | Overview with live statistics widget and recent activity feed |
| **Blog Management** | Create, edit, and delete blog posts using CKEditor rich-text editor |
| **Category Management** | Add, update, and remove content categories |
| **Use Case Management** | Manage case studies with tags and metadata |
| **Gallery Management** | Upload, organise, and delete gallery images |
| **Activity History** | Sortable, filterable, exportable audit log of all admin actions with configurable retention |
| **Settings** | Admin configuration and preferences |

### User Profile

- View and update personal details
- Upload a profile picture
- Change account password

---

## Project Structure

```
next_webapp/
├── src/
│   ├── app/
│   │   ├── [locale]/              # All locale-prefixed pages
│   │   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── blog/              # Blog list and detail
│   │   │   ├── categories/        # Category pages
│   │   │   ├── usecases/          # Use case pages
│   │   │   ├── search/            # Search page
│   │   │   ├── statistics/        # Statistics and charts
│   │   │   ├── gallery/           # Gallery page
│   │   │   ├── login/             # Auth pages (login, signup, forgot-password)
│   │   │   └── profile/           # User profile
│   │   └── api/                   # REST API routes
│   ├── components/                # Reusable React components
│   ├── hooks/                     # Custom React hooks
│   ├── library/                   # Supabase and DB clients
│   ├── models/                    # TypeScript interfaces and types
│   ├── mongodb/                   # MongoDB schemas
│   ├── utils/                     # Logger, helpers, data utilities
│   └── middleware.ts              # JWT auth and route protection
├── messages/                      # i18n translation JSON files
├── public/                        # Static assets (images, icons)
├── sql/                           # PostgreSQL migration scripts
├── cypress/                       # Cypress E2E test configuration
├── Dockerfile
├── Jenkinsfile
└── next.config.mjs
```

---

## API Overview

All protected routes require a valid JWT in the `Authorization: Bearer <token>` header.

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/login` | POST | Public | Log in and receive a JWT |
| `/api/auth/signup` | POST | Public | Register a new user |
| `/api/auth/logout` | POST | Protected | Invalidate session |
| `/api/auth/forgot-password` | POST | Public | Request a password reset email |
| `/api/auth/reset-password` | POST | Public | Reset password with token |
| `/api/home/blogs` | GET | Public | Featured blogs for homepage |
| `/api/home/categories` | GET | Public | Categories for homepage |
| `/api/home/gallery` | GET | Public | Featured gallery items |
| `/api/blogs` | GET / POST | Protected | List or create blogs |
| `/api/blogs/[id]` | GET / PUT / DELETE | Protected | Blog CRUD |
| `/api/categories` | GET / POST | Protected | List or create categories |
| `/api/categories/[id]` | GET / PUT / DELETE | Protected | Category CRUD |
| `/api/usecases` | GET / POST | Public | List or create use cases |
| `/api/usecases/[id]` | GET / PUT / DELETE | Public | Use case CRUD |
| `/api/gallery` | GET / POST | Protected | List or upload gallery items |
| `/api/gallery/[id]` | GET / PUT / DELETE | Protected | Gallery item CRUD |
| `/api/search` | GET | Public | Full-text search (`?q=&category=&page=&sortBy=`) |
| `/api/statistics/*` | GET | Public | Dataset statistics (count, by-category, trimester, tags) |
| `/api/profile` | GET / PUT | Protected | View or update user profile |
| `/api/profile/upload-image` | POST | Protected | Upload profile picture |
| `/api/admin/activity-history` | GET | Admin | Admin audit log |
| `/api/contact` | POST | Public | Contact form submission |
| `/api/chat` | POST | Public | Chatbot endpoint |
| `/api/logs` | GET / DELETE | Admin | Application logs |

---

## Git Contributions

### Branching

Branch from the branch you intend to merge back into. Use your username with a team indicator:

```
Username_WD   or   Username-webdev
```

Always fetch the latest changes before pushing to avoid merge conflicts.

### Commit Message Tags

| Tag | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix or hotfix |
| `docs` | Documentation changes |
| `design` | Style or UI changes |
| `refactor` | Code refactoring |
| `test` | New or updated tests |
| `build` | Build process changes |

### Pull Requests

- Write a clear, specific PR title and description.
- If you collaborated on the branch, mention co-contributors in the PR body.
- Link any related issues.
