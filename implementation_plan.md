# ColonyOS — Implementation Plan

> Single Expo React Native app. All roles on phone. Supabase backend. No desktop. No CCTV.

---

## Architecture

```
┌──────────────────────────────────────┐
│         EXPO REACT NATIVE APP        │
│   Resident / RWA Admin / Guard       │
│   (one app, role-based UI)           │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│             SUPABASE                  │
│  Auth (Phone OTP)                     │
│  Postgres DB + Row Level Security     │
│  Realtime (live feed, reactions)      │
│  Edge Functions (notifications,       │
│    duplicate detection, expiry)       │
│  Storage (post images, attachments)   │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│       EXPO PUSH NOTIFICATIONS         │
│       (FCM + APNs via Expo)           │
└──────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | Expo SDK 52 + Expo Router (file-based) |
| Language | TypeScript |
| UI Components | React Native Paper (Material Design 3) |
| State / Data | TanStack Query + Supabase Realtime |
| Auth | Supabase Auth (Phone OTP) |
| Database | Supabase Postgres + RLS |
| Server Logic | Supabase Edge Functions (Deno) |
| Push Notifications | Expo Notifications (wraps FCM/APNs) |
| Image Storage | Supabase Storage |
| Deployment | EAS Build → Play Store / TestFlight |

### Why These Choices

- **React Native Paper** over custom styling — gives Material Design 3 components out of the box (cards, FABs, chips, bottom sheets, dialogs). Looks polished on Android immediately. On iOS it's distinctive but clean.
- **TanStack Query** — handles caching, background refetch, optimistic updates. Feed data stays fresh without manual state management. Combined with Supabase Realtime for truly live updates.
- **No Redux/Zustand** — React Context for user session + society data. TanStack Query for server state. That's it.

---

## App Structure

```
/app
  _layout.tsx                    — root layout, auth gate
  
  /(auth)                        — unauthenticated screens
    _layout.tsx
    welcome.tsx                  — landing screen
    login.tsx                    — phone number + OTP
    join-society.tsx             — enter society code or scan QR
    select-flat.tsx              — pick block + flat number
    
  /(main)                        — authenticated screens
    _layout.tsx                  — bottom tab navigator
    
    /(feed)
      index.tsx                  — feed with category filters
      [postId].tsx               — post detail + reactions/comments
      create.tsx                 — new post (category selector)
      
    /(directory)
      index.tsx                  — resident list by flat
      [residentId].tsx           — resident profile + DM button
      
    /(messages)
      index.tsx                  — conversation list
      [conversationId].tsx       — chat thread
      
    /(profile)
      index.tsx                  — settings, notifications, role info
      members.tsx                — 🔒 ADMIN ONLY: manage residents
      notices.tsx                — 🔒 ADMIN ONLY: manage notices
      reported.tsx               — 🔒 ADMIN ONLY: reported posts

/lib
  supabase.ts                    — client init + types
  auth.tsx                       — auth context provider
  notifications.ts               — Expo push token registration + handlers
  types.ts                       — shared TypeScript types
  constants.ts                   — category configs, expiry times, reaction types

/components
  PostCard.tsx                   — single post in feed
  ReactionBar.tsx                — reaction buttons (confirmed/resolved/thanks)
  CategoryChip.tsx               — filter chips for feed
  AlertBanner.tsx                — pinned alerts at top of feed
  NoticeBanner.tsx               — pinned RWA notices
  DuplicatePrompt.tsx            — "already posted, upvote instead?" bottom sheet
  EmptyState.tsx                 — empty feed / directory states
  FlatBadge.tsx                  — "B-204" identity tag component
