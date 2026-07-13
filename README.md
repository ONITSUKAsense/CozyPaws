# CozyPaws — Full-Stack Pet Store Platform

A bilingual (English/Chinese) e-commerce platform for pet supplies built with React + Spring Boot. Features product browsing, shopping cart, checkout, user authentication, blog, and a full admin panel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 6, Tailwind CSS v4, Vite |
| **Backend** | Spring Boot 3.x, JDK 17, Maven |
| **Database** | MySQL 8, Flyway (migrations), Spring Data JPA |
| **Auth** | Spring Security, JWT (stateless) |
| **State** | Zustand (with localStorage persist) |
| **Icons** | Lucide React |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |

## Features

- **Public** — Product catalog with categories, search, sorting, pagination; blog; responsive design
- **User** — Register, login, shopping cart (persisted), checkout, order history
- **Admin** — Dashboard, product/category/blog CRUD, order management, image upload, bilingual UI toggle
- **i18n** — Full English and Chinese translations across public and admin interfaces

## Project Structure

```
cozypaws/
├── public/                   # Static assets (favicon)
├── src/                      # React frontend
│   ├── api/                  # Axios API client & endpoint modules
│   ├── components/           # UI & layout components
│   │   ├── ui/               # Reusable components (ImageUpload, etc.)
│   │   └── layout/           # Header, Footer, Layout
│   ├── pages/                # Route pages
│   │   └── admin/            # Admin panel pages
│   ├── store/                # Zustand stores (auth, cart)
│   ├── hooks/                # Custom hooks
│   ├── i18n/                 # Translation resources & context
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Router configuration
│   └── main.tsx              # Entry point
├── backend/                  # Spring Boot backend
│   ├── src/main/java/com/cozypaws/
│   │   ├── config/           # Security, CORS, Swagger config
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic layer
│   │   ├── repository/       # JPA repositories
│   │   ├── entity/           # JPA entities
│   │   ├── dto/              # Request/response DTOs
│   │   ├── exception/        # Global exception handler
│   │   └── security/         # JWT provider, filter, UserDetailsService
│   └── src/main/resources/
│       ├── application.yml   # Main config (env-variable-injected)
│       ├── application-prod.yml
│       └── db/migration/     # Flyway migrations (V1–V4)
├── DEPLOY.md                 # Production deployment guide
└── vite.config.ts            # Vite config with proxy
```

## Quick Start

### Prerequisites

- Node.js 20+
- JDK 17+
- MySQL 8
- Maven

### 1. Database Setup

```sql
CREATE DATABASE cozypaws CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend

# Configure (or set env vars: DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET)
# Defaults in application.yml work for local development

mvn clean package -DskipTests
java -jar target/cozypaws-0.0.1-SNAPSHOT.jar
```

The backend starts on `http://localhost:8080`. Flyway automatically runs migrations (V1–V4) on startup, creating all tables and seed data.

### 3. Frontend

```bash
# From project root
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` (or next available port). Vite proxies `/api` and `/uploads` requests to the backend.

### 4. Admin Login

Default admin credentials (created by V4 migration):

- **Email:** `admin@cozypaws.com`
- **Password:** `admin123`

Access the admin panel at `/admin` after logging in.

## API Overview

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/products` | Public | List products (query: category, sort, page, size) |
| `GET /api/products/featured` | Public | Featured products |
| `GET /api/products/:id` | Public | Product detail |
| `GET /api/categories` | Public | List categories |
| `GET /api/blog` | Public | List blog posts |
| `GET /api/blog/:slug` | Public | Blog post detail |
| `POST /api/auth/register` | Public | Register user |
| `POST /api/auth/login` | Public | Login, returns JWT |
| `GET /api/auth/me` | User | Current user info |
| `GET /api/cart` | User | Get cart |
| `POST /api/cart/items` | User | Add to cart |
| `POST /api/orders` | User | Place order |
| `GET /api/orders` | User | Order history |
| `GET /api/admin/dashboard` | Admin | Dashboard stats |
| `POST /api/admin/products` | Admin | Create product |
| `PUT /api/admin/products/:id` | Admin | Update product |
| `DELETE /api/admin/products/:id` | Admin | Delete product |
| `POST /api/upload` | Admin | Upload image file |

Full API documentation available at Swagger UI: `http://localhost:8080/swagger-ui.html`

## Database Migrations

| File | Description |
|------|-------------|
| `V1__init.sql` | Core schema: categories, products, users, carts, cart_items, orders, order_items, blog_posts |
| `V2__seed_data.sql` | Sample categories, products (EN), blog posts (EN) with placeholder images |
| `V3__i18n_update.sql` | Updates seed data with Chinese names/descriptions and real Unsplash images |
| `V4__add_admin_user.sql` | Creates default admin user (`admin@cozypaws.com` / `admin123`) |

## Configuration

All sensitive values in `application.yml` are environment-variable-injected with local-development defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:mysql://localhost:3306/cozypaws?...` | Database JDBC URL |
| `DB_USERNAME` | `root` | Database user |
| `DB_PASSWORD` | *(empty)* | Database password |
| `JWT_SECRET` | *(embedded dev key)* | JWT signing secret (change in production!) |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` | Allowed CORS origins |
| `UPLOAD_DIR` | `./uploads` | File upload directory |

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for a complete production deployment guide covering:

- Cloud server setup (Ubuntu + Nginx)
- SSL certificate via Let's Encrypt
- MySQL 8 installation and database creation
- Backend systemd service configuration
- Frontend build and Nginx reverse proxy
- Image upload directory setup
- WeChat QR code scanning for mobile access

## Development

```bash
# Frontend dev (with HMR)
npm run dev

# Backend dev (with Spring Boot DevTools)
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Build frontend for production
npm run build

# Build backend
cd backend && mvn clean package -DskipTests
```

## License

Private project — all rights reserved.
