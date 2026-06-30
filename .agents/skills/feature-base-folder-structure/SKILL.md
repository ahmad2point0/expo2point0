---
name: feature-base-folder-structure
description: Sets up a feature-based (modular) folder architecture for Next.js (App Router) and React Native Expo (Expo Router) TypeScript apps — self-contained feature modules, a thin routing layer, a shared global layer, plus naming conventions, barrel exports, and path aliases. Use when starting, scaffolding, or restructuring such an app, adding a feature, or deciding where a component, hook, service, store, type, or screen/page belongs — even when the user doesn't say "architecture" or "folder structure" and only asks where to put a file or how to organize the project. Also use when route files hold business logic, features cross-import, or imports use deep ../../ relative paths. Not for non-React/TypeScript stacks; not a styling or state-management guide.
license: MIT
metadata:
  author: ahmad2point0
  version: "1.0.0"
---

# Feature-Based Folder Structure

## Overview

A **feature-based** (modular) architecture organizes code by *business domain* (`auth`, `orders`, `chat`) instead of by *technical type* (all components in one folder, all hooks in another). Each feature is a self-contained module you can read, move, or delete as a unit.

It rests on **three layers**:

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Routing** | `app/` | Pages/screens, layouts, route handlers. **Thin wrappers** that only compose feature components. No business logic. |
| **Business** | `features/` | Self-contained domain modules: components, hooks, services, stores, types. The actual app. |
| **Shared** | `global/` | Cross-feature infrastructure: design-system UI, utilities, global stores, config, clients. |

**Core principle:** Routing composes, features own logic, global is shared. Dependencies flow **one direction**: `app/ → features/ → global/`. Features never import each other; global never imports features (except types).

## When to Use

- Starting a new Next.js App Router or Expo Router app in TypeScript.
- A project where route files hold data fetching + business logic, or where `components/` has hundreds of unrelated files.
- You see deep relative imports (`../../../utils/x`), circular imports, or "where does this file go?" stalls.
- Scaling a side project toward production with multiple contributors.

**When NOT to use:** A throwaway prototype or a single-screen app — the overhead isn't worth it. A non-TS or non-React stack — the conventions here are React/TypeScript specific.

## Pick Your Framework Reference

Read the **core conventions below** first (they apply to both), then load exactly one framework reference for the concrete tree, routing files, and runnable code:

- **Next.js App Router** (Server Components, Server Actions, route handlers) → read [references/nextjs-app-router.md](references/nextjs-app-router.md)
- **React Native + Expo** (Expo Router, native screens, client-only data) → read [references/react-native-expo.md](references/react-native-expo.md)

The two share the same `features/` + `global/` design. Only the routing layer (`app/`) and a few platform details (data fetching, storage, styling) differ.

## Anatomy of a Feature Module

Every feature follows the same internal shape. Include only the folders the feature actually needs.

```
features/<feature>/
├── components/        # UI specific to this feature (PascalCase.tsx)
├── hooks/             # Client logic & data hooks (use*.ts)
├── services/          # Data access — API calls / DB / SDK (*.service.ts)
├── actions/           # (Next.js only) Server Actions (*.action.ts)
├── utils/             # Feature-only helpers
├── store/             # Feature-scoped state, if not global (*.store.ts)
├── @types/            # Types, DTOs, responses — co-located
│   ├── <feature>.types.ts
│   ├── <feature>.dto.ts
│   ├── <feature>.response.ts
│   └── index.ts
└── index.ts           # Public API (barrel export) — the ONLY entry point
```

A feature's `index.ts` is its public contract. Outside code imports from `@/features/auth`, never from `@/features/auth/hooks/useLogin`. Internal files of a feature import each other with relative paths (`../hooks/useLogin`).

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Component files | `PascalCase.tsx` | `LoginForm.tsx`, `OrderCard.tsx` |
| Hooks | `camelCase.ts`, `use` prefix | `useLogin.ts`, `useOrders.ts` |
| Services | `<domain>.service.ts` | `auth.service.ts` |
| Server Actions (Next.js) | `<domain>.action.ts` | `auth.action.ts` |
| Stores | `<domain>.store.ts` | `auth.store.ts` |
| Type files | `<domain>.types.ts` / `.dto.ts` / `.response.ts` | `auth.dto.ts` |
| Folders | lowercase, plural for collections | `components/`, `hooks/`, `@types/` |
| Barrel | `index.ts` per feature & for `global/` | — |

## The Rules

1. **Routes are thin.** Files in `app/` only compose feature components and pass props/params. Zero business logic.
2. **Features never import other features.** If two features need the same thing, it belongs in `global/`. This keeps modules independently deletable and prevents circular dependencies.
3. **Every feature exposes a public API** via `index.ts`. Import features by their barrel, not deep paths.
4. **Types stay close.** Feature types live in that feature's `@types/`; app-wide types live in `global/@types/`.
5. **Services own data access.** Components and hooks never call `fetch`/`axios`/the DB directly — they go through a `*.service.ts`.
6. **Separate state by kind.** Client/global UI state → Zustand store. Server state (caching, refetch) → TanStack Query. Initial data → Server Components (Next.js) or a query hook (Expo).
7. **One feature = one domain.** When a feature outgrows comprehension, split it (e.g. `orders` → `orders`, `order-tracking`).
8. **Use path aliases, not deep relatives.** `@/features/*`, `@/global/*` — never `../../../`.

