# Codebase Scan Report

_Date:_ 2026-05-10  
_Project:_ `my-app` (Expo + React Native + Clerk)

## 1) Critical Build/Typecheck Issues

### 1.1 Dependencies are not installed / unresolved modules
`npx tsc --noEmit` fails with many `TS2307` errors (`Cannot find module ...`) for core runtime packages like:
- `react`, `react-native`, `expo-router`, `@clerk/clerk-expo`, `expo-secure-store`, `zustand`, `@supabase/supabase-js`, `@react-native-async-storage/async-storage`.

**Impact:** Project cannot typecheck or build in current environment.

---

### 1.2 Base Expo TS config not found
TypeScript reports:
- `tsconfig.json(2,14): error TS6053: File 'expo/tsconfig.base' not found.`

**Impact:** TypeScript falls back to wrong defaults (`--jsx` unset), which triggers a cascade of JSX errors.

---

### 1.3 JSX mode not active (`--jsx` flag errors)
Large number of files fail with:
- `TS17004: Cannot use JSX unless the '--jsx' flag is provided.`

This is a secondary symptom of missing Expo TS base config / node_modules.

**Impact:** Almost all `.tsx` files fail typecheck.

---

## 2) Onboarding/Auth Flow Risks

### 2.1 Duplicate onboarding completion entrypoints
Both screens write completion:
- `app/(root)/onboarding/style-preference.tsx`
- `app/(root)/onboarding/setup-account.tsx`

**Risk:** Double writes + confusing flow ownership (final step marks complete, but setup screen can also mark complete).

**Suggestion:** Keep a single source of completion trigger (prefer final step OR setup screen, not both).

---

### 2.2 Redirect state can stay `null` for signed-out users
In `app/_layout.tsx`, onboarding state loader sets `onboardingComplete` to `null` when `userId` is missing; redirect effect short-circuits on `onboardingComplete === null`.

**Risk:** Signed-out users may remain on current route until another state transition occurs.

**Suggestion:** For signed-out case, do auth redirect independent of onboarding state gating.

---

## 3) Supabase Integration Risks

### 3.1 Hook composition pattern may create independent clients unintentionally
`useSupabaseQuery` calls `useSupabase()` internally. If `PostsScreen` also calls `useSupabase()`, separate client instances/lifecycles can exist in same screen tree.

**Risk:** token/client re-init timing mismatch and duplicate initialization work.

**Suggestion:** Let `useSupabaseQuery` accept a `supabase` client parameter, or expose a provider-level singleton.

---

### 3.2 `useSupabaseQuery` uses broad `any` query typing
`PostgrestFilterBuilder<any, any, any>` with `apply` function weakens type safety.

**Risk:** Runtime query mistakes won’t be caught by TS.

**Suggestion:** Add generics per table schema types.

---

## 4) Maintainability / Code Quality Issues

### 4.1 Several screens are one-line JSX blocks
Files like onboarding screens contain compressed single-line JSX returns.

**Impact:** Harder debugging, reviewing, and merge conflict resolution.

**Suggestion:** Reformat files with Prettier and keep multiline JSX.

---

### 4.2 Store provider is a passthrough component
`OnboardingProvider` currently returns only `children` and holds no provider logic.

**Impact:** Misleading abstraction (appears to provide context but doesn’t).

**Suggestion:** Remove wrapper or rename as `AppProviders` only if it has provider composition purpose.

---

## 5) Environment/Tooling Gaps

### 5.1 Lint command unavailable
Previous runs indicate `expo` CLI not available in environment.

**Impact:** No lint/static quality gate in current container.

---

### 5.2 Package installation blocked
Previous package install attempts failed with npm registry 403.

**Impact:** Cannot verify runtime deps / type defs in this environment.

---

## 6) Immediate Action Plan

1. Restore dependencies (`npm ci` / `npm install`) in a network-enabled environment.
2. Ensure `expo` package is installed so `expo/tsconfig.base` resolves.
3. Re-run:
   - `npx tsc --noEmit`
   - `npm run lint`
4. Consolidate onboarding completion trigger to one screen.
5. Refactor `useSupabaseQuery` to consume shared client instance and tighten generic typing.
6. Prettier-format compressed TSX files.

---

## Command Evidence
- `npx tsc --noEmit` (failed with TS6053 + TS2307 + TS17004 + additional errors)
