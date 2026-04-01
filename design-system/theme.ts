/**
 * ColonyOS Design System
 * 
 * Inspired by: Discord (clean lists, green accents), Cosmos (dark premium splash),
 * Mozi (bold saturated full-bleed), Lex (QR flows, yellow CTAs, pill buttons)
 * 
 * Philosophy: Clean white surfaces for content consumption. Bold saturated color
 * for moments of delight (onboarding, CTAs, category tags). Generous radius everywhere.
 * Emoji as visual identity instead of custom icons where possible.
 * Flat number as identity — always visible, always styled consistently.
 */

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────

export const colors = {
  // ── Primary ──
  // Warm emerald green — trustworthy, community-friendly
  // Distinct from WhatsApp dark green (#25D366) and MyGate blue
  primary: {
    50:  '#E8FAF0',
    100: '#C5F2DA',
    200: '#9EE8C1',
    300: '#6DDBA5',
    400: '#3FD08B',
    500: '#2BB673', // ◀ primary base
    600: '#22995F',
    700: '#1A7D4D',
    800: '#13613B',
    900: '#0D4529',
  },

  // ── Accent ──
  // Warm yellow for CTAs and highlights (from Lex QR screen)
  accent: {
    50:  '#FFF9E0',
    100: '#FFF0B3',
    200: '#FFE680',
    300: '#FFDB4D',
    400: '#FFD326',
    500: '#FFCA08', // ◀ accent base — buttons, highlights
    600: '#D4A806',
    700: '#AA8705',
    800: '#806504',
    900: '#554303',
  },

  // ── Category Colors ──
  // Each post category has a distinct, saturated color
  // Used for: category chips, left border on post cards, icons
  category: {
    alert:   '#FF453A', // red — urgent, grabs attention
    notice:  '#0A84FF', // blue — official, authoritative
    service: '#FF9F0A', // amber — warm, helpful
    help:    '#BF5AF2', // purple — asking, requesting
    sale:    '#30D158', // green — transactional, positive
  },

  // ── Neutrals ──
  // Warm grays, not cold blue-grays. From Discord's clean white surfaces.
  neutral: {
    0:   '#FFFFFF',
    50:  '#FAFAFA',
    100: '#F5F5F5', // ◀ main background
    150: '#EFEFEF',
    200: '#E5E5E5', // ◀ borders, dividers
    300: '#D4D4D4',
    400: '#A3A3A3', // ◀ placeholder text
    500: '#737373', // ◀ secondary text
    600: '#525252',
    700: '#404040', // ◀ body text
    800: '#262626', // ◀ headings
    900: '#171717', // ◀ high emphasis
    950: '#0A0A0A', // ◀ dark mode surfaces (Cosmos-inspired)
  },

  // ── Semantic ──
  success: '#30D158',
  warning: '#FF9F0A',
  error:   '#FF453A',
  info:    '#0A84FF',

  // ── Special Surfaces ──
  // Dark mode for splash/onboarding screens (Cosmos blob aesthetic)
  splash: {
    background: '#0A0A0A',
    surface:    '#1A1A1A',
    text:       '#FFFFFF',
    textMuted:  'rgba(255, 255, 255, 0.6)',
  },

  // Bold full-bleed backgrounds for onboarding steps (Mozi-inspired)
  onboarding: {
    // Each onboarding step gets a different bold bg
    step1: '#2BB673', // green — welcome
    step2: '#0A84FF', // blue — explain feed
    step3: '#FFCA08', // yellow — join society
  },
} as const;


// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────

export const typography = {
  // Font family — Inter for clean readability
  // Falls back to system font if Inter isn't loaded yet
  fontFamily: {
    regular:    'Inter_400Regular',
    medium:     'Inter_500Medium',
    semibold:   'Inter_600SemiBold',
    bold:       'Inter_700Bold',
    extrabold:  'Inter_800ExtraBold',
  },

  // Type scale — mobile-first, generous sizing
  // Named semantically, not by pixel size
  size: {
    xs:     11,   // timestamps, metadata
    sm:     13,   // secondary labels, flat badge text
    base:   15,   // body text, post content
    md:     17,   // list item titles, input text
    lg:     20,   // section headers, card titles
    xl:     24,   // screen titles
    '2xl':  28,   // onboarding headlines
    '3xl':  34,   // splash screen text
    '4xl':  42,   // big numbers (reaction counts)
  },

  lineHeight: {
    tight:   1.2,  // headings
    normal:  1.5,  // body text
    relaxed: 1.7,  // long-form content
  },

  letterSpacing: {
    tight:   -0.5,  // large headings
    normal:  0,     // body
    wide:    0.5,   // labels, badges
    wider:   1.0,   // uppercase labels
  },
} as const;