## Import Order

Group imports top-to-bottom; blank line between groups:

```ts
// 1. Framework (react, next/*, expo-router, react-native)
// 2. Third-party (@tanstack/react-query, zustand, axios)
// 3. Global / shared  (@/global/...)
// 4. Feature-relative  (../hooks/useLogin, ../@types)
```

## Writing Code: Do / Don't

Concrete corrections for the mistakes agents make most when working in this architecture.

**Keep route files thin — no logic, no data access.**
```tsx
// ❌ Don't: business logic + fetching inside the route file
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { axios.get('/orders').then((r) => setOrders(r.data)); }, []);
  return <div>{orders.map(/* ...filtering, sorting, markup... */)}</div>;
}

// ✅ Do: route composes a feature component; logic lives in the feature
import { OrderList } from '@/features/orders';
export default function OrdersPage() { return <OrderList />; }
```

**Never import one feature from another — hoist shared code to `global/`.**
```ts
// ❌ Don't: sideways dependency between features
import { formatPrice } from '@/features/checkout/utils/formatPrice';   // inside features/orders

// ✅ Do: shared helper lives in global, both features import it
import { formatPrice } from '@/global/utils/formatPrice';
```

**Import features through their barrel, not their internals.**
```ts
// ❌ Don't: reach into a feature's private files
import { useLogin } from '@/features/auth/hooks/useLogin';

// ✅ Do: use the public API
import { useLogin } from '@/features/auth';
```

**Go through a service for data access — never call the transport from a component/hook.**
```ts
// ❌ Don't: axios/fetch in a component or hook
const res = await axios.post('/auth/login', dto);

// ✅ Do: the service owns the call; the hook/component calls the service
const res = await authService.login(dto);
```

**Use path aliases, not deep relatives; co-locate types in `@types/`.**
```ts
// ❌ Don't
import { Button } from '../../../global/components/ui/Button';
export interface User { /* ... */ }   // declared loose inside a component file

// ✅ Do
import { Button } from '@/global/components/ui';
import type { User } from '../@types';   // from features/<x>/@types/index.ts
```

**Quick rules of thumb:**

| Do | Don't |
|----|-------|
| Put domain logic in `features/<x>/` | Put it in `app/` route files |
| Expose a feature via `index.ts` | Deep-import a feature's internals |
| Share via `global/` | Import feature → feature |
| Fetch through `*.service.ts` | Call `axios`/`fetch` in components |
| Type files in `@types/` | Scatter `interface`s across files |
| Import with `@/features`, `@/global` | Use `../../../` chains |
| One component / hook / service per file | Dump multiple concerns in one file |

## Gotchas

- **A `features/` import from another feature is a design smell, not a shortcut.** Hoist the shared piece into `global/` instead of reaching sideways — sideways imports are how this architecture rots back into spaghetti.
- **`global/` may import feature *types* but never feature *logic*.** A global store typing its user as `import type { User } from '@/features/auth/@types'` is fine; a global module calling a feature's service is not.
- **The barrel (`index.ts`) is the boundary.** If you find yourself importing `@/features/x/services/...` from outside the feature, either expose it through the barrel or move it to `global/`.
- **Next.js 15+: `params` and `searchParams` are async** (`Promise`) and `cookies()`/`headers()` must be `await`ed — see the Next.js reference. Old `params.id` (sync) access is a common stale-pattern bug.
- **Expo Router uses `src/app` only if configured**; route files are `name.tsx`/`[id].tsx` with `_layout.tsx`, not `page.tsx`. See the Expo reference.
- **Don't put real route segments inside route groups by accident.** `(auth)` / `(tabs)` parentheses create logical groups that do **not** appear in the URL/path.

## Scaffolding a New Feature

When asked to add a feature, replicate the [anatomy](#anatomy-of-a-feature-module): create the folder under `features/`, add only the subfolders it needs, and finish with an `index.ts` barrel that re-exports its public components, hooks, and types. Wire it into routing by creating a thin route file in `app/` that imports from the feature's barrel. Confirm the framework reference's tree before adding platform-specific files (`actions/` is Next.js only).

## Validation Checklist

Before considering a structure correct, verify:
- [ ] No file in `app/` contains business logic or direct data access.
- [ ] No feature imports from another feature (`grep -r "@/features" features/` should only show same-feature relative paths or none).
- [ ] Every feature has an `index.ts` barrel.
- [ ] Types live in `@types/` (feature) or `global/@types/`, not scattered.
- [ ] Path aliases (`@/features`, `@/global`) are configured in `tsconfig.json` and used instead of deep relatives.
