# 02 — Backend API

## Purpose
Build the Node.js/Express backend with all REST API routes, MongoDB schemas (Mongoose), Redis caching layer, middleware stack, and security hardening.

---

## Tech Stack

| Tool | Role |
|------|------|
| Express.js | HTTP framework |
| Mongoose | MongoDB ODM |
| Redis | Caching & sessions |
| Helmet | Security headers |
| Morgan | Request logging |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |

---

## MongoDB Schemas

### User
```js
{
  username:     { type: String, required: true, unique: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  avatar:       { type: String, default: '' },
  preferences:  {
    defaultCategory: { type: mongoose.Types.ObjectId, ref: 'Category' },
    theme:           { type: String, default: 'light' },
    searchEngine:    { type: String, default: 'google' }
  },
  role:         { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now }
}
```

### Tile
```js
{
  title:       { type: String, required: true },
  url:         { type: String, required: true },
  logo:        { type: String, default: '' },
  subtitle:    { type: String, default: '' },
  categoryId:  { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
  metadata:    {
    trendIndicator: { type: String, enum: ['hot', 'new', 'trending', 'none'], default: 'none' },
    biasIndicator:  { type: String, default: '' },
    subLinks:       [{ title: String, url: String }],
    infoPanel:      { type: String, default: '' }
  },
  isSponsored:  { type: Boolean, default: false },
  isDefault:    { type: Boolean, default: true },
  position:     { type: Number, default: 0 },
  size:         { type: String, enum: ['1x1', '2x2', '4x4'], default: '1x1' },
  createdAt:    { type: Date, default: Date.now }
}
```

### Category
```js
{
  name:      { type: String, required: true, unique: true },
  slug:      { type: String, required: true, unique: true },
  icon:      { type: String, default: '' },
  parentId:  { type: mongoose.Types.ObjectId, ref: 'Category', default: null },
  order:     { type: Number, default: 0 },
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Layout
```js
{
  userId:     { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
  tiles:      [{
    tileId:   { type: mongoose.Types.ObjectId, ref: 'Tile' },
    position: { x: Number, y: Number },
    size:     { type: String, enum: ['1x1', '2x2', '4x4'], default: '1x1' }
  }],
  settings:   {
    background:      { type: String, default: '#ffffff' },
    backgroundImage: { type: String, default: '' },
    opacity:         { type: Number, default: 1, min: 0, max: 1 },
    gridColumns:     { type: Number, default: 8 }
  },
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now }
}
```

### Article
```js
{
  title:      { type: String, required: true },
  categoryId: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
  type:       { type: String, enum: ['perspective', 'informational'], required: true },
  perspective:{ type: String, default: '' },  // e.g. "Conservative"
  content:    { type: String, required: true },
  author:     { type: String, default: 'Right360' },
  isPublished:{ type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now }
}
```

### Ad
```js
{
  title:      { type: String, required: true },
  image:      { type: String, required: true },
  link:       { type: String, required: true },
  categoryId: { type: mongoose.Types.ObjectId, ref: 'Category', default: null },
  type:       { type: String, enum: ['panel', 'tile'], required: true },
  priority:   { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
  impressions:{ type: Number, default: 0 },
  clicks:     { type: Number, default: 0 },
  startDate:  { type: Date },
  endDate:    { type: Date },
  createdAt:  { type: Date, default: Date.now }
}
```

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Create new user |
| POST | `/login` | Login, return JWT |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password` | Reset with token |
| GET | `/me` | Get current user (protected) |

### Tiles (`/api/tiles`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Get all default tiles |
| GET | `/category/:categoryId` | Get tiles by category |
| GET | `/:id` | Get single tile |
| POST | `/` | Create tile (admin) |
| PUT | `/:id` | Update tile (admin) |
| DELETE | `/:id` | Delete tile (admin) |

### Categories (`/api/categories`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Get all categories |
| GET | `/:id` | Get category with subcategories |
| POST | `/` | Create category (admin) |
| PUT | `/:id` | Update category (admin) |
| DELETE | `/:id` | Delete category (admin) |

### Layouts (`/api/layouts`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/:categoryId` | Get user layout for category |
| POST | `/` | Save/update layout |
| PUT | `/:id` | Update layout |
| DELETE | `/:id` | Delete layout |

### Articles (`/api/articles`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/category/:categoryId` | Get articles by category |
| GET | `/:id` | Get single article |
| POST | `/` | Create article (admin) |
| PUT | `/:id` | Update article (admin) |

### Ads (`/api/ads`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Get active ads |
| GET | `/category/:categoryId` | Get ads by category |
| POST | `/:id/click` | Track ad click |
| POST | `/` | Create ad (admin) |
| PUT | `/:id` | Update ad (admin) |

---

## Middleware Stack

```
Request → Helmet → CORS → Morgan → Rate Limiter → Body Parser → Routes → Error Handler
```

1. **helmet** — Security headers
2. **cors** — Cross-origin (allow client origin)
3. **morgan** — Request logging
4. **rateLimiter** — 100 requests/15min per IP
5. **express.json()** — Parse JSON body
6. **auth middleware** — JWT verification on protected routes
7. **validate middleware** — express-validator checks
8. **errorHandler** — Centralized error response

---

## Redis Caching Strategy

| Data | TTL | Key Pattern |
|------|-----|-------------|
| Categories | 1 hour | `categories:all` |
| Tiles by category | 30 min | `tiles:cat:{categoryId}` |
| Active ads | 15 min | `ads:active` |
| User session | 7 days | `session:{userId}` |

---

## Implementation Steps

1. Set up Express app with middleware stack (`app.js`)
2. Create MongoDB connection config (`config/db.js`)
3. Create Redis connection config (`config/redis.js`)
4. Define all 6 Mongoose models
5. Create route files for each resource
6. Implement controllers with CRUD operations
7. Add JWT auth middleware
8. Add input validation middleware
9. Add centralized error handler
10. Add Redis caching to GET endpoints
11. Seed initial categories and default tiles
12. Test all endpoints with Postman/curl

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup` (folder structure, dependencies)
- **Required by**: All other modules (they consume these APIs)
