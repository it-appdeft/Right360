# 07 — Search System

## Purpose
Multi-engine search aggregation layer — users can search across 18 different search engines via a single search bar with engine selector, icon switching, and redirect-based execution.

---

## Tech Stack

| Tool | Role |
|------|------|
| Zustand | Search state & engine preference |
| React Icons | Engine icons |
| localStorage | Guest engine preference |

---

## Features

### 7.1 Search Bar
- Prominent search input in the header
- Auto-focus on page load (optional)
- Search on Enter key press
- Clear button (X icon)
- Responsive width (grows on focus)

### 7.2 Engine Selector
- Dropdown to the left of the search input
- Shows current engine icon + name
- Click to open engine list
- Grouped by category
- Selected engine persists per session

### 7.3 Search Execution
- Redirect-based: opens search results in new tab
- URL pattern: `{engine.searchUrl}{query}`
- Recent searches stored locally (last 10)

### 7.4 Engine Switching
- Click engine icon in dropdown to switch
- Icon updates immediately
- Preference saved (localStorage for guest, DB for user)

---

## 18 Search Engines

| # | Engine | Icon | Search URL |
|---|--------|------|-----------|
| 1 | Google | FaGoogle | `https://www.google.com/search?q=` |
| 2 | Bing | SiBing | `https://www.bing.com/search?q=` |
| 3 | Yahoo | FaYahoo | `https://search.yahoo.com/search?p=` |
| 4 | DuckDuckGo | SiDuckduckgo | `https://duckduckgo.com/?q=` |
| 5 | Brave | SiBrave | `https://search.brave.com/search?q=` |
| 6 | YouTube | FaYoutube | `https://www.youtube.com/results?search_query=` |
| 7 | Amazon | FaAmazon | `https://www.amazon.com/s?k=` |
| 8 | Wikipedia | FaWikipediaW | `https://en.wikipedia.org/wiki/Special:Search?search=` |
| 9 | Reddit | FaReddit | `https://www.reddit.com/search/?q=` |
| 10 | Twitter/X | FaXTwitter | `https://twitter.com/search?q=` |
| 11 | eBay | SiEbay | `https://www.ebay.com/sch/i.html?_nkw=` |
| 12 | Stack Overflow | FaStackOverflow | `https://stackoverflow.com/search?q=` |
| 13 | GitHub | FaGithub | `https://github.com/search?q=` |
| 14 | Pinterest | FaPinterest | `https://www.pinterest.com/search/pins/?q=` |
| 15 | Yandex | SiYandex | `https://yandex.com/search/?text=` |
| 16 | Baidu | SiBaidu | `https://www.baidu.com/s?wd=` |
| 17 | Google Scholar | FaGraduationCap | `https://scholar.google.com/scholar?q=` |
| 18 | Google Maps | FaMapMarkerAlt | `https://www.google.com/maps/search/` |

### Engine Categories
- **General**: Google, Bing, Yahoo, DuckDuckGo, Brave, Yandex, Baidu
- **Video**: YouTube
- **Shopping**: Amazon, eBay
- **Social**: Reddit, Twitter/X, Pinterest
- **Knowledge**: Wikipedia, Stack Overflow, GitHub, Google Scholar
- **Maps**: Google Maps

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `SearchBar` | Main search input with engine icon |
| `EngineSelector` | Dropdown list of 18 engines |
| `EngineIcon` | Renders correct icon for engine |
| `RecentSearches` | Dropdown of last 10 searches |
| `SearchSuggestions` | Auto-complete dropdown (future AI) |

---

## Zustand Store (`useSearchStore.js`)

```js
{
  query: '',                    // Current search text
  selectedEngine: 'google',     // Active engine key
  recentSearches: [],           // Last 10 searches
  isDropdownOpen: false,        // Engine selector open
  
  // Actions
  setQuery(text),
  setEngine(engineKey),
  executeSearch(),              // Redirect to engine URL
  addToRecent(query),
  clearRecent(),
  loadPreference()              // Load from localStorage or DB
}
```

---

## Search Execution Logic

```js
const executeSearch = () => {
  const engine = ENGINES.find(e => e.key === selectedEngine);
  const encodedQuery = encodeURIComponent(query.trim());
  
  if (encodedQuery) {
    // Track search (analytics)
    addToRecent(query);
    
    // Open in new tab
    window.open(`${engine.searchUrl}${encodedQuery}`, '_blank');
  }
};
```

---

## SearchBar Layout

```
┌─────────────────────────────────────────────────┐
│  [G ▼]  │  Search the web...            │  [🔍]  │
└─────────────────────────────────────────────────┘
   ↑ Engine                                  ↑ Submit
   Selector                                  Button

On dropdown open:
┌─────────────────────┐
│  General             │
│  ● Google           │
│  ○ Bing             │
│  ○ DuckDuckGo       │
│  Video               │
│  ○ YouTube          │
│  Shopping             │
│  ○ Amazon           │
│  ...                 │
└─────────────────────┘
```

---

## Search Analytics (Future)

| Data | Storage |
|------|---------|
| Total searches | MongoDB |
| Searches per engine | MongoDB |
| Popular queries | MongoDB |
| User engine preference | User preferences |

---

## Advanced Scope (Future)

- **Per-category engine**: Set preferred engine per category (e.g., YouTube for Entertainment)
- **Smart suggestions**: AI-powered autocomplete
- **Inline results**: Show preview results without redirect
- **Voice search**: Speech-to-text input

---

## Implementation Steps

1. Define engine constants array with all 18 engines
2. Build `SearchBar` component with input + submit
3. Build `EngineSelector` dropdown with grouped engines
4. Build `EngineIcon` component for dynamic icons
5. Implement search execution (redirect to engine URL)
6. Create `useSearchStore` in Zustand
7. Add recent searches (localStorage)
8. Save engine preference (localStorage / user DB)
9. Build `RecentSearches` dropdown
10. Style responsive search bar (shrink on mobile)
11. Add keyboard shortcuts (/ to focus search)
12. Test all 18 engine redirects

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup`, `04-UI-Design`
- **Optional link**: `05-Category-System` (per-category engine preference — future)
