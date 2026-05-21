# Payment Integration Blueprint (Razorpay + Stripe)

**Last Updated:** 2026-05-19

- Added a client-side payments service at `lib/payments.ts` with:
  - gateway resolution (`resolveProvider`) for India vs international
  - typed API contracts for create/status/razorpay verify
  - fetch wrappers for:
    - `POST /api/payments/create`
    - `POST /api/payments/verify-razorpay`
    - `GET /api/payments/:localOrderId/status`

- Updated `app/(root)/(tabs)/outfit.tsx` into a payment integration sandbox:
  - user inputs for country, currency, and amount
  - provider preview (razorpay/stripe)
  - payment create + status query flow wired to backend API

## Required backend endpoints

Implement these endpoints on your backend:

1. `POST /api/payments/create`
2. `POST /api/payments/verify-razorpay`
3. `GET /api/payments/:localOrderId/status`
4. `POST /api/webhooks/stripe`
5. `POST /api/webhooks/razorpay`

## Required env for app

Add to `.env`:

- `EXPO_PUBLIC_PAYMENTS_API_BASE_URL=https://your-backend-domain.com`

## Notes

- **Added** `isMounted` guard to prevent state updates on unmounted component
- Later updated — see Change 10

### Change 5 — `app/(root)/onboarding/skin-tone.tsx`

- **Formatted** single-line JSX (~1200 chars) into readable multi-line code

### Change 6 — `app/(root)/onboarding/style-preference.tsx`

- **Formatted** single-line JSX into readable multi-line code
- Later updated — see Change 9, 12

### Change 7 — `components/navigation/CustomTabBar.tsx`

- **Added** optional chaining: `options?.tabBarButtonTestID` (2 places)
- Prevents crash when `descriptors[route.key]` is undefined

### Change 8 — `hooks/useSupabaseQuery.ts`

- **Fixed** infinite refetch loop: moved `options` to `useRef` so inline objects don't trigger re-renders
- **Fixed** TS lint: replaced `PostgrestFilterBuilder<any, any, any>` with `QueryBuilder` type alias
- **Fixed** TS lint: added `unknown` intermediate cast for `rows as T[]`

### Change 9 — `tailwind.config.js`

- **Added** `"./screens/**/*.{js,jsx,ts,tsx}"` to `content` glob
- NativeWind classes in `screens/` are now compiled

### Change 10 — `app/get-started.tsx`

- **Fixed** inconsistent JSX indentation (LinearGradient block was dedented)

### Change 11 — `app/(root)/(tabs)/profile.tsx`

- **Removed** `router.replace("/get-started")` after `signOut()`
- **Removed** unused `useRouter` import
- Root auth guard now handles post-logout redirect automatically (prevents double navigation)

---

## Session 2: Save Onboarding Data to Supabase

### Change 12 — `store/onboarding-store.ts`

- **Added** `SupabaseClient` type import
- **Updated** `completeOnboarding` signature: `(userId: string, supabase: SupabaseClient) => Promise<boolean>`
- **Added** `get` to Zustand `persist` callback to read current state
- **Added** Supabase `upsert` to `user_profiles` table inside `completeOnboarding`:
  - Saves `age`, `height`, `gender`, `body_type`, `skin_tone`, `style_preferences`
  - Order: Supabase upsert first → SecureStore flag second
- **Added** `_completionVersion: number` counter (not persisted, excluded in `partialize`)
  - Increments after successful onboarding completion
  - Used by root layout to detect completion and re-read onboarding status

### Change 13 — `app/(root)/onboarding/setup-account.tsx`

- **Added** `useSupabase` hook import
- **Passes** `supabase` client to `completeOnboarding(user.id, supabase)`
- **Guards** on `isInitializing` before running
- **Removed** direct `router.replace("/(root)/(tabs)")` — auth guard handles redirect
- **Removed** unused `router` import
- Shows spinner during both `isSaving` and `isInitializing`

### Change 14 — `app/(root)/onboarding/style-preference.tsx`

