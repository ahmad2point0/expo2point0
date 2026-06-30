# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`expo2point0` — a React Native + Expo **starter template** distributed via npm (`npx expo2point0`). Consumers scaffold an app from it, which clones the repo, clears git history, and runs `bun install`.

The package manager is **bun** (`bun.lock`). There is **no test runner configured** — do not invent `bun test`/Jest commands; the only verification gates are typecheck, lint, and Expo Doctor.

## Commands

```bash
bun install              # install dependencies
bun start                # Expo dev server (Metro)
bun run android          # build + run on Android (expo run:android)
bun run ios              # build + run on iOS (expo run:ios)
bun run web              # run in browser
bun run lint             # ESLint (expo lint)
bun run doctor           # npx expo-doctor — dependency/version compatibility check
bun run expo:dep-check   # expo install --check — verify dep versions match SDK
npx tsc --noEmit         # typecheck (strict mode; no dedicated script)
```

## Pre-commit hooks (important)

Husky runs `lint-staged` on commit against staged `*.{js,jsx,ts,tsx}`, in order:

1. **`node scripts/remove_console.js`** — strips `console.log(...)` calls from staged files in place. Don't rely on `console.log` surviving a commit; it is silently deleted.
2. `prettier --write` (with `prettier-plugin-tailwindcss` → sorts Tailwind classes)
3. `eslint --fix`
4. `npx expo-doctor`

## Architecture

This template enforces a **three-layer feature-based architecture**, codified by the bundled skill at `.agents/skills/feature-base-folder-structure/` (read its `SKILL.md` and `references/react-native-expo.md` before adding features or deciding where a file belongs — they are the authoritative convention for this repo).

Dependencies flow **one direction only**: `src/app/ → src/features/ → src/global/`.

| Layer | Path | Role |
|-------|------|------|
| Routing | `src/app/` | Expo Router file-based screens/layouts. **Thin** — compose feature components, read params; no business logic or data fetching. |
| Business | `src/features/<domain>/` | Self-contained domain modules (components, hooks, services, `@types/`), each exposing a public API via `index.ts`. Features **never import each other**. |
| Shared | `src/global/` | Cross-feature infra: `components/ui` (design system), `components/shared` (HOCs), `lib/`, `providers/`, `types/`. May import feature *types* but never feature *logic*. |

Key consequences when writing code here:

- **Import through barrels, not internals.** `src/global/index.ts` re-exports everything shared, so screens import `from "@/global"` (e.g. `import { Button, withSafeAreaView } from "@/global"`). Reach into a feature only via `@/features/<x>` (its `index.ts`), never `@/features/x/hooks/...`.
- **Data access goes through a `*.service.ts`** inside the feature; components/hooks call the service, not `fetch`/`axios` directly. (`features/auth/` is currently an empty placeholder.)
- The auth feature and most `features/` subfolders (`hooks/`, `services/`, `@types/`) are **conventions to follow when scaffolding**, not yet present — replicate the anatomy in the skill reference.

### Routing & providers

`src/app/_layout.tsx` is the root layout: it imports `../../global.css` (NativeWind), wraps `<Stack />` in `<Provider>` from `@/global`. `src/global/providers/Provider.tsx` nests `GestureHandlerRootView` → `SafeAreaProvider` → `KeyboardProvider`. Typed routes are enabled (`app.json` → `experiments.typedRoutes`).

Screens compose **HOC wrappers** rather than rendering layout chrome inline — see `src/app/index.tsx`:

```tsx
const SafeArea = withSafeAreaView(Index);
const KeyboardAvoid = withKeyboardAwareScrollView(SafeArea);
export default KeyboardAvoid;
```

### Styling

NativeWind v4 (Tailwind for RN). `babel.config.js` sets `jsxImportSource: "nativewind"`; `metro.config.js` wires `global.css`; `tailwind.config.js` uses `darkMode: "class"` and scans `src/app`, `src/global/components`, `src/features`. Merge conditional classes with `cn()` from `src/global/lib/utils.ts` (clsx + tailwind-merge).

### UI components (Reactix)

`component.config.json` (`{ "outDir": "src/global/components/ui" }`) configures the Reactix CLI to drop generated components into the global UI layer. The shipped `Button` (`src/global/components/ui/base/button/`) is a Reanimated-animated component (press-scale, gradient, animated loading state); its prop contract lives in `types.ts` (`IButton`).

## Path aliases

`tsconfig.json` sets `baseUrl: "./src"` with:

- `@/*` → `src/*` (so `@/global` resolves to `src/global`)
- `@global/*` → `src/global/*`
- `@features/*` → `src/features/*`

Use aliases, never deep `../../../` relatives.

## Conventions

- Naming: components `PascalCase.tsx`, hooks `useX.ts`, services `<domain>.service.ts`, stores `<domain>.store.ts`, type files `<domain>.types.ts` under `@types/`.
- Every feature and `global/` has an `index.ts` barrel = its public boundary.
- Strict TypeScript (`strict: true`). React 19 / React Native 0.86 / Expo SDK 57 (New Architecture) — treat `package.json` as the source of truth for versions.
