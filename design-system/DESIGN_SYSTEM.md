# ColonyOS Design System

> Clean surfaces for content. Bold color for moments of delight. Flat number as identity.

---

## Inspiration Analysis

### What We Took From Each Reference

| App | What We Borrowed | Where It Shows Up |
|---|---|---|
| **Discord** (server list) | Clean white surfaces, soft gray bg, rounded search bar, emoji-rich lists, bottom tab bar | Feed screen, category lists, bottom navigation |
| **Discord** (DM) | Green accent CTAs, clean chat layout, rounded action buttons | Message bubbles, primary buttons, profile screens |
| **Cosmos** | Dark premium loading screen, organic blobs, minimal white text | Splash screen, account creation loading state |
| **Mozi** | Bold saturated full-bleed color backgrounds, organic curves, playful personality | Onboarding flow screens, society code entry |
| **Lex** | Green bg + white QR card, yellow CTA button, dark pill buttons | QR invite poster, primary/secondary button system |

### Design DNA (Across All 5)

```
✅ Clean white surfaces for content consumption
✅ Bold saturated colors for emotional moments (not everywhere)
✅ Very generous border radius (16-32px cards, full-round pills)
✅ Emoji as personality — not generic icons
✅ Large, readable type with clear hierarchy
✅ Bottom tab navigation with minimal items
✅ Playful but trustworthy — not childish, not corporate
```

---

## Color System

### Primary — Emerald Green `#2BB673`

