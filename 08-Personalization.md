# 08 — Personalization Engine

## Purpose
Deep personalization system — users control tile layout positioning, background appearance, opacity, multi-page layouts, and settings. Guest data lives in localStorage; authenticated users sync to MongoDB.

---

## Tech Stack

| Tool | Role |
|------|------|
| Zustand | Layout & settings state |
| @dnd-kit | Drag & drop positioning |
| localStorage | Guest persistence |
| MongoDB | User persistence |
| CSS variables | Dynamic theming |

---

## Features

### 8.1 Layout Control
- Drag & drop tile repositioning (via Tile System)
- Save custom tile arrangements per category
- Multiple layouts per category (e.g., "Work", "Personal")
- Reset layout to default
- Copy layout from one category to another

### 8.2 Background Customization
- Solid color picker (brand colors + custom hex)
- Background image upload (future: cloud storage)
- Preset background images (built-in collection)
- Background image URL input

### 8.3 Opacity Control
- Slider: 0% (transparent) to 100% (opaque)
- Applies to tile grid overlay on background image
- Real-time preview as slider moves

### 8.4 Grid Settings
- Column count adjustment (4–12)
- Tile size preference (compact / default / large)
- Tile gap/spacing control
- Show/hide tile labels

### 8.5 Theme Settings
- Light mode (default)
- Dark mode (future)
- Auto (follow system preference — future)

### 8.6 Multi-Page Layouts
- Swipeable or paginated tile pages
- Each page is a separate grid
- Page indicator dots at bottom
- Add/remove pages

---

## Settings Modal Structure

```
┌──────────────────────────────────────────┐
│  ⚙ Settings                        [✕]  │
├──────────────────────────────────────────┤
│  [Layout] [Background] [Grid] [Account]  │
├──────────────────────────────────────────┤
│                                          │
│  Background Tab:                         │
│  ┌──────────────────────────────────┐    │
│  │  Color: [___________] [🎨]       │    │
│  │                                   │    │
│  │  Image:                           │    │
│  │  [Upload] or [Enter URL...]       │    │
│  │                                   │    │
│  │  Presets:                         │    │
│  │  [img1] [img2] [img3] [img4]     │    │
│  │                                   │    │
│  │  Opacity: ──────●──── 80%         │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [Reset to Default]    [Save Settings]   │
└──────────────────────────────────────────┘
```

---

## Persistence Strategy

### Guest User (No Auth)
```
localStorage keys:
  right360_layout_{categorySlug}   → tile positions JSON
  right360_settings                → global settings JSON
  right360_background              → background preferences
  right360_searchEngine            → preferred search engine
```

### Authenticated User
```
MongoDB Layout collection:
  userId + categoryId → tile positions, grid settings, background
  
MongoDB User.preferences:
  theme, defaultCategory, searchEngine
```

### Migration: Guest → User
On registration/login:
1. Read all `right360_*` keys from localStorage
2. POST each layout to `/api/layouts`
3. Update user preferences via `/api/auth/profile`
4. Clear localStorage after successful sync
5. Show "Your settings have been synced" toast

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `SettingsModal` | Main settings dialog with tabs |
| `BackgroundPicker` | Color picker + image upload |
| `OpacitySlider` | Range slider for grid opacity |
| `GridSettings` | Column count, tile size, spacing |
| `LayoutManager` | Switch between saved layouts |
| `PageIndicator` | Dots for multi-page layouts |
| `ThemeToggle` | Light/dark mode switch |
| `ColorPicker` | Custom hex color input with swatches |

---

## Zustand Store (`useLayoutStore.js`)

```js
{
  // Layout state
  currentLayout: null,        // Active layout object
  layouts: [],                // All user layouts
  currentPage: 0,             // Active page index
  
  // Settings
  settings: {
    background: '#F5F7FA',
    backgroundImage: '',
    opacity: 1,
    gridColumns: 8,
    tileSize: 'default',     // 'compact' | 'default' | 'large'
    tileGap: 8,
    showLabels: true,
    theme: 'light'
  },
  
  isSettingsOpen: false,
  
  // Actions
  fetchLayout(categoryId),
  saveLayout(),
  resetLayout(categoryId),
  updateSettings(key, value),
  setBackground(color),
  setBackgroundImage(url),
  setOpacity(value),
  setGridColumns(count),
  openSettings(),
  closeSettings(),
  migrateFromLocalStorage(),   // Guest → user migration
  exportSettings(),            // Download as JSON
  importSettings(json)         // Upload from JSON
}
```

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/layouts/:categoryId` | Yes | Get user layout |
| POST | `/api/layouts` | Yes | Create layout |
| PUT | `/api/layouts/:id` | Yes | Update layout |
| DELETE | `/api/layouts/:id` | Yes | Delete layout |
| PUT | `/api/auth/profile` | Yes | Update preferences |

---

## CSS Dynamic Theming

```css
/* Applied via inline styles or CSS variables */
:root {
  --bg-color: #F5F7FA;
  --bg-image: none;
  --grid-opacity: 1;
  --grid-columns: 8;
  --tile-gap: 8px;
}

.tile-grid-wrapper {
  background-color: var(--bg-color);
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
}

.tile-grid {
  opacity: var(--grid-opacity);
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--tile-gap);
}
```

---

## Preset Backgrounds

| Name | Description |
|------|-------------|
| Solid White | #FFFFFF |
| Light Gray | #F5F7FA |
| Soft Blue | #E8F0FE |
| Dark Navy | #1A1A2E |
| Mountain | Nature landscape |
| Ocean | Beach/ocean view |
| City | Urban skyline |
| Abstract | Gradient pattern |

---

## Implementation Steps

1. Build `SettingsModal` with tab navigation
2. Build `BackgroundPicker` with color input + presets
3. Build `OpacitySlider` component
4. Build `GridSettings` with column/size controls
5. Implement CSS variable theming system
6. Create `useLayoutStore` in Zustand
7. Implement localStorage persistence for guests
8. Implement MongoDB persistence for users
9. Build guest → user migration logic
10. Build `LayoutManager` for switching layouts
11. Build multi-page layout with `PageIndicator`
12. Add real-time preview for all settings changes
13. Test persistence across page reloads
14. Test migration flow (guest → register → verify sync)

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup`, `02-Backend-API`, `03-Authentication`, `04-UI-Design`, `06-Tile-System`
- **Required by**: None directly (this is a user-facing feature layer)
