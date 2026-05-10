# Codebase Scan Report — LookAI

**Generated:** 2025-05-10  
**Framework:** Expo (React Native) + Expo Router  
**Language:** TypeScript

---

## 1. Project Overview

| Field                | Value                                               |
| -------------------- | --------------------------------------------------- |
| **Name**             | my-app (LookAI)                                     |
| **Entry**            | `expo-router/entry`                                 |
| **React**            | 19.1.0                                              |
| **React Native**     | 0.81.5                                              |
| **Expo SDK**         | ~54                                                 |
| **Styling**          | NativeWind v4 + TailwindCSS 3                       |
| **Auth**             | Clerk (`@clerk/clerk-expo`)                         |
| **Backend**          | Supabase (`@supabase/supabase-js`)                  |
| **State**            | Zustand 5 (persisted via `expo-secure-store`)       |
| **Navigation**       | Expo Router (file-based) with `@react-navigation/*` |
| **New Architecture** | Enabled (`newArchEnabled: true`)                    |
| **Typed Routes**     | Enabled (`experiments.typedRoutes: true`)           |
| **React Compiler**   | Enabled (`experiments.reactCompiler: true`)         |

---

## 2. Directory Structure

```
my-app/
├── app/
│   ├── _layout.tsx              ← Root layout (Clerk + SafeArea + OnboardingProvider + auth guard)
│   ├── index.tsx                 ← Entry redirect (signed-in → tabs, else → get-started)
│   ├── get-started.tsx           ← Landing / CTA screen
│   ├── (auth)/
│   │   ├── _layout.tsx           ← Auth guard (redirects signed-in users away)
│   │   ├── sign-in.tsx           ← Google SSO + email CTA
│   │   └── email.tsx             ← Email OTP sign-in / sign-up (Clerk)
│   └── (root)/
│       ├── _layout.tsx           ← Slot wrapper
│       ├── (tabs)/
│       │   ├── _layout.tsx       ← Bottom tab navigator (custom tab bar)
│       │   ├── index.tsx         ← Home tab
│       │   ├── wardrobe.tsx      ← Wardrobe tab (placeholder)
│       │   ├── outfit.tsx        ← AI Outfit Planner tab (placeholder)
│       │   ├── saved.tsx         ← Saved tab (placeholder)
│       │   └── profile.tsx       ← Profile + logout
│       └── onboarding/
│           ├── _layout.tsx       ← Onboarding stack (SafeAreaView wrapper)
│           ├── index.tsx         ← Welcome step (step 1)
│           ├── age.tsx           ← Age picker (step 2)
│           ├── height.tsx        ← Height picker (step 3)
│           ├── gender.tsx        ← Gender selector (step 4)
│           ├── body-type.tsx     ← Body type cards (step 5)
│           ├── skin-tone.tsx     ← Skin tone selector (step 6)
│           ├── style-preference.tsx ← Style chips (step 7, completes onboarding)
│           └── setup-account.tsx ← Auto-save fallback screen
├── components/
│   ├── navigation/
│   │   └── CustomTabBar.tsx      ← Floating bottom tab bar + FAB
│   ├── onboarding/
│   │   ├── AgePicker.tsx         ← Horizontal scroll age wheel
│   │   ├── BackButton.tsx        ← Simple ‹ back chevron
│   │   ├── BodyTypeCard.tsx      ← Animated selectable card (Reanimated)
│   │   ├── ContinueButton.tsx    ← Shared continue button
│   │   ├── HeightPicker.tsx      ← Vertical scroll height wheel
│   │   └── ProgressIndicator.tsx ← 7-step bar
│   └── ui/
│       └── AppGradientBackground.tsx ← Reusable gradient overlay
├── hooks/
│   ├── useSupabase.ts            ← Clerk-token-bound Supabase client
│   └── useSupabaseQuery.ts       ← Generic table query hook
├── lib/
│   └── supabase.ts               ← Supabase client factory
├── store/
│   └── onboarding-store.ts       ← Zustand persisted onboarding state
├── screens/
│   └── PostsScreen.tsx           ← CRUD demo (NOT wired into any route)
└── assets/
    ├── images/        (11 files: kribb.png, getStartedLogo.png, icons, splash, etc.)
    └── bodytypes/
        ├── female/    (5 PNGs: slim, curvy, average, plus, athletic)
        └── male/      (5 PNGs: slim, athletic, average, plus, curvy — curvy unused)
```

