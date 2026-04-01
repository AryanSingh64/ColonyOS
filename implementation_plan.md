# ColonyOS — Implementation Plan

> All-in-one society operating system: Communication + Gate Entry. Single Expo React Native app. All roles on phone. Supabase backend. No desktop.

**Team:** 2 Full-Stack Developers  
**Timeline:** 6-8 weeks (iterative, no hard deadlines)  
**Strategy:** Build communication + gate entry together — gate entry drives adoption, communication drives engagement.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│           EXPO REACT NATIVE APP (2 Developer Team)     │
│   Resident / RWA Admin / Guard (Role-Based UI)         │
└────────────────┬─────────────────────────────────────────┘
                 │
    ┌────────────┴─────────────────────────────────────────┐
    │ Features:                                            │
    │  • Feed (alerts, notices, service, help, sale)     │
    │  • Reactions + Comments                             │
    │  • Directory + Direct Messages                      │
    │  • Gate Entry (delivery approvals, visitor logging)│
    │  • Admin Panel (CSV import, moderation, settings)  │
    └─────────────────────────────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────────────────┐
│                 SUPABASE                                │
│  ┌────────────────────────────────────────────────┐    │
│  │ Auth (Phone OTP + SMS/Call Fallback)          │    │
│  │ Postgres DB + Row Level Security (RLS)        │    │
│  │ Realtime (feed updates, DMs, gate approvals) │    │
│  │ Edge Functions (API routes, business logic)  │    │
│  │ Storage (post images + gate rider photos)    │    │
│  └────────────────────────────────────────────────┘    │
└────────────────┬─────────────────────────────────────────┘
                 │
    ┌────────────┴──────────────────────────────────────────┐
    │ Push via Expo (FCM/APNs)                             │
    │ • Alerts & Notices (all residents)                  │
    │ • Delivery approvals (specific resident)            │
    │ • Direct messages                                   │
    └──────────────────────────────────────────────────────┘
```

**Key Architectural Decisions:**

1. **Single App, Multiple Roles** — Residents, Guards, Admins all use same binary. UI adapts via role-based navigation and conditional rendering.

2. **RLS as Security Boundary** — All data access enforced at database level. Edge Functions use `service_role` key, but validate JWT + role before acting.

3. **Realtime for Critical Flows** — New posts, DM messages, delivery approvals broadcast via Supabase Realtime channels. Feed uses cursor-based pagination + "new posts available" banner (no auto-insert).

4. **Offline-First Guard Flow** — Gate entry works offline: guard creates entry locally, queues for sync, shows "pending" status. Photo upload retries when online.

5. **Cost Optimization** — Gate photos auto-delete after 30 days (cron). Push notifications batched (100 tokens/batch, 200ms delay) to avoid Expo rate limits. Storage bucket per feature (posts vs gate).

6. **Scalability Indexes** — All query patterns indexed: feed (`society_id, is_pinned, created_at`), gate entries (`society_id, approval_status`), DMs (`conversation_id`), residents (`user_id, society_id`).

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
| Camera & QR | `expo-camera`, `expo-barcode-scanner` |
| SMS Fallback | Twilio Verify (India) or MSG91 |
| Analytics | PostHog (free tier) |
| Error Tracking | Sentry (free via GitHub Student Pack) |
| Landing Page | Vercel + Next.js (free) |
| CRM | Pipedrive (free via GitHub Student Pack) |
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

    /(gate) — NEW TAB (guards see, admins also see)
      index.tsx                  — Gate entry form (type selector, flat search, photo)
      history.tsx                — Gate logs list with filters
      [entryId].tsx              — Entry detail + exit mark (for guards/admins)

/lib
  supabase.ts                    — client init + types
  auth.tsx                       — auth context provider
  notifications.ts               — Expo push token registration + handlers
  types.ts                       — shared TypeScript types
  constants.ts                   — category configs, expiry times, reaction types

/components
  // Communication Components
  PostCard.tsx                   — single post in feed
  ReactionBar.tsx                — reaction buttons (confirmed/resolved/thanks)
  CategoryChip.tsx               — filter chips for feed
  AlertBanner.tsx                — pinned alerts at top of feed
  NoticeBanner.tsx               — pinned RWA notices
  DuplicatePrompt.tsx            — "already posted, upvote instead?" bottom sheet
  EmptyState.tsx                 — empty feed / directory states
  FlatBadge.tsx                  — "B-204" identity tag component

  // Gate Entry Components (NEW)
  GateEntryScreen.tsx            — main gate form (type selector, flat search, photo)
  EntryTypeSelector.tsx          — delivery/visitor/vip radio group
  FlatSearchInput.tsx            — type-ahead flat search (virtualized list)
  PhotoCapture.tsx               — camera + preview + capture button
  DeliveryApprovalScreen.tsx     — resident approval view with photo
  DeliveryApprovalCard.tsx       — push notification card component
  GateLogsScreen.tsx             — filterable list of entries (admin/guard)
  GateLogDetail.tsx              — entry details + exit mark button
  ExitMarkButton.tsx             — floating action to mark exit
  GateMetricsCard.tsx            — today's stats (entries, pending, avg approval time)
```

