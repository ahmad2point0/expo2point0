---
name: nativewind
description: Use when styling React Native / Expo components with Tailwind utility classes via NativeWind v4 — writing `className` on RN primitives, wiring the babel/metro/tailwind/global.css setup, dark mode with `darkMode: "class"`, responsive/state/platform variants, theming with CSS variables, styling third-party or custom components (cssInterop/remapProps), or debugging why classes don't apply. Expo SDK 57 + NativeWind v4 + Tailwind v3 specific. Not for plain StyleSheet or web-only Tailwind.
license: MIT
metadata:
  author: ahmad2point0
  version: "1.0.0"
---

# NativeWind v4 (Expo)

## Overview

**NativeWind** lets you style React Native components with Tailwind CSS utility classes via the `className` prop. Tailwind is used as a *scripting language*: at build time classes compile into native `StyleSheet` objects, and a small runtime handles conditional styles (dark mode, `hover:`/`focus:`/`active:`, breakpoints, container queries).

**Core principle:** write Tailwind classes on RN primitives (`View`, `Text`, `Pressable`, …) exactly like web Tailwind — but only the subset of utilities that map to React Native's style model applies. When something doesn't render, it's almost always a **setup wiring** issue or an **unsupported utility**, not a class typo.

This project is already configured: **NativeWind `^4.1.x`**, **Tailwind `^3.4.x`**, **Expo SDK 57**, `darkMode: "class"`, `tailwind-merge` available.

## When to Use

- Styling any screen or component in this Expo app (`className="..."`).
- Adding/adjusting the NativeWind build wiring (babel, metro, `tailwind.config.js`, `global.css`).
- Dark mode, responsive breakpoints, pseudo-states, or platform-specific styles.
- Making a third-party or custom component accept `className`.
- Debugging "my Tailwind classes do nothing" / "styles only work after reload".

**When NOT to use:** plain `StyleSheet.create` only code, web projects using standard Tailwind (no RN), or non-Tailwind styling questions.

## The Required Wiring (6 pieces)

NativeWind only works when **all** of these line up. This repo already has them — verify here before assuming a class is broken.

| File | Must contain | This repo |
|------|-------------|-----------|
| `tailwind.config.js` | `presets: [require("nativewind/preset")]` + `content` globs that cover every file using `className` | scans `src/app`, `src/global/components`, `src/features` |
| `global.css` | `@tailwind base; @tailwind components; @tailwind utilities;` | ✅ |
| `metro.config.js` | `withNativeWind(config, { input: "./global.css" })` | ✅ |
| `babel.config.js` | `babel-preset-expo` with `{ jsxImportSource: "nativewind" }` **and** `"nativewind/babel"` | ✅ |
| `nativewind-env.d.ts` | `/// <reference types="nativewind/types" />` (gives `className` its types — do not edit) | ✅ |
| App entry | `import "../../global.css";` imported once | imported in [src/app/_layout.tsx](../../../src/app/_layout.tsx) |

> **The single most common failure:** a file using `className` is **not matched by a `content` glob** in `tailwind.config.js`, so its classes get tree-shaken away. When adding a new top-level source folder, add it to `content`.

## Core Usage

```tsx
import { View, Text, Pressable } from "react-native";

export const Card = () => (
  <View className="rounded-2xl bg-white p-4 shadow dark:bg-neutral-900">
    <Text className="text-lg font-semibold text-neutral-900 dark:text-white">
      Title
    </Text>
    <Pressable className="mt-3 items-center rounded-lg bg-blue-600 px-4 py-2 active:bg-blue-700">
      <Text className="font-medium text-white">Press me</Text>
    </Pressable>
  </View>
);
```

- Style with `className`; keep `style={}` only for truly dynamic values that can't be expressed as classes.
- `Text` color/weight/size do **not** cascade to child `Text` the way web CSS does — set typography on the `Text` that renders it.

## Conditional / Merged Classes — `cn()`

This repo already ships a `cn` helper (`clsx` + `tailwind-merge`, both installed) at [src/global/lib/utils.ts](../../../src/global/lib/utils.ts) — use it, don't re-create one elsewhere:

```ts
// src/global/lib/utils.ts  (already exists)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`twMerge` resolves conflicts so later classes win over earlier ones (e.g. a `variant` overriding a base color). Import it via the path alias:

```tsx
import { cn } from "@global/lib/utils";

<Pressable
  className={cn(
    "items-center rounded-lg px-4 py-2",
    variant === "primary" ? "bg-blue-600" : "border border-blue-600",
    disabled && "opacity-50",
  )}
