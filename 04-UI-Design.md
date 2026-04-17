# 04 — UI Design System

## Purpose
Define the complete visual design system for Right360 — brand colors (from logo), typography, spacing, component library, responsive breakpoints, layout structure, and Tailwind CSS configuration.

---

## Brand Colors (Extracted from logo.png)

Each letter/number in the Right360 logo has a distinct color circle:

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| R | Red | `#D94444` | Primary CTA, alerts, destructive actions |
| I | Olive Green | `#6B9E3A` | Success states, positive indicators |
| G | Purple | `#7B5EA7` | Secondary accent, categories |
| H | Gray | `#7A7A7A` | Neutral text, borders, disabled |
| T | Green | `#4CAF50` | Success, active states |
| 3 | Orange | `#E8842A` | Warnings, highlights, trending |
| 6 | Blue | `#3F8ECF` | Links, info, primary actions |
| 0 | Brown | `#A0522D` | Tertiary, earthy accents |

### Design Palette

```
Primary:     #3F8ECF (Blue — main brand action color)
Secondary:   #7B5EA7 (Purple — secondary highlights)
Accent:      #E8842A (Orange — attention/trending)
Success:     #4CAF50 (Green — positive)
Danger:      #D94444 (Red — errors/delete)
Warning:     #E8842A (Orange — warnings)
Info:        #3F8ECF (Blue — informational)
Neutral:     #7A7A7A (Gray — muted elements)

Background:  #F5F7FA (Light gray page bg)
Surface:     #FFFFFF (Cards, tiles, panels)
Text:        #1A1A2E (Dark navy — primary text)
Text Muted:  #6B7280 (Gray — secondary text)
Border:      #E5E7EB (Light gray borders)
```

---

