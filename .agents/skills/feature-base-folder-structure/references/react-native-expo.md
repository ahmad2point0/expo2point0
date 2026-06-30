# React Native + Expo — Feature-Based Structure

A feature-based structure for **React Native with Expo (Expo Router, TypeScript)**. Read the [SKILL.md](../SKILL.md) core conventions first — this file covers the Expo-specific tree, routing layer, and code.

> **Modern (Expo SDK 52+, Expo Router v4, New Architecture):** File-based routing with `app/`, typed routes, `_layout.tsx` files, NativeWind v4 for Tailwind-style classes, TanStack Query for server state, Zustand for client state, and `expo-secure-store` for secrets. **Everything runs on the client** — there are no Server Components or Server Actions; data fetching lives in services + query hooks.

The `features/` and `global/` layers are **identical in spirit to the Next.js setup**. The differences are all in the routing layer and a few platform details (storage, navigation, styling).

## Project Structure

```
project-root/
├── assets/                                # Expo convention (root): images & fonts
│   ├── images/{icon,splash,logo}.png
│   └── fonts/Inter.ttf
│
├── src/                                   # Requires Expo Router `src/` dir support
│   ├── app/                               # Expo Router (file-based routing) — THIN
│   │   ├── (auth)/                        # Route group (not in the path)
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── _layout.tsx                 # Stack for auth screens
│   │   ├── (tabs)/                         # Tab navigator group
│   │   │   ├── index.tsx                   # Home tab
│   │   │   ├── profile.tsx
│   │   │   └── _layout.tsx                 # <Tabs> bar definition
│   │   ├── orders/
│   │   │   ├── index.tsx                   # Orders list
│   │   │   └── [id].tsx                    # Order details (dynamic)
│   │   ├── chats/
│   │   │   └── [id].tsx
│   │   ├── _layout.tsx                     # Root layout — providers + root <Stack>
│   │   └── +not-found.tsx                  # 404 / unmatched route
│   │
│   ├── features/                          # Business logic modules (see SKILL.md anatomy)
│   │   ├── auth/
│   │   │   ├── components/{LoginForm,RegisterForm}.tsx
│   │   │   ├── hooks/{useLogin,useRegister}.ts
│   │   │   ├── services/auth.service.ts
│   │   │   ├── utils/authValidator.ts
│   │   │   ├── @types/{auth.types,auth.dto,auth.response,index}.ts
│   │   │   └── index.ts
│   │   ├── chat/
│   │   │   ├── components/{ChatBubble,ChatInput,MessageList}.tsx
│   │   │   ├── hooks/useChat.ts
│   │   │   ├── services/chat.service.ts
│   │   │   ├── @types/{chat.types,message.types,index}.ts
│   │   │   └── index.ts
│   │   ├── orders/
│   │   │   ├── components/{OrderCard,OrderList,OrderStatusBadge}.tsx
│   │   │   ├── hooks/useOrders.ts
│   │   │   ├── services/order.service.ts
│   │   │   ├── @types/{order.types,order.status,index}.ts
│   │   │   └── index.ts
│   │   └── home/
│   │       ├── components/HomeHeader.tsx
│   │       ├── hooks/useHome.ts
│   │       ├── services/home.service.ts
│   │       ├── @types/{home.types,index}.ts
│   │       └── index.ts
│   │
│   ├── global/                            # Shared infrastructure (see SKILL.md)
│   │   ├── components/
│   │   │   ├── ui/{Button,Input,Card,Text}.tsx
│   │   │   └── shared/{AppHeader,ScreenContainer,Loader}.tsx
│   │   ├── hooks/{useColorScheme,useDebounce}.ts
│   │   ├── utils/{formatDate,validateEmail,cn}.ts
│   │   ├── constants/{colors,strings,endpoints}.ts
│   │   ├── store/{auth.store,theme.store}.ts
│   │   ├── lib/{queryClient,secureStore,supabase}.ts   # client/SDK setup
│   │   ├── config/{env,apiClient}.ts
│   │   ├── providers/AppProviders.tsx
│   │   ├── @types/{api.types,common.types,index}.ts
│   │   └── index.ts
│   │
│   └── styles/global.css                  # NativeWind directives (optional)
│
├── app.config.ts                          # Expo config (or app.json)
├── babel.config.js
├── metro.config.js
├── tailwind.config.js                     # NativeWind
├── tsconfig.json
├── package.json
└── .env
```

> **Enable `src/app`:** Expo Router resolves `app/` at the project root by default. To use `src/app`, keep `app/` empty/absent at root and ensure your Expo Router version supports the `src` directory (SDK 50+). If you hit issues, move `app/` to the root and keep `features/` + `global/` under `src/`.

## Routing Layer

Route files are **thin screens** — they read params and compose feature components, exactly like Next.js pages.

