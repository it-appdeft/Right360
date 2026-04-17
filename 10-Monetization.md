# 10 — Monetization System

## Purpose
Revenue generation layer — sponsored tiles, sponsored ad panels, dynamic ad rotation, affiliate link tracking, CPC/CPM analytics, and category-targeted advertising.

---

## Tech Stack

| Tool | Role |
|------|------|
| React | Ad components |
| Zustand | Ad state management |
| MongoDB | Ad storage & analytics |
| Intersection Observer | Impression tracking |
| UUID | Click tracking IDs |

---

## Features

### 10.1 Sponsored Panel
- Banner-style ad panel above or beside the tile grid
- Full-width on desktop, stacked on mobile
- Rotating ads (carousel or timed rotation)
- Click-through to advertiser URL
- "Sponsored" label clearly visible

### 10.2 Sponsored Tiles
- Tiles marked as sponsored within the grid
- Subtle visual distinction (brand-orange left border or "Ad" badge)
- Blend with regular tiles for native ad experience
- Clickable → opens advertiser URL
- Positioned by priority score

### 10.3 Dynamic Ad Rotation
- Rotate ads based on:
  - Time interval (every 30 seconds)
  - Page refresh
  - Category change
- Priority-based: higher priority ads shown more often
- Date-based: respect start/end dates

### 10.4 Category Targeting
- Ads assigned to specific categories
- General ads show on all categories (categoryId = null)
- Category-specific ads show only on matching pages

### 10.5 Affiliate Tracking
- Affiliate links with tracking parameters
- Click tracking (increment click count)
- Impression tracking (increment on view)
- UTM parameter support

---

## Database Schema

Uses `Ad` model from `02-Backend-API.md`:

```js
{
  title:       String,           // "Best VPN Service"
  image:       String,           // Banner/tile image URL
  link:        String,           // Click-through URL
  categoryId:  ObjectId | null,  // null = show everywhere
  type:        'panel' | 'tile', // Ad format
  priority:    Number,           // Higher = shown more (0-100)
  isActive:    Boolean,          // Enable/disable
  impressions: Number,           // View count
  clicks:      Number,           // Click count
  ctr:         Number,           // Click-through rate (calculated)
  costModel:   'cpc' | 'cpm',   // Cost per click / per mille
  costValue:   Number,           // Rate in cents
  advertiser:  String,           // Advertiser name
  startDate:   Date,             // Campaign start
  endDate:     Date,             // Campaign end
  createdAt:   Date
}
```

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/ads` | No | Get active ads (general) |
| GET | `/api/ads/category/:categoryId` | No | Get ads for category |
| GET | `/api/ads/panel` | No | Get panel-type ads |
| GET | `/api/ads/tiles` | No | Get tile-type ads |
| POST | `/api/ads/:id/impression` | No | Track impression |
| POST | `/api/ads/:id/click` | No | Track click |
| GET | `/api/ads/:id/stats` | Admin | Get ad analytics |
| POST | `/api/ads` | Admin | Create ad |
| PUT | `/api/ads/:id` | Admin | Update ad |
| DELETE | `/api/ads/:id` | Admin | Delete ad |

### Active Ad Query Logic
```js
// Only return ads that are:
// 1. isActive === true
// 2. startDate <= now <= endDate (or no date restriction)
// 3. Sorted by priority (descending)
// 4. Filtered by categoryId (if provided) OR categoryId is null
```

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `SponsoredPanel` | Full-width banner ad above tile grid |
| `SponsoredTile` | Ad tile blended into tile grid |
| `AdBadge` | Small "Sponsored" or "Ad" label |
| `AdCarousel` | Rotating panel ads (auto-advance) |
| `AdWrapper` | HOC that handles impression/click tracking |

---

## Zustand Store (`useAdStore.js`)

```js
{
  panelAds: [],              // Panel-type ads
  tileAds: [],               // Tile-type ads for current category
  currentPanelAd: null,      // Currently displayed panel ad
  rotationIndex: 0,          // Current ad in rotation
  
  // Actions
  fetchAds(categoryId),
  fetchPanelAds(),
  fetchTileAds(categoryId),
  trackImpression(adId),
  trackClick(adId),
  rotateAd(),                // Next ad in rotation
  startRotation(interval),   // Auto-rotate every N seconds
  stopRotation()
}
```

---

## Impression & Click Tracking

### Impression Tracking (View)
```jsx
// Uses Intersection Observer
const AdWrapper = ({ ad, children }) => {
  const ref = useRef();
  const tracked = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !tracked.current) {
        tracked.current = true;
        trackImpression(ad._id);  // POST /api/ads/:id/impression
      }
    }, { threshold: 0.5 });
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return <div ref={ref}>{children}</div>;
};
```

### Click Tracking
```jsx
const handleAdClick = (ad) => {
  trackClick(ad._id);  // POST /api/ads/:id/click
  window.open(ad.link, '_blank');
};
```

---

## Ad Placement Strategy

```
Page Layout with Ads:
┌──────────────────────────────────────────────┐
│  Header                                       │
├──────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐     │
│  │  Sponsored Panel (rotating banner)    │     │
│  │  [Ad Image]  Title  "Sponsored"  →   │     │
│  └──────────────────────────────────────┘     │
├──────────────────────────────────────────────┤
│  Tile Grid                                    │
│  ┌───┬───┬───┬───┬───┬───┬───┬───┐          │
│  │   │   │ Ad│   │   │   │   │   │          │
│  ├───┼───┼───┼───┼───┼───┼───┼───┤          │
│  │   │   │   │   │   │ Ad│   │   │          │
│  └───┴───┴───┴───┴───┴───┴───┴───┘          │
│         ↑ Sponsored tiles blend in            │
└──────────────────────────────────────────────┘
```

### Sponsored Tile Positions
- Insert at fixed positions: slot 3, slot 14 (configurable)
- Max 2 sponsored tiles per grid page
- Visually distinct but not intrusive

---

## Ad Rotation Logic

```js
// Panel ad rotation every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    rotateAd();
  }, 30000);
  
  return () => clearInterval(interval);
}, [panelAds]);