- **Added** `useSupabase` hook import
- **Passes** `supabase` client to `completeOnboarding(userId, supabase)`
- **Removed** direct `router.replace("/(root)/(tabs)")` — auth guard handles redirect

---

## Session 3: Fix Onboarding Completion Redirect

### Problem

After completing onboarding, user was redirected back to onboarding first screen instead of home tabs. Root cause: `onboardingComplete` state in root layout was stale — it was read from SecureStore only on `[isSignedIn, userId]` change, never re-read after `completeOnboarding` updated SecureStore.

### Change 15 — `app/_layout.tsx`

- **Added** `useOnboardingState` import from store
- **Added** `completionVersion` subscription: `useOnboardingState((s) => s._completionVersion)`
- **Added** `completionVersion` to the `loadOnboardingStatus` effect dependency array
- **Added** synchronous shortcut: when `completionVersion > 0`, set `onboardingComplete = true` immediately (skip async SecureStore read)
- Cold starts (`completionVersion === 0`) still read from SecureStore normally
- **Fixes** the stale state bug without causing infinite re-render loops

---

## Supabase SQL (Must Run Manually)

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

---

## Session 4: Remove Skin Tone from Onboarding & Database

### Change 16 — `store/onboarding-store.ts`

- **Removed** `skinTone: string` from state type
- **Removed** `setSkinTone` action
- **Removed** `skinTone: ""` default value
- **Removed** `setSkinTone` setter
- **Removed** `skin_tone: state.skinTone` from Supabase upsert payload

### Change 17 — `app/(root)/onboarding/skin-tone.tsx`

- **Deleted** entire file

### Change 18 — `app/(root)/onboarding/body-type.tsx`

- **Updated** navigation: `skin-tone` → `style-preference` (skip removed screen)

### Change 19 — `app/(root)/onboarding/style-preference.tsx`

- **Updated** `ProgressIndicator step={7}` → `step={6}`

### Change 20 — `components/onboarding/ProgressIndicator.tsx`

- **Updated** step array from `[1,2,3,4,5,6,7]` → `[1,2,3,4,5,6]`

### Supabase SQL (Run Manually)

```sql
ALTER TABLE user_profiles DROP COLUMN IF EXISTS skin_tone;
```

---

## Session 5: Fix "Maximum update depth exceeded" Infinite Loop

### Problem

`useSegments()` returns a new array reference on every render, and `router` from `useRouter()` may also be unstable. Since both were in the navigation guard's dependency array, the effect re-fired every render → `router.replace()` → re-render → infinite loop.

### Change 21 — `app/_layout.tsx`

