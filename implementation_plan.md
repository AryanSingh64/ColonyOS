# ColonyOS Implementation Plan

> Security and official communication for modern apartment communities.

## 1. Product Thesis

ColonyOS should not compete by cloning MyGate, NoBrokerHood, ADDA, or ApnaComplex feature-for-feature. That path produces a weaker copy of a mature category.

ColonyOS should compete as the product for apartment communities that want:

- faster guard workflows
- cleaner resident experience
- lighter admin operations
- no hardware dependency
- no ads, no marketplace clutter, no junk features in the critical path

### Ideal Customer Profile

- India-first
- 80 to 300 flats
- 1 to 2 gates
- committee-led or lightly managed societies
- WhatsApp-heavy today
- unhappy with bloated society apps or not yet digitized

### Core Promise

If a society wants a reliable gate and official communication system that can go live in one day, ColonyOS should feel like the obvious choice.

## 2. Competitive Positioning

### Market Reality

The category is already crowded:

- MyGate wins on breadth, scale, and ecosystem depth.
- NoBrokerHood wins on security breadth, household workflows, and operational coverage.
- ADDA wins on official communication credibility and privacy-oriented positioning.
- ApnaComplex wins on mature apartment operations and guard tooling depth.

This means the ColonyOS wedge must be sharper than "we also do gate entry + feed".

### Where ColonyOS Wins

| Competitor | What they are strong at | Where ColonyOS should attack |
|---|---|---|
| MyGate | Large-scale ERP, many modules, distribution, monetization ecosystem | Simpler daily operations, cleaner UX, calmer resident app, faster onboarding |
| NoBrokerHood | Security breadth, household access, many operational features | Less bloat, less clutter, stronger mobile speed, easier setup for smaller societies |
| ADDA | Official communication credibility, privacy messaging, apartment admin maturity | Better guard speed, more focused v1, easier day-one rollout |
| ApnaComplex | Mature community ops, guard workflows, offline expectations | Better product taste, cleaner interaction model, less enterprise heaviness |

### Positioning Statement

ColonyOS is the fastest way for a modern apartment community to run gate approvals and official notices without adopting a bloated ERP.

### What ColonyOS Must Not Become

- not a resident social network
- not a marketplace app
- not an ad platform
- not an accounting ERP in v1
- not a "do everything badly" clone

## 3. Product Differentiation

ColonyOS is defined by four promises.

### 1. 30-Second Gate Flow

A guard can create a delivery or visitor entry in under 30 seconds on a low-end Android phone, one-handed, under poor network conditions.

This is the main wedge. If this flow is not materially better than incumbents, the product is not differentiated.

### 2. Calm Official App

Residents should see:

- official notices
- urgent alerts
- delivery approvals
- visitor records for their flat

They should not see:

- classifieds in v1
- social clutter
- ad inventory
- noisy engagement bait

### 3. 1-Day Society Launch

An 80 to 300 flat society should be able to:

1. import flats
2. assign admins and guards
3. invite households
4. train guards
5. go live

all in one day.

### 4. Visible Privacy Defaults

Privacy should be obvious in the product:

- short retention windows
- explicit capture consent language
- signed media access
- audit trail for overrides
- no unnecessary personal data
- no ads or resale language

## 4. Product Scope

### v1 In Scope

- phone OTP login
- society creation and setup
- flat import and flat structure templates
- household/member linking
- official notices
- urgent alerts
- delivery approval flow
- visitor logging
- gate logs
- push notifications
- offline guard sync
- audit log
- basic admin web console

### v1 Out of Scope

- direct messages
- classifieds / sale posts
- social feed features
- resident-to-resident engagement loops
- marketplace features
- payments and accounting
- advanced dashboards
- CRM setup
- public pricing certainty
- VIP visitor flow

## 5. Platform Strategy

### Resident App

- Expo React Native
- OTP auth
- notices, alerts, delivery approvals, own flat gate history

### Guard App

- same Expo codebase, role-based guard mode
- Android-first
- optimized for fast entry creation
- offline-safe queue

### Admin Console

- slim web console
- imports, settings, audit, flat management, guard management, gate logs
- optimized for desktop and tablet use

Admins may still use the mobile app for quick actions, but primary configuration and audit work belongs on web.

## 6. UX Principles

### Guard UX Is The Product

Guard flows must be designed for:

- one-handed usage
- sunlight visibility
- low-end Android phones
- weak network
- multilingual labels later if needed
- large tap targets
- zero ambiguity on approval state

### Resident UX Should Feel Calm

- official content only
- low-notification-noise defaults
- no decorative complexity in core flows
- clear distinction between notice, alert, approval request, and history

### Design System Direction

Use the existing custom visual language in `design-system/`.

Do not use React Native Paper as the primary UI system. It will flatten the product into generic Material UI and kill the visual differentiation already present in the repo.