---

## 3. Authentication Flow

1. **Clerk** is the sole auth provider; wrapped at the root in `app/_layout.tsx` via `<ClerkProvider>`.
2. **Google SSO** — `sign-in.tsx` uses `useSSO` with `strategy: "oauth_google"`, plus `expo-web-browser` warm-up on Android.
3. **Email OTP** — `email.tsx` implements a full sign-in ↔ sign-up toggle:
   - Tries `signIn.create` first; if email is unknown, falls back to `signUp.create`.
   - 6-digit code auto-verification on input change.
   - Resend cooldown (30 s).
   - Auto-fills missing Clerk fields (first name, last name, username) from the email address.
4. **Auth guard** (`RootNavigator` in root `_layout.tsx`):
   - Not signed in → redirect to `/(auth)/sign-in`.
   - Signed in + onboarding incomplete → redirect to `/(root)/onboarding`.
   - Signed in + onboarding complete → redirect to `/(root)/(tabs)`.
   - Onboarding status read from `SecureStore` key `onboarding_complete_<userId>`.
5. **Token relay** — `useSupabase` fetches a Clerk JWT (template `"supabase"`) and injects it as a `Bearer` header into a new Supabase client on every auth state change.

---

## 4. Onboarding Flow

| Step | Route                         | Store Field                    | UI Component                           |
| ---- | ----------------------------- | ------------------------------ | -------------------------------------- |
| 1    | `onboarding/index`            | —                              | Welcome + logo                         |
| 2    | `onboarding/age`              | `age` (default: 28)            | `AgePicker` (horizontal FlatList)      |
| 3    | `onboarding/height`           | `height` (default: 165)        | `HeightPicker` (vertical FlatList)     |
| 4    | `onboarding/gender`           | `gender`                       | 3 circle buttons (Male/Female/Other)   |
| 5    | `onboarding/body-type`        | `bodyType`                     | `BodyTypeCard` FlatList (gender-aware) |
| 6    | `onboarding/skin-tone`        | `skinTone`                     | 6 color swatches                       |
| 7    | `onboarding/style-preference` | `stylePreferences` (exactly 3) | 8 chip toggles                         |

**Completion:** upserts profile data to Supabase `user_profiles` table, then writes `onboarding_complete_<userId> = "true"` to SecureStore. Root layout auth guard detects completion via `_completionVersion` and redirects to `/(root)/(tabs)` automatically.

**Persistence:** Zustand `persist` middleware → `expo-secure-store` (key: `"onboarding-state"`). `isSaving` and `error` are excluded via `partialize`.

---

## 5. State Management

- **Zustand v5** with `persist` middleware backed by `expo-secure-store`.
- Single store: `useOnboardingState` in `store/onboarding-store.ts`.
- `OnboardingProvider` is a **no-op pass-through** (`({ children }) => children`) — exists as a placeholder for future context.
- `_completionVersion` counter (transient, not persisted) — signals root layout to re-read onboarding status after completion.

---

## 6. Backend / Data Layer

| Aspect               | Details                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Client**           | `lib/supabase.ts` — factory function `createSupabaseClient(token?)`                                            |
| **Auth integration** | Clerk JWT injected via global headers; Supabase's own auth is disabled (`autoRefreshToken: false`)             |
| **Session storage**  | `AsyncStorage` (for Supabase internal session, though effectively unused)                                      |
| **Query hook**       | `useSupabaseQuery<T>(table, options)` — generic select with `apply` filter builder                             |
| **Demo**             | `screens/PostsScreen.tsx` — insert + list for a `posts` table; **not routed**                                  |
| **Onboarding data**  | Upserted to `user_profiles` table on completion (age, height, gender, body_type, skin_tone, style_preferences) |