```

### Role-Based UI (Same App, Different Permissions)

The app doesn't have separate "admin screens" hidden behind a menu. Instead:

| Feature | Resident | RWA Admin | Guard |
|---|---|---|---|
| View feed | ✅ | ✅ | ✅ |
| Post alerts/help/service/sale | ✅ | ✅ | ❌ |
| Post notices | ❌ | ✅ | ❌ |
| React to posts | ✅ | ✅ | ❌ |
| Long-press post → Pin/Delete | ❌ | ✅ | ❌ |
| Directory | ✅ | ✅ | ❌ |
| DMs | ✅ | ✅ | ❌ |
| Profile → "Manage Members" | ❌ | ✅ | ❌ |
| Profile → "Reported Posts" | ❌ | ✅ | ❌ |

Guard role is severely limited — they can only view the feed (to see alerts) and their profile. No posting, no directory, no DMs. This is intentional.

Admin features are accessed from the Profile tab. Extra menu items appear only if `role === 'admin'`. No hidden screens, no separate navigation — just conditional rendering.

---

## Database Schema

### Tables

#### `societies`
```sql
CREATE TABLE societies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  invite_code TEXT UNIQUE NOT NULL,  -- 6-char code e.g. "RK-7X2P"
  blocks JSONB NOT NULL,             -- ["A", "B", "C"] or ["Tower 1", "Tower 2"]
  flats_per_block JSONB NOT NULL,    -- {"A": ["101","102",...,"204"], ...} or uniform count
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `residents`
```sql
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  society_id UUID REFERENCES societies(id) NOT NULL,
  block TEXT NOT NULL,
  unit TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'resident'
    CHECK (role IN ('resident', 'admin', 'guard')),
  directory_visibility TEXT DEFAULT 'all'
    CHECK (directory_visibility IN ('all', 'block', 'hidden')),
  push_token TEXT,                   -- Expo push token
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(society_id, block, unit, user_id)
);
```

#### `posts`
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id) NOT NULL,
  author_id UUID REFERENCES residents(id) NOT NULL,
  author_flat TEXT NOT NULL,         -- "B-204" denormalized
  category TEXT NOT NULL
    CHECK (category IN ('alert', 'notice', 'service', 'help', 'sale')),
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,                    -- optional photo attachment
  is_pinned BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_reason TEXT,
  confirmed_count INT DEFAULT 0,     -- denormalized reaction counts
  resolved_count INT DEFAULT 0,
  thanks_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,   -- auto-set by trigger based on category
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `reactions`
```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  resident_id UUID REFERENCES residents(id) NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('confirmed', 'resolved', 'thanks')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, resident_id)       -- one reaction per person per post
);
```

#### `comments`
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES residents(id) NOT NULL,
  author_flat TEXT NOT NULL,
  body TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `direct_messages`
```sql
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id) NOT NULL,
  sender_id UUID REFERENCES residents(id) NOT NULL,
  receiver_id UUID REFERENCES residents(id) NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `reports`
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  message_id UUID REFERENCES direct_messages(id),
  reporter_id UUID REFERENCES residents(id) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by UUID REFERENCES residents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Database Functions & Triggers

```sql
-- Auto-set expires_at based on category
CREATE OR REPLACE FUNCTION set_post_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at := CASE NEW.category
    WHEN 'alert'   THEN NOW() + INTERVAL '6 hours'
    WHEN 'notice'  THEN NOW() + INTERVAL '100 years'  -- never expires
    WHEN 'service' THEN NOW() + INTERVAL '60 days'
    WHEN 'help'    THEN NOW() + INTERVAL '7 days'
    WHEN 'sale'    THEN NOW() + INTERVAL '21 days'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_post_expiry
  BEFORE INSERT ON posts
  FOR EACH ROW EXECUTE FUNCTION set_post_expiry();

