# expo2point0

Modern React Native Expo starter template with the latest Expo SDK, preconfigured NativeWind (Tailwind CSS), and a scalable production-ready folder structure.

[![npm version](https://img.shields.io/npm/v/expo2point0)](https://www.npmjs.com/package/expo2point0)
[![license](https://img.shields.io/npm/l/expo2point0)](https://github.com/ahmad2point0/react-native-template/blob/main/LICENSE)

## Features

- **Expo SDK 54** with New Architecture enabled
- **Expo Router v6** with file-based routing and typed routes
- **NativeWind v4** (Tailwind CSS for React Native) with dark mode support
- **TypeScript** with strict mode and path aliases (`@/*`, `@global/*`, `@features/*`)
- **Husky + lint-staged** pre-commit hooks (ESLint, Prettier, console.log removal, Expo Doctor)
- **Reactix** UI components — animated, production-ready Button with gradient, loading states, and press animations
- **Feature-based architecture** with clear separation of global and feature-specific code
- **Higher-Order Components** — `withSafeAreaView` and `withKeyboardAwareScrollView` wrappers
- **Provider setup** — GestureHandler, SafeArea, and KeyboardController preconfigured
- **Utility functions** — `cn()` helper for merging Tailwind classes (clsx + tailwind-merge)

## Quick Start

```bash
npx expo2point0
```

You'll be prompted for a project name. The CLI will clone the template, clean up git history, and install dependencies with bun.

```bash
cd your-project-name
bun start
```

### Run on a specific platform

```bash
bun run ios
bun run android
bun run web
```

## Project Structure

```
src/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout with providers
│   └── index.tsx                 # Home screen
├── assets/
│   ├── fonts/                    # Custom fonts
│   └── images/                   # App images and icons
├── features/                     # Feature-based modules
│   └── auth/                     # Auth feature (extensible)
└── global/                       # Shared across features
    ├── components/
    │   ├── shared/               # HOCs and shared components
    │   │   └── Wrappers/         # withSafeAreaView, withKeyboardAwareScrollView
    │   └── ui/                   # Reactix UI components
    │       └── base/
    │           └── button/       # Animated button with gradient & loading states
    ├── lib/
    │   └── utils.ts              # cn() utility (clsx + tailwind-merge)
    ├── providers/
    │   └── Provider.tsx          # Root providers (Gesture, SafeArea, Keyboard)
    └── types/
        └── nativewind-env.d.ts   # NativeWind type definitions
```

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Expo | 54.0.33 |
| Runtime | React Native | 0.81.5 |
| UI Library | React | 19.1.0 |
| Routing | Expo Router | 6.0.23 |
| Styling | NativeWind + Tailwind CSS | 4.1.23 / 3.4.17 |
| Animations | React Native Reanimated | 4.1.1 |
| Gestures | react-native-gesture-handler | 2.28.0 |
| Keyboard | react-native-keyboard-controller | 1.18.5 |
| Linting | ESLint + eslint-config-expo | 9.25.0 |
| Formatting | Prettier + prettier-plugin-tailwindcss | — |
| Git Hooks | Husky + lint-staged | 9.1.7 |
| Language | TypeScript | 5.9.2 |

## Path Aliases

Configured in `tsconfig.json` with `baseUrl: "./src"`:

```typescript
import { Button } from "@/global";           // → src/global
import { cn } from "@global/lib/utils";       // → src/global/lib/utils
import { AuthScreen } from "@features/auth";  // → src/features/auth
```

## Pre-commit Hooks

Husky runs lint-staged on every commit, which automatically:

1. **Removes `console.log` statements** from staged files
2. **Formats code** with Prettier (with Tailwind class sorting)
3. **Lints and fixes** with ESLint
4. **Runs Expo Doctor** to check dependency compatibility

## Reactix Components

The template includes [Reactix](https://github.com/ahmad2point0/react-native-template) UI components out of the box. The `Button` component supports:

- Press animations (scale) via React Native Reanimated
- Linear gradient backgrounds
- Loading state with customizable indicator and text
- Configurable dimensions, border radius, and styles
- Platform-aware rendering (iOS / Android / Web)

```tsx
import { Button } from "@/global";

<Button
  onPress={() => {}}
  gradientColors={["#4c669f", "#3b5998"]}
  isLoading={false}
  withPressAnimation
>
  <Text>Press me</Text>
</Button>
```

## HOC Wrappers

Compose screen-level wrappers using Higher-Order Components:

```tsx
import { withSafeAreaView, withKeyboardAwareScrollView } from "@/global";

function MyScreen() {
  return <View>...</View>;
}

const Safe = withSafeAreaView(MyScreen);
const Final = withKeyboardAwareScrollView(Safe);
export default Final;
```

## Available Scripts

| Script | Description |
|---|---|
| `bun start` | Start the Expo dev server |
| `bun run ios` | Run on iOS simulator |
| `bun run android` | Run on Android emulator |
| `bun run web` | Run in the browser |
| `bun run lint` | Run ESLint |
| `bun run doctor` | Run Expo Doctor |
| `bun run expo:dep-check` | Check dependency versions |

## Configuration Files

| File | Purpose |
|---|---|
| `tailwind.config.js` | Tailwind CSS configuration with NativeWind preset |
| `babel.config.js` | Babel with NativeWind JSX transform |
| `metro.config.js` | Metro bundler with NativeWind integration |
| `eslint.config.js` | ESLint flat config with Expo preset |
| `tsconfig.json` | TypeScript strict mode with path aliases |
| `app.json` | Expo app configuration |
| `global.css` | Tailwind directives |
| `component.config.json` | Reactix component output directory |

## Contributing

1. Fork the [template repository](https://github.com/ahmad2point0/react-native-template)
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

[ISC](https://github.com/ahmad2point0/react-native-template/blob/main/LICENSE)

## Author

[ahmad2point0](https://github.com/ahmad2point0)
