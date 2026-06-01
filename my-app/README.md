# LookAI — Your Personal AI Stylist

A React Native mobile application built with Expo that helps users discover their personal style, organize their wardrobe, and receive AI-powered outfit recommendations.

---

## 🚀 Tech Stack

| Layer               | Technology                                                      |
| ------------------- | --------------------------------------------------------------- |
| **Framework**       | Expo SDK 54 + React Native 0.81.5                               |
| **Language**        | TypeScript                                                      |
| **Routing**         | Expo Router (file-based navigation)                             |
| **Auth**            | Clerk (Google SSO + Email OTP passwordless login)               |
| **Backend**         | Supabase (PostgreSQL + RLS + Database Functions)                |
| **State**           | Zustand v5 (persisted via `expo-secure-store`)                  |
| **Styling**         | NativeWind v4 + TailwindCSS 3                                   |
| **Animations**      | React Native Reanimated (layout transitions & fades)            |
| **In-App Purchase** | Google Play Billing / App Store (`react-native-iap` + Webhooks) |

---

## 📂 Codebase Structure

The project directory structure is organized as follows:

```
my-app/
├── app/                        # Main routing entry (Expo Router file-based)
│   ├── _layout.tsx             # Root: Clerk provider + global Auth Guard redirects
│   ├── index.tsx               # Main entry routing resolver
│   ├── get-started.tsx         # Landing splash screen
│   ├── (auth)/                 # Auth route screens
│   │   ├── sign-in.tsx         # Email / Google SSO sign-in options
│   │   └── email.tsx           # OTP validation verification with 30s resend timer
│   └── (root)/                 # Authenticated workspace screens
│       ├── _layout.tsx         # Authenticated environment wrapper
│       ├── calendar.tsx        # Outfit wear logs calendar interface
│       ├── streak.tsx          # Logging streak tracking details
│       ├── (tabs)/             # Main Tab Bar screen views
│       │   ├── _layout.tsx     # Tab setup & navigation index mapping
│       │   ├── index.tsx       # Home: Highlights, trend feeds, and stats overview
│       │   ├── wardrobe.tsx    # Wardrobe: Toggle between Grid & Grouped Carousels
│       │   ├── outfit.tsx      # Outfit: AI Outfit Suggester (only accessible via Action Menu)
│       │   ├── saved.tsx       # Saved: Outfits screen with overlapping fanned decks
│       │   ├── score.tsx       # Score: Style Score metrics & achievements dashboard
│       │   ├── profile.tsx     # Profile: Redesigned bio summary, body stats, and settings
│       │   ├── subscription.tsx # Paywall pricing screen options
│       │   └── manage-subscription.tsx # Subscription billing history & cancel options
│       ├── onboarding/         # Onboarding questionnaire wizard
│       │   ├── index.tsx       # Onboarding entry page
│       │   ├── step{1-6}.tsx   # Wizard steps (Age, Height, Gender, Body, Styles)
│       │   └── _layout.tsx     # Wizard state progress navigation
│       ├── add-clothes/        # Clothes registration flow
│       │   ├── _layout.tsx     # Clothes creation router
│       │   ├── index.tsx       # Main page (Upload options / Grid preview)
│       │   ├── camera.tsx      # In-app custom viewfinder camera
│       │   ├── scanning.tsx    # Backdrop scanning indicator animation
│       │   ├── form.tsx        # Metadata form (Categories, colors, occasions)
│       │   └── success.tsx     # Completion success feedback screen
│       └── log-outfit/         # Logging daily outfits flow
│           ├── _layout.tsx     # Daily log router
│           ├── camera.tsx      # Custom image viewfinder camera
│           ├── analyzing.tsx   # AI scan analyzing simulation backdrop
│           ├── confirm.tsx     # Confirmed items lists checks
│           ├── info.tsx        # Details metadata log fields
│           ├── details.tsx     # Summary check log page
│           └── success.tsx     # Completion daily logged feedback screen
├── components/                 # Reusable React components
│   ├── navigation/             # Navigation-specific elements
│   │   ├── AddActionMenu.tsx   # Overlay translucent modal menu (top & bottom bar styled)
│   │   ├── CustomTabBar.tsx    # Floating animated tab bar with center Add FAB button
│   │   └── SwipeTabWrapper.tsx # Screen page swipe wrap structure (click-only navigation)
│   ├── onboarding/             # Onboarding picker forms
│   │   ├── AgePicker.tsx       # Horizontal scrolling age wheel
│   │   ├── HeightPicker.tsx    # Vertical scrolling height ruler
│   │   └── BodyTypeCard.tsx    # Gender-aware body graphics selection
│   └── ui/                     # Shared UI layout elements
│       ├── HomeHeader.tsx      # Welcome header with avatar and streak pill
│       ├── WeeklyCalendarStrip.tsx # Horizontal weekly calendar calendar row
│       ├── WardrobeHighlights.tsx  # Horizontal scroll highlights category carousel
│       ├── WardrobeRingSummaryCard.tsx # Usage stats ring chart illustration
│       ├── RecentlyUploadedCard.tsx    # Double grid preview card list
│       └── TrendFeed.tsx       # Scrolling fashion visual trend guides
├── backend/                    # Core Database sync layer
│   ├── api/                    # Supabase config clients
│   │   ├── supabase.ts         # Injects Clerk JWT token authentication headers
│   │   └── entitlement.ts      # Verifies active subscription queries
│   ├── hooks/                  # Custom database querying hooks
│   │   ├── useSupabase.ts      # Context client retrieval
│   │   ├── useSupabaseQuery.ts # Generic hook querying database tables
│   │   └── useWardrobeSummary.ts # Fetch user stats from database summary table
│   └── store/                  # Persisted database state stores
│       ├── onboarding-store.ts # Zustand wizard questionnaire sync store
│       └── outfit-analysis-store.ts # AI scan details cache store
├── billing/                    # Local in-app purchasing services
│   ├── store.ts                # Zustand Store managing subscriptions and billing state
│   ├── BillingService.ts       # IAP lifecycle management (Google Play Billing / App Store)
│   ├── hooks.ts                # Custom subscription active status react hooks
│   └── types.ts                # Type boundaries for purchases and billing states
├── supabase/                   # Supabase backend scripts
│   ├── schema.sql              # Database schemas, policies, functions, & triggers
│   └── functions/              # Supabase Edge Functions (Deno runtime)
│       ├── billing-webhook/    # Listens to Store IAP notifications & updates DB
│       └── verify-purchase/    # Manages receipt validation verification
├── src/                        # Secondary shared source package structures
├── assets/                     # Graphics, logos, and onboarding illustrations
├── package.json                # Project dependencies
└── app.json                    # Expo config specifications
```

