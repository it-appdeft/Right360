# Right360 — Complete User Flow Documentation

---

## Table of Contents

1. [First-Time User Journey](#1-first-time-user-journey)
2. [Authentication Flows](#2-authentication-flows)
3. [Home Dashboard](#3-home-dashboard)
4. [Tile Management](#4-tile-management)
5. [Webmix Management](#5-webmix-management)
6. [Search System](#6-search-system)
7. [Category System](#7-category-system)
8. [Content System](#8-content-system)
9. [Settings & Personalization](#9-settings--personalization)
10. [Widget System](#10-widget-system)
11. [Monetization & Ads](#11-monetization--ads)
12. [Public Webspaces](#12-public-webspaces)
13. [API Reference](#13-api-reference)
14. [State Management](#14-state-management)
15. [Responsive Behavior](#15-responsive-behavior)

---

## 1. First-Time User Journey

### 1.1 Onboarding Wizard (4 Steps)

**Trigger**: First visit — no `right360_onboarding_done` in localStorage

**Step 1 — Choose Webmix Type**
```
User sees two options:
  [Empty]     → "Start fresh and add your own tiles"
  [Prefilled] → "Get handy tiles right from the start"

Action:
  - Click "Empty"     → Skip to Step 3
  - Click "Prefilled" → Go to Step 2
  - Click "I'll do this later" → Skip all, go to Home
```

**Step 2 — Select Webmix Category** (only if Prefilled)
```
User selects from:
  - News         (Daily, News, World, Technology)
  - Popular      (Shopping, Social, Gaming, Music)
  - Education    (School, Science, Learning)
  - Technology   (Dev, AI, Software, Hardware)
  - Entertainment (Movies, Music, Streaming)
  - Finance      (Stocks, Crypto, Banking)

Action:
  - Click category card → Highlighted with green border
  - Click "Save choice" → Go to Step 3
```

**Step 3 — Choose Use Case**
```
User selects how they'll use Right360:
  [Home]      → Orange icon
  [Student]   → Blue icon
  [Classroom] → Purple icon
  [Office]    → Green icon

Action:
  - Click use case → Highlighted
  - Click "Next step" → Go to Step 4
```

**Step 4 — Congratulations**
```
Shows two tips:
  1. "Customize your tiles" — Click Edit to add/remove/rearrange
  2. "Browse the Category Library" — Discover curated collections

Action:
  - Click "Continue to Right360" → Close wizard, show Tour
```

**Data Saved**:
- `localStorage.right360_onboarding_done = 'true'`
- `localStorage.right360_webmixType = 'empty' | 'prefilled'`
- `localStorage.right360_webmix = 'news' | 'popular' | ...`
- `localStorage.right360_useCase = 'home' | 'student' | ...`

---

### 1.2 Welcome Tour (5 Slides)

**Trigger**: After onboarding completes — no `right360_tour_done` in localStorage

```
Slide 1: "Welcome to Right360!"
  → "Save, organize, and share your favorite links in one place"

Slide 2: "Save bookmarks with tiles"
  → "One-click access to websites, Google docs, videos, and more"

Slide 3: "Organize tiles in webmixes"
  → "Create the perfect homepage, limited only by your imagination"

Slide 4: "Customize the look & feel"
  → "Change colors, backgrounds, icons, and much more"

Slide 5: "Share with others"
  → "Easy to share your creations with others"
```

**Navigation**:
- "Skip Tour" (slide 1) or "Previous Slide" (slides 2-5)
- "Next Slide" → advance / "Get started" on last slide
- X button (top right) → close at any time
- Progress dots at bottom

**Data Saved**: `localStorage.right360_tour_done = 'true'`

---

## 2. Authentication Flows

### 2.1 Registration

```
Page: /register

User enters:
  1. Username    (3-30 characters)
  2. Email       (valid email format)
  3. Password    (min 8 characters)
  4. Confirm     (must match password)

Validation:
  - Client-side: Length checks, password match
  - Server-side: express-validator, duplicate check

API: POST /api/auth/register
  Request:  { username, email, password }
  Response: { user, token }

On success:
  → Token stored in localStorage
  → User state set (isAuthenticated = true)
  → Redirect to Home (/)
  → Guest localStorage data can be migrated
```

### 2.2 Login

```
Page: /login

User enters:
  1. Email
  2. Password

API: POST /api/auth/login
  Request:  { email, password }
  Response: { user, token }

On success:
  → Token stored in localStorage
  → Redirect to Home (/)

On failure:
  → Error message: "Invalid email or password"

Additional options:
  - "Forgot your password?" → /forgot-password
  - "Continue with Google" → Google OAuth flow
  - "Create one" → /register
```

### 2.3 Google OAuth

```
Page: /login (button at bottom)

Flow:
  1. User clicks "Continue with Google"
  2. Client sends Google profile data to server
  3. Server creates/finds user by email

API: POST /api/auth/google
  Request:  { email, name, googleId, avatar }
  Response: { user, token }

Backend logic:
  - Existing user with email → Login + link Google ID
  - New user → Create account with auto-generated username
```

### 2.4 Password Recovery

```
Page: /forgot-password

Step 1 — Request Reset:
  1. User enters email
  2. API: POST /api/auth/forgot-password
  3. Server generates reset token (SHA-256 hash)
  4. Token expires in 1 hour
  5. Shows "Check your email" message
  (Dev mode: returns reset URL directly)

Step 2 — Reset Password:
  Page: /reset-password/:token

  1. User enters new password + confirm
  2. API: POST /api/auth/reset-password
     Request: { token, password }
  3. Server verifies token + expiry
  4. Password updated, token cleared
  5. Auto-login with new JWT
  6. Redirect to Home
```

### 2.5 Logout

```
Trigger: Click "Sign Out" in user dropdown menu (Header)

Actions:
  → localStorage.removeItem('token')
  → Clear user state
  → Set isGuest = true
  → Navigate to Home (/)
```

### 2.6 Auto-Login on App Start

```
Trigger: App mounts (every page load)

Flow:
  1. Check localStorage for 'token'
  2. If token exists → GET /api/auth/me
     - Success → Set user state, isAuthenticated = true
     - 401 error → Clear token, set isGuest = true
  3. If no token → Set isGuest = true
```

---

## 3. Home Dashboard

### 3.1 Page Layout

```
┌─ Header (dark nav bar) ──────────────────────────────────┐
│  [Logo]  [🏠 Homepage] [News] [Tech] [Sports] ... [+ Add]│
├──────────────────────────────────────────────────────────┤
│ [CTA Banner - guests only]                                │
│ [Webmix Tabs: My Webmix | Tab2 | + ] [⚙ Edit Webmixes]  │
│ [News Carousel: 3 large image cards with pagination]      │
├─────────┬─────────────────────────────┬──────────────────┤
│ Left    │ Center                       │ Right            │
│ (lg+)   │                              │ (xl+)            │
│         │ [Google Search] [Weather]    │                  │
│ [News   │                              │ [Sponsored Ad 1] │
│  Feed   │ [Tile Grid]                  │ [Sponsored Ad 2] │
│  Widget]│ [🟡][🔴][🟢][🔵][🟣][🟠]   │ [Stocks Widget]  │
│         │ [🟢][🔴][🟡][🔵][🟣][🟠]   │                  │
│         │         [+ Add Tile]         │                  │
└─────────┴─────────────────────────────┴──────────────────┘
```

### 3.2 On Page Load

```
1. fetchCategories()       → GET /api/categories
2. fetchWebmixes()         → GET /api/webmixes (or localStorage)
3. Load first category     → Display its tiles in grid
4. Load panel ads          → GET /api/ads/panel
5. News carousel fetches   → RSS-to-JSON proxy
6. Weather widget fetches  → wttr.in API
7. Stocks widget starts    → Simulated data with 10s refresh
```

### 3.3 CTA Banner (Guests Only)

```
Shown when: isAuthenticated === false AND not dismissed

Content:
  "Create your personal Right360"
  "Create and customize your own Webmixes, manage all resources..."
  [Close] [Learn more → /register]

Dismiss: Click Close or X → localStorage.right360_cta_dismissed = 'true'
```

---

## 4. Tile Management

### 4.1 Viewing Tiles (Default Mode)

```
Tile displays:
  - Colored background (auto-generated or custom)
  - Logo (favicon from Google API or first letter fallback)
  - Title (truncated)
  - Subtitle (if set, truncated)
  - Trend badge: 🔥 Hot | ⭐ New | ⚡ Trending (top-right)
  - Bias indicator: ⚖️ + label (top-left)
  - "AD" badge for sponsored tiles
  - Sub-links arrow (bottom-right, on hover)
  - Info icon (bottom-left, on hover)

Click tile → Opens URL in new tab
Right-click tile → Context menu
Hover → Scale up + shadow + external link icon
```

### 4.2 Context Menu (Right-Click)

```
Trigger: Right-click on any tile

Options:
  1. Open Link        → window.open(tile.url, '_blank')
  2. Copy URL         → navigator.clipboard.writeText(tile.url)
  ─── divider ───
  3. Edit Tile        → Opens TileEditor modal
  4. Delete Tile      → Removes tile immediately (API + state)

Dismiss: Click anywhere outside menu
```

### 4.3 Edit Mode

```
Trigger: Click "Edit" button (top-right of tile grid)

Changes:
  - Tiles show dashed ring border
  - Hover shows "Click to edit" overlay
  - Drag-and-drop enabled (dnd-kit)
  - "Add Tile" button (+) appears at grid end
  - "Add Tile" button appears in toolbar

Click tile in edit mode → Opens TileEditor
Drag tile → Reorder in grid (visual feedback: opacity + scale)

Exit: Click "Save & Done"
  → Saves layout to MongoDB (authenticated) or localStorage (guest)
  → Shows "Layout saved!" toast
```

### 4.4 Add/Edit Tile Modal

```
Trigger:
  - Click "Add Tile" button (edit mode)
  - Click existing tile (edit mode)
  - Right-click → "Edit Tile"

Fields:
  ┌─────────────────────────────────────┐
  │ Title *        [e.g. Google]        │
  │ URL *          [https://google.com] │
  │ Logo URL       [auto-detected]      │
  │ Subtitle       [Search engine]      │
  │                                     │
  │ Tile Color:                         │
  │ [🟡][🔴][🟢][🔵][🟣][🟠]...       │
  │                                     │
  │ Tile Size:  [1x1] [2x2] [4x4]      │
  │                                     │
  │ Info Panel:    [tooltip text]       │
  │ Trend Badge:   [none|hot|new|trend] │
  │                                     │
  │ Sub-links:                          │
  │   Link 1: [title] [url] [x]        │
  │   [+ Add sub-link]                  │
  │                                     │
  │ Bias Indicator: [e.g. Conservative] │
  │                                     │
  │ Preview:  [🔵 G google.com]        │
  │                                     │
  │ [Delete]           [Cancel] [Save]  │
  └─────────────────────────────────────┘

Auto-behaviors:
  - Entering URL → Auto-fetches favicon as logo
  - URL without https:// → Auto-prepends

Validation:
  - Title required
  - URL required

API calls:
  - New tile:  POST /api/tiles
  - Edit tile: PUT /api/tiles/:id
  - Delete:    DELETE /api/tiles/:id

Toast: "Tile added!" / "Tile updated!" / "Tile removed"
```

### 4.5 Tile Intelligence Features

```
Info Panel:
  - Trigger: Click ℹ️ icon (bottom-left, hover to reveal)
  - Shows: Popup below tile with title + description + bias

Sub-links Menu:
  - Trigger: Click ▼ icon (bottom-right, hover to reveal)
  - Shows: Dropdown with clickable sub-link list
  - Each sub-link opens in new tab

Bias Indicator:
  - Shows: ⚖️ icon + label (e.g. "Conservative") on tile face
  - Position: Top-left corner

Trend Badges:
  - 🔥 Hot / ⭐ New / ⚡ Trending
  - Position: Top-right corner
  - Semi-transparent dark background
```

### 4.6 Tile Layout Persistence

```
Guest user:
  - Layout order saved to localStorage
  - Key: right360_layout_{categoryId}

Authenticated user:
  - On "Save & Done": POST /api/layouts
  - Payload: { categoryId, tiles: [{ tileId, position, size }] }
  - On load: GET /api/layouts/:categoryId
  - Tiles reordered according to saved positions
```

---

## 5. Webmix Management

### 5.1 Webmix Tabs

```
Location: Top of Home page, below header

Display:
  [🏠 My Webmix] [📋 Tab 2] [🔖 Tab 3] [+]  [⚙ Edit Webmixes]

Each tab shows:
  - Emoji icon
  - Name (truncated to 80px)
  - 🌐 globe icon if public

Click tab → Switch active webmix
Click [+]  → Open Add Webmix modal
Click [⚙]  → Open Webmix Sidebar
```

### 5.2 Add Webmix Modal

```
Trigger: Click [+] in webmix tabs

┌─────────────────────────────────────────────┐
│            Add a webmix                      │
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │  [Grid icon]  │  │   [Colorful tiles]   │ │
│  │  Empty Webmix │  │  Search for existing │ │
│  │               │  │                      │ │
│  │  [Name input] │  │  [Search input]      │ │
│  │  [✓ Add]      │  │  Tags: Education,    │ │
│  │               │  │  Math, Reading...    │ │
│  │               │  │  [🔍 Search]         │ │
│  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────┘

Option 1 — Empty Webmix:
  1. Click "Add an empty webmix" card
  2. Enter name
  3. Click "Add"
  4. API: POST /api/webmixes { name, icon: '📋' }
  5. New webmix appears in tabs as active

Option 2 — Search Existing:
  1. Click "Search for an existing webmix" card
  2. Type search query or click suggested tag
  3. Browse results
  4. Click to add

Guest behavior: Webmix saved to localStorage only
```

### 5.3 Webmix Sidebar Panel

```
Trigger: Click "⚙ Edit Webmixes"

┌──────────────────────────┐
│ 🟣 My Webmix             │ ← Purple gradient header
│ Last updated: just now    │
├──────────────────────────┤
│ WEBMIX CONTENT            │
│                           │
│ 🟢 Add Tiles              │ → Enables edit mode
│    Add from URL or        │
│    collection             │
│                           │
│ 🟠 Customize Tiles        │ → Enables edit mode
│    Edit colors and        │
│    appearance             │
│                           │
│ 🔵 Markers                │ → Mark with labels
│    Mark Tiles with        │
│    labels & colors        │
│                           │
│ 🟣 Groups                 │ → Group tiles
│    Group Tiles together   │
│                           │
│ 🔴 Learning Paths         │ → Create paths
│    Create a Learning      │
│    Path and add steps     │
├──────────────────────────┤
│ WEBMIX CUSTOMIZATION      │
│                           │
│ 🟠 General                │ → /settings
│    Set name, color, icon  │
│                           │
│ 🟢 Background             │ → /settings
│    Pick a background      │
├──────────────────────────┤
│ VISIBILITY                 │
│                           │
│ 🔒 Private                │ → Toggle to 🌐 Public
│    Only visible to you    │
│                           │
└──────────────────────────┘

Dismiss: Click backdrop or X button
```

---

## 6. Search System

### 6.1 Embedded Search (Home Page)

```
Location: Center column, above tile grid

┌──────────────────────────────────────┐
│  [G ▼] Google                        │
│                                      │
│  [Search the web...          ] [🔍]  │
└──────────────────────────────────────┘

Components:
  - Engine label + dropdown
  - Search input
  - Submit button
```

### 6.2 Engine Selection

```
Click engine label → Opens dropdown

Grouped by category:
  General:    Google, Bing, Yahoo, DuckDuckGo, Brave
  Video:      YouTube
  Shopping:   Amazon, eBay
  Social:     Reddit, X (Twitter), Pinterest
  Knowledge:  Wikipedia, Stack Overflow, GitHub, Google Scholar
  Maps:       Google Maps

Click engine → Closes dropdown, updates icon + label
Persisted: localStorage.right360_searchEngine
```

### 6.3 Search Execution

```
1. User types query in input
2. Press Enter or click 🔍 button
3. Query trimmed + URL-encoded
4. Opens new tab: {engine.searchUrl}{encodedQuery}
5. Query added to recent searches (max 10)

Example: "react hooks" on Google
  → Opens: https://www.google.com/search?q=react%20hooks
```

### 6.4 Recent Searches

```
Trigger: Focus search input (when recent searches exist)

┌──────────────────────┐
│ RECENT         Clear  │
│ 🕐 react hooks        │
│ 🕐 tailwind css       │
│ 🕐 mongodb tutorial   │
└──────────────────────┘

Click item → Set query + execute search
Click "Clear" → Remove all recent searches
Storage: localStorage.right360_recentSearches (JSON array)
```

### 6.5 Keyboard Shortcut

```
Press "/" key → Focus search input (when not in another input)
```

---

## 7. Category System

### 7.1 Category Directory (/categories)

```
Display: Grid of category cards (2-5 columns responsive)

Each card:
  ┌──────────────┐
  │   [🔵 Icon]   │
  │   Category    │
  │   3 subcats   │
  └──────────────┘

10 Default Categories:
  📰 News        💻 Technology   ⚽ Sports
  🎬 Entertainment  📈 Finance   🛒 Shopping
  # Social Media    🎓 Education  ❤️ Health
  ✈️ Travel

Click card → Navigate to /category/:slug
```

### 7.2 Category Page (/category/:slug)

```
Layout:
  [Breadcrumb: Home > Categories > Technology]
  [Tabs: Start Page | Perspective | Info]

  Start Page tab:
    [Embedded Search]
    [Tile Grid for this category]

  Perspective tab:
    [Article with perspective badge]
    [e.g. "Conservative Perspective"]

  Info tab:
    [Informational article]
    [Neutral, fact-based content]

Right sidebar: Sponsored ads
```

### 7.3 Header Category Tabs

```
Shows first 6 categories as quick-access tabs:
  [🏠 Homepage] [📰 News] [💻 Technology] [⚽ Sports] ... [More ▸]

Active tab: White text + blue bottom border + bg highlight
Click tab → Navigate to /category/:slug
Click "More" → Navigate to /categories
```

---

## 8. Content System

### 8.1 Article View

```
Displays when user clicks "Perspective" or "Info" tab

Article layout:
  [Perspective Badge: "Conservative Perspective"]  ← only for perspective type
  [Cover Image]
  [Title]
  [Meta: 👤 Author  🕐 Date  👁 Views]
  [Summary quote - italic, blue left border]
  [Article HTML content]
  [Tags: #politics #tech]

API: GET /api/articles/category/:categoryId/perspective
     GET /api/articles/category/:categoryId/info

Empty state: "No perspective article available for this category yet."
```

---

## 9. Settings & Personalization

### 9.1 Settings Page (/settings)

```
Three tabs: [Background] [Grid] [Account]
[Reset All] button (top-right)
```

### 9.2 Background Tab

```
Background Color:
  [10 preset swatches] + [Color picker] + [Hex input]
  Presets: #F5F7FA, #FFFFFF, #E8F0FE, #FEF3E2, #F0FDF4,
           #FDF2F8, #1A1A2E, #0F172A, #1E293B, #374151

Background Image URL:
  [Text input: https://example.com/image.jpg]
  [Preview thumbnail] [Remove button]

Grid Opacity:
  [Slider: 0% ──────●── 100%]
  Controls tile grid transparency over background image
```

### 9.3 Grid Tab

```
Grid Columns:
  [Slider: 4 ──────●── 12]  (default: 8)

Tile Size:
  [compact] [default] [large]

Tile Spacing:
  [Slider: 4px ──────●── 24px]  (default: 12px)

Show Tile Labels:
  [Toggle switch: ON/OFF]
```

### 9.4 Account Tab

```
Authenticated:
  [Avatar circle: first letter]
  Username
  Email
  "Member since [date]"

Guest:
  "You're browsing as a guest."
  "Sign in to sync your settings across devices."
```

### 9.5 Persistence

```
All settings saved to: localStorage.right360_settings

Default settings:
  background: '#1a1a2e'
  backgroundImage: 'https://images.unsplash.com/photo-1506905925346...'
  opacity: 1
  gridColumns: 8
  tileSize: 'default'
  tileGap: 12
  showLabels: true
  theme: 'light'

Applied in App.jsx:
  - background/image → page background style
  - opacity → main content area opacity
```

---

## 10. Widget System

### 10.1 Weather Widget

```
Location: Home page, next to search bar (hidden on <md)

Data source: https://wttr.in/?format=j1 (free, no API key)

Display:
  ┌──────────────────────────┐
  │ 📍 City, Region          │
  │ 72°F  (22°C)     ☁️      │
  │ Partly Cloudy            │
  │ 🌡 Feels 70°F  💧 65%  💨 8mph │
  └──────────────────────────┘

Blue gradient background
Auto-fetches on component mount
```

### 10.2 News Feed Widget

```
Location: Home page, left sidebar (hidden on <lg)

Data source: RSS-to-JSON proxy (rss2json.com)
Feeds: NYTimes HomePage, TechCrunch, NYTimes World

Display:
  ┌──────────────────────────┐
  │ 📰 News feeds        [▼] │ ← Collapsible header
  ├──────────────────────────┤
  │ [Top News] [Tech] [World]│ ← Category tabs
  ├──────────────────────────┤
  │ [thumb] Article title    │
  │         Source · 2h ago  │
  │ [thumb] Article title    │
  │         Source · 5h ago  │
  │ ...                      │
  ├──────────────────────────┤
  │       Learn more ↗       │
  └──────────────────────────┘

Features:
  - Click article → Opens in new tab
  - Click tab → Switch news category
  - 🔄 Refresh button
  - Collapsible with ▼ header
  - Max height with scroll
```

### 10.3 News Carousel

```
Location: Home page, below webmix tabs

Display: 3 large image news cards in a row

  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ [Image]  │ │ [Image]  │ │ [Image]  │
  │          │ │          │ │          │
  │ Title... │ │ Title... │ │ Title... │
  │ Src · 3h │ │ Src · 1h │ │ Src · 5h │
  └──────────┘ └──────────┘ └──────────┘
         [● ○ ○] ← Pagination dots

Navigation:
  - [◀] [▶] arrows on sides
  - Dots: Click to jump to page
  - 3 articles per page, max 9 total

Click card → Opens article in new tab
Gradient overlay: bottom black for text readability
```

### 10.4 Stocks Widget

```
Location: Home page, right sidebar (hidden on <xl)

Display:
  ┌──────────────────────────┐
  │ 📈 Markets               │
  │                          │
  │ AAPL   Apple    $198.45  │
  │                 ▲ +2.31  │
  │ GOOGL  Alphabet $171.82  │
  │                 ▼ -0.96  │
  │ MSFT   Microsoft $428.15 │
  │                 ▲ +5.20  │
  │ AMZN   Amazon   $186.49  │
  │                 ▲ +1.87  │
  │ TSLA   Tesla    $245.30  │
  │                 ▼ -3.15  │
  │ NVDA   NVIDIA   $875.28  │
  │                 ▲ +12.45 │
  └──────────────────────────┘

Auto-updates: Minor simulated price changes every 10 seconds
Green ▲ for positive, Red ▼ for negative
```

---

## 11. Monetization & Ads

### 11.1 Sponsored Sidebar

```
Location: Home + Category pages, right sidebar (hidden on <xl)

Display: 1-3 ad cards stacked vertically

Each ad card:
  ┌──────────────────┐
  │ [Image or        │
  │  Gradient BG]    │
  │  Ad Title        │
  │  Advertiser      │
  │         Sponsored│
  └──────────────────┘

Click → trackClick(adId) + open ad link in new tab

Placeholder ads shown when no real ads exist:
  - "Transform your productivity" (blue gradient)
  - "Discover new websites daily" (orange gradient)
```

### 11.2 Sponsored Tiles

```
Display: Within tile grid, marked with "AD" badge
  - Orange left border (ring-2 ring-brand-orange)
  - "AD" text badge (top-left, semi-transparent)
  - Otherwise behaves like normal tiles

Click → Opens advertiser URL
```

### 11.3 Ad Tracking

```
Impression Tracking:
  - Tracked when ad becomes visible
  - Uses IntersectionObserver (threshold: 0.5)
  - API: POST /api/ads/:id/impression
  - Each ad tracked only once per session

Click Tracking:
  - Tracked on ad click
  - API: POST /api/ads/:id/click
  - Opens ad link in new tab after tracking

Panel Ad Rotation:
  - Rotates every 30 seconds
  - Cycles through available panel ads
```

---

## 12. Public Webspaces

### 12.1 Webspaces Page (/webspaces)

```
Trigger: Click "+ Add a Public Webspace" (green button in header tabs)

Layout:
  ┌──────────────────────────────────────────┐
  │    Add a Public Webspace                  │
  │    Public Webspaces contain internet      │
  │    resources and pre-selected content     │
  │                                           │
  │    [🔍 Search webspaces...]               │
  ├──────────────────────────────────────────┤
  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
  │  │[Image]  │  │[Image]  │  │[Image]  │  │
  │  │💼       │  │🤖       │  │🌍       │  │
  │  │Business │  │AI Tools │  │World    │  │
  │  │Tools    │  │         │  │News     │  │
  │  │         │  │Top AI   │  │Stay     │  │
  │  │Essential│  │tools... │  │informed │  │
  │  │business │  │         │  │with...  │  │
  │  │         │  │[AI][Tech]│  │[News]   │  │
  │  │[+ Add]  │  │[+ Add]  │  │[+ Add]  │  │
  │  └─────────┘  └─────────┘  └─────────┘  │
  │  ┌─────────┐  ┌─────────┐  ...          │
  │  │📚 Edu   │  │🔍 Disc  │               │
  │  └─────────┘  └─────────┘               │
  └──────────────────────────────────────────┘

12 Seeded Public Webmixes:
  💼 Business Tools
  🤖 Artificial Intelligence Tools
  🌍 World News
  📚 Education
  🔍 Discovery Zone
  📱 Social Media Hub
  💻 Coding & Development
  💪 Health & Fitness
  📜 Periodic Tables of History
  🎬 Streaming & Entertainment
  📈 Finance & Investing
  ✈️ Travel Planning

Each card shows:
  - Cover image (Unsplash)
  - Emoji icon overlay
  - Name
  - Description (3-line clamp)
  - Tags
  - [+ Add to My Webmixes] button

Click "Add" → Creates copy in user's webmixes
Search → Filters by name, tags, and description
```

---

## 13. API Reference

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/google` | No | Google OAuth |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Reset password |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile |

### Tiles
| Method | Route | Auth | Cache | Description |
|--------|-------|------|-------|-------------|
| GET | `/api/tiles` | No | 30m | All default tiles |
| GET | `/api/tiles/category/:categoryId` | No | 30m | Tiles by category |
| GET | `/api/tiles/:id` | No | 15m | Single tile |
| POST | `/api/tiles` | Yes | Invalidate | Create tile |
| PUT | `/api/tiles/:id` | Yes | Invalidate | Update tile |
| DELETE | `/api/tiles/:id` | Yes | Invalidate | Delete tile |

### Categories
| Method | Route | Auth | Cache | Description |
|--------|-------|------|-------|-------------|
| GET | `/api/categories` | No | 1hr | All categories |
| GET | `/api/categories/:id` | No | 30m | Single category |
| GET | `/api/categories/slug/:slug` | No | 30m | Category by slug |
| POST | `/api/categories` | Admin | Invalidate | Create category |
| PUT | `/api/categories/:id` | Admin | Invalidate | Update category |
| DELETE | `/api/categories/:id` | Admin | Invalidate | Delete category |

### Layouts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/layouts/:categoryId` | Yes | User layout for category |
| POST | `/api/layouts` | Yes | Save/create layout |
| PUT | `/api/layouts/:id` | Yes | Update layout |
| DELETE | `/api/layouts/:id` | Yes | Delete layout |

### Webmixes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/webmixes` | Yes | User's webmixes |
| GET | `/api/webmixes/public` | No | Browse public webmixes |
| GET | `/api/webmixes/search?q=` | No | Search webmixes |
| GET | `/api/webmixes/:id` | Optional | Single webmix |
| POST | `/api/webmixes` | Yes | Create webmix |
| PUT | `/api/webmixes/:id` | Yes | Update webmix |
| DELETE | `/api/webmixes/:id` | Yes | Delete webmix |

### Articles
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/articles/category/:id` | No | Articles for category |
| GET | `/api/articles/category/:id/perspective` | No | Perspective article |
| GET | `/api/articles/category/:id/info` | No | Info article |
| GET | `/api/articles/:id` | No | Single article |
| POST | `/api/articles` | Admin | Create article |
| PUT | `/api/articles/:id` | Admin | Update article |
| DELETE | `/api/articles/:id` | Admin | Delete article |

### Ads
| Method | Route | Auth | Cache | Description |
|--------|-------|------|-------|-------------|
| GET | `/api/ads` | No | 15m | Active ads |
| GET | `/api/ads/panel` | No | 15m | Panel ads |
| GET | `/api/ads/tiles` | No | 15m | Tile ads |
| GET | `/api/ads/category/:id` | No | 15m | Category ads |
| POST | `/api/ads/:id/impression` | No | - | Track view |
| POST | `/api/ads/:id/click` | No | - | Track click |
| POST | `/api/ads` | Admin | Invalidate | Create ad |
| PUT | `/api/ads/:id` | Admin | Invalidate | Update ad |
| DELETE | `/api/ads/:id` | Admin | Invalidate | Delete ad |

### Utility
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |

---

## 14. State Management

All stores use **Zustand**. Here's the state shape for each:

### useAuthStore
```
user, token, isAuthenticated, isGuest, isLoading, error
Actions: login, register, logout, loadUser, updateProfile, clearError
```

### useTileStore
```
tiles, userLayout, isLoading, isEditMode, error
Actions: fetchTiles, reorderTiles, saveLayout, toggleEditMode, addTile, removeTile, clearTiles
```

### useWebmixStore
```
webmixes, activeWebmix, isLoading, isSidebarOpen
Actions: fetchWebmixes, setActiveWebmix, createWebmix, updateWebmix, deleteWebmix, toggleSidebar, closeSidebar
```

### useCategoryStore
```
categories, activeCategory, activeTab, isLoading, error
Actions: fetchCategories, setActiveCategory, setActiveTab, getCategoryBySlug, fetchCategoryBySlug
```

### useSearchStore
```
query, selectedEngine, recentSearches, isDropdownOpen
Actions: setQuery, setEngine, toggleDropdown, closeDropdown, executeSearch, addToRecent, clearRecent
```

### useLayoutStore
```
settings (background, backgroundImage, opacity, gridColumns, tileSize, tileGap, showLabels, theme)
isSettingsOpen, activeSettingsTab
Actions: updateSetting, setBackground, setBackgroundImage, setOpacity, setGridColumns, resetSettings
```

### useContentStore
```
articles, currentArticle, isLoading, error
Actions: fetchArticle, clearArticle
```

### useAdStore
```
panelAds, tileAds, currentPanelAd, isLoading
Actions: fetchPanelAds, fetchTileAds, rotateAd, trackImpression, trackClick
```

---

## 15. Responsive Behavior

| Breakpoint | Width | Visible Elements |
|------------|-------|-----------------|
| Mobile | < 640px | Header (compact), tile grid (4 cols), search |
| Tablet | 640-1024px | + Left sidebar icons, 5-col grid, weather widget |
| Desktop | 1024-1280px | + News feed (left), 6-col grid |
| Wide | > 1280px | + Sponsored sidebar (right), stocks widget |

### Hidden on Mobile
- Left icon sidebar
- News feed widget
- Weather widget
- Sponsored sidebar
- Stocks widget
- "sm:inline" text labels

### Always Visible
- Header with category tabs
- Tile grid (4+ columns)
- Embedded search
- All modals/overlays