### Role-Based UI (Same App, Different Permissions)

The app doesn't have separate "admin screens" hidden behind a menu. Instead:

| Feature | Resident | RWA Admin | Guard |
|---|---|---|---|
| View feed | ✅ | ✅ | ✅ |
| Post alerts/help/service/sale | ✅ | ✅ | ❌ |
| Post notices | ❌ | ✅ | ✅ |
| React to posts | ✅ | ✅ | ❌ |
| Long-press post → Pin/Delete | ❌ | ✅ | ❌ |
| Directory | ✅ (respects visibility) | ✅ (sees all) | ✅ (sees all) |
| DMs | ✅ | ✅ | ❌ |
| Gate tab access | ❌ | ✅ | ✅ |
| Create delivery entry | ❌ | ✅ | ✅ |
| Create visitor entry | ❌ | ✅ | ✅ |
| Approve delivery (own flat) | ✅ | ✅ (any) | ❌ |
| Mark exit | ❌ | ✅ | ✅ |
| View gate logs | Own flat only | All | Own entries + today's |
| Profile → "Manage Members" | ❌ | ✅ | ❌ |
| Profile → "Reported Posts" | ❌ | ✅ | ❌ |

**Guard role expanded:** Can post notices (RWA announcements), access gate tab for entry logging, view directory (to verify flats). Cannot use DMs or react to posts (maintains official separation).

Admin features are accessed from the Profile tab. Extra menu items appear only if `role === 'admin'`. No hidden screens, no separate navigation — just conditional rendering.

---

## Gate Entry Management System (v1 Lite)

### Scope & Philosophy

Gate entry solves the **physical security** problem: tracking who enters the society, when, and for which flat. This is the **adoption driver** — RWAs will pay for this feature, and it forces residents to install the app (deliveries require approval).

**v1 Lite includes:**
- ✅ **Delivery approvals** with mandatory rider photo + 3-minute expiry
- ✅ **Visitor logging** (no approval, just entry/exit tracking)
- ✅ **Gate logs** viewable by guards (own entries) and admins (all)
- ✅ **Exit marking** by guards

**Deferred to v2:**
- ❌ VIP flow (frequent visitors, quick add)
- ❌ "Call resident" button (just opens dialer)
- ❌ Advanced analytics dashboard
- ❌ Export gate logs to CSV

### User Flows

