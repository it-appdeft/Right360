# 01 — Project Setup

## Purpose
Initialize the full Right360 monorepo with React.js frontend, Node.js backend, and MongoDB database. Establish folder structure, dependencies, environment config, and dev/prod scripts.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18+ (Create React App or Vite) |
| Backend | Node.js 20+ with Express.js |
| Database | MongoDB 7+ with Mongoose ODM |
| Cache | Redis 7+ |
| Styling | Tailwind CSS 3+ |
| State Mgmt | Zustand |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| HTTP Client | Axios |
| Dev Tools | Nodemon, Concurrently, dotenv |

---

## Folder Structure

```
right360/
├── client/                    # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── logo.png
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Button, Input, Modal, Loader
│   │   │   ├── layout/        # Header, Footer, Sidebar
│   │   │   ├── tiles/         # Tile, TileGrid, TileEditor
│   │   │   ├── search/        # SearchBar, EngineSelector
│   │   │   ├── categories/    # CategoryGrid, CategoryCard
│   │   │   ├── content/       # ArticleView, TabSystem
│   │   │   ├── ads/           # SponsoredPanel, SponsoredTile
│   │   │   └── widgets/       # Weather, News, Stocks
│   │   ├── pages/             # Route-level pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Categories.jsx
│   │   │   └── Settings.jsx
│   │   ├── store/             # Zustand stores
│   │   │   ├── useAuthStore.js
│   │   │   ├── useTileStore.js
│   │   │   ├── useCategoryStore.js
│   │   │   ├── useSearchStore.js
│   │   │   └── useLayoutStore.js
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions (Axios)
│   │   │   ├── api.js         # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   ├── tileService.js
│   │   │   ├── categoryService.js
│   │   │   └── layoutService.js
│   │   ├── utils/             # Helper functions
│   │   ├── styles/            # Global styles
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── routes.jsx         # React Router config
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── tileController.js
│   │   │   ├── categoryController.js
│   │   │   ├── layoutController.js
│   │   │   ├── articleController.js
│   │   │   └── adController.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Tile.js
│   │   │   ├── Category.js
│   │   │   ├── Layout.js
│   │   │   ├── Article.js
│   │   │   └── Ad.js
│   │   ├── routes/            # Express route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── tileRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── layoutRoutes.js
│   │   │   ├── articleRoutes.js
│   │   │   └── adRoutes.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js        # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validate.js    # Input validation
│   │   ├── services/          # Business logic
│   │   ├── config/
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── redis.js       # Redis connection
│   │   └── app.js             # Express app setup
│   ├── server.js              # Entry point
│   └── package.json
│
├── context.md                 # Master spec
├── logo.png                   # Brand logo
├── .env.example               # Environment template
├── .gitignore
└── README.md
```

---

## Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/right360

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# OAuth (future)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Client
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Package Dependencies

### Client (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "zustand": "^4.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@dnd-kit/utilities": "^3.x",
    "react-icons": "^5.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

### Server (`server/package.json`)
```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^8.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "cors": "^2.x",
    "dotenv": "^16.x",
    "express-rate-limit": "^7.x",
    "express-validator": "^7.x",
    "redis": "^4.x",
    "helmet": "^7.x",
    "morgan": "^1.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

---

## Implementation Steps

1. Create root folder structure (`client/`, `server/`)
2. Initialize `client/` with `npx create-react-app` or Vite
3. Initialize `server/` with `npm init`
4. Install all dependencies for both client and server
5. Configure Tailwind CSS in client
6. Set up Express app with CORS, helmet, morgan
7. Set up MongoDB connection with Mongoose
8. Set up Redis connection
9. Create `.env` and `.env.example`
10. Set up `concurrently` to run both client and server
11. Create `.gitignore` (node_modules, .env, build/)
12. Verify both client and server start without errors

---

## NPM Scripts

### Root level (optional)
```json
{
  "scripts": {
    "client": "cd client && npm start",
    "server": "cd server && npm run dev",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "install-all": "cd client && npm install && cd ../server && npm install"
  }
}
```

---

## Dependencies on Other Modules
- **None** — This is the foundation. All other modules depend on this.