Why green:
- **Trust** — green signals safety, community, "things are OK"
- **Distinct** — WhatsApp is dark green (#25D366), MyGate is blue, we're warm emerald
- **Matches inspo** — both Discord and Lex use green as their primary accent
- **Works for both light surfaces** (as accent) and **dark surfaces** (as bg on onboarding)

### Accent — Warm Yellow `#FFCA08`

Why yellow:
- **Direct from Lex** — the yellow "Share your link" button pops beautifully
- **High contrast on any background** — works on white, green, and dark surfaces
- **Call to action color** — only used for primary buttons, never for decoration
- **Black text on yellow** = maximum readability for CTAs

### Category Colors — 5 Distinct, Saturated Hues

Each post category gets its own color so residents can visually scan the feed:

| Category | Color | Hex | Rationale |
|---|---|---|---|
| 🚨 Alert | Red | `#FF453A` | Universal urgency signal |
| 📢 Notice | Blue | `#0A84FF` | Authority, official, trustworthy |
| 🔧 Service | Amber | `#FF9F0A` | Warm, helpful, recommendation |
| 🤝 Help | Purple | `#BF5AF2` | Request, asking — stands out from others |
| 🛒 Sale | Green | `#30D158` | Transactional, positive, "available" |

These map to Apple's system colors for familiarity on iOS, but work equally well on Android.

### Surfaces

- **Main background:** `#F5F5F5` — warm light gray, not harsh white (Discord-inspired)
- **Card background:** `#FFFFFF` — pure white cards floating on gray
- **Dividers/borders:** `#EFEFEF` — barely visible, clean separation

---

## Typography

### Font: Inter

Why Inter:
- Designed specifically for screens at small sizes
- Excellent readability at 13-15px (the body text range for mobile)
- Open source, free on Google Fonts and Expo
- Clean, neutral personality — lets the content and emoji be the personality

### Scale

```
xs    11px    timestamps, "2h ago", metadata
sm    13px    flat badge text "B-204", secondary labels
base  15px    body text, post content — the workhorse
md    17px    list item titles, input text
lg    20px    section headers, card titles
xl    24px    screen titles ("Feed", "Directory")
2xl   28px    onboarding headlines
3xl   34px    splash screen text
```

### Weight Usage

| Weight | Where Used |
|---|---|
| Regular (400) | Body text, post content, comments |
| Medium (500) | Labels, timestamps, secondary info |
| Semi-Bold (600) | Flat badges, category chips, list items |
| Bold (700) | Headlines, screen titles, button text |
| Extra-Bold (800) | Onboarding headlines, splash text only |

---

## Border Radius

**Everything is generously rounded.** This is the single strongest visual pattern across all 5 inspo screenshots.

| Token | Value | Used For |
|---|---|---|
| `xs` | 4px | Tiny inline elements |
| `sm` | 8px | Small chips, category tags |
| `md` | 12px | Input fields, small cards |
| `lg` | 16px | **Post cards**, modals, notifications |
| `xl` | 20px | Bottom sheets, large containers |
| `2xl` | 24px | **Buttons**, search bar |
| `3xl` | 32px | QR code card (Lex-style) |
| `full` | 9999px | **Pills**, avatars, flat badges, reaction buttons |

---

## Component Patterns

### Post Card
```
┌─────────────────────────────────────┐
│▎ 🚨 Alert              2h left  ↓  │  ← category color left border
│▎                                    │
│▎ ⬤ B-204   •  12 min ago          │  ← flat badge (pill, gray bg)
│▎                                    │
│▎ Power cut in Block B — anyone      │  ← title (bold, lg)
│▎ else affected?                     │
│▎                                    │
│▎ ┌──────┐ ┌──────────┐ ┌───────┐  │  ← reaction pills
│▎ │ ✅ 14 │ │ 🔕 3      │ │ 👍 8  │  │
│▎ └──────┘ └──────────┘ └───────┘  │
└─────────────────────────────────────┘
```

- White card on gray background
- 4px left border in category color
- Flat badge is always the first thing after the category
- Reactions are pill-shaped buttons at the bottom
- No comment section for alerts — reactions only

### Button System (from Lex)
```
┌──────────────────────────────┐
│    ◆ Primary (Yellow CTA)     │  ← bold yellow bg, black text
└──────────────────────────────┘

┌──────────────────────────────┐
│    ◆ Secondary (Dark Pill)    │  ← near-black bg, white text
└──────────────────────────────┘

┌──────────────────────────────┐
│    ◇ Ghost (Outline)          │  ← transparent, gray border
└──────────────────────────────┘
```

### Onboarding Flow (Mozi + Lex + Cosmos)
```
Screen 1: Dark splash (Cosmos-style)
  → black bg, subtle organic shapes, "ColonyOS" in white, loading spinner

Screen 2: Full-bleed green (Mozi-style)
  → primary green bg, white text, "Your building, your community"

Screen 3: Green bg with white QR card (Lex-style)
  → scan QR or enter society code

Screen 4: White surface
  → select your flat, enter name, verify OTP
```

### Feed Screen (Discord-inspired)
```
┌─────────────────────────────────┐
│  ColonyOS        🔔  ⚙️         │  ← header
├─────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ 🔍 Search posts...         │  │  ← rounded search bar
│ └────────────────────────────┘  │
│                                 │
│ ⦿ All  🚨  📢  🔧  🤝  🛒     │  ← category filter chips
│                                 │
│ ┌── PINNED ALERTS ───────────┐  │
│ │ 🚨 Power cut Block B  2h ↓ │  │  ← red-tinted alert banner
│ │    14 flats confirmed       │  │
│ └─────────────────────────────┘ │
│                                 │
│ ┌── PINNED NOTICES ──────────┐  │
│ │ 📢 Water timing changed     │  │  ← blue-tinted notice banner
│ │    RWA Committee            │  │
│ └─────────────────────────────┘ │
│                                 │
│ ┌── POST CARD ───────────────┐  │
│ │▎🔧 B-102 • 3h ago          │  │  ← amber left border
│ │▎Great plumber — Rs 400     │  │
│ │▎ ✅ 6   👍 4               │  │
│ └─────────────────────────────┘ │
│                                 │
│ ┌── POST CARD ───────────────┐  │
│ │▎🤝 A-305 • 5h ago          │  │  ← purple left border
│ │▎Anyone have a drill?       │  │
│ │▎ 💬 3 comments              │  │
│ └─────────────────────────────┘ │
│                                 │
│              ⊕                  │  ← FAB: new post
├─────────────────────────────────┤
│  🏠     📋     💬     👤       │  ← bottom tabs
│ Feed  Directory Messages Profile│
└─────────────────────────────────┘
```

---

## Does This Design Suit ColonyOS?

### ✅ Why It Works

**1. Trust through cleanliness.**
Indian apartment residents range from 25 to 70 years old. A clean, white, well-spaced interface with clear categories works for everyone. The Discord-style clean list is universally readable. Uncle ji in C-304 can use it just as easily as a 28-year-old tech worker.

**2. Category colors = instant visual scanning.**
When a resident opens the feed and sees a red-bordered card at the top, they immediately know it's urgent — before reading a single word. This is the "replace WhatsApp" moment. In WhatsApp, a gas leak alert looks identical to a birthday wish. Here, it's unmissable.

**3. Bold onboarding creates the first impression.**
The Mozi/Cosmos-style full-bleed color splash screens make the app feel premium and confident on first open. This matters because you're asking people to trust a new app with their building's information. A cheap-looking onboarding flow kills trust before you start.

**4. Yellow CTA buttons drive action.**
The Lex-inspired yellow buttons are impossible to ignore. For "Post Alert," "Scan QR," and "Upvote Instead" — you want buttons that scream "tap me." Yellow on white background achieves this without feeling aggressive.

**5. Flat badge as identity.**
The pill-shaped flat badge (gray background, semi-bold text, "B-204") becomes the visual identity of every post. It's always in the same position, always styled the same way. After a week of use, residents start recognizing flat numbers the way they recognize usernames on social media. The design makes this identity system feel intentional, not like an afterthought.

### ⚠️ Tradeoffs

**No dark mode in v1.** The Cosmos-inspired dark aesthetic is only used for splash/loading screens. The main app is light mode. Dark mode is phase 2 — it's a lot of design work for a feature that doesn't drive adoption.

**Not "native iOS" looking.** This design system has its own personality — it won't look like a stock iOS app with SF Symbols and blue tint bars. That's intentional. ColonyOS should feel like "ColonyOS," not like "another iOS settings screen." The generous radius and custom color system give it brand identity.

**Emoji as icons** saves development time but may feel informal to some users. The tradeoff is worth it — emoji are universally understood, culturally neutral in India, and require zero design assets.

---

## File Reference

| File | Purpose |
|---|---|
| `design-system/theme.ts` | All design tokens — colors, typography, spacing, radius, shadows, component tokens, animation tokens, category config, reaction config |

Import and use throughout the app:
```typescript
import { colors, typography, spacing, radius, components, categoryConfig } from '@/design-system/theme';
```