#### **Delivery Flow (Strict Control)**
```
1. Rider arrives at gate
2. Guard opens ColonyOS → Gate tab → "New Entry"
3. Select type: "Delivery"
4. Enter flat number (type-ahead search from society_flats)
5. Enter rider name
6. Tap "Take Photo" (mandatory) → camera → capture → confirm
7. Tap "Create Entry"
8. System:
   - Saves entry with approval_status = 'pending'
   - Uploads photo to storage (gate-entry-photos bucket)
   - Sends push notification to resident(s) of that flat:
     "🚚 Delivery for Tower 1-101 — Rider Singh
      [Approve] [Deny]"
   - Starts 3-minute countdown (expires_at = NOW() + 3 min)
9. Resident receives push:
   - Option A: Tap [Approve] directly from notification (no app open)
   - Option B: Open app → see delivery approval screen → Approve/Deny
10. If approved:
    - Entry status → 'approved'
    - Guard's app shows "APPROVED" badge on entry (realtime)
    - Guard opens gate
11. If denied:
    - Entry status → 'denied'
    - Guard shows notification: "Delivery denied by resident"
12. If no response after 3 minutes:
    - Entry status → 'expired'
    - Guard must request approval again or ask resident to come to gate
```

#### **Visitor Flow (Standard)**
```
1. Visitor arrives (cab, friend, etc.)
2. Guard: New Entry → type "Visitor"
3. Enter name + flat number
4. Photo optional (skip for privacy)
5. Create entry → status = 'auto_approved' (no approval needed)
6. Log entry time, guard identity
7. Visitor proceeds
8. When visitor leaves:
   - Guard finds entry in logs
   - Taps "Mark Exit"
   - exit_time recorded
```

#### **Gate Logs & Audit**
- **Guard view:** "Today" tab shows own entries, filterable by type/status. "History" tab with date picker.
- **Admin view:** All entries across all guards, with full search (name, flat, date range).
- **Resident view:** Can see entries linked to their own flat only (privacy).

### Database Additions

**New Table: `gate_entries`**
```sql
CREATE TABLE gate_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id) NOT NULL,
  guard_id UUID REFERENCES residents(id) NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('delivery', 'visitor', 'vip')),
  visitor_name TEXT NOT NULL,
  flat_number TEXT NOT NULL,  -- denormalized; matches society_flats.unit format
  rider_photo_url TEXT,        -- only for delivery; NULL for visitor
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'denied', 'auto_approved', 'expired')),
  approved_by UUID REFERENCES residents(id),
  approved_at TIMESTAMPTZ,
  entry_time TIMESTAMPTZ DEFAULT NOW(),
  exit_time TIMESTAMPTZ,
  exit_marked_by UUID REFERENCES residents(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_gate_entries_pending ON gate_entries(society_id, created_at DESC) WHERE approval_status = 'pending';
CREATE INDEX idx_gate_entries_guard ON gate_entries(guard_id, created_at DESC);
CREATE INDEX idx_gate_entries_flat_society ON gate_entries(flat_number, society_id, created_at DESC);
CREATE INDEX idx_gate_entries_society_day ON gate_entries(society_id, DATE(entry_time), created_at DESC);
```

**Storage Bucket: `gate-entry-photos`**
- Path: `{society_id}/{entry_id}.jpg`
- RLS: Only guard who uploaded, admin of society, and resident of that flat can view
- **Auto-delete cron** every 7 days: remove photos older than 30 days
- Max file size: 500KB (compressed on upload)

### RLS Policies for Gate Entry