---

## 🛠 File Explanations of Key Modules

- **`app/_layout.tsx`**: The main application file. Configures Clerk auth context, registers global font assets, and executes the **Auth Guard** redirect routing logic (watches user authorization and checks onboarding completion flag from `SecureStore` to route users appropriately).
- **`components/navigation/AddActionMenu.tsx`**: Renders the overlay menu modal when the bottom tab "+" button is clicked. It uses a translucent dark `BlurView` backdrop. To fit this dark layout, it leverages the `expo-status-bar` and `expo-navigation-bar` libraries to dynamically style both the **top status bar** and the **Android bottom system navigation bar** to a dark style (`#1A1827` with white icons) while the modal is open, and reverts them back to light style when closed.
- **`app/(root)/(tabs)/wardrobe.tsx`**: Main wardrobe interface. Combines dynamic statistics (Total, Worn, Unworn, Usage) with:
  - **Text-only category filter chips** at the top.
  - A Segmented Toggle switch allowing users to swap between **Grouped View** (vertical category headers with horizontal scroll carousels) and **Grid View** (a clean 3-column items grid).
  - A custom dotted **"Add cloth" card** placed at index 0 of the grid and carousels for easy upload.
  - An **AI Suggestion** card styled dark at the footer.
- **`app/(root)/(tabs)/saved.tsx`**: Favorites screen displaying saved looks. Uses a customized `OutfitPreview` component that dynamically positions clothing cards in an **overlapping fanned deck** with tilt angles (`transform: [{ rotate: '8deg' }]`), providing a premium look. It includes heart icons to unsave favorited items and an empty-state screen directing users to the AI Planner.
- **`app/(root)/(tabs)/outfit.tsx`**: Redesigned **AI Outfit Suggester** screen (light themed `#F8F7FC`). Renders weather/style pills, a 3-item collage, checkmark badges, and a custom note explanation panel. Features interactive reload cycling (simulate AI planning) and alternative scrolling cards that load into the main screen on click. Hidden from the tab bar navigation.
- **`app/(root)/(tabs)/score.tsx`**: The new **Style Score** dashboard. Features interactive segmented period selectors (Daily, Weekly, Monthly), a custom circular score ring built with `react-native-svg`, 6 progress-bar category breakdowns, improvement recommendations, and a scrolling achievements badge panel. Hidden from the tab bar navigation.
- **`app/(root)/(tabs)/profile.tsx`**: Redesigned **User Profile** tab. Built using clean grid components. Displays centered avatar with online indicator, user bio and style badges, clothes summary statistics, Body Profile emoji cards (Height, Body Type, Skin Tone, Age), preference tastes pills, referral Copy invitation code (`ZARA2026`), and settings menu logs.
- **`backend/hooks/useSupabaseQuery.ts`**: A generic data-fetching hook that handles Supabase querying, returns loading and error states, and supports conditional query building (`apply` parameter) using the Clerk JWT-authenticated client.