// ─────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────

// 4px base unit, common increments
export const spacing = {
  xs:     4,
  sm:     8,
  md:     12,
  base:   16,  // ◀ standard padding
  lg:     20,
  xl:     24,
  '2xl':  32,
  '3xl':  40,
  '4xl':  48,
  '5xl':  64,
  '6xl':  80,
} as const;


// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────

// Very generous radius everywhere — from all 5 inspo screenshots
export const radius = {
  xs:    4,    // tiny elements, inline badges
  sm:    8,    // small chips, tags
  md:    12,   // input fields, small cards
  lg:    16,   // cards, post cards, modals
  xl:    20,   // bottom sheets, large cards
  '2xl': 24,   // buttons, search bar (Discord-style)
  '3xl': 32,   // QR code container (Lex-style)
  full:  9999, // pills, avatars, circular elements
} as const;


// ─────────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────────

// Subtle, warm shadows — not harsh drop shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  // For floating action buttons and bottom sheets
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;


// ─────────────────────────────────────────────
// COMPONENT TOKENS
// ─────────────────────────────────────────────

// Pre-composed styles for specific components
// These reference the primitives above

export const components = {

  // ── Screen ──
  screen: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.base,
  },

  // ── Post Card ──
  // White card on gray background, left color border by category
  postCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    // borderLeftColor set dynamically by category
    ...shadows.sm,
  },

  // ── Alert Banner ──
  // Red-tinted surface, always at top of feed
  alertBanner: {
    backgroundColor: '#FFF0EF',
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.category.alert,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },

  // ── Notice Banner ──
  // Blue-tinted surface, pinned below alerts
  noticeBanner: {
    backgroundColor: '#EBF3FF',
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.category.notice,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },

  // ── Flat Badge ──
  // The identity tag — "B-204" — always visible, always styled the same
  flatBadge: {
    backgroundColor: colors.neutral[150],
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    // text inside: semibold, size sm, color neutral.800
  },

  // ── Category Chip ──
  // Filter chips at top of feed (Discord search bar area)
  categoryChip: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    // active: filled with category color, white text
    // inactive: neutral.150 bg, neutral.600 text
  },

  // ── Reaction Button ──
  // Pill-shaped, subtle, with count
  reactionButton: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    // active: primary.50 bg, primary.500 border, primary.700 text
  },

  // ── Primary Button ──
  // Bold yellow CTA (Lex-inspired)
  primaryButton: {
    backgroundColor: colors.accent[500],
    borderRadius: radius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    // text: bold, neutral.900 (black on yellow)
    ...shadows.md,
  },

  // ── Secondary Button ──
  // Dark pill button (Lex "Show my code" / "Scan a code" style)
  secondaryButton: {
    backgroundColor: colors.neutral[900],
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    // text: bold, white
  },

  // ── Ghost Button ──
  // Transparent with border
  ghostButton: {
    backgroundColor: 'transparent',
    borderRadius: radius['2xl'],
    borderWidth: 1.5,
    borderColor: colors.neutral[300],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    // text: semibold, neutral.700
  },

  // ── Search Bar ──
  // Rounded, light gray bg (Discord-inspired)
  searchBar: {
    backgroundColor: colors.neutral[150],
    borderRadius: radius['2xl'],
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    // placeholder color: neutral.400
    // icon color: neutral.500
  },

  // ── Input Field ──
  inputField: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    // focus: borderColor → primary.500
    // text: md size, neutral.900
  },

  // ── Bottom Tab Bar ──
  bottomTab: {
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[150],
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg, // safe area
    // active icon: primary.500
    // inactive icon: neutral.400
    // active label: primary.700, semibold
    // inactive label: neutral.500, regular
  },

  // ── Avatar / Flat Circle ──
  avatar: {
    small:  32,
    medium: 40,
    large:  56,
    xl:     80,
    borderRadius: radius.full,
    backgroundColor: colors.primary[100],
    // text inside: primary.700, bold, initials or flat number
  },

  // ── Bottom Sheet ──
  // For duplicate prompt, post actions, etc.
  bottomSheet: {
    backgroundColor: colors.neutral[0],
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.xl,
  },

  // ── Message Bubble ──
  messageBubble: {
    sent: {
      backgroundColor: colors.primary[500],
      borderRadius: radius.lg,
      borderBottomRightRadius: radius.xs,
      // text: white
    },
    received: {
      backgroundColor: colors.neutral[150],
      borderRadius: radius.lg,
      borderBottomLeftRadius: radius.xs,
      // text: neutral.900
    },
    padding: spacing.md,
    maxWidth: '75%',
  },

  // ── QR Code Card ──
  // White card on colored background (Lex-inspired)
  qrCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius['3xl'],
    padding: spacing['2xl'],
    ...shadows.lg,
    // centered, generous padding around QR
  },

  // ── Countdown Timer (on alerts) ──
  countdownBadge: {
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    // text: error color, xs size, medium weight
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: colors.neutral[150],
    marginVertical: spacing.md,
  },

  // ── Toast / Snackbar ──
  toast: {
    backgroundColor: colors.neutral[900],
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    // text: white, base size
    ...shadows.lg,
  },
} as const;