-- Auto-update reaction counts on posts
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET
      confirmed_count = CASE WHEN NEW.type = 'confirmed' THEN confirmed_count + 1 ELSE confirmed_count END,
      resolved_count  = CASE WHEN NEW.type = 'resolved'  THEN resolved_count + 1  ELSE resolved_count END,
      thanks_count    = CASE WHEN NEW.type = 'thanks'    THEN thanks_count + 1    ELSE thanks_count END
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET
      confirmed_count = CASE WHEN OLD.type = 'confirmed' THEN confirmed_count - 1 ELSE confirmed_count END,
      resolved_count  = CASE WHEN OLD.type = 'resolved'  THEN resolved_count - 1  ELSE resolved_count END,
      thanks_count    = CASE WHEN OLD.type = 'thanks'    THEN thanks_count - 1    ELSE thanks_count END
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_reaction_counts
  AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW EXECUTE FUNCTION update_reaction_counts();

-- Cron: soft-delete expired posts every 15 minutes
SELECT cron.schedule('expire-posts', '*/15 * * * *', $$
  UPDATE posts
  SET is_deleted = TRUE, deleted_reason = 'auto-expired'
  WHERE expires_at < NOW() AND is_deleted = FALSE;
$$);
```

### Row Level Security (Critical)

```sql
-- All tables: residents can only access data from their own society
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Posts: society members only, exclude soft-deleted
CREATE POLICY "posts_society_read" ON posts FOR SELECT USING (
  society_id = (SELECT society_id FROM residents WHERE user_id = auth.uid())
  AND is_deleted = FALSE
);

-- Posts: only author can insert, with their society_id
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (
  author_id = (SELECT id FROM residents WHERE user_id = auth.uid())
  AND society_id = (SELECT society_id FROM residents WHERE user_id = auth.uid())
);

-- Posts: admin can update any post (pin/delete), author can update own (resolve)
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (
  author_id = (SELECT id FROM residents WHERE user_id = auth.uid())
  OR (SELECT role FROM residents WHERE user_id = auth.uid()) = 'admin'
);

-- DMs: only sender or receiver can see
CREATE POLICY "dm_access" ON direct_messages FOR SELECT USING (
  sender_id = (SELECT id FROM residents WHERE user_id = auth.uid())
  OR receiver_id = (SELECT id FROM residents WHERE user_id = auth.uid())
);