---

## 🔄 Core Application Workflows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          1. AUTH & ONBOARDING FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘
  Clerk SSO/OTP Verify ──→ Onboarding Wizard ──→ Upsert Profile to Supabase
                                                     │
  Home Screen Tab Layout ←── SecureStore True ←──────┘
```

### 1. Authentication & Onboarding

1.  Users land on `get-started.tsx` and navigate to sign in via **Google SSO** or **Email OTP**.
2.  If signed in but onboarding is incomplete, they are routed to the **Onboarding Wizard** (`app/(root)/onboarding`), passing through a 6-step progress bar collecting age, height, gender, body shape, and style tastes.
3.  On step 6, data is upserted to the Supabase database (`user_profiles`), and an onboarding completion flag is saved locally to the device's secure storage.
4.  The root auth guard detects the flag and redirects the user into the main tabs layout.

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          2. ADD CLOTHES FLOW (AI Scan)                      │
└─────────────────────────────────────────────────────────────────────────────┘
  Custom camera click ──→ AI Scan Animation ──→ Auto-detect attributes ──→ Save
```

### 2. Add Clothes Flow

1.  Opening the camera inside `add-clothes` allows users to snap a photo of their clothing.
2.  The app shows a pulsing scanning animation backdrop (`scanning.tsx`) while analyzing the cloth.
3.  The results populate the metadata form (`form.tsx`), auto-detecting the category, occasion, and dominant color.
4.  The user confirms the form, and the item is saved to the database. It immediately populates the Wardrobe tab.

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          3. VIEW MODE TOGGLE WORKFLOW                       │
└─────────────────────────────────────────────────────────────────────────────┘
  [Grouped View (Default)]                        [Grid View]
  ├── Tops Carousel (Add + items)                 ├── Row 1: [Add] [Item] [Item]
  ├── Bottoms Carousel (Add + items)              ├── Row 2: [Item] [Item] [Item]
  └── Shoes Carousel (Add + items)                └── Row 3: [Item] [Item] [Item]
```

### 3. Wardrobe View Modes Toggle

- **Grouped View (Default)**: The list shows item categories vertically, with each category displaying its items in a horizontal scroll carousel. Selecting a category filter chip at the top dynamically narrows the view down to show only that category's carousel.
- **Grid View**: Changes the layout to a uniform 3-column scrollable grid. Prepend the dashed add card at the top-left index.
- **How it works**: Swapping view modes changes a `viewMode` state, which swaps between two separate `FlatList` components mapped to unique `key` parameters (`grid-view` vs `grouped-view`). This forces React Native to cleanly remount the list, preventing layout calculation crashes.

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          4. BILLING & ENTIRE PAYWALL                        │
└─────────────────────────────────────────────────────────────────────────────┘
  Check Pro Status ──→ Subscription Screen (Paywall) ──→ trigger native purchase
                                                               │
  Pro Unlock! /🤖 IAP ←── Webhook Sync (user_entitlements) ←──┘
```

### 4. Billing & Premium Flow

1.  Features like the **AI Outfit Planner** check the local `useBillingStore` state for `isPremium` authorization. If the user is on the free tier, a locked premium message is displayed.
2.  If the user clicks "View Plans" or "Manage Subscription", the paywall (`subscription.tsx`) renders the subscription package.
3.  Clicking a package executes purchase sequences via `BillingService.ts` (wraps native Apple App Store or Google Play Store billing APIs).
4.  Once bought, a notification is sent to the Supabase Edge Function webhook (`billing-webhook`), which verifies the receipt against store servers and upserts an entitlement record in the database, unlocking Pro features across the app.

---

## 💻 Getting Started

### Prerequisites

- **Node.js 18+**
- **Expo CLI** (`npx expo`)
- **Clerk Account** (for user management API keys)
- **Supabase Project** (Postgres DB)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxx
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
```

### 3. Run the Development Server

```bash
npx expo start
```

Run `a` to load on Android Emulator, `i` to load on iOS Simulator, or scan the QR code to open inside the Expo Go client.

---

## 📜 Available Scripts

- `npm start`: Launches the Expo development server.
- `npm run android`: Opens the application inside the connected Android emulator.
- `npm run ios`: Opens the application inside the iOS simulator.
- `npm run web`: Launches the web-browser preview dev client.
- `npm run lint`: Scans source files for syntax and stylistic issues.
- `npm run reset-project`: Resets workspace to a blank boilerplate configuration.