```sql
-- Residents can see entries for their own flat only
CREATE POLICY "gate_entries_society_read" ON gate_entries FOR SELECT USING (
  society_id = (
    SELECT society_id FROM residents
    WHERE user_id = auth.uid()
    AND society_id = gate_entries.society_id
  )
  AND (
    -- Resident: see own flat only
    (SELECT unit FROM residents WHERE user_id = auth.uid()) = gate_entries.flat_number
    -- Admin: see all
    OR (SELECT role FROM residents WHERE user_id = auth.uid() AND society_id = gate_entries.society_id) = 'admin'
    -- Guard: see own entries + all entries for their society (for audit)
    OR (SELECT role FROM residents WHERE user_id = auth.uid() AND society_id = gate_entries.society_id) = 'guard'
  )
);

-- Residents can approve deliveries for their own flat only
CREATE POLICY "gate_entries_approve_own" ON gate_entries FOR UPDATE USING (
  approval_status = 'pending'
  AND entry_type = 'delivery'
  AND flat_number = (
    SELECT unit FROM residents
    WHERE user_id = auth.uid()
    AND society_id = gate_entries.society_id
  )
);

-- Guards can create entries for their society
CREATE POLICY "gate_entries_guard_insert" ON gate_entries FOR INSERT WITH CHECK (
  guard_id = (SELECT id FROM residents WHERE user_id = auth.uid() AND role = 'guard')
  AND society_id = (SELECT society_id FROM residents WHERE user_id = auth.uid())
);

-- Guards can mark exit (only if not already exited)
CREATE POLICY "gate_entries_mark_exit" ON gate_entries FOR UPDATE USING (
  exit_time IS NULL
  AND guard_id = (SELECT id FROM residents WHERE user_id = auth.uid() AND role = 'guard')
);
```

### Edge Function Routes for Gate Entry

```
POST   /api/gate/entries
  Body: { entry_type, visitor_name, flat_number, rider_photo_url? }
  Auth: Guard or Admin only
  Action: Create entry, upload photo if delivery, trigger push if delivery
  Returns: entry object

PATCH  /api/gate/entries/:id/approve
  Body: { approved: boolean }
  Auth: Resident (own flat) or Admin
  Action: Update approval_status, set approved_by/approved_at
  Returns: updated entry

PATCH  /api/gate/entries/:id/exit
  Auth: Guard only
  Action: Set exit_time = NOW(), exit_marked_by = guard.id
  Returns: updated entry

GET    /api/gate/entries
  Query: ?type=delivery&status=pending&flat=Tower1-101&from=2025-01-01&to=2025-01-31&page=1&limit=50
  Auth: Guard (own entries + today), Admin (all with filters)
  Returns: { entries: [], pagination: {page, limit, total, hasMore} }
```

### Push Notifications for Gate Entry

**Type:** `delivery_approval`

**Payload:**
```json
{
  "to": "<expo_push_token>",
  "title": "🚚 Delivery Approval Needed",
  "body": "Rider Singh at gate for Tower 1-101",
  "data": {
    "type": "delivery_approval",
    "entryId": "uuid-here",
    "flat": "Tower 1-101",
    "visitorName": "Rider Singh"
  },
  "actionButtons": [
    { "action": "approve", "title": "Approve", "foreground": true },
    { "action": "deny", "title": "Deny", "foreground": true }
  ]
}
```

**Android:** Action buttons appear directly on notification (no app open needed).
**iOS:** Tap notification opens app to `DeliveryApprovalScreen` with Approve/Deny buttons.

### Component Details (Gate Entry)

**Guard UI:**
- `GateEntryScreen` — Main screen with:
  - `EntryTypeSelector` (3 radio buttons: Delivery/Visitor/VIP)
  - `FlatSearchInput` (type-ahead, shows matching flats from `society_flats`, debounced 150ms)
  - `PhotoCapture` (only visible for delivery type, shows preview thumbnail after capture)
  - Submit button (disabled until flat selected + name entered + photo if delivery)

- `GateLogsScreen` — Tabbed: "Today" / "History"
  - Today: query entries WHERE `DATE(entry_time) = TODAY` AND `guard_id = current`
  - History: date range picker + search by name/flat
  - Each entry card shows: type badge, name, flat, time, status badge (pending/approved/denied/exited)
  - Tap entry → `GateLogDetail` with exit button (if not exited)