const rotateAd = () => {
  // Weighted by priority
  const weightedAds = panelAds.flatMap(ad => 
    Array(ad.priority).fill(ad)
  );
  const next = weightedAds[Math.floor(Math.random() * weightedAds.length)];
  setCurrentPanelAd(next);
};
```

---

## Analytics Dashboard (Admin — Future)

| Metric | Description |
|--------|-------------|
| Total Impressions | How many times ad was viewed |
| Total Clicks | How many times ad was clicked |
| CTR | clicks / impressions × 100 |
| Revenue | clicks × CPC or impressions/1000 × CPM |
| Top Performing | Ads sorted by CTR |
| By Category | Performance per category |

---

## Seed Ads (Examples)

| Title | Type | Category | Priority |
|-------|------|----------|----------|
| Best VPN 2026 | panel | Technology | 80 |
| Top News App | tile | News | 60 |
| Investment Platform | panel | Finance | 90 |
| Streaming Deal | tile | Entertainment | 70 |
| Travel Deals | panel | Travel | 50 |

---

## Implementation Steps

1. Create `Ad` model in backend
2. Build ad CRUD endpoints (admin)
3. Build impression/click tracking endpoints
4. Build `SponsoredPanel` component with image + link
5. Build `AdCarousel` with auto-rotation
6. Build `SponsoredTile` component with "Ad" badge
7. Build `AdWrapper` HOC with Intersection Observer
8. Create `useAdStore` in Zustand
9. Integrate sponsored tiles into `TileGrid`
10. Integrate `SponsoredPanel` above tile grid
11. Implement category-based ad targeting
12. Implement priority-weighted rotation
13. Seed sample ads for testing
14. Test impression/click tracking accuracy
15. Verify ads respect start/end dates

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup`, `02-Backend-API`, `04-UI-Design`, `05-Category-System`, `06-Tile-System`
- **Required by**: None (top-level revenue feature)