## 7. User Roles

### Resident

- join society
- belong to one flat in that society
- receive delivery approval requests
- see notices and alerts
- see gate history for their flat

### Guard

- create delivery entries
- create visitor entries
- capture delivery photos
- mark exits
- view own shift logs

### Admin

- manage society settings
- manage flats and members
- assign guards
- publish notices and alerts
- view all gate logs
- override approval outcomes when policy allows
- review audit logs

## 8. Core User Flows

### Society Launch Flow

1. Admin creates society
2. Admin selects a flat structure template or uploads CSV
3. System creates `society_flats`
4. Admin assigns additional admins and guards
5. System generates invite links / QR codes
6. Households join and attach to their flat
7. Guard training mode walks through first entry
8. Society goes live

### Delivery Approval Flow

1. Guard opens Gate
2. Search flat
3. Enter rider name
4. Capture photo
5. Submit entry
6. Resident household members receive push
7. First valid approval or denial wins
8. Guard sees realtime result
9. Entry expires if no action within configured window
10. Every approval, denial, expiry, and override is logged

### Visitor Flow

1. Guard opens Gate
2. Search flat
3. Enter visitor name
4. Optional photo if policy requires it later
5. Submit entry
6. Guard marks exit later
7. Entry and exit appear in logs

### Official Communication Flow

1. Admin creates notice or alert
2. Residents receive in-app and optional push
3. Alerts have expiry and higher visual priority
4. Notices remain visible until archived

## 9. Information Architecture

### Resident Mobile Navigation

- Home
- Gate
- Notices
- Profile

`Home` shows urgent alerts and approval requests first. It is not an open social feed.

### Guard Mobile Navigation

- New Entry
- Logs
- Profile

### Admin Web Navigation

- Overview
- Flats
- Members
- Guards
- Notices
- Gate Logs
- Audit
- Settings

## 10. Technical Architecture

### Frontend

- Expo React Native for resident and guard mobile experiences
- custom component system from `design-system/`
- TanStack Query for server state
- local persisted queue for guard offline actions

### Admin Web

- Next.js or equivalent lightweight web app
- shares types and API contracts with mobile app

### Backend

- Supabase Auth for OTP login
- Postgres as source of truth
- Row Level Security for data isolation
- Edge Functions for guarded write operations and signed media access
- Realtime for approval updates and official announcements where needed
- Storage for gate photos

### Storage Rules

- separate buckets for gate photos and other media
- no direct public gate photo URLs
- signed URL access only
- retention-driven deletion job

## 11. Data Model

The current plan should stop treating flats as loose text. The canonical relation must be the flat record.

### Core Tables

#### `societies`

- metadata about the society
- invite code
- status
- launch state

#### `society_flats`

- canonical flat row
- `society_id`
- `block`
- `unit`
- `display_name`
- occupancy / activation metadata

`display_name` is for UI. `id` is the canonical relation.

#### `society_members`

- maps authenticated user to society
- `society_id`
- `society_flat_id`
- `role` = resident | admin | guard
- `member_type` = owner | tenant | family | staff
- `display_name`
- active state

Important rules:

- remove global `UNIQUE(user_id)`
- allow the same user in multiple societies if needed
- use `UNIQUE(society_id, user_id)` instead
- residents link to one flat through `society_flat_id`
- multiple members can belong to the same flat

#### `push_devices`

- one row per device token
- `member_id`
- `platform`
- `push_token`
- `last_seen_at`
- active / invalid state

Do not store one push token directly on the member row. Multi-device households are normal.

#### `posts`

Limit categories in v1 to:

- `alert`
- `notice`

Remove social categories from v1.

#### `gate_entries`

- `society_id`
- `society_flat_id`
- `created_by_member_id`
- `entry_type` = delivery | visitor
- `visitor_name`
- `photo_path`
- `approval_status` = pending | approved | denied | auto_approved | expired
- `approved_by_member_id`
- `approved_at`
- `expires_at`
- `entry_time`
- `exit_time`
- `exit_marked_by_member_id`
- `offline_client_id`
- `created_at`

Key changes:

- remove `vip` from v1
- add `expires_at`
- use `society_flat_id` as canonical foreign key
- keep flat display text denormalized only for snapshots if needed

#### `audit_log`

- `society_id`
- `actor_member_id`
- `action`
- `entity_type`
- `entity_id`
- `changes`
- `context`
- `created_at`

Actions to log in v1:

- gate entry created
- gate entry approved
- gate entry denied
- gate entry expired
- gate exit marked
- admin override
- notice created
- notice archived
- member role changed

## 12. Security And Privacy

### Security

- RLS is the baseline boundary
- every Edge Function validates JWT and role
- signed media access for gate photos
- no cross-society reads
- resident can only see entries tied to their own flat
- guard can only create entries in their own society
- admin override paths must be explicit, not implied

