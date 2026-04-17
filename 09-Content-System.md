# 09 — Content System

## Purpose
Category-driven content layer with tabbed articles — each category has a Start Page (tiles), a Perspective article (e.g., Conservative viewpoint), and an Informational article. CMS-driven for easy content management.

---

## Tech Stack

| Tool | Role |
|------|------|
| React | Article rendering |
| Zustand | Content state |
| Markdown / HTML | Article content format |
| DOMPurify | Sanitize HTML content |

---

## Features

### 9.1 Content Tabs
Each category page has 3 tabs:

| Tab | Content |
|-----|---------|
| **Start Page** | Tile grid (default view) |
| **Perspective** | Opinion/perspective article (e.g., Conservative) |
| **Info** | Factual informational article |

### 9.2 Perspective Articles
- Political/ideological perspective content
- Perspective label displayed prominently (e.g., "Conservative View")
- Source citations
- Related articles sidebar (future)

### 9.3 Informational Articles
- Neutral, fact-based content
- Category overview / educational content
- Updated regularly via CMS

### 9.4 CMS Features (Admin)
- Create / edit / delete articles
- Rich text editor (future: TinyMCE or similar)
- Publish / draft status
- Category assignment
- Author attribution

---

## Database Schema

Uses `Article` model from `02-Backend-API.md`:

```js
{
  title:       String,           // "Technology: A Conservative Perspective"
  categoryId:  ObjectId,         // Links to Category
  type:        'perspective' | 'informational',
  perspective: String,           // "Conservative", "Liberal", etc.
  content:     String,           // HTML or Markdown content
  summary:     String,           // Short excerpt (200 chars)
  author:      String,           // "Right360 Editorial"
  coverImage:  String,           // Article header image URL
  tags:        [String],         // ["politics", "tech"]
  isPublished: Boolean,          // Draft vs published
  viewCount:   Number,           // Analytics
  createdAt:   Date,
  updatedAt:   Date
}
```

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/articles/category/:categoryId` | No | Articles for a category |
| GET | `/api/articles/category/:categoryId/perspective` | No | Perspective article |
| GET | `/api/articles/category/:categoryId/info` | No | Info article |
| GET | `/api/articles/:id` | No | Single article |
| POST | `/api/articles` | Admin | Create article |
| PUT | `/api/articles/:id` | Admin | Update article |
| DELETE | `/api/articles/:id` | Admin | Delete article |

### Response Format
```json
{
  "_id": "...",
  "title": "Technology: A Conservative Perspective",
  "categoryId": "...",
  "type": "perspective",
  "perspective": "Conservative",
  "content": "<h2>...</h2><p>...</p>",
  "summary": "An analysis of tech industry trends...",
  "author": "Right360 Editorial",
  "coverImage": "/images/articles/tech-perspective.jpg",
  "isPublished": true,
  "viewCount": 1245,
  "createdAt": "2026-04-01T..."
}
```

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `ContentTabs` | Tab bar switching Start / Perspective / Info |
| `ArticleView` | Full article renderer (HTML content) |
| `ArticleHeader` | Title, author, date, cover image |
| `PerspectiveBadge` | Label showing perspective type |
| `ArticleSkeleton` | Loading placeholder |
| `ArticleNotFound` | Empty state when no article exists |

---

## Zustand Store (`useContentStore.js`)

```js
{
  articles: {},               // Cache: { [categoryId]: { perspective: Article, info: Article } }
  currentArticle: null,       // Active article being viewed
  isLoading: false,
  
  // Actions
  fetchArticles(categoryId),
  fetchPerspective(categoryId),
  fetchInfo(categoryId),
  setCurrentArticle(article),
  clearCache()
}
```

---

## Tab Integration with Category

```
CategoryPage
├── CategoryTabs
│   ├── "Start Page" → <TileGrid />        (from 06-Tile-System)
│   ├── "Perspective" → <ArticleView />     (perspective article)
│   └── "Info" → <ArticleView />            (informational article)
```

### URL Routing
```
/category/:slug              → Start Page tab (tiles)
/category/:slug/perspective  → Perspective article tab
/category/:slug/info         → Info article tab
```

---

## Article Rendering

```jsx
// ArticleView.jsx
<article className="max-w-3xl mx-auto px-4 py-8">
  <ArticleHeader 
    title={article.title}
    author={article.author}
    date={article.updatedAt}
    coverImage={article.coverImage}
  />
  
  {article.type === 'perspective' && (
    <PerspectiveBadge perspective={article.perspective} />
  )}
  
  <div 
    className="prose prose-lg"
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
  />
</article>
```

---

## Multi-Perspective Support (Future)

Each category could have multiple perspectives:
- Conservative
- Liberal
- Libertarian
- Centrist

Users could switch between perspectives or see a side-by-side comparison.

```
/category/:slug/perspective/conservative
/category/:slug/perspective/liberal
```

---

## Seed Content (Examples)

### News Category — Perspective Article
```
Title: "News Media: A Conservative Perspective"
Type: perspective
Perspective: Conservative
Content: Analysis of mainstream media bias, coverage patterns...
```

### Technology Category — Info Article
```
Title: "Understanding the Technology Landscape"
Type: informational
Content: Overview of major tech companies, trends, emerging technologies...
```

---

## Implementation Steps

1. Create `Article` model in backend
2. Build article CRUD endpoints with validation
3. Build `ContentTabs` component
4. Build `ArticleView` with HTML rendering + DOMPurify
5. Build `ArticleHeader` component
6. Build `PerspectiveBadge` component
7. Create `useContentStore` in Zustand
8. Integrate tabs into category page
9. Set up article routes in React Router
10. Seed sample articles for 3–5 categories
11. Build `ArticleSkeleton` loading state
12. Build `ArticleNotFound` empty state
13. Test tab switching and article loading

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup`, `02-Backend-API`, `04-UI-Design`, `05-Category-System`
- **Required by**: None directly (end-user content feature)
