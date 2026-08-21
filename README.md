# 💎 ESTELE — Jewellery E-Commerce Website

A modern, responsive and premium jewellery e-commerce website built using
React.js, Laravel REST APIs and MySQL.

The project focuses on creating a clean luxury jewellery shopping experience
with a responsive frontend and a structured backend API.

---

## 🌐 Project Links

### 🔗 Live Backend — Render

https://estele-bniw.onrender.com

### 🔗 Home API

https://estele-bniw.onrender.com/api/home

> Note: The Laravel backend is successfully deployed on Render.
> The production cloud database migration is currently pending.

---

#  Project Overview

ESTELE is a full-stack jewellery e-commerce website.

The project is divided into two main parts:

- React.js frontend
- Laravel backend

The frontend communicates with the Laravel backend through REST APIs.

### Architecture

```text
React.js Frontend
       ↓
Laravel REST API
       ↓
Eloquent ORM
       ↓
MySQL Database
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* Lucide React
* Responsive UI/UX

## Backend

* Laravel 13
* PHP 8.3+
* REST API
* Laravel Sanctum
* Laravel Fortify
* Eloquent ORM

## Database

* MySQL 8.4

## Deployment

* GitHub
* Docker
* Render
* Aiven MySQL

---

#  Home Page

The Home Page has been developed with a premium and responsive UI.

### Completed Sections

* Announcement Bar
* Responsive Navbar
* Hero Section
* Shop by Category
* Brand Information
* Brand Story / About Estele
* Newsletter / Email Subscription Section
* Footer

---

# 🧭 Responsive Navbar

The Navbar includes:

* ESTELE branding
* Product navigation
* Search interface
* Account
* Cart
* Store Locator
* Mobile hamburger menu
* Mobile navigation drawer
* Sticky navigation
* Responsive desktop/tablet/mobile layout
* Hover interactions

---

#  Dynamic Shop by Category

The Shop by Category section is connected with the Laravel API.

The frontend dynamically receives category information from the backend.

Current API data:

```text
12 Categories
114 Collections
249 Products
```

Example category response:

```json
{
    "id": 6,
    "name": "Bangles",
    "slug": "bangles",
    "products_count": 3
}
```

---

#  Brand Information

The Home Page includes the following Estele brand highlights:

* 24K GOLD-PLATED JEWELLERY
* DESIGNED IN HYDERABAD
* HANDCRAFTED / SKIN FRIENDLY
* 35+ YEARS LEGACY
* 1 YEAR WARRANTY

---

# ✨ Brand Story

A dedicated Brand Story / About Estele section has been implemented
to introduce the brand and provide a premium storytelling experience.

---

# 📧 Newsletter Section

The Home Page includes an email subscription section:

### Get the Glow – Exclusive Access Awaits

**Subscribe to our emailer and get 5% off your first purchase.**

The section is designed with a premium responsive layout.

---

# 🔌 REST API Integration

The React frontend communicates with the Laravel backend using REST APIs.

### Home API

```http
GET /api/home
```

### API Response Structure

```json
{
    "success": true,
    "data": {
        "categories": [],
        "collections": [],
        "products": []
    }
}
```

### Frontend API Flow

```text
Home.jsx
   ↓
useHome()
   ↓
getHomeData()
   ↓
apiRequest()
   ↓
GET /api/home
   ↓
Laravel Controller
   ↓
MySQL
```

---

#  Custom React Hook

A custom React hook has been implemented for Home Page API management:

```text
src/hooks/useHome.js
```

The hook handles:

* API request
* Loading state
* Error state
* Home data state

Example flow:

```js
const {
    homeData,
    loading,
    error
} = useHome();
```

---

#  Database

The backend uses MySQL as the relational database.

The database structure includes the required entities for:

* Categories
* Collections
* Products
* Product-category relationships

The Home API currently retrieves:

```text
12 Categories
114 Collections
249 Products
```

---

# 🚀 Laravel Backend

The Laravel backend has been successfully configured with:

* Laravel 13
* PHP 8.3+
* REST API architecture
* Eloquent ORM
* MySQL database integration
* API response handling
* CORS configuration
* Environment-based configuration

---

# 🐳 Docker

Docker configuration has been added for production deployment.

The Laravel backend uses:

```text
PHP 8.3+
Apache
Composer
Laravel
MySQL PDO Extension
```

The Docker configuration allows the Laravel backend to run as a containerized
application on Render.

---

# ☁️ Render Deployment

The Laravel backend has been successfully deployed on Render.

### Backend URL

[https://estele-bniw.onrender.com](https://estele-bniw.onrender.com)

### Deployment Stack

```text
GitHub
   ↓
Render
   ↓
Docker
   ↓
Apache
   ↓
Laravel 13
   ↓
PHP
```

The Render service is currently live.

---

# 🗃️ Cloud Database Setup

An Aiven MySQL 8.4 cloud database has also been created for production.

### Current Configuration

```text
Provider: Aiven
Database: MySQL 8.4
Region: Asia, India - Bangalore
```

The cloud database service has been successfully created.

The existing local MySQL data is yet to be migrated to the cloud database.

---

# 🔐 Security

Sensitive configuration values are stored through environment variables.

The following information is NOT committed to GitHub:

```text
.env
APP_KEY
Database Password
Database Credentials
```

Production configuration is managed through environment variables.

---

# 📱 Responsive Design

The website is designed to provide a consistent experience across:

* Desktop
* Laptop
* Tablet
* Mobile

Tailwind CSS responsive utilities are used throughout the frontend.

---

# 📂 Project Structure

```text
ESTELE/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── AnnouncementBar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Hero.jsx
│   │   │   │
│   │   │   └── common/
│   │   │       └── Footer.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useHome.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── homeApi.js
│   │   │
│   │   └── pages/
│   │       └── Home.jsx
│   │
│   └── package.json
│
└── backend/
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/
    ├── resources/
    ├── routes/
    ├── storage/
    ├── artisan
    ├── composer.json
    ├── composer.lock
    └── Dockerfile
```

---

# ✅ Current Implementation Status

| Feature                            | Status      |
| ----------------------------------- | ----------- |
| React Frontend Setup               | ✅ Completed |
| Laravel Backend                    | ✅ Completed |
| MySQL Database Structure           | ✅ Completed |
| REST API                           | ✅ Completed |
| Home API                           | ✅ Completed |
| API Integration                    | ✅ Completed |
| Announcement Bar                   | ✅ Completed |
| Responsive Navbar                  | ✅ Completed |
| Shop by Category                   | ✅ Completed |
| Brand Information                  | ✅ Completed |
| Brand Story                        | ✅ Completed |
| Newsletter Section                 | ✅ Completed |
| Footer                             | ✅ Completed |
| Docker Configuration               | ✅ Completed |
| Render Backend Deployment          | ✅ Live      |
| Aiven MySQL Service                | ✅ Created   |
| Local Database → Cloud Database    |  Pending   |
| Render → Cloud Database Connection |  Pending   |
| Vercel Frontend Deployment         |  Pending   |

---

---

# 👩‍💻 Developer

Developed as a full-stack jewellery e-commerce project using modern
frontend and backend technologies.

---

## ⭐ Key Highlights

* Responsive premium jewellery UI
* React + Laravel full-stack architecture
* REST API integration
* Dynamic database-driven content
* Custom React hook for API handling
* Laravel Eloquent ORM
* MySQL database
* Dockerized Laravel backend
* Render deployment
* Cloud database setup with Aiven