- **Added** `segmentKey = segments.join("/")` — converts array to stable string
- **Replaced** `segments` with `segmentKey` in the navigation guard dependency array
- **Removed** `router` from dependency array (conceptually stable, doesn't need tracking)
- **Added** `as string[]` cast on `segments.includes("onboarding")` to fix TS typed routes lint
- **Added** eslint-disable comment for `react-hooks/exhaustive-deps`

---

## Session 6: Remove "Other" Gender Option

### Change 22 — `store/onboarding-store.ts`

- **Updated** `Gender` type: `"Male" | "Female" | "Other" | ""` → `"Male" | "Female" | ""`

### Change 23 — `app/(root)/onboarding/gender.tsx`

- **Removed** `{ label: "Other", icon: "⚥", bg: "#5E59E6", iconColor: "#FFFFFF" }` from options array
- Only Male and Female are now selectable

---

## Session 7: Fix "Maximum update depth" on Style Toggle

### Problem

Toggling style preferences triggered infinite re-render loop. Root cause: `getToken` from Clerk's `useAuth()` returns a **new function reference** every render. It was in the `useSupabase` effect's dependency array → store update → re-render → new `getToken` → effect fires → `setSupabase(newClient)` → re-render → infinite loop.

### Change 24 — `hooks/useSupabase.ts`

- **Added** `getTokenRef = useRef(getToken)` to hold stable reference
- **Updated** effect to call `getTokenRef.current(...)` instead of `getToken(...)`
- **Removed** `getToken` from dependency array — `isLoaded`, `isSignedIn`, `userId` already capture auth changes

---

## Session 8: Fix Duplicate Key Error on Upsert + Reorder Onboarding

### Change 26 — Reorder Onboarding Flow

Old: Welcome → Age → Height → Gender → Body Type → Style Preference
New: Welcome → Gender → Age → Height → Body Type → Style Preference

| File                    | Change                                           |
| ----------------------- | ------------------------------------------------ |
| `onboarding/index.tsx`  | Navigate to `gender` (was `age`)                 |
| `onboarding/gender.tsx` | Step 4→2, navigate to `age` (was `body-type`)    |
| `onboarding/age.tsx`    | Step 2→3                                         |
| `onboarding/height.tsx` | Step 3→4, navigate to `body-type` (was `gender`) |

### Change 29 — Add "2 full-length pics" onboarding screen (step 7)

- **Created** `app/(root)/onboarding/full-length-pics.tsx` — new final onboarding screen
  - Shows 2 example images (`two-full-lenght1.png`, `two-full-lenght2.png`)
  - "For Best Results" tips section
  - "Upload Image" button (completes onboarding, TODO: image picker)
  - "Skip now →" button (also completes onboarding)
- **Updated** `style-preference.tsx` — now navigates to `full-length-pics` instead of completing onboarding; removed Clerk/Supabase imports
- **Updated** `ProgressIndicator.tsx` — 6 steps → 7 steps

### Change 28 — Fix first-time login skipping onboarding

**Problem:** `app/index.tsx` had `<Redirect href="/(root)/(tabs)" />` for signed-in users, which fired synchronously BEFORE the root layout could async-read onboarding status from SecureStore.

**Fixes:**

- `app/index.tsx` — removed all redirect logic, now shows only a loading spinner
- `app/_layout.tsx` nav guard — restructured: check `!isSignedIn` BEFORE `onboardingComplete === null`, so unauthenticated users get redirected to sign-in immediately without waiting for onboarding status

### Change 27 — `app/_layout.tsx` (Logout → Login flow fix)

- **Moved** `!userId` check BEFORE `completionVersion > 0` check
- On logout (`userId = null`) → always resets `onboardingComplete = null`
- Prevents stale `_completionVersion` from giving wrong result if a different user logs in

### Change 25 — `store/onboarding-store.ts`

- **Added** `{ onConflict: "user_id" }` to `supabase.from("user_profiles").upsert()` call
- Without this, Supabase couldn't resolve conflicts on existing `user_id` rows → error code `23505`

---

## Files Modified (Summary)

| File                                          | Changes                                                        |
| --------------------------------------------- | -------------------------------------------------------------- |
| `app/_layout.tsx`                             | Completion subscription + segmentKey fix for infinite loop     |
| `app/get-started.tsx`                         | Fixed indentation                                              |
| `app/(auth)/sign-in.tsx`                      | Removed debug styles, fixed tracking                           |
| `app/(root)/(tabs)/profile.tsx`               | Removed manual logout navigation                               |
| `app/(root)/onboarding/_layout.tsx`           | Removed duplicate OnboardingProvider                           |
| `app/(root)/onboarding/body-type.tsx`         | Added empty gender guard, updated nav to skip skin-tone        |
| `app/(root)/onboarding/gender.tsx`            | Removed "Other" option, only Male/Female                       |
| `app/(root)/onboarding/setup-account.tsx`     | Added Supabase integration, removed direct navigation          |
| `app/(root)/onboarding/skin-tone.tsx`         | **DELETED**                                                    |
| `app/(root)/onboarding/style-preference.tsx`  | Added Supabase integration, formatted JSX, step 7→6            |
| `components/navigation/CustomTabBar.tsx`      | Added optional chaining on options                             |
| `hooks/useSupabase.ts`                        | Stabilized getToken with useRef to fix infinite loop           |
| `hooks/useSupabaseQuery.ts`                   | Fixed infinite loop + TS lint errors                           |
| `store/onboarding-store.ts`                   | Added Supabase upsert + `_completionVersion`, removed skinTone |
| `tailwind.config.js`                          | Added screens/ to content glob                                 |
| `components/onboarding/ProgressIndicator.tsx` | Updated from 7 steps to 6 steps                                |
| `components/onboarding/BodyTypeCard.tsx`      | Rewritten as accordion with title, description, chevron icons  |
| `app/(root)/onboarding/body-type.tsx`         | Added descriptions, expanded state for accordion UI            |

---

## Session: Full-Length Pics — Gallery Upload to Supabase (2026-05-13)

### Change — `app/(root)/onboarding/full-length-pics.tsx`

**What changed:**

- Installed `expo-image-picker` package
- Added gallery permission request via `requestMediaLibraryPermissionsAsync`
- Implemented `handlePickImages`: opens gallery with `allowsMultipleSelection: true`, `selectionLimit: 2`
- Added `uploadToSupabase`: fetches each selected image as a blob and uploads to Supabase Storage bucket `full-length-pics` under path `{userId}/{timestamp}_{random}.{ext}` using Clerk JWT token
- Selected images shown as live preview (two side-by-side thumbnails) replacing the placeholder image
- Upload button shows "Select Images" before selection and "Upload Image" after; shows `ActivityIndicator` while uploading
- Error handling via `Alert` on permission denial or upload failure
- Navigates to `/(root)/onboarding/nickname` on successful upload

---

## Session N: Payment Integration (Razorpay + Stripe)

### New Files Created

| File                                                | Purpose                                                                                                    |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `lib/payment/types.ts`                              | Shared TypeScript types: `Plan`, `PaymentProvider`, `PaymentIntent`, `Subscription`, `PaymentResult`, etc. |
| `lib/payment/razorpay.ts`                           | Razorpay provider: creates order via Edge Function, opens checkout via `expo-web-browser`                  |
| `lib/payment/stripe.ts`                             | Stripe provider: creates session via Edge Function, opens Stripe Hosted Checkout via `expo-web-browser`    |
| `lib/payment/index.ts`                              | Unified gateway: `getProvider(country)` routes India→Razorpay, else→Stripe; `initiatePaymentWithToken()`   |
| `constants/plans.ts`                                | Plan definitions: Free / Pro (₹299/$4) / Premium (₹699/$9) with Razorpay & Stripe plan IDs                 |
| `store/payment-store.ts`                            | Zustand store: `fetchSubscription`, `startPayment`, `isPaymentInProgress`, `subscription` state            |
| `components/payment/PlanCard.tsx`                   | Individual plan card with features list, price (INR/USD), CTA button                                       |
| `components/payment/PlanList.tsx`                   | Renders all plans, shows active plan, includes `PaymentMethodBadge`                                        |
| `components/payment/PaymentMethodBadge.tsx`         | Badge showing "UPI/Cards (India)" or "International Card"                                                  |
| `app/(root)/(tabs)/subscription.tsx`                | Main subscription tab screen                                                                               |
| `app/(root)/payment/_layout.tsx`                    | Stack layout for payment screens                                                                           |
| `app/(root)/payment/checkout.tsx`                   | Checkout screen — confirms plan, triggers payment, routes to success/cancel                                |
| `app/(root)/payment/success.tsx`                    | Success confirmation screen                                                                                |
| `app/(root)/payment/cancel.tsx`                     | Payment failed/cancelled screen                                                                            |
| `supabase/functions/create-razorpay-order/index.ts` | Edge Function: creates Razorpay order (server-side, secrets safe)                                          |
| `supabase/functions/create-stripe-session/index.ts` | Edge Function: creates Stripe Checkout session (server-side, secrets safe)                                 |
| `supabase/functions/payment-webhook/index.ts`       | Edge Function: handles Razorpay + Stripe webhooks, verifies signatures, updates `subscriptions` table      |

### Schema Changes (`supabase/schema.sql`)

- Added `subscriptions` table: `user_id`, `plan_id`, `provider`, `status`, `provider_subscription_id`, `current_period_end`
- Added `payment_events` table: audit log for all webhook events
- Both tables have RLS policies (user can only read/write own data)

### Environment Variables Required (`.env`)

```
EXPO_PUBLIC_RAZORPAY_KEY_ID=
EXPO_PUBLIC_RAZORPAY_PRO_PLAN_ID=
EXPO_PUBLIC_RAZORPAY_PREMIUM_PLAN_ID=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EXPO_PUBLIC_STRIPE_PRO_PRICE_ID=
EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID=
# Server-side only (Supabase Edge Function secrets):
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_PREMIUM_PRICE_ID=
```

### Architecture Notes

- **No native SDKs** — uses `expo-web-browser` (already installed), works in Expo Go
- **Provider routing** — `getProvider(country)` checks locale; India → Razorpay, else → Stripe
- **Secret keys** — never client-side; only inside Supabase Edge Functions
- **Adding a new provider** — create `lib/payment/newprovider.ts` + update `lib/payment/index.ts` router

---

## Session N+1: Subscription Routing Setup

### Change 1 — `app/(root)/(tabs)/profile.tsx`

- Added `useRouter` from `expo-router`
- Added `Crown` icon from `lucide-react-native`
- Added **"Manage Subscription"** button (purple, Crown icon) above Logout → navigates to `/(root)/(tabs)/subscription`

### Change 2 — `app/(root)/(tabs)/_layout.tsx`

- Registered `subscription` screen with `href: null` — hidden from tab bar but fully routable via `router.push`

---

## Session: Home Page Header — Logo, Streak & Calendar (2026-05-21)

### Change — `components/ui/HomeHeader.tsx` (NEW FILE)

- **Created** reusable `HomeHeader` component
- Left side: `getStartedLogo.png` image (`w-28 h-8`, `resizeMode="contain"`)
- Right side:
  - Streak pill: 🔥 emoji + count from `useState<number>(1)` — ready to wire to API
  - Calendar button: `CalendarDays` icon from `lucide-react-native`, navigates to `/(root)/calendar` via `router.push`
  - Both elements have pill/circle border with `bg-white/70` frosted styling

### Change — `app/(root)/(tabs)/index.tsx`

- **Added** `HomeHeader` import
- **Rendered** `<HomeHeader />` at top of `SafeAreaView`, above the body content card
- **Added** `mt-4` margin to the body card to space it from the header

---

## Session: Swipe Left/Right Tab Navigation (2026-05-21)

### Change — `components/navigation/SwipeTabWrapper.tsx` (NEW FILE)

- **Created** reusable `SwipeTabWrapper` component
- Accepts `tabIndex: number` + `children: ReactNode`
- Uses `Gesture.Fling` from `react-native-gesture-handler` (already installed)
- Swipe **left** → navigates to next tab (`tabIndex + 1`)
- Swipe **right** → navigates to previous tab (`tabIndex - 1`)
- Boundary safe: index 0 ignores right swipe, index 4 ignores left swipe
- Tab order: `0=Home`, `1=Wardrobe`, `2=Outfit`, `3=Saved`, `4=Profile`

### Change — All 5 tab screens

| File                             | Change                                        |
| -------------------------------- | --------------------------------------------- |
| `app/(root)/(tabs)/index.tsx`    | Wrapped with `<SwipeTabWrapper tabIndex={0}>` |
| `app/(root)/(tabs)/wardrobe.tsx` | Wrapped with `<SwipeTabWrapper tabIndex={1}>` |
| `app/(root)/(tabs)/outfit.tsx`   | Wrapped with `<SwipeTabWrapper tabIndex={2}>` |
| `app/(root)/(tabs)/saved.tsx`    | Wrapped with `<SwipeTabWrapper tabIndex={3}>` |
| `app/(root)/(tabs)/profile.tsx`  | Wrapped with `<SwipeTabWrapper tabIndex={4}>` |