### Root layout — providers + root stack

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { AppProviders } from '@/global/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="orders/[id]" options={{ headerShown: true, title: 'Order' }} />
      </Stack>
    </AppProviders>
  );
}
```

### Tab layout

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2563eb' }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### Screen — thin wrapper around a feature component

```tsx
// app/(auth)/login.tsx
import { View } from 'react-native';
import { LoginForm } from '@/features/auth';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <LoginForm />
    </View>
  );
}
```

### List screen — composes a feature component that fetches via a hook

```tsx
// app/orders/index.tsx
import { OrderList } from '@/features/orders';

export default function OrdersScreen() {
  return <OrderList />;
}
```

### Dynamic route — read params with `useLocalSearchParams`

```tsx
// app/orders/[id].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useOrder } from '@/features/orders';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <Text>Loading…</Text>;
  if (!order) return <Text>Not found</Text>;

  return (
    <View className="flex-1 p-6">
      <Text className="text-xl font-bold">Order #{order.id}</Text>
      <Text>Status: {order.status}</Text>
    </View>
  );
}
```

## Feature Layer

Native components use React Native primitives and (optionally) NativeWind `className`. Data is fetched through services + TanStack Query hooks — there is no server-side fetch.

### Feature component

```tsx
// features/auth/components/LoginForm.tsx
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Input } from '@/global/components/ui';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();

  return (
    <View className="w-full gap-4">
      <Input placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button loading={isPending} onPress={() => login({ email, password })}>Login</Button>
    </View>
  );
};
```

### Hook — mutation (navigate with expo-router)

```ts
// features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/global/store/auth.store';
import type { LoginDto } from '../@types';

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (data) => { setUser(data.user); router.replace('/(tabs)'); },
  });
};
```

### Hook — query

```ts
// features/orders/hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const useOrders = () =>
  useQuery({ queryKey: ['orders'], queryFn: () => orderService.getAll() });

export const useOrder = (id: string) =>
  useQuery({ queryKey: ['orders', id], queryFn: () => orderService.getById(id), enabled: !!id });
```

### Service

```ts
// features/auth/services/auth.service.ts
import { apiClient } from '@/global/config/apiClient';
import type { LoginDto, RegisterDto, AuthResponse } from '../@types';

export const authService = {
  login: (dto: LoginDto) => apiClient.post<AuthResponse>('/auth/login', dto).then((r) => r.data),
  register: (dto: RegisterDto) => apiClient.post<AuthResponse>('/auth/register', dto).then((r) => r.data),
};
```

### Types & barrel

```ts
// features/auth/@types/auth.dto.ts
export interface LoginDto { email: string; password: string; }
export interface RegisterDto { name: string; email: string; password: string; }

// features/auth/@types/auth.types.ts
export interface User { id: string; email: string; name: string; avatar?: string; }

// features/auth/index.ts — public API
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { useLogin } from './hooks/useLogin';
export type { User, LoginDto, RegisterDto } from './@types';
```

## Global Layer

### UI component (React Native + NativeWind)

```tsx
// global/components/ui/Button.tsx
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import { cn } from '@/global/utils/cn';

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button = ({ children, variant = 'primary', loading, disabled, ...props }: ButtonProps) => (
  <Pressable
    disabled={loading || disabled}
    className={cn(
      'items-center rounded-lg px-5 py-3',
      variant === 'primary' && 'bg-blue-600 active:bg-blue-700',
      variant === 'secondary' && 'border border-blue-600',
      (loading || disabled) && 'opacity-50',
    )}
    {...props}
  >
    {loading ? <ActivityIndicator color="#fff" /> : (
      <Text className={cn('font-semibold', variant === 'primary' ? 'text-white' : 'text-blue-600')}>
        {children}
      </Text>
    )}
  </Pressable>
);
```

### `cn` utility (same as Next.js — works with NativeWind)

```ts
// global/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

### Global store — Zustand persisted to AsyncStorage

```ts
// global/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/features/auth/@types';   // global may import feature TYPES only

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
```

### Secure token storage

```ts
// global/lib/secureStore.ts — keep tokens out of AsyncStorage
import * as SecureStore from 'expo-secure-store';

export const tokenStore = {
  get: () => SecureStore.getItemAsync('token'),
  set: (token: string) => SecureStore.setItemAsync('token', token),
  clear: () => SecureStore.deleteItemAsync('token'),
};
```

### API client — attaches the secure token

```ts
// global/config/apiClient.ts
import axios from 'axios';
import { env } from './env';
import { tokenStore } from '@/global/lib/secureStore';

export const apiClient = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Providers wrapper

```tsx
// global/providers/AppProviders.tsx
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GestureHandlerRootView>
  );
};
```

## Writing Expo Code: Do / Don't

**Keep screens thin — read params, render a feature component.**
```tsx
// ❌ Don't: fetching + business logic inside a route screen
export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { axios.get('/orders').then((r) => setOrders(r.data)); }, []);
  return <FlatList data={orders} renderItem={/* ...markup... */} />;
}

// ✅ Do: screen composes a feature component that owns the hook + UI
import { OrderList } from '@/features/orders';
export default function OrdersScreen() { return <OrderList />; }
```

**Fetch through a service + TanStack Query hook — there is no server runtime.**
```ts
// ❌ Don't: raw fetch/axios inside a component
const res = await fetch(`${url}/orders`);

