# 06 — Tile System

## Purpose
Core engine of Right360 — the tile-based grid for visual website navigation. Includes tile rendering, drag & drop reordering, tile CRUD, tile metadata/intelligence layer, resizing, grouping, and lazy loading.

---

## Tech Stack

| Tool | Role |
|------|------|
| @dnd-kit/core | Drag & drop framework |
| @dnd-kit/sortable | Sortable grid |
| @dnd-kit/utilities | CSS transforms |
| Zustand | Tile state management |
| Intersection Observer | Lazy loading |

---

## Features

### 6.1 Tile Grid (Base)
- Responsive grid layout (4–10 columns based on breakpoint)
- Click tile → open URL in new tab
- Category-based tile display
- Default tiles for each category (from DB)

### 6.2 Tile Intelligence Layer
Each tile supports rich metadata:

| Feature | Description |
|---------|-------------|
| Logo | 48x48 favicon/logo image |
| Title | Site name (e.g. "CNN") |
| Subtitle | Description (e.g. "Breaking News") |
| Trend Badge | Hot / New / Trending indicator |
| Bias Indicator | Political bias label (optional) |
| Info Panel | Tooltip with site description |
| Sub-links | Dropdown menu with related pages |

### 6.3 Drag & Drop
- Reorder tiles within the grid
- Visual feedback during drag (opacity, shadow)
- Grid snapping on drop
- Save new positions to layout
- Touch support for mobile

### 6.4 Tile CRUD (Edit Mode)
- **Add Tile**: Modal with URL, title, logo, category
- **Edit Tile**: Modify title, URL, logo, position
- **Remove Tile**: Delete from personal layout
- **Edit Toolbar**: Floating toolbar in edit mode

### 6.5 Advanced Grid
- Tile resizing: 1x1, 2x2, 4x4
- Dynamic grid expansion (add rows as needed)
- Multi-page layouts (pagination or swipe)
- Tile grouping (group related tiles visually)

### 6.6 Lazy Loading
- Tiles below the fold load on scroll
- Logo images use Intersection Observer
- Skeleton placeholders while loading

---

## Database Schema

Uses `Tile` and `Layout` models from `02-Backend-API.md`.

### Tile (Global / Default)
```js
{
  title, url, logo, subtitle,
  categoryId,
  metadata: { trendIndicator, biasIndicator, subLinks, infoPanel },
  isSponsored, isDefault, position, size
}
```

### Layout (Per User)
```js
{
  userId, categoryId,
  tiles: [{ tileId, position: { x, y }, size }],
  settings: { background, backgroundImage, opacity, gridColumns }
}
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tiles` | All default tiles |
| GET | `/api/tiles/category/:catId` | Tiles by category |
| GET | `/api/tiles/:id` | Single tile detail |
| POST | `/api/tiles` | Create tile (admin) |
| PUT | `/api/tiles/:id` | Update tile (admin) |
| DELETE | `/api/tiles/:id` | Delete tile (admin) |
| GET | `/api/layouts/:catId` | User's layout for category |
| POST | `/api/layouts` | Save layout |
| PUT | `/api/layouts/:id` | Update layout positions |

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `TileGrid` | Main grid container with dnd-kit context |
| `Tile` | Single tile component (logo, title, badges) |
| `TileDragOverlay` | Ghost tile shown while dragging |
| `TileEditor` | Modal for add/edit tile |
| `TileInfoPanel` | Tooltip/popover with tile details |
| `TileSubLinks` | Dropdown menu for sub-links |
| `TileBadge` | Trend/bias indicator badge |
| `EditToolbar` | Floating toolbar (add, edit, remove, done) |
| `TileSkeleton` | Loading placeholder |

---

## Zustand Store (`useTileStore.js`)

```js
{
  tiles: [],               // Current category tiles
  userLayout: null,        // User's custom layout
  isEditMode: false,       // Edit toolbar visible
  isLoading: false,
  draggedTile: null,       // Currently dragging

  // Actions
  fetchTiles(categoryId),
  fetchUserLayout(categoryId),
  addTile(tileData),
  updateTile(tileId, data),
  removeTile(tileId),
  reorderTiles(newOrder),
  saveLayout(),
  toggleEditMode(),
  resizeTile(tileId, size)
}
```

---

## Drag & Drop Implementation

```jsx
// TileGrid.jsx — dnd-kit setup
<DndContext
  sensors={[useSensor(PointerSensor), useSensor(TouchSensor)]}
  collisionDetection={closestCenter}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={tileIds} strategy={rectSortingStrategy}>
    {tiles.map(tile => (
      <SortableTile key={tile._id} tile={tile} />
    ))}
  </SortableContext>
  <DragOverlay>
    {draggedTile && <TileDragOverlay tile={draggedTile} />}
  </DragOverlay>
</DndContext>
```

---

## Tile Sizing

| Size | Grid Cells | Pixel Size (approx) |
|------|-----------|---------------------|
| 1x1 | 1 column, 1 row | 100×100px |
| 2x2 | 2 columns, 2 rows | 210×210px |
| 4x4 | 4 columns, 4 rows | 430×430px |

---

## Default Tiles (Seed Data — per Category)

### News Category
| Title | URL | Logo |
|-------|-----|------|
| CNN | cnn.com | favicon |
| Fox News | foxnews.com | favicon |
| BBC | bbc.com | favicon |
| Reuters | reuters.com | favicon |
| AP News | apnews.com | favicon |

### Technology Category
| Title | URL | Logo |
|-------|-----|------|
| TechCrunch | techcrunch.com | favicon |
| The Verge | theverge.com | favicon |
| Wired | wired.com | favicon |
| Ars Technica | arstechnica.com | favicon |
| GitHub | github.com | favicon |

---

## Implementation Steps

1. Build `Tile` component with all visual elements
2. Build `TileGrid` with CSS grid layout
3. Integrate dnd-kit for drag & drop
4. Build `TileDragOverlay` for drag feedback
5. Build `EditToolbar` with add/edit/remove actions
6. Build `TileEditor` modal (add/edit form)
7. Build `TileInfoPanel` tooltip
8. Build `TileSubLinks` dropdown
9. Build `TileBadge` for trend/bias indicators
10. Create `useTileStore` in Zustand
11. Implement layout save/load (API integration)
12. Add lazy loading with Intersection Observer
13. Implement tile resizing (1x1, 2x2, 4x4)
14. Seed default tiles for each category
15. Test drag & drop on desktop and mobile

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup`, `02-Backend-API`, `04-UI-Design`, `05-Category-System`
- **Required by**: `08-Personalization` (layout customization), `10-Monetization` (sponsored tiles)