---

## 7. UI & Styling

- **NativeWind v4** — Tailwind utility classes on React Native components.
- **Metro config** — `withNativeWind` wrapper with `global.css` input.
- **Babel** — `nativewind/babel` preset + `jsxImportSource: "nativewind"`.
- **AppGradientBackground** — linear gradient overlay (`#CACAD7 → #F5EBE7 → #FFFFFF`).
- **CustomTabBar** — floating pill-shaped bar with spring-animated press feedback + a prominent circular FAB (+) that navigates to the Outfit tab.
- **BodyTypeCard** — uses `react-native-reanimated` for `FadeInDown` entrance + spring scale on selection.
- **AgePicker / HeightPicker** — snap-to-interval `FlatList` wheels with viewability callbacks.

---

## 8. Issues & Warnings

### ✅ Fixed Issues

| #   | Severity   | Location                 | Status   | Fix                                                            |
| --- | ---------- | ------------------------ | -------- | -------------------------------------------------------------- |
| 1   | **High**   | `sign-in.tsx`            | ✅ FIXED | Removed debug `bg-red-300` class                               |
| 2   | **High**   | `onboarding/_layout.tsx` | ✅ FIXED | Removed duplicate `OnboardingProvider`                         |
| 3   | **Medium** | `body-type.tsx`          | ✅ FIXED | Added empty gender guard                                       |
| 4   | **Medium** | `setup-account.tsx`      | ✅ FIXED | Added mounted guard + Supabase integration                     |
| 5   | **Medium** | `sign-in.tsx`            | ✅ FIXED | Fixed tracking `-5.60px` → `-0.56px`                           |
| 6   | **Medium** | `skin-tone.tsx`          | ✅ FIXED | Formatted single-line JSX                                      |
| 7   | **Medium** | `style-preference.tsx`   | ✅ FIXED | Formatted single-line JSX                                      |
| 8   | **Medium** | `CustomTabBar.tsx`       | ✅ FIXED | Added `options?.` optional chaining                            |
| 9   | **Medium** | `useSupabaseQuery.ts`    | ✅ FIXED | Moved options to `useRef`, fixed TS lint                       |
| 10  | **Low**    | `tailwind.config.js`     | ✅ FIXED | Added `screens/` to content glob                               |
| 12  | **Low**    | `get-started.tsx`        | ✅ FIXED | Fixed indentation                                              |
| 13  | **Low**    | `sign-in.tsx`            | ✅ FIXED | Removed leading space                                          |
| 16  | **High**   | `onboarding-store.ts`    | ✅ FIXED | Onboarding data now upserted to Supabase `user_profiles` table |
| 20  | **Medium** | `profile.tsx`            | ✅ FIXED | Removed manual navigation; auth guard handles redirect         |

### 🔴 Remaining Bugs / Errors

| #   | Severity | Location                          | Description                                            |
| --- | -------- | --------------------------------- | ------------------------------------------------------ |
| 11  | **Low**  | `assets/bodytypes/male/curvy.png` | Unused asset — male body types don't reference `curvy` |

### � Remaining Code Quality / Suggestions

| #   | Severity   | Area             | Description                                                                                          |
| --- | ---------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| 14  | **Medium** | Dead code        | `screens/PostsScreen.tsx` is not routed anywhere — wire it in or remove it                           |
| 15  | **Medium** | Supabase client  | A new `SupabaseClient` is instantiated on every token refresh. Consider reusing and swapping headers |
| 17  | **High**   | Error boundaries | No React error boundary exists — unhandled JS error crashes to white screen                          |
| 18  | **High**   | Testing          | Zero tests (unit, integration, or E2E)                                                               |
| 19  | **Low**    | Prettier         | `prettier-plugin-tailwindcss` installed but no `.prettierrc` config                                  |
| 21  | **Medium** | Loading states   | Tab screens (`wardrobe`, `outfit`, `saved`) have no loading or empty states                          |
| 22  | **Low**    | Accessibility    | `BackButton` uses text chevron `‹` instead of icon with `accessibilityLabel`                         |

