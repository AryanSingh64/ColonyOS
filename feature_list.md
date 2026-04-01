# ColonyOS Feature List

This file lists the product features in simple language.

ColonyOS is a society app for:

- gate security
- delivery approvals
- visitor logging
- official notices and alerts
- flat and household management
- simple admin control

It is meant to feel faster, cleaner, and more private than the usual society apps.

## 1. Society Setup

- Create a new society
- Add society details
- Import all flats from CSV
- Use default flat structure templates
- Generate invite links and QR invites
- Add admins
- Add guards
- Launch the society in one day

## 2. Household and Member Management

- Link multiple people to the same flat
- Support owner, tenant, family member, and staff roles
- Join a society with phone OTP
- Attach the user to the correct flat
- Move a resident from one flat to another
- Mark a resident as moved out
- Stop old flat notifications after move-out
- Rejoin a society later without breaking old records

## 3. Resident App Features

- Login with phone OTP
- See urgent alerts
- See official notices
- Approve or deny deliveries
- See visitor and delivery history for the resident's flat
- View household members linked to the flat
- Manage notification settings
- See a calm home screen without clutter

## 4. Guard App Features

- Create a new delivery entry
- Create a new visitor entry
- Search flats quickly
- Take rider photo for deliveries
- Mark visitor exit
- View today's gate logs
- View own shift history
- Use large buttons for faster entry
- Work on low-end Android phones

## 5. Delivery Approval Features

- Guard logs a delivery
- Resident gets a push notification
- Resident can approve or deny
- First household member response wins
- Guard sees approval result in real time
- Delivery request expires after a fixed time
- Every approval or denial is stored in the audit log

## 6. Visitor Management Features

- Log visitor name
- Link visitor to a flat
- Store entry time
- Store exit time
- View visitor history later
- Let admins review all visitor records

## 7. Official Communication Features

- Admin posts notices
- Admin posts urgent alerts
- Alerts appear with higher priority
- Notices stay visible until archived
- Residents get push notifications if needed
- App stays focused on official communication

## 8. Admin Web Console

- View society overview
- Manage flats
- Manage members
- Manage guards
- Publish notices and alerts
- View all gate logs
- View audit logs
- Manage settings
- Import society data from CSV

## 9. Privacy and Trust Features

- No in-app ads
- No selling resident data
- No third-party lead spam
- Gate photos are not public
- Gate photos use signed access only
- Short photo retention period
- Capture consent shown before photo storage
- Audit log for important actions
- Privacy-first product language

## 10. Offline and Poor Network Features

These matter because many societies have weak internet at gates, basements, or lifts.

- Guard app keeps working when internet is weak
- New entries are saved locally first
- Entries sync when internet comes back
- Prevent duplicate entry creation after reconnect
- Keep flat list cached on device
- Show sync status clearly
- Retry photo upload later if network fails

### Optional no-hardware ideas for later

- Temporary offline approval code system
- Missed-call or SMS fallback for resident approval
- Bluetooth-based local approval flow

These are useful differentiators, but they are harder and should come after the core gate flow is stable.

## 11. Move-In / Move-Out Features

This is a major weakness in other apps and should be done properly.

- Mark resident as moved out
- Remove old flat access quickly
- Stop old flat pushes immediately
- Keep audit trail of move-out
- Let a resident join a new flat cleanly
- Prevent people from being stuck in old societies for months

## 12. Accessibility and Non-Smartphone Support

These are important for Indian societies.

- Simple screens for elderly users
- Bigger text and buttons where needed
- Low-complexity resident flows
- SMS fallback for critical alerts later
- Voice call fallback for important approvals later

Full no-smartphone support is not a v1 feature, but the product should be designed so it can be added later.

## 13. Guard Accuracy and Audit Features

The system should not fully depend on perfect guard behavior.

- Audit every important gate action
- Show missing exit records
- Show pending approvals clearly
- Show failed photo uploads clearly
- Let admin review guard activity
- Training mode for new guards
- Keep the guard flow short so fewer mistakes happen

### Possible later improvements without extra hardware

- Resident-created guest pass from the app
- Resident pre-approve visitor before arrival
- Remote gate open flow if policy allows

## 14. Community Features

These are secondary features, not the main wedge.

### Marketplace

- Buy and sell posts inside the society
- Simple item listing
- Price field
- Contact seller
- Mark item as sold

### Borrow and Lend

- Ask to borrow items from neighbours
- Offer items for lending
- Set expected return date
- Mark returned

### Important note

Marketplace and borrowing should only be added after the security and official communication flows are solid. These features are useful, but they can easily make the app feel noisy and generic if added too early.

## 15. What Makes ColonyOS Different

- Faster gate entry flow
- Cleaner resident app
- No ad clutter
- Better privacy defaults
- Better move-out handling
- Household support from day one
- Strong admin audit trail
- Offline-safe guard experience
- Easier setup for smaller societies

## 16. Core v1 Feature Set

These are the features that matter most for the first real version:

- Society setup
- Flat import
- Household linking
- OTP login
- Guard app
- Delivery approvals
- Visitor logging
- Gate logs
- Official notices
- Urgent alerts
- Offline sync for guards
- Audit log
- Basic admin web console
- Privacy-safe photo access

## 17. Later Features

These can come after v1:

- Marketplace buy/sell
- Borrow and lend section
- SMS fallback approvals
- Voice call fallback approvals
- Resident pre-approved visitors
- Remote gate open without guard action
- Deeper reports for large societies
- Accounting or payment integrations

