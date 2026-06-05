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
| **Icons**           | Tabler Icons (`@tabler/icons-react-native`)                     |
| **Animations**      | React Native Reanimated + Animated API                          |
| **SVG**             | `react-native-svg` (rings, arcs, comfort score)                 |
| **Weather**         | Open-Meteo API (free, no API key required)                      |
| **In-App Purchase** | Google Play Billing / App Store (`react-native-iap` + Webhooks) |

---

## 📂 Codebase Structure

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
│       ├── saved.tsx           # Saved outfits screen with overlapping fanned decks
│       ├── look-ai.tsx         # AI Look generator screen
│       ├── trend-feed.tsx      # Fashion trends full-screen feed
│       ├── outfit-log-detail.tsx # Individual outfit log detail view
│       ├── wardrobe-highlights.tsx # Wardrobe highlights expanded view
│       ├── (tabs)/             # Main Tab Bar screen views
│       │   ├── _layout.tsx     # Tab setup & navigation index mapping
│       │   ├── index.tsx       # Home: Highlights, trend feeds, and stats overview
│       │   ├── wardrobe.tsx    # Wardrobe: Pinterest masonry grid + grouped carousels
│       │   ├── outfit.tsx      # Outfit: AI Outfit Suggester
│       │   ├── saved.tsx       # Saved: Bookmarked outfits screen
│       │   ├── score.tsx       # Score: Style Score metrics & achievements dashboard
│       │   ├── profile.tsx     # Profile: Bio summary, body stats, and settings
│       │   ├── subscription.tsx         # Paywall pricing screen
│       │   └── manage-subscription.tsx  # Billing history & cancel options
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
│   │   ├── AddActionMenu.tsx   # Overlay translucent modal menu
│   │   ├── CustomTabBar.tsx    # Floating animated tab bar with center Add FAB
│   │   └── SwipeTabWrapper.tsx # Screen swipe wrap structure
│   ├── onboarding/             # Onboarding picker forms
│   │   ├── AgePicker.tsx       # Horizontal scrolling age wheel
│   │   ├── HeightPicker.tsx    # Vertical scrolling height ruler
│   │   └── BodyTypeCard.tsx    # Gender-aware body graphics selection
│   └── ui/                     # Shared UI layout elements
│       ├── HomeHeader.tsx              # Welcome header with avatar and streak pill
│       ├── WeeklyCalendarStrip.tsx     # Horizontal weekly calendar row
│       ├── WardrobeHighlights.tsx      # Horizontal highlights category carousel
│       ├── WardrobeRingSummaryCard.tsx # Usage stats ring chart
│       ├── WeatherOutfitCard.tsx       # Real-time weather card (Open-Meteo)
│       ├── AIPickOfTheDayCard.tsx      # AI pick of the day card
│       ├── LookAIBanner.tsx            # Look AI promotional banner
│       ├── OutfitAnalyzingCard.tsx     # Outfit AI analyzing animation card
│       ├── RecentlyUploadedCard.tsx    # Recent uploads double grid preview
│       ├── TrendFeed.tsx               # Scrolling fashion visual trend guides
│       ├── WardrobeFilterTabs.tsx      # Wardrobe filter tab selector
│       ├── AppGradientBackground.tsx   # Shared gradient background wrapper
│       └── ErrorStateView.tsx          # Reusable error state display
├── backend/                    # Core Database sync layer
│   ├── api/                    # Supabase config clients
│   │   ├── supabase.ts         # Injects Clerk JWT token authentication headers
│   │   └── entitlement.ts      # Verifies active subscription queries
│   ├── hooks/                  # Custom database querying hooks
│   │   ├── useSupabase.ts      # Context client retrieval
│   │   ├── useSupabaseQuery.ts # Generic hook querying database tables
│   │   └── useWardrobeSummary.ts # Fetch user wardrobe stats from Supabase
│   └── store/                  # Persisted state stores (Zustand)
│       ├── onboarding-store.ts       # Wizard questionnaire sync store
│       ├── outfit-analysis-store.ts  # AI scan details cache store
│       └── weather-store.ts          # Real-time weather data store (Open-Meteo)
├── billing/                    # Local in-app purchasing services
│   ├── store.ts                # Zustand store for subscriptions & billing state
│   ├── BillingService.ts       # IAP lifecycle (Google Play Billing / App Store)
│   ├── hooks.ts                # Custom subscription status react hooks
│   └── types.ts                # Type boundaries for purchases and billing states
├── supabase/                   # Supabase backend scripts
│   ├── schema.sql              # Database schemas, policies, functions & triggers
│   └── functions/              # Supabase Edge Functions (Deno runtime)
│       ├── billing-webhook/    # Listens to Store IAP notifications & updates DB
│       └── verify-purchase/    # Manages receipt validation verification
├── assets/                     # Graphics, logos, and onboarding illustrations
├── package.json                # Project dependencies
└── app.json                    # Expo config specifications
```

---

## 🖥️ Screen Overview

| Screen | Description |
|---|---|
| **Home** | Daily dashboard — weekly calendar strip, wardrobe ring summary, weather outfit card, AI picks, recently uploaded, trend feed |
| **Wardrobe** | Digital wardrobe — half-ring usage stats, 41-category filter chips (paginated), Pinterest masonry grid view + grouped carousel view |
| **Score** | AI style score (0–100) with ring chart, category breakdowns, improvement tips, and achievement badges |
| **Saved** | Bookmarked outfits with fanned deck preview cards |
| **Profile** | User bio, body stats, style preferences, referral code, settings |

---

## 🛠 Key Module Details

- **`app/(root)/(tabs)/wardrobe.tsx`**: Main wardrobe interface featuring:
  - **Half-Ring Stats Card** — SVG semi-circle arc showing usage %, worn, total & unworn counts
  - **41-category filter chips** — paginated horizontal FlatList with dot indicators
  - **Pinterest Masonry Grid** — true 2-column masonry layout (independent column heights, 12 varying heights for natural feel)
  - **Grouped View** — vertical category headers with horizontal scroll carousels (CarouselCards)
  - **Add Menu** — bottom sheet modal with 4 options (Add Clothing, Scan & Add, From Gallery, Create Outfit)
  - **Dynamic section title** — changes from "All Categories" to selected category name

- **`components/ui/WeatherOutfitCard.tsx`**: Real-time weather card powered by Open-Meteo API (no API key needed):
  - Displays temperature, feels like, humidity %, wind speed (km/h), UV index + level
  - Animated comfort ring (0–100 score) built with `react-native-svg`
  - Animated spinning sun icon, blinking live dot
  - WMO weather code → readable condition mapping
  - 10-minute result caching via Zustand

- **`backend/store/weather-store.ts`**: Zustand store that:
  - Requests location permission via `expo-location`
  - Reverse geocodes coordinates to city/state name
  - Fetches live weather from Open-Meteo API
  - Calculates comfort score from temp, humidity & wind
  - Suggests best fabric and colors for current temperature

- **`components/navigation/AddActionMenu.tsx`**: Overlay menu modal opened from tab bar. Dynamically styles status bar and Android navigation bar to match dark overlay while open.

- **`app/(root)/(tabs)/score.tsx`**: Style Score dashboard with segmented period selectors (Daily/Weekly/Monthly), SVG circular score ring, 6 progress-bar category breakdowns, and scrolling achievement badge panel.

---

## 🔄 Core Application Workflows

### 1. Authentication & Onboarding

```
Clerk SSO/OTP → Onboarding Wizard (6 steps) → Upsert to Supabase → Home Tab
```

1. Users land on `get-started.tsx` → sign in via **Google SSO** or **Email OTP**
2. Incomplete onboarding → routed to 6-step wizard (age, height, gender, body shape, style tastes)
3. Step 6 upserts data to `user_profiles` table, saves completion flag to SecureStore
4. Auth guard detects flag → redirects to main tabs

---

### 2. Add Clothes Flow

```
Camera / Gallery → AI Scan Animation → Auto-detect attributes → Save to Supabase → Wardrobe
```

1. User opens Add menu (header `+` button or tab bar FAB)
2. Camera snaps photo → pulsing scan animation
3. AI auto-detects category, occasion, dominant color
4. User confirms metadata form → saved to database → appears in Wardrobe tab

---

### 3. Wardrobe View Modes

```
[Grid View — Pinterest Masonry]         [Grouped View — Carousels]
├── Left column  (varying heights)      ├── Tops    → horizontal scroll
├── Right column (offset 32px down)     ├── Jeans   → horizontal scroll
└── Cards: image only, rounded          └── Shoes   → horizontal scroll
```

- **Grid (Masonry)**: ScrollView with two independent `View` columns. Each card height comes from a 12-item `MASONRY_HEIGHTS` array cycling naturally. Right column offset by 32px for authentic Pinterest stagger. Cards show image only.
- **Grouped**: FlatList of `groupableCategories`, each rendered as a `GroupHeader` + horizontal `ScrollView` of `CarouselCard`s.

---

### 4. Real-Time Weather

```
Location Permission → GPS Coordinates → Reverse Geocode → Open-Meteo API → Display
```

- **Open-Meteo** endpoint: `api.open-meteo.com/v1/forecast`
- Fields fetched: `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `wind_speed_10m`, `uv_index`, `weather_code`, `is_day`
- Comfort score formula: `temp(50%) + humidity(30%) + wind(20%)`
- Results cached for 10 minutes

