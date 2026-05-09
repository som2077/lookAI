# Production-Ready Architecture Proposal (Expo Router + React Native)

## 1) Current State (Observed)

- Route groups are already in place (`app/(auth)`, `app/(root)`, `app/(root)/(tabs)`), which is good for Expo Router.
- UI components and business logic are not yet clearly separated at scale.
- No strong feature module boundaries yet (e.g., wardrobe domain, saved domain, profile domain).
- Shared concerns (services, constants, hooks, utils, config) need dedicated top-level homes.

---

## 2) Recommended Target Structure

> Keep `app/` only for route files and navigation layout; move most implementation into `src/`.

```txt
my-app/
├── app/                                # Expo Router route entry points only
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── email.tsx
│   └── (root)/
│       ├── _layout.tsx
│       ├── onboarding.tsx
│       ├── get-started.tsx
│       └── (tabs)/
│           ├── _layout.tsx
│           ├── index.tsx
│           ├── wardrobe.tsx
│           ├── outfit.tsx
│           ├── saved.tsx
│           └── profile.tsx
│
├── src/
│   ├── features/                       # Feature-first modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── wardrobe/
│   │   ├── planner/
│   │   ├── saved/
│   │   └── profile/
│   │
│   ├── components/                     # Shared/reusable UI components
│   │   ├── navigation/
│   │   │   └── CustomTabBar.tsx
│   │   ├── ui/                         # atoms/molecules (Button, Card, Input)
│   │   └── feedback/                   # loaders, empty states, errors
│   │
│   ├── services/                       # Cross-feature infra services
│   │   ├── api/                        # HTTP client, interceptors
│   │   ├── auth/                       # Clerk wrappers
│   │   ├── storage/                    # secure-store wrappers
│   │   └── analytics/
│   │
│   ├── hooks/                          # App-wide reusable hooks
│   ├── state/                          # Global store slices (if using Zustand/Redux)
│   ├── constants/                      # app constants, route names, keys
│   ├── config/                         # env, app config, feature flags
│   ├── utils/                          # pure utility helpers
│   ├── types/                          # global type contracts
│   ├── theme/                          # colors, spacing, typography tokens
│   └── lib/                            # framework adapters/integrations
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
├── .env
├── .env.example
├── app.json
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 3) Naming Conventions

- Use **feature names as singular domains**: `planner`, `wardrobe`, `profile`.
- Use clear suffixes:
  - `*.service.ts` for service modules
  - `*.hook.ts` for hooks
  - `*.types.ts` for type files
  - `*.constants.ts` for constants
- Prefer explicit route names and avoid ambiguous files like `outfit.tsx` if the product language is “Planner” (rename to `planner.tsx` when feasible).

---

## 4) Architectural Improvements

1. **Route/Feature separation**
   - `app/` handles navigation only.
   - Real screen composition and business logic live in `src/features/*`.

2. **Shared UI system**
   - Move all reusable UI to `src/components/ui` with consistent props and style tokens.

3. **Service layer standardization**
   - Centralize Clerk, API, secure storage, analytics in `src/services`.
   - Ensure no direct SDK usage inside route files.

4. **Config and constants isolation**
   - Environment variables and app-wide constants become first-class modules.

5. **Scalable team workflow**
   - Domain ownership by feature folders enables parallel work and fewer merge conflicts.

---

## 5) Import Path Strategy

Add path aliases in `tsconfig.json` (recommended):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@config/*": ["src/config/*"],
      "@utils/*": ["src/utils/*"],
      "@constants/*": ["src/constants/*"]
    }
  }
}
```

---

## 6) Refactor / Migration Plan (Low Risk)

### Phase 1 (Safe, no behavior change)

- Create `src/` folders.
- Move `components/navigation/CustomTabBar.tsx` -> `src/components/navigation/CustomTabBar.tsx`.
- Update imports in route layouts.
- Add alias config.

### Phase 2 (Feature modularization)

- For each domain (`auth`, `wardrobe`, `planner`, `saved`, `profile`):
  - Create `src/features/<domain>/`.
  - Move domain UI + hooks + services there.

### Phase 3 (Infrastructure hardening)

- Add API client layer, error handling, logging, analytics wrapper.
- Add testing layers: unit/integration/e2e.

### Phase 4 (Quality gates)

- Enforce lint + typecheck + tests in CI.
- Add pre-commit hooks for lint-staged + formatting.

---

## 7) Best Practices Checklist

- Keep route files thin (view composition + navigation only).
- Keep business logic out of UI components.
- Use typed service contracts and DTOs.
- Create a shared design token system in `src/theme`.
- Prefer feature-based ownership over large global folders.
- Standardize error/loading/empty states.
- Add ADRs (`docs/adr/`) for important architecture decisions.
