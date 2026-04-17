# Right360 — Full-Scale Product Development Specification (Claude-Ready)

## 1. Product Vision

Right360 is a **next-generation customizable web navigation platform** inspired by Symbaloo, combining:

* Visual tile-based navigation
* Multi-engine search aggregation
* Deep personalization
* Content + bias context layer
* Monetization-ready infrastructure

This is **NOT an MVP scope**. This document defines a **full-scale, production-grade system**.

---

## 2. Core Product Pillars

### 2.1 Navigation Hub

* Tile-based website access (core UX)
* Category-driven discovery
* Fast access to frequently used services

### 2.2 Personalization Engine

* Full layout control
* Multi-device sync
* Visual customization

### 2.3 Search Aggregation Layer

* Multi-engine search (18 engines)
* Engine preference per page

### 2.4 Content Layer

* Category-based articles
* Perspective-driven content (e.g. Conservative)

### 2.5 Monetization Layer

* Sponsored tiles
* Sponsored panels
* Affiliate tracking

---

## 3. System Architecture (Production Grade)

### Frontend

* React.js (Next.js preferred)
* State: Zustand / Redux Toolkit
* Drag & Drop: dnd-kit
* Styling: Tailwind CSS

### Backend

* Node.js (NestJS recommended)
* REST APIs
* JWT Authentication

### Database

* MongoDB (Primary)
* Redis (Caching + sessions)

### Storage

* Cloud Storage (images, backgrounds)

### CMS Layer

* Required for:

  * Tiles
  * Categories
  * Articles
  * Ads

---

## 4. Full Feature Scope (Detailed)

## 4.1 Landing Page

### Features

* Global header (logo, nav, login, help)
* Quick-access shortcuts (Google, Microsoft)
* Sponsored content panel

### Enhancements

* Dynamic ads rotation
* Personalized shortcuts (future)

---

## 4.2 Search System

### Features

* Input + dropdown selector
* 18 search engines
* Icon switching
* Redirect-based search execution

### Advanced Scope

* Search analytics tracking
* Preferred engine per category
* Smart suggestions (future AI)

---

## 4.3 User System

### Features

* Registration
* Login
* Password recovery
* Guest usage

### Advanced Scope

* OAuth (Google, Apple)
* Multi-device sync
* Profile management
* Preferences storage

---

## 4.4 Tile Grid System (Core Engine)

### Base Features

* Grid layout
* Tile click navigation
* Category-based tiles

### Advanced Features

* Drag & drop reorder
* Add/remove tiles
* Tile metadata system
* Lazy loading

---

## 4.5 Personalization Engine

### Layout Control

* Drag & drop positioning
* Save layouts
* Multiple layouts per category

### Appearance

* Background color
* Background images
* Opacity control

### Persistence

* Guest → localStorage
* User → MongoDB sync

---

## 4.6 Advanced Grid System (Full Scope)

* Grid snapping
* Tile resizing (1x1, 2x2, 4x4)
* Dynamic grid expansion
* Multi-page layouts
* Tile grouping

---

## 4.7 Tile Intelligence Layer

Each tile supports:

* Logo
* Title
* Subtitle
* Trend indicator (Hot/New/Trending)
* Info panel
* Sub-links menu
* Bias indicator

---

## 4.8 Category Directory

### Features

* Icon grid
* Subcategory lists
* Discover sidebar

### Advanced Scope

* Personalized categories
* Recommended categories

---

## 4.9 Content Tabs System

Each category includes:

* Start Page (tiles)
* Perspective article (e.g. Conservative)
* Informational article

### Advanced Scope

* CMS-driven content
* Multi-perspective support

---

## 4.10 Widget System

Special tiles:

* Weather
* News (RSS)
* Stocks
* Custom widgets

---

## 4.11 Monetization System

### Features

* Sponsored panel
* Sponsored tiles

### Advanced Scope

* Affiliate tracking
* CPC/CPM tracking
* Ad targeting by category

---

## 5. MongoDB Schema (Production Ready)

### Users

```json
{
  _id,
  username,
  email,
  passwordHash,
  preferences,
  createdAt
}
```

### Tiles

```json
{
  _id,
  title,
  url,
  logo,
  categoryId,
  metadata,
  isSponsored
}
```

### Layouts

```json
{
  _id,
  userId,
  categoryId,
  tiles,
  positions,
  settings
}
```

### Categories

```json
{
  _id,
  name,
  parentId,
  icon
}
```

### Articles

```json
{
  _id,
  categoryId,
  type,
  content
}
```

### Ads

```json
{
  _id,
  image,
  link,
  categoryId,
  priority
}
```

---

## 6. API Architecture

### Auth

* POST /auth/register
* POST /auth/login

### Tiles

* GET /tiles
* POST /tiles

### Layout

* GET /layout
* POST /layout

### Categories

* GET /categories

### Articles

* GET /articles

### Ads

* GET /ads

---

## 7. Frontend Component System

* Header
* SearchBar
* TileGrid
* Tile
* EditToolbar
* SettingsModal
* CategoryDirectory
* Tabs

---

## 8. Performance & Scalability

### Must Implement

* Lazy loading
* Image CDN
* Virtualized grid rendering
* API caching

---

## 9. Security

* JWT authentication
* Password hashing (bcrypt)
* Input validation
* Rate limiting

---

## 10. Development Rules for Claude

You are building a scalable production system.

### Always

* Modular code
* Reusable components
* Clean architecture
* Proper error handling

### Never

* Hardcode data
* Skip validation
* Ignore performance

---

## 11. Folder Structure

### Frontend

```
src/
  components/
  pages/
  store/
  hooks/
  services/
```

### Backend

```
src/
  controllers/
  services/
  models/
  routes/
  middleware/
```

---

## 12. Definition of Done

* Feature fully functional
* Data persisted
* No errors
* Responsive UI
* Performance optimized

---

## 13. Execution Strategy

### Build Order

1. Core backend setup
2. Authentication
3. Category system
4. Tile system
5. Personalization engine
6. Search system
7. Content system
8. Ads system
9. Advanced grid features

---

## 14. Final Instruction to Claude

Build Right360 as a **scalable, production-ready Symbaloo competitor**.

Focus on:

* Performance
* Clean architecture
* Extensibility