---

## 9. Dependency Summary

### Production (30 packages)

| Category         | Packages                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Core**         | `expo ~54`, `react 19.1.0`, `react-native 0.81.5`, `react-dom`, `react-native-web`                                                         |
| **Navigation**   | `expo-router`, `@react-navigation/bottom-tabs`, `@react-navigation/elements`, `@react-navigation/native`, `react-native-screens`           |
| **Auth**         | `@clerk/clerk-expo`, `expo-auth-session`, `expo-web-browser`, `expo-secure-store`                                                          |
| **Backend**      | `@supabase/supabase-js`, `@react-native-async-storage/async-storage`                                                                       |
| **UI / Styling** | `nativewind`, `tailwindcss`, `expo-linear-gradient`, `expo-image`, `@expo/vector-icons`, `expo-symbols`, `expo-haptics`                    |
| **Animation**    | `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`                                                         |
| **State**        | `zustand`                                                                                                                                  |
| **Build**        | `babel-preset-expo`, `prettier-plugin-tailwindcss`                                                                                         |
| **Misc**         | `expo-constants`, `expo-font`, `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-system-ui`, `react-native-safe-area-context` |

### Dev (4 packages)

`typescript ~5.9.2`, `eslint ^9.39.4`, `eslint-config-expo ~10.0.0`, `@types/react ~19.1.0`

---

## 10. Environment Variables Required

| Variable                            | Used In           | Purpose                  |
| ----------------------------------- | ----------------- | ------------------------ |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `app/_layout.tsx` | Clerk auth               |
| `EXPO_PUBLIC_SUPABASE_URL`          | `lib/supabase.ts` | Supabase project URL     |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`     | `lib/supabase.ts` | Supabase anon/public key |

All three are validated at startup with `throw new Error(...)` if missing.

---

## 11. Navigation Map

```
app/index.tsx (redirect)
├── /get-started                    ← Landing page (unauthenticated)
├── /(auth)
│   ├── /sign-in                    ← Google + Email auth
│   └── /email                      ← Email OTP flow
└── /(root)
    ├── /(tabs)
    │   ├── / (index → Home)
    │   ├── /wardrobe
    │   ├── /outfit (AI Planner)
    │   ├── /saved
    │   └── /profile (+ Logout)
    └── /onboarding
        ├── / (Welcome)
        ├── /age → /height → /gender → /body-type → /skin-tone → /style-preference
        └── /setup-account (fallback)
```

---

## 12. File Count & Size

| Category            | Files     | Lines (approx.) |
| ------------------- | --------- | --------------- |
| App routes (`app/`) | 15        | ~1,120          |
| Components          | 7         | ~270            |
| Hooks               | 2         | ~116            |
| Lib                 | 1         | ~34             |
| Store               | 1         | ~76             |
| Screens (unused)    | 1         | ~97             |
| Config files        | 7         | ~70             |
| **Total source**    | **34**    | **~1,783**      |
| Assets              | 22 images | —               |

---

## 13. Summary

**LookAI** is an Expo SDK 54 React Native app with Clerk authentication (Google SSO + email OTP), a 7-step onboarding flow, and a Supabase backend (currently used only in a demo screen). The app has a clean file-based routing structure and a polished custom tab bar.

**Key risks (remaining):**

- No error boundaries, no tests.
- `screens/PostsScreen.tsx` is dead code (not routed).
- Tab screens (`wardrobe`, `outfit`, `saved`) are empty placeholders.
- No `.prettierrc` config despite `prettier-plugin-tailwindcss` being installed.
- Supabase client is re-created on every token refresh (could be optimized).

---

_End of report._