-- Directory: respect visibility settings
CREATE POLICY "directory_read" ON residents FOR SELECT USING (
  society_id = (SELECT society_id FROM residents WHERE user_id = auth.uid())
  AND is_active = TRUE
  AND (
    directory_visibility = 'all'
    OR (directory_visibility = 'block' AND block = (SELECT block FROM residents WHERE user_id = auth.uid()))
    OR user_id = auth.uid()
  )
);
```

---

## MVP Feature Breakdown (Build Order)

### Phase 1 — Foundation (Days 1-3)

- [ ] Expo project init with Expo Router
- [ ] Supabase project setup (DB, Auth, RLS)
- [ ] TypeScript types matching schema
- [ ] Supabase client setup with auth context
- [ ] Phone OTP login screen
- [ ] Society code entry + QR scan screen
- [ ] Flat number selection screen
- [ ] Root layout with auth gate (redirect to login if not authenticated)

### Phase 2 — Feed Core (Days 4-7)

- [ ] Bottom tab navigator (Feed, Directory, Messages, Profile)
- [ ] Feed screen — fetch posts by society, sorted by recency
- [ ] Category filter chips (Alert, Notice, Service, Help, Sale)
- [ ] PostCard component — category tag, flat badge, time, reaction counts
- [ ] Alert posts pinned at top with red badge + countdown timer
- [ ] Notice posts pinned below alerts, visually distinct (official look)
- [ ] Post creation screen with category selector
- [ ] Admin-only: "Notice" category visible in post creation
- [ ] Image attachment on posts (camera + gallery picker → Supabase Storage)

### Phase 3 — Reactions & Duplicate Detection (Days 8-10)

- [ ] ReactionBar component (confirmed / resolved / thanks)
- [ ] One reaction per resident per post (toggle behavior)
- [ ] Live reaction count updates via Supabase Realtime
- [ ] Duplicate alert detection — keyword match against active alerts
- [ ] DuplicatePrompt bottom sheet ("upvote existing or post separately?")
- [ ] Comments on service/help/sale posts (not alerts/notices)
- [ ] Comment count cap: 50 per post, then lock

### Phase 4 — Push Notifications (Days 11-12)

- [ ] Expo push token registration on login
- [ ] Store push token in `residents.push_token`
- [ ] Supabase Edge Function: on new alert INSERT → send push to all society residents
- [ ] Supabase Edge Function: on new notice INSERT → send push to all society residents
- [ ] Notification settings screen — per-category toggles
- [ ] Evening digest Edge Function (8pm cron) — summary of day's non-alert posts

### Phase 5 — Directory & DMs (Days 13-15)

- [ ] Directory screen — list residents by block/flat, respect visibility
- [ ] Search by flat number or name
- [ ] Resident profile screen with DM button
- [ ] Message list screen — conversations sorted by last message
- [ ] Chat thread screen — real-time via Supabase Realtime
- [ ] Unread message badge on Messages tab

### Phase 6 — Admin Features (Days 16-17)

- [ ] Long-press post in feed → admin actions (Pin / Delete with reason)
- [ ] Profile → Manage Members screen (list residents, approve/reject pending)
- [ ] Profile → Reported Posts screen (review reports, dismiss or act)
- [ ] Admin can issue posting cooldown (24h, 7d) to residents
- [ ] Society settings screen (edit name, regenerate invite code)

### Phase 7 — Polish (Days 18-20)

- [ ] Empty states for all screens (new society with no posts yet)
- [ ] Pull-to-refresh on feed
- [ ] Skeleton loading states
- [ ] Haptic feedback on reactions
- [ ] Auto-expire visual — countdown timer on alerts ("expires in 2h 14m")
- [ ] Offline cache — feed loads from AsyncStorage first, then refreshes
- [ ] App icon, splash screen
- [ ] EAS Build config for Android APK / Play Store

---

## User Review Required

> [!IMPORTANT]
> **Design Direction:** I'll use React Native Paper (Material Design 3) for components — cards, FABs, chips, bottom navigation, dialogs. This gives a clean, polished Android-native feel. On iOS it'll look distinctive rather than "native iOS." Are you OK with Material Design, or do you prefer a custom design system?

> [!IMPORTANT]
> **Supabase Project:** Do you already have a Supabase project set up, or should I create the migration files for you to run when you create one? I'll need the Supabase URL and anon key to wire up the client.

> [!IMPORTANT]  
> **Guard Role:** You mentioned "Guard" as a role. For MVP with no CCTV, guards can only view the feed. Should I include the guard role at all in v1, or strip it out entirely and add it when CCTV comes in Phase 2?

> [!IMPORTANT]
> **Expo Account:** Do you have an Expo account / EAS set up? This is needed for push notifications and builds. If not, I'll include setup steps.

---

## Open Questions

> [!WARNING]
> **Flat number structure varies wildly across Indian buildings.** Some use "A-101", some use "Tower 1, Flat 204", some use "3BHK-14". The schema uses `block` + `unit` separately. During society setup, should the admin define the exact flat numbering scheme, or should we keep it as free-text entry by the resident?

> [!WARNING]
> **Multiple residents per flat.** The current schema allows multiple `residents` with the same `(society_id, block, unit)` via different `user_id`. But who "owns" the flat identity? Should the first registrant be the primary, with subsequent registrants needing approval from the primary? Or is everyone equal?

---

## Verification Plan

### Automated
- TypeScript strict mode — catches type errors at build time
- Supabase RLS policies tested via `supabase test` with different auth contexts
- Expo build succeeds without errors (`eas build --profile development`)

### Manual
- Install dev build on physical Android device
- Complete onboarding flow: register → OTP → society code → flat selection
- Post an alert, see it appear in real-time on a second device
- React to a post, see count update live
- Test duplicate detection — post two similar alerts
- Test admin actions — pin, delete, manage members
- Test push notification receipt for alerts
- Test directory visibility settings
