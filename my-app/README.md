# LookAI — Your Personal AI Stylist

A React Native mobile app built with Expo that helps users discover their personal style through AI-powered outfit recommendations.

---

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| **Framework**  | Expo SDK 54 + React Native 0.81.5            |
| **Language**   | TypeScript                                   |
| **Routing**    | Expo Router (file-based)                     |
| **Auth**       | Clerk (Google SSO + Email OTP)               |
| **Backend**    | Supabase (PostgreSQL + Row Level Security)   |
| **State**      | Zustand v5 (persisted via expo-secure-store) |
| **Styling**    | NativeWind v4 + TailwindCSS 3                |
| **Animations** | React Native Reanimated                      |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- Clerk account (for auth keys)
- Supabase project (for database)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
```

### 3. Set Up Supabase Database

Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  age INTEGER,
  height INTEGER,
  gender TEXT,
  body_type TEXT,
  skin_tone TEXT,
  style_preferences TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_own" ON user_profiles FOR INSERT
WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "select_own" ON user_profiles FOR SELECT
USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "update_own" ON user_profiles FOR UPDATE
USING (auth.jwt() ->> 'sub' = user_id);
```

### 4. Start the App

```bash
npx expo start
```

Open in:

- **Development build** — recommended for full native module support
- **Android emulator** — via Android Studio
- **iOS simulator** — via Xcode (macOS only)
- **Expo Go** — for quick testing (limited features)

---

## How the App Works

### App Flow

```
App Launch
  │
  ├── Not Signed In ──→ Get Started Screen ──→ Sign In
  │                                              ├── Google SSO
  │                                              └── Email OTP
  │
  ├── Signed In + Onboarding Incomplete ──→ Onboarding (7 steps)
  │                                           1. Welcome
  │                                           2. Age
  │                                           3. Height
  │                                           4. Gender
  │                                           5. Body Type
  │                                           6. Skin Tone
  │                                           7. Style Preferences
  │                                           └── Saves to Supabase → Home
  │
  └── Signed In + Onboarding Complete ──→ Home (Tabs)
                                           ├── Home
                                           ├── Wardrobe
                                           ├── AI Outfit Planner
                                           ├── Saved
                                           └── Profile (+ Logout)
```

### Authentication

- **Clerk** handles all authentication
- **Google SSO** — one-tap sign-in via `expo-auth-session`
- **Email OTP** — passwordless sign-in with 6-digit code, auto-verification, 30s resend cooldown
- **Auth Guard** — root layout (`app/_layout.tsx`) automatically redirects users based on auth + onboarding status

### Onboarding

A 7-step wizard that collects user profile data:

| Step | Screen            | Data Collected                                |
| ---- | ----------------- | --------------------------------------------- |
| 1    | Welcome           | —                                             |
| 2    | Age Picker        | `age` (horizontal scroll wheel)               |
| 3    | Height Picker     | `height` in cm (vertical scroll wheel)        |
| 4    | Gender            | `gender` (Male / Female / Other)              |
| 5    | Body Type         | `bodyType` (gender-aware card selection)      |
| 6    | Skin Tone         | `skinTone` (6 color swatches)                 |
| 7    | Style Preferences | `stylePreferences` (exactly 3 from 8 options) |

On completion:

1. Data is **upserted** to Supabase `user_profiles` table
2. Completion flag saved to `SecureStore`
3. Root auth guard detects completion and redirects to Home tabs

### State Management

- **Zustand v5** with `persist` middleware
- Storage: `expo-secure-store` (encrypted local storage)
- Single store: `useOnboardingState` — holds all onboarding data + actions
- `_completionVersion` counter signals the root layout to refresh onboarding status

### Backend Integration

- **Supabase** client is created with Clerk JWT token for RLS
- `useSupabase()` hook — returns an authenticated Supabase client
- `useSupabaseQuery()` hook — generic table query with loading/error states
- Clerk JWT is injected as `Authorization: Bearer <token>` header

### Navigation

- **Expo Router** — file-based routing under `app/`
- **Custom Tab Bar** — floating pill-shaped bar with animated press feedback
- **FAB Button** — center "+" button navigates to AI Outfit Planner
- **Auth Guard** — automatic redirects based on sign-in and onboarding state

---

## Project Structure

```
my-app/
├── app/                        # All routes (file-based routing)
│   ├── _layout.tsx             # Root: Clerk + auth guard + onboarding check
│   ├── index.tsx               # Entry redirect
│   ├── get-started.tsx         # Landing page
│   ├── (auth)/                 # Auth screens (sign-in, email OTP)
│   └── (root)/                 # Authenticated screens
│       ├── (tabs)/             # Main tab screens (Home, Wardrobe, Outfit, Saved, Profile)
│       └── onboarding/         # 7-step onboarding wizard
├── components/
│   ├── navigation/             # CustomTabBar
│   ├── onboarding/             # AgePicker, HeightPicker, BodyTypeCard, etc.
│   └── ui/                     # AppGradientBackground
├── hooks/
│   ├── useSupabase.ts          # Clerk-authenticated Supabase client
│   └── useSupabaseQuery.ts     # Generic table query hook
├── lib/
│   └── supabase.ts             # Supabase client factory
├── store/
│   └── onboarding-store.ts     # Zustand store (onboarding state + Supabase save)
├── screens/
│   └── PostsScreen.tsx         # Demo CRUD screen (not routed)
├── assets/                     # Images + body type PNGs
├── docs_changes.md             # Code changes log
└── scan.md                     # Codebase scan report with issues
```

---

## Key Files

| File                                     | Purpose                                                         |
| ---------------------------------------- | --------------------------------------------------------------- |
| `app/_layout.tsx`                        | Root layout — Clerk provider, auth guard, onboarding redirect   |
| `store/onboarding-store.ts`              | Zustand store — onboarding data + Supabase upsert on completion |
| `lib/supabase.ts`                        | Supabase client factory (injects Clerk token)                   |
| `hooks/useSupabase.ts`                   | Hook that creates authenticated Supabase client                 |
| `components/navigation/CustomTabBar.tsx` | Animated floating bottom tab bar                                |

---

## Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
npm run reset-project  # Reset to blank project
```

---

## Documentation

- **`scan.md`** — Full codebase scan report with current issues and warnings
- **`docs_changes.md`** — Log of all code changes made during development