## Tailwind CSS Configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:    '#D94444',
          green:  '#4CAF50',
          olive:  '#6B9E3A',
          purple: '#7B5EA7',
          gray:   '#7A7A7A',
          orange: '#E8842A',
          blue:   '#3F8ECF',
          brown:  '#A0522D',
        },
        primary:   '#3F8ECF',
        secondary: '#7B5EA7',
        accent:    '#E8842A',
        success:   '#4CAF50',
        danger:    '#D94444',
        surface:   '#FFFFFF',
        page:      '#F5F7FA',
        'text-primary': '#1A1A2E',
        'text-muted':   '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        tile: '12px',
        card: '8px',
      },
      boxShadow: {
        tile: '0 2px 8px rgba(0,0,0,0.08)',
        'tile-hover': '0 4px 16px rgba(0,0,0,0.12)',
        card: '0 1px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
```

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| H1 | Poppins | 32px (2rem) | 700 | text-primary |
| H2 | Poppins | 24px (1.5rem) | 600 | text-primary |
| H3 | Poppins | 20px (1.25rem) | 600 | text-primary |
| Body | Inter | 16px (1rem) | 400 | text-primary |
| Small | Inter | 14px (0.875rem) | 400 | text-muted |
| Caption | Inter | 12px (0.75rem) | 400 | text-muted |
| Tile Title | Poppins | 13px | 600 | text-primary |
| Tile Subtitle | Inter | 11px | 400 | text-muted |

---

## Responsive Breakpoints

| Breakpoint | Width | Columns | Use |
|------------|-------|---------|-----|
| Mobile | < 640px | 4 tiles | Phone |
| Tablet | 640–1024px | 6 tiles | iPad |
| Desktop | 1024–1440px | 8 tiles | Laptop |
| Wide | > 1440px | 10 tiles | Monitor |

---

## Page Layout Structure

```
┌──────────────────────────────────────────────────┐
│  Header (logo, search, nav, user menu)           │
├──────────────────────────────────────────────────┤
│  Category Tabs / Navigation Bar                   │
├──────────────┬───────────────────────────────────┤
│              │                                    │
│  Sidebar     │  Main Content Area                 │
│  (Category   │  ┌─────────────────────────────┐  │
│   Directory) │  │  Sponsored Panel (top)       │  │
│              │  ├─────────────────────────────┤  │
│              │  │  Tile Grid                   │  │
│              │  │  ┌───┬───┬───┬───┬───┬───┐  │  │
│              │  │  │   │   │   │   │   │   │  │  │
│              │  │  ├───┼───┼───┼───┼───┼───┤  │  │
│              │  │  │   │   │   │   │   │   │  │  │
│              │  │  └───┴───┴───┴───┴───┴───┘  │  │
│              │  ├─────────────────────────────┤  │
│              │  │  Content Tabs (articles)     │  │
│              │  └─────────────────────────────┘  │
│              │                                    │
├──────────────┴───────────────────────────────────┤
│  Footer                                           │
└──────────────────────────────────────────────────┘
```

---

## Common UI Components

### Button Variants
| Variant | Class | Use |
|---------|-------|-----|
| Primary | `bg-primary text-white` | Main actions |
| Secondary | `bg-secondary text-white` | Alternate actions |
| Outline | `border border-primary text-primary` | Subtle actions |
| Danger | `bg-danger text-white` | Delete/destructive |
| Ghost | `text-primary hover:bg-gray-100` | Minimal style |

### Input Fields
- Rounded corners (`rounded-card`)
- Border: `border-gray-300`
- Focus: `ring-2 ring-primary/30 border-primary`
- Height: 44px (mobile-friendly)

### Cards
- Background: white
- Border radius: `rounded-card` (8px)
- Shadow: `shadow-card`
- Padding: 16px

### Modals
- Centered overlay with backdrop blur
- Max width: 480px (sm), 640px (md), 800px (lg)
- Close button top-right
- Padding: 24px

### Loader / Skeleton
- Skeleton pulse animation for loading states
- Brand blue spinner for actions

---

## Tile Design

```
┌─────────────────┐
│                  │
│    [Logo/Icon]   │  ← 48x48px icon, centered
│                  │
│   Tile Title     │  ← 13px, bold, centered
│   Subtitle       │  ← 11px, muted, centered
│                  │
│  [Trend Badge]   │  ← Optional: "Hot" "New" "Trending"
└─────────────────┘

Size: 100x100px (1x1)
Border radius: 12px
Background: white
Shadow: shadow-tile
Hover: shadow-tile-hover + slight scale(1.03)
```

### Tile States
| State | Style |
|-------|-------|
| Default | white bg, subtle shadow |
| Hover | elevated shadow, scale 1.03 |
| Active/Pressed | scale 0.98, darker shadow |
| Dragging | opacity 0.7, larger shadow |
| Sponsored | subtle orange border-left or badge |

---

## Color Usage Guidelines

- **Blue (#3F8ECF)**: Primary buttons, links, active nav, selected states
- **Purple (#7B5EA7)**: Category highlights, secondary buttons, tags
- **Orange (#E8842A)**: Trending badges, warning messages, CTA highlights
- **Green (#4CAF50)**: Success toasts, checkmarks, positive trends
- **Red (#D94444)**: Error messages, delete buttons, negative trends
- **Gray (#7A7A7A)**: Disabled states, placeholder text, dividers

---

## Dark Mode (Future)

```
Background:  #0F172A
Surface:     #1E293B
Text:        #F1F5F9
Text Muted:  #94A3B8
Border:      #334155
```

---

## Implementation Steps

1. Install fonts: Inter + Poppins (Google Fonts)
2. Configure `tailwind.config.js` with brand colors, fonts, shadows
3. Create global CSS with base styles (`styles/globals.css`)
4. Build `Button` component with all variants
5. Build `Input` component with validation states
6. Build `Card` component
7. Build `Modal` component with overlay
8. Build `Header` layout component
9. Build `Sidebar` layout component
10. Build `Skeleton` loader component
11. Implement responsive grid system
12. Test across breakpoints (mobile → wide)

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup` (Tailwind installed)
- **Required by**: All frontend modules use these components
