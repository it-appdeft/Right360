# 05 — Category System

## Purpose
Build the category directory — hierarchical categories with icons, subcategories, sidebar navigation, and category-based content filtering across tiles, articles, and ads.

---

## Tech Stack

| Tool | Role |
|------|------|
| React Icons | Category icons |
| Zustand | Category state management |
| React Router | Category-based URL routing |

---

## Features

### 5.1 Category Directory Page
- Grid of category cards with icons
- Click to navigate to category's tile grid
- Search/filter categories
- Sorted by order field

### 5.2 Subcategories
- Parent → child hierarchy (1 level deep)
- Expanding subcategory list under parent
- Breadcrumb navigation: Home > Category > Subcategory

### 5.3 Category Sidebar
- Always-visible sidebar on desktop
- Collapsible on mobile (hamburger menu)
- Active category highlighted
- Shows subcategories on expand
- "Discover" section at bottom with recommended categories

### 5.4 Category Tabs
- Each category page has tabs:
  - **Start Page** — tile grid
  - **Perspective** — perspective article
  - **Info** — informational article

---

## Database Schema

Uses `Category` model from `02-Backend-API.md`:

```js
{
  name:      String,      // "Technology"
  slug:      String,      // "technology"
  icon:      String,      // "FaLaptop" (react-icons name)
  parentId:  ObjectId,    // null for top-level
  order:     Number,      // Sort order
  isActive:  Boolean      // Show/hide
}
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/categories` | All top-level categories |
| GET | `/api/categories/:id` | Category with subcategories |
| GET | `/api/categories/slug/:slug` | Category by slug |
| POST | `/api/categories` | Create (admin) |
| PUT | `/api/categories/:id` | Update (admin) |
| DELETE | `/api/categories/:id` | Delete (admin) |

### Response Format
```json
{
  "_id": "...",
  "name": "Technology",
  "slug": "technology",
  "icon": "FaLaptop",
  "parentId": null,
  "order": 1,
  "subcategories": [
    { "_id": "...", "name": "Software", "slug": "software", "icon": "FaCode" },
    { "_id": "...", "name": "Hardware", "slug": "hardware", "icon": "FaMicrochip" }
  ]
}
```

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `CategoryDirectory` | Full-page grid of all categories |
| `CategoryCard` | Single category card (icon + name) |
| `CategorySidebar` | Left sidebar with category list |
| `CategoryTabs` | Tab bar: Start Page / Perspective / Info |
| `SubcategoryList` | Expandable subcategory items |
| `Breadcrumb` | Navigation trail (Home > Category > Sub) |

---

## Zustand Store (`useCategoryStore.js`)

```js
{
  categories: [],           // All categories
  activeCategory: null,     // Currently selected
  activeTab: 'start',       // 'start' | 'perspective' | 'info'
  isLoading: false,
  
  // Actions
  fetchCategories(),
  setActiveCategory(categoryId),
  setActiveTab(tab),
  getCategoryBySlug(slug)
}
```

---

## Default Categories (Seed Data)

| Category | Icon | Subcategories |
|----------|------|---------------|
| News | FaNewspaper | US News, World News, Politics |
| Technology | FaLaptop | Software, Hardware, AI |
| Sports | FaFootball | NFL, NBA, Soccer |
| Entertainment | FaFilm | Movies, Music, TV |
| Finance | FaChartLine | Stocks, Crypto, Banking |
| Shopping | FaShoppingCart | Deals, Fashion, Electronics |
| Social Media | FaHashtag | Facebook, Twitter, Instagram |
| Education | FaGraduationCap | Courses, Research, Schools |
| Health | FaHeartPulse | Fitness, Nutrition, Mental Health |
| Travel | FaPlane | Flights, Hotels, Destinations |

---

## URL Routing

```
/                        → Home (default category)
/category/:slug          → Category tile grid (Start tab)
/category/:slug/perspective → Perspective article
/category/:slug/info     → Info article
/categories              → Category directory page
```

---

## Implementation Steps

1. Create `Category` model in backend (if not done in 02)
2. Build category CRUD endpoints with validation
3. Seed database with 10 default categories + subcategories
4. Build `CategoryDirectory` page with grid layout
5. Build `CategoryCard` component
6. Build `CategorySidebar` with expand/collapse
7. Build `CategoryTabs` component
8. Build `Breadcrumb` component
9. Create `useCategoryStore` in Zustand
10. Set up React Router routes for categories
11. Wire up category switching → tile grid filtering
12. Test responsive sidebar (collapse on mobile)

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup`, `02-Backend-API`, `04-UI-Design`
- **Required by**: `06-Tile-System` (tiles filtered by category), `09-Content-System` (articles by category), `10-Monetization` (ads by category)