// ✅ Do: service does the call, hook caches it
const { data } = useOrders();   // → orderService.getAll() via useQuery
```

**Store secrets in SecureStore, not AsyncStorage.**
```ts
// ❌ Don't: tokens/PII in AsyncStorage (unencrypted)
await AsyncStorage.setItem('token', token);

// ✅ Do: secrets in expo-secure-store; AsyncStorage only for non-sensitive prefs
await tokenStore.set(token);
```

**Prefix public env vars with `EXPO_PUBLIC_`, and navigate with typed expo-router.**
```ts
// ❌ Don't: bare env var (undefined in the bundle) / stringly-typed nav scattered around
const url = process.env.API_URL;
navigation.navigate('OrderDetailScreen', { id });

// ✅ Do: EXPO_PUBLIC_ prefix + expo-router
const url = process.env.EXPO_PUBLIC_API_URL;
router.push(`/orders/${id}`);
```

**Use the right list/image primitives for native performance.**
```tsx
// ❌ Don't: map a long array inside a ScrollView (renders everything at once)
<ScrollView>{orders.map((o) => <OrderCard key={o.id} order={o} />)}</ScrollView>

// ✅ Do: virtualized list (FlatList / FlashList) and expo-image
<FlatList data={orders} keyExtractor={(o) => o.id} renderItem={({ item }) => <OrderCard order={item} />} />
```

| Do | Don't |
|----|-------|
| Thin screens that render feature components | Logic/fetching inside route files |
| Fetch via `*.service.ts` + query hook | `fetch`/`axios` directly in components |
| `expo-secure-store` for tokens/PII | Tokens in AsyncStorage |
| AsyncStorage for non-sensitive prefs | Persist secrets in plain AsyncStorage |
| `EXPO_PUBLIC_` for client env vars | Unprefixed `process.env` in app code |
| `router.push` / typed routes (expo-router) | Hard-coded screen-name navigation strings |
| `FlatList`/`FlashList` + `expo-image` | `ScrollView` + `.map` for long lists |
| React Native primitives (`View`, `Pressable`) | DOM tags (`div`, `button`) — they don't exist in RN |

## Config

```jsonc
// tsconfig.json (paths) — extends expo/tsconfig.base
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/features/*": ["src/features/*"],
      "@/global/*": ["src/global/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

```ts
// app.config.ts — enable typed routes (and React Compiler if desired)
import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Your App',
  slug: 'your-app',
  scheme: 'yourapp',
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: { typedRoutes: true },
};

export default config;
```

## Getting Started

```bash
# Scaffold (the default template already ships Expo Router + TypeScript)
npx create-expo-app@latest your-app

# State, data, storage
npx expo install zustand @tanstack/react-query axios \
  @react-native-async-storage/async-storage expo-secure-store

# (Optional) NativeWind for Tailwind-style classes + cn
npm install nativewind && npx expo install tailwindcss react-native-reanimated
npm install clsx tailwind-merge

npx expo start
```

## Next.js → Expo Translation Cheatsheet

| Next.js App Router | Expo Router | Notes |
|--------------------|-------------|-------|
| `page.tsx` | `index.tsx` / `name.tsx` | Route file is the segment name |
| `layout.tsx` | `_layout.tsx` | Defines `<Stack>` / `<Tabs>` navigator |
| `[id]/page.tsx` | `[id].tsx` | Dynamic segment |
| `(group)/` | `(group)/` | Same — logical group, not in path |
| `not-found.tsx` | `+not-found.tsx` | `+` prefixes special routes |
| `await params` | `useLocalSearchParams()` | Params read via hook, client-side |
| `useRouter()` (next/navigation) | `useRouter()` (expo-router) | `push` / `replace` / `back` |
| `<Link href>` (next/link) | `<Link href>` (expo-router) | Same idea |
| Server Components fetch | TanStack Query hook in component | No server runtime on device |
| Server Actions (`'use server'`) | Service call inside a mutation hook | No `actions/` folder |
| `cookies()` | `expo-secure-store` / AsyncStorage | Native secure storage |
| `className` (web CSS / Tailwind) | `className` via NativeWind, or `StyleSheet` | NativeWind maps utilities to RN styles |
| `next/image` | `expo-image` | Native image component |

## Expo-Specific Rules (in addition to SKILL.md)

- **No server runtime on the device.** All data fetching is client-side via services + TanStack Query hooks. There is no `actions/` folder.
- **Screens are thin** — a route file reads params and renders a feature component. Keep `View`/layout glue minimal; push UI into the feature.
- **Secure secrets with `expo-secure-store`**, not AsyncStorage. AsyncStorage is fine for non-sensitive persisted state (e.g. Zustand UI prefs).
- **Public env vars must be prefixed `EXPO_PUBLIC_`** to be inlined into the client bundle.
- **Styling default:** NativeWind (`className`) for parity with the web example; fall back to `StyleSheet.create` for complex or performance-critical styles.
- **State separation:** Zustand for client/UI state, TanStack Query for server-state caching. Same split as the Next.js app, minus Server Components.