// ─────────────────────────────────────────────
// ANIMATION TOKENS
// ─────────────────────────────────────────────

export const animation = {
  // Durations (ms)
  duration: {
    instant:  100,
    fast:     200,
    normal:   300,
    slow:     500,
    splash:   800,  // splash screen fade
  },

  // Easing curves
  easing: {
    // Spring-like — for interactive elements (buttons, reactions)
    spring: { damping: 15, stiffness: 150, mass: 1 },
    // Smooth — for transitions (screen changes, bottom sheets)
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    // Bounce — for playful moments (reaction added, duplicate prompt)
    bounce: { damping: 10, stiffness: 180, mass: 0.8 },
  },
} as const;


// ─────────────────────────────────────────────
// CATEGORY CONFIG
// ─────────────────────────────────────────────

// Maps category to its visual properties + behavior rules
export const categoryConfig = {
  alert: {
    label: 'Alert',
    emoji: '🚨',
    color: colors.category.alert,
    bgTint: '#FFF0EF',
    expiryHours: 6,
    allowComments: false,    // reactions only
    allowReactions: true,
    pushNotification: true,  // always push
  },
  notice: {
    label: 'Notice',
    emoji: '📢',
    color: colors.category.notice,
    bgTint: '#EBF3FF',
    expiryHours: null,       // never expires
    allowComments: false,    // reactions only
    allowReactions: true,
    pushNotification: true,  // always push
    adminOnly: true,         // only RWA admin can post
  },
  service: {
    label: 'Service',
    emoji: '🔧',
    color: colors.category.service,
    bgTint: '#FFF6E5',
    expiryHours: 60 * 24,   // 60 days
    allowComments: true,
    allowReactions: true,
    pushNotification: false, // digest only
  },
  help: {
    label: 'Help',
    emoji: '🤝',
    color: colors.category.help,
    bgTint: '#F5EAFF',
    expiryHours: 7 * 24,    // 7 days
    allowComments: true,
    allowReactions: true,
    pushNotification: false, // opt-in only
  },
  sale: {
    label: 'For Sale',
    emoji: '🛒',
    color: colors.category.sale,
    bgTint: '#E8FAF0',
    expiryHours: 21 * 24,   // 21 days
    allowComments: true,
    allowReactions: true,
    pushNotification: false, // no push
  },
} as const;

export type CategoryKey = keyof typeof categoryConfig;


// ─────────────────────────────────────────────
// REACTION CONFIG
// ─────────────────────────────────────────────

export const reactionConfig = {
  confirmed: {
    emoji: '✅',
    label: 'Confirmed',
    countLabel: (n: number) => `${n} flat${n !== 1 ? 's' : ''} confirmed`,
  },
  resolved: {
    emoji: '🔕',
    label: 'Resolved for me',
    countLabel: (n: number) => `${n} flat${n !== 1 ? 's' : ''} resolved`,
  },
  thanks: {
    emoji: '👍',
    label: 'Thanks',
    countLabel: (n: number) => `${n} thank${n !== 1 ? 's' : ''}`,
  },
} as const;

export type ReactionKey = keyof typeof reactionConfig;
