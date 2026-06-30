# NativeWind v4 — Documentation Index

> NativeWind uses Tailwind CSS as a scripting language to create a universal style system for React Native. It compiles Tailwind CSS styles into native StyleSheet objects at build time while providing an efficient runtime for conditional styles like hover, focus, media queries, and container queries.

This is the canonical `llms.txt` link index for [nativewind.dev](https://nativewind.dev). Fetch a specific page only when the answer isn't already in [../SKILL.md](../SKILL.md). For the entire documentation in one file, fetch the **Full documentation** link at the bottom.

## Overview

- [Overview](https://nativewind.dev/docs)

## Getting Started

- [Editor Setup](https://nativewind.dev/docs/getting-started/editor-setup)
- [Troubleshooting](https://nativewind.dev/docs/getting-started/troubleshooting)
- [Typescript](https://nativewind.dev/docs/getting-started/typescript)
- [Additional Setup Guides](https://nativewind.dev/docs/getting-started/installation/_additional-guides)
- [Import CSS](https://nativewind.dev/docs/getting-started/installation/_import-css)
- [Installation](https://nativewind.dev/docs/getting-started/installation/frameworkless)
- [Installation](https://nativewind.dev/docs/getting-started/installation)
- [Installation (Next.js)](https://nativewind.dev/docs/getting-started/installation/nextjs)

## Guides

- [Writing Custom Components](https://nativewind.dev/docs/guides/custom-components)
- [Custom Fonts](https://nativewind.dev/docs/guides/custom-fonts): How to load and use custom fonts with NativeWind v4 and Expo
- [Other Bundlers](https://nativewind.dev/docs/guides/other-bundlers)
- [Themes](https://nativewind.dev/docs/guides/themes)
- [Styling Third-Party Components](https://nativewind.dev/docs/guides/third-party-components)
- [Using with Monorepos](https://nativewind.dev/docs/guides/using-with-monorepos): Set up NativeWind in monorepo environments like NX

## Core Concepts

- [Dark Mode](https://nativewind.dev/docs/core-concepts/dark-mode)
- [Platform Differences](https://nativewind.dev/docs/core-concepts/differences)
- [Functions & Directives](https://nativewind.dev/docs/core-concepts/functions-and-directives)
- [Quirks](https://nativewind.dev/docs/core-concepts/quirks)
- [Responsive Design](https://nativewind.dev/docs/core-concepts/responsive-design)
- [States & Pseudo-classes](https://nativewind.dev/docs/core-concepts/states)
- [Style Specificity](https://nativewind.dev/docs/core-concepts/style-specificity)
- [Built on Tailwind CSS](https://nativewind.dev/docs/core-concepts/tailwindcss)
- [Units](https://nativewind.dev/docs/core-concepts/units)

## Customization

- [Colors](https://nativewind.dev/docs/customization/colors)
- [Configuration](https://nativewind.dev/docs/customization/configuration)
- [Content](https://nativewind.dev/docs/customization/content)
- [Screens](https://nativewind.dev/docs/customization/screens)
- [Theme](https://nativewind.dev/docs/customization/theme)

## API

- [cssInterop](https://nativewind.dev/docs/api/css-interop)
- [StyleSheet](https://nativewind.dev/docs/api/native-wind-style-sheet)
- [remapProps](https://nativewind.dev/docs/api/remap-props)
- [useColorScheme()](https://nativewind.dev/docs/api/use-color-scheme)
- [vars() & useUnstableNativeVariable()](https://nativewind.dev/docs/api/vars)
- [withNativeWind](https://nativewind.dev/docs/api/with-nativewind)

## Tailwind CSS Utilities

The full per-utility reference lives under `https://nativewind.dev/docs/tailwind/...`. Common categories:

- **Backgrounds** — background-color, gradient-color-stops, …
- **Borders** — border-color, border-radius, border-width, divide-*, outline-*, ring-*
- **Effects** — box-shadow, box-shadow-color, opacity
- **Filters / Backdrop filters** — blur, brightness, contrast, grayscale, …
- **Flexbox & Grid** — flex, flex-direction, align-*, justify-*, gap, grid-*
- **Interactivity** — cursor, pointer-events, user-select, scroll-*, touch-action, will-change
- **Layout** — aspect-ratio, box-sizing, display, overflow, position, top-right-bottom-left, z-index, container
- **New Concepts** — [Safe Area Insets](https://nativewind.dev/docs/tailwind/new-concepts/safe-area-insets)
- **Plugins** — [Container Queries](https://nativewind.dev/docs/tailwind/plugins/container-queries)
- **Sizing** — width, height, min/max-width, min/max-height
- **Spacing** — margin, padding, space-between
- **SVG** — fill, stroke, stroke-width
- **Tables** — border-collapse, border-spacing, caption-side, table-layout
- **Transforms** — rotate, scale, skew, translate, transform-origin
- **Transitions & Animation** — animation, transition-property, transition-duration, transition-delay, transition-timing-function
- **Typography** — font-family, font-size, font-weight, font-style, letter-spacing, line-height, line-clamp, text-align, text-color, text-decoration, text-transform, vertical-align, whitespace, word-break
- **Accessibility** — [Screen Readers](https://nativewind.dev/docs/tailwind/accessibility/screen-readers)

> Not every web Tailwind utility maps to React Native. When in doubt about whether a class is supported on native, check [Platform Differences](https://nativewind.dev/docs/core-concepts/differences) and [Quirks](https://nativewind.dev/docs/core-concepts/quirks).

## Full Documentation (for LLM consumption)

- [Full documentation (single file)](https://nativewind.dev/llms-full.txt): Complete NativeWind v4 documentation in one file.