### Privacy

- no ads
- no data resale
- delivery photo retention is short and documented
- capture consent shown in guard flow
- audit trail exists for every sensitive action
- legal copy should be conservative until reviewed

### Compliance Direction

Design for DPDP-safe behavior, but do not claim legal compliance in product copy without counsel review.

## 13. API And Write Logic

### Principle

All sensitive write operations should happen through backend-controlled APIs, not raw client writes.

### Required APIs

- `POST /api/societies`
- `POST /api/societies/:id/flats/import`
- `POST /api/invites`
- `POST /api/notices`
- `POST /api/gate/entries`
- `PATCH /api/gate/entries/:id/approve`
- `PATCH /api/gate/entries/:id/deny`
- `PATCH /api/gate/entries/:id/exit`
- `POST /api/gate/entries/:id/photo-url`
- `GET /api/gate/logs`
- `GET /api/audit`

### Race Safety

Delivery approval must be atomic.

Two household members pressing approve at the same time must not produce inconsistent results.

Implementation requirement:

- use a single transaction or RPC that updates only when `approval_status = 'pending'`
- return the winning result deterministically
- log the action in the same transaction where possible

## 14. Performance Targets

These are product requirements, not nice-to-haves.

- guard creates a new delivery entry in under 30 seconds
- flat search responds in under 200ms for 1000 flats
- approval status update reaches guard in under 5 seconds for 95 percent of cases
- app remains usable on low-end Android with 2GB RAM
- offline-created entry syncs without duplication after reconnect

## 15. Acceptance Criteria

### Product Acceptance

- one society with 80 to 300 flats can launch in one day
- residents can join without manual cleanup of flat names
- admins can audit all gate actions from web
- guard can complete the main flow without training debt

### UX Acceptance

- the gate entry form uses large touch targets and minimal fields
- delivery result state is impossible to miss
- the resident app feels official, calm, and uncluttered
- the design system remains custom and intentional

### Technical Acceptance

- all flat relationships use `society_flat_id`
- no gate photo is publicly accessible
- audit log covers all sensitive actions
- approval race condition is handled safely

## 16. Test Plan

### Critical Automated Tests

- RLS: resident from Flat A cannot read Flat B gate entries
- RLS: member from Society A cannot read Society B data
- approval race: two members approve or deny at the same time
- offline sync: duplicate client submissions do not create duplicate gate entries
- audit log: every sensitive action creates a log row
- retention job: expired gate photos are no longer retrievable

### Critical Manual Tests

- guard completes delivery entry in under 30 seconds
- low-end Android guard device remains responsive
- flat search works with 1000 flats
- approval notification and deep link work on physical devices
- admin can import flats and assign guards from web
- resident sees only their own flat history

## 17. Delivery Phases

### Phase 0 - Plan Cleanup

- finalize this implementation plan
- create product copy from this positioning
- remove old contradictory sections

### Phase 1 - Foundation

- Supabase project setup
- auth
- base schema
- `society_flats`
- `society_members`
- `push_devices`
- `audit_log`
- shared types
- design system baseline

### Phase 2 - Society Launch

- admin web shell
- flat import
- invite links / QR
- household linking
- role assignment

### Phase 3 - Gate Operations

- guard app shell
- flat search
- delivery flow
- visitor flow
- offline queue
- realtime approval result
- exit marking

### Phase 4 - Resident Experience

- resident home
- notices
- alerts
- approval requests
- flat history

### Phase 5 - Hardening

- signed photo access
- retention job
- audit views
- device testing
- pilot launch prep

## 18. Launch Strategy

### First Beachhead

Target apartment communities with:

- 80 to 300 flats
- visible WhatsApp chaos
- no deep ERP dependency
- committee members willing to try a cleaner product

### Sales Motion

- founder-led sales
- founder-led onboarding for first societies
- demo led by guard flow and one-day launch promise

### Demo Story

Lead with:

1. guard creates entry fast
2. resident approves instantly
3. admin audits it later
4. notices and alerts stay clean and official

Do not lead with broad feature count.

## 19. Market References

Use these as positioning references, not as products to clone:

- MyGate: https://mygate.com/
- MyGate visitor management: https://mygate.com/visitor-management/
- NoBrokerHood visitor system: https://www.nobrokerhood.com/solutions/visitor-registration-system
- NoBrokerHood security platform: https://www.nobrokerhood.com/solutions/apartment-security-management-system
- ADDA: https://contact.adda.io/
- ADDA Essential: https://contact.adda.io/essential/
- ApnaComplex Gatekeeper: https://www.apnacomplex.com/gatekeeper

## 20. Non-Negotiables

- guard UX is the wedge
- official communication stays focused
- flat records are canonical
- household access is first-class
- admin web exists in v1
- privacy defaults are visible
- no clone strategy