---

### 5. Billing & Premium Flow

```
isPremium check → Paywall (subscription.tsx) → Native IAP → Webhook → Supabase entitlements
```

1. AI features check `useBillingStore` for `isPremium`
2. Free users see paywall → select package → native Apple/Google billing
3. Purchase notification → Supabase Edge Function webhook → receipt verified → entitlement upserted

---

## 💻 Getting Started

### Prerequisites

- **Node.js 18+**
- **Expo CLI** (`npx expo`)
- **Clerk Account** (for auth API keys)
- **Supabase Project** (PostgreSQL DB)

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

> **Note:** Weather data uses [Open-Meteo](https://open-meteo.com/) — completely free, no API key required.

### 3. Run the Development Server

```bash
npx expo start
```

Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code with Expo Go.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm start` | Launch Expo development server |
| `npm run android` | Open on connected Android emulator |
| `npm run ios` | Open on iOS simulator |
| `npm run web` | Launch web browser preview |
| `npm run lint` | Scan source files for issues |
| `npm run reset-project` | Reset to blank boilerplate |

---

## 🗂️ Category System

Wardrobe supports **41 clothing categories**:

`all` · `top` · `bottoms` · `footwear` · `outerwear` · `dress` · `ethnic` · `accessory` · `activewear` · `sportswear` · `formal` · `casual` · `partywear` · `sleepwear` · `swimwear` · `winterwear` · `summerwear` · `loungewear` · `bags` · `jewelry` · `watches` · `sunglasses` · `belts` · `hats` · `co_ords` · `jumpsuits` · `blazers` · `hoodies` · `jackets` · `sweaters` · `jeans` · `trousers` · `shorts` · `skirts` · `traditional` · `festive` · `wedding` · `new_arrivals` · `trending` · `favorites` · `recommended`

Categories are displayed as paginated text-only filter chips (8 per page) with dot navigation indicators.