/>
```

## Dark Mode

Config uses `darkMode: "class"`. Use `dark:` variants and drive the scheme with NativeWind's hook:

```tsx
import { useColorScheme } from "nativewind";

const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
// colorScheme: "light" | "dark"; setColorScheme("light" | "dark" | "system")
```

`dark:bg-neutral-900` etc. then resolve against the active scheme. To follow the OS, `setColorScheme("system")`.

## Variants: Responsive, States, Platform

```tsx
// Responsive (sm/md/lg... breakpoints from tailwind.config screens)
<View className="px-4 md:px-8" />

// Interaction states
<Pressable className="bg-blue-600 active:bg-blue-700 disabled:opacity-50" />

// Platform-specific (NativeWind adds ios:/android:/web:/native:)
<View className="ios:pt-12 android:pt-6 web:pt-4" />
```

## Theming with CSS Variables

Define design tokens as CSS variables in `global.css`, map them in `tailwind.config.js`, and switch them per scheme — see [Themes](https://nativewind.dev/docs/guides/themes). For per-subtree overrides use `vars()` from `nativewind`.

```css
/* global.css */
@layer base {
  :root { --color-brand: 37 99 235; }       /* rgb channels */
  .dark:root { --color-brand: 96 165 250; }
}
```
```js
// tailwind.config.js → theme.extend.colors
colors: { brand: "rgb(var(--color-brand) / <alpha-value>)" }
```

## Styling Components That Don't Accept `className`

Only components built on `cssInterop`/the JSX transform receive `className`. For third-party components:

- **`remapProps`** — map a `className`-style prop onto an existing style prop (most third-party components). See [remapProps](https://nativewind.dev/docs/api/remap-props).
- **`cssInterop`** — full interop when a component needs computed styles (e.g. moving styles to a non-`style` prop, handling `ref`). See [cssInterop](https://nativewind.dev/docs/api/css-interop) and [Writing Custom Components](https://nativewind.dev/docs/guides/custom-components).

```ts
import { remapProps } from "nativewind";
import { SomeIcon } from "third-party";
// now <SomeIcon className="text-blue-600" /> works
remapProps(SomeIcon, { className: "style" });
```

## Common Mistakes

| Symptom | Cause / Fix |
|---------|-------------|
| Classes do nothing on a new file | File path not covered by `content` globs in `tailwind.config.js`. Add the glob. |
| Nothing styled at all | `import "global.css"` missing from app entry, or metro `input` path wrong. |
| `className` is a TS error | `nativewind-env.d.ts` missing/removed, or `jsxImportSource: "nativewind"` not in babel preset. |
| Styles only apply after manual reload | Metro/babel config edited without restarting with cache cleared → `npx expo start -c`. |
| A web Tailwind class has no effect | Utility isn't supported on native — check [Platform Differences](https://nativewind.dev/docs/core-concepts/differences) & [Quirks](https://nativewind.dev/docs/core-concepts/quirks). |
| Conflicting classes both apply / wrong one wins | Use `cn()` (tailwind-merge) instead of string concatenation. |
| Animations/transitions janky or absent | NativeWind animations rely on `react-native-reanimated` (installed here) — ensure it's set up. |
| Text styles "don't inherit" | RN has no CSS inheritance for nested `Text`; set typography on each `Text`. |

After changing any of the 6 wiring files, restart Metro with a clean cache: `npx expo start -c`.

## Quick Reference

| Need | Do |
|------|-----|
| Style an element | `className="..."` on the RN primitive |
| Merge/override classes | `cn("base", cond && "override")` |
| Dark mode class | `dark:bg-...`; control via `useColorScheme()` |
| Read/set scheme | `const { colorScheme, setColorScheme } = useColorScheme()` |
| Responsive | `md:px-8` (breakpoints from `screens`) |
| Pressed/disabled | `active:...`, `disabled:...` |
| Platform branch | `ios:` / `android:` / `web:` / `native:` |
| Make 3rd-party stylable | `remapProps` (simple) or `cssInterop` (full) |
| Theme tokens | CSS vars in `global.css` + `theme.extend` |
| Restart after config change | `npx expo start -c` |

## Full Documentation

Per-topic links and the single-file dump for deep dives are in [references/nativewind-docs.md](references/nativewind-docs.md). Fetch a page from there (or `https://nativewind.dev/llms-full.txt`) only when the answer isn't already above.