**Resident UI:**
- `DeliveryApprovalScreen` — Full screen shown when resident taps delivery notification:
  - Large rider photo (if available)
  - Visitor name, flat number (verify it's their flat)
  - Approve (green) / Deny (red) buttons
  - Tapping approve sends PATCH to `/api/gate/entries/:id/approve` with `approved: true`

**Admin UI:**
- Same as guard logs but sees all guards' entries + filter by guard name
- Can view entry details (including photo) but cannot approve/deny (that's resident-only)

### Guard UX Constraints (Critical)

**Design requirements derived from real-world gate conditions:**

1. **One-handed operation** — All interactive elements in bottom 1/3 of screen (thumb zone). Submit button fixed at bottom.

2. **Flat search must be instant** — Use `FlatSearchInput` with:
   - Debounced input (150ms)
   - Virtualized list (react-native-virtualized-list)
   - Preload all flats for society into memory on app start (1000 flats = ~50KB array)
   - Search across both block and unit: "1204" matches "Tower 1-1204"

3. **Camera performance** —
   - Request camera permissions on app first launch, not per-use
   - Camera component should be reused, not remounted each time
   - Photo compression: 1080px width, JPEG quality 70% → ~150KB file
   - Show flash toggle if available (low-light gates)

4. **Offline mode** —
   - Create entry offline: store in local SQLite (via WatermelonDB or just AsyncStorage queue)
   - Show "Pending sync" indicator
   - When connection returns, auto-upload photos and POST to Edge Function
   - If photo upload fails after 3 retries, alert guard: "Photo failed. Continue without?" (allow skip)

5. **Error states:**
   - Photo upload fails → show retry button + "Skip photo" option
   - Network unavailable → "Entry saved locally. Will sync when online."
   - Flat not in society_flats → "Flat not found. Contact RWA to add." (prevent invalid entries)

### Photo Retention & Privacy

**Policy:**
- Rider photos are **Personally Identifiable Information (PII)** and biometric data under Indian DPDP Act
- Store encrypted at rest (Supabase Storage does this)
- Auto-delete after **30 days** via cron job
- Accessible only to: guard who captured, admin of society, resident of that flat (RLS enforces)
- Consent during capture: "By taking photo, you consent to storage for 30 days for security purposes"

**Cron job (runs daily at 2am):**
```sql
-- Delete photos older than 30 days from storage
-- Also delete corresponding gate_entries rows OR just set rider_photo_url = NULL?
-- Better: keep entry but remove photo after 30 days (audit trail needs entry, not photo)
```

### Metrics & Monitoring

**Key metrics to track in PostHog:**
- `gate_entry_created` (by type, guard_id, time_of_day)
- `delivery_approval_rate` (% approved vs denied)
- `avg_approval_time` (seconds from creation to approval/denial/expiry)
- `photo_upload_success_rate`
- `offline_entries_count` (guard offline scenarios)

**Gate-specific dashboard for admin:**
- Today's total entries
- Pending approvals count
- Avg approval time (target: <60 seconds)
- Most active gates (if multiple entry points)
- Delivery approval rate (benchmark: 95% approve)

### Testing Strategy

**Must test these scenarios:**

1. **Delivery approval flow end-to-end:**
   - Guard creates delivery entry → resident receives push within 5 seconds → resident approves from notification → guard sees real-time update

2. **Expiry race condition:**
   - Create delivery, wait 2:50, resident approves at 2:59 → should succeed (grace period)
   - Resident approves at 3:01 → should fail ("expired")

3. **Offline gate entry:**
   - Guard puts phone in airplane mode → create entry with photo → verify saved locally → restore network → verify sync successful

4. **Photo scenarios:**
   - Upload 500KB photo → verify compression to ~150KB
   - Upload fails after retries → guard skips → entry still created without photo
   - Resident approves entry without photo → is that allowed? **YES** (photo is guard's responsibility, not resident's approval condition)

5. **Flat search edge cases:**
   - Society with 1000 flats → search "1204" returns "Tower 1-1204" instantly (<200ms)
   - Invalid flat "9999" → "Flat not found" message (don't allow creation)
   - New flat just added to society_flats but not yet in local cache → should still work (query server)

6. **RLS bypass attempts:**
   - Resident A tries to approve delivery for Flat B → should get 403
   - Guard tries to mark exit for entry created by another guard → should work (guards can mark any exit)
   - Admin tries to create gate entry as resident → should work? **YES** (admin can do guard actions)

7. **Push notification delivery:**
   - Test on both Android & iOS physical devices
   - Verify action buttons appear on Android (direct approve/deny)
   - Verify deep link on iOS opens correct screen

---

Now let's continue with the updated Database Schema section which should include the new `society_flats` and `gate_entries` tables plus all the fixes. I'll read current Database Schema to see what's there:
</think>
Excellent! Now let's update the Database Schema section. I need to replace the current `societies` and `residents` tables and add `society_flats` and `gate_entries`. Let me read the current database section:<tool_call>
<function=Read>

### Tables

#### `societies`
```sql
CREATE TABLE societies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  invite_code TEXT UNIQUE NOT NULL,  -- 6-char code e.g. "RK-7X2P"
  flat_structure JSONB NOT NULL,     -- {format: "tower-flat", blocks: [...], units_per_block: {...}}
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  max_units INTEGER,                 -- total number of flats (for analytics)
  invited_count INTEGER DEFAULT 0,   -- count of invited residents
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
  flat_number TEXT NOT NULL,  -- denormalized: "Tower 1-101", "B-204", etc.
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'resident'
    CHECK (role IN ('resident', 'admin', 'guard')),
  directory_visibility TEXT DEFAULT 'block'  -- more private by default
    CHECK (directory_visibility IN ('all', 'block', 'hidden')),
  push_token TEXT,                   -- Expo push token
  push_token_updated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(society_id, user_id)  -- one resident record per user per society
);

CREATE INDEX idx_residents_user ON residents(user_id);
CREATE INDEX idx_residents_society_role ON residents(society_id, role);
CREATE INDEX idx_residents_flat ON residents(society_id, flat_number);
```

#### `posts`
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID REFERENCES societies(id) NOT NULL,
  author_id UUID REFERENCES residents(id) NOT NULL,
  author_flat TEXT NOT NULL,         -- denormalized flat display
  category TEXT NOT NULL
    CHECK (category IN ('alert', 'notice', 'service', 'help', 'sale')),
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,                    -- optional photo attachment
  is_pinned BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,   -- for moderation (reported posts)
  deleted_reason TEXT,
  is_duplicate_of UUID REFERENCES posts(id),  -- tracks duplicate alerts
  confirmed_count INT DEFAULT 0,     -- denormalized reaction counts
  resolved_count INT DEFAULT 0,
  thanks_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,   -- auto-set by trigger based on category
  edited_at TIMESTAMPTZ,
  edited_by UUID REFERENCES residents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_society_feed ON posts(society_id, is_pinned DESC, created_at DESC)
  WHERE is_deleted = FALSE AND is_hidden = FALSE;
CREATE INDEX idx_posts_society_category ON posts(society_id, category, created_at DESC)
  WHERE is_deleted = FALSE;
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
  conversation_id TEXT GENERATED ALWAYS AS (
    CASE WHEN sender_id < receiver_id
      THEN sender_id || ':' || receiver_id
      ELSE receiver_id || ':' || sender_id
    END
  ) STORED,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dms_conversation ON direct_messages(conversation_id, created_at DESC);
CREATE INDEX idx_dms_sender_receiver ON direct_messages(sender_id, receiver_id, created_at DESC);
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
  resolution_notes TEXT,  -- admin notes on decision
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reporter_id, post_id)  -- one report per person per post
);

CREATE INDEX idx_reports_status ON reports(status, created_at DESC) WHERE status = 'pending';
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
