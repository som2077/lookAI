# Code Changes Log — LookAI

**Last Updated:** 2025-05-10

---

## Session 1: Bug Fixes (Scan Report Issues)

### Change 1 — `app/(auth)/sign-in.tsx`

- **Removed** debug `bg-red-300` class from "Welcome to Look AI" heading
- **Fixed** `tracking-[-5.60px]` → `tracking-[-0.56px]` (typo — extreme letter-spacing)
- **Removed** leading space before "Continue with Google" text

### Change 2 — `app/(root)/onboarding/_layout.tsx`

- **Removed** duplicate `OnboardingProvider` wrapper (already exists in root `app/_layout.tsx`)
- **Removed** unused `OnboardingProvider` import

### Change 3 — `app/(root)/onboarding/body-type.tsx`

- **Added** early return guard for empty `gender` string: `if (!gender) return maleBodyTypes`
- Prevents silent fallthrough when gender is `""` (default)

### Change 4 — `app/(root)/onboarding/setup-account.tsx`

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

## Files Modified (Summary)

| File                                         | Changes                                                              |
| -------------------------------------------- | -------------------------------------------------------------------- |
| `app/_layout.tsx`                            | Added `_completionVersion` subscription + sync shortcut              |
| `app/get-started.tsx`                        | Fixed indentation                                                    |
| `app/(auth)/sign-in.tsx`                     | Removed debug styles, fixed tracking                                 |
| `app/(root)/(tabs)/profile.tsx`              | Removed manual logout navigation                                     |
| `app/(root)/onboarding/_layout.tsx`          | Removed duplicate OnboardingProvider                                 |
| `app/(root)/onboarding/body-type.tsx`        | Added empty gender guard                                             |
| `app/(root)/onboarding/setup-account.tsx`    | Added Supabase integration, removed direct navigation                |
| `app/(root)/onboarding/skin-tone.tsx`        | Formatted JSX                                                        |
| `app/(root)/onboarding/style-preference.tsx` | Added Supabase integration, formatted JSX, removed direct navigation |
| `components/navigation/CustomTabBar.tsx`     | Added optional chaining on options                                   |
| `hooks/useSupabaseQuery.ts`                  | Fixed infinite loop + TS lint errors                                 |
| `store/onboarding-store.ts`                  | Added Supabase upsert + `_completionVersion`                         |
| `tailwind.config.js`                         | Added screens/ to content glob                                       |
