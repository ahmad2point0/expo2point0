# Next.js App Router — Feature-Based Structure

A feature-based structure for **Next.js (App Router, Server Components, TypeScript)**. Read the [SKILL.md](../SKILL.md) core conventions first — this file only covers the Next.js-specific tree, routing layer, and code.

> **Modern (Next.js 15+):** `params` and `searchParams` are `Promise`s — `await` them. `cookies()` and `headers()` are async. Typed routes are stable. Default to Server Components; opt into the client with `'use client'`.

## Project Structure

```
project-root/
├── public/                                # Static files served at /
│   ├── images/logo.png
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── app/                               # App Router (file-based routing) — THIN
│   │   ├── (auth)/                        # Route group (not in URL)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (main)/
│   │   │   ├── page.tsx                    # Home page
│   │   │   ├── profile/page.tsx
│   │   │   └── layout.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx                    # Orders list
│   │   │   ├── loading.tsx                 # Route-level Suspense fallback
│   │   │   └── [id]/page.tsx               # Order details (dynamic)
│   │   ├── chats/
│   │   │   └── [id]/page.tsx
│   │   ├── api/                            # Route Handlers
│   │   │   ├── auth/route.ts
│   │   │   └── orders/route.ts
│   │   ├── layout.tsx                      # Root layout
│   │   ├── loading.tsx                     # Global loading UI
│   │   ├── error.tsx                       # Global error UI ('use client')
│   │   └── not-found.tsx                   # 404 page
│   │
│   ├── features/                          # Business logic modules (see SKILL.md anatomy)
│   │   ├── auth/
│   │   │   ├── components/{LoginForm,RegisterForm}.tsx
│   │   │   ├── hooks/{useLogin,useRegister}.ts
│   │   │   ├── services/auth.service.ts
│   │   │   ├── actions/auth.action.ts      # Server Actions
│   │   │   ├── utils/authValidator.ts
│   │   │   ├── @types/{auth.types,auth.dto,auth.response,index}.ts
│   │   │   └── index.ts
│   │   ├── chat/
│   │   │   ├── components/{ChatBubble,ChatInput}.tsx
│   │   │   ├── hooks/useChat.ts
│   │   │   ├── services/chat.service.ts
│   │   │   ├── @types/{chat.types,message.types,index}.ts
│   │   │   └── index.ts
│   │   ├── orders/
│   │   │   ├── components/{OrderCard,OrderList,OrderStatusBadge}.tsx
│   │   │   ├── hooks/useOrders.ts
│   │   │   ├── services/order.service.ts
│   │   │   ├── actions/order.action.ts
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
│   │   │   ├── ui/{Button,Input,Card}.tsx
│   │   │   └── shared/{AppHeader,Footer,Loader,Providers}.tsx
│   │   ├── hooks/{useTheme,useDebounce}.ts
│   │   ├── utils/{formatDate,validateEmail,cn}.ts
│   │   ├── constants/{colors,strings,endpoints}.ts
│   │   ├── store/{auth.store,theme.store}.ts
│   │   ├── lib/{prisma,supabase,analytics}.ts     # Server-side clients
│   │   ├── config/{site,env,apiClient}.ts
│   │   ├── @types/{api.types,common.types,index}.ts
│   │   └── index.ts
│   │
│   └── styles/globals.css
│
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── .env.local
```

## Routing Layer

### Page — Server Component (default), fetches directly

```tsx
// app/orders/page.tsx
import { OrderList } from '@/features/orders';
import { orderService } from '@/features/orders/services/order.service';

export default async function OrdersPage() {
  const orders = await orderService.getAll();          // server-side fetch, no client JS
  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <OrderList initialOrders={orders} />               {/* hand off to client component */}
    </main>
  );
}
```

### Route group — thin wrapper

```tsx
// app/(auth)/login/page.tsx — parentheses group routes without adding to the URL
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </main>
  );
}
```

### Layout

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
```

### Dynamic route — `params` is async in Next.js 15+

```tsx
// app/orders/[id]/page.tsx
import { orderService } from '@/features/orders/services/order.service';
import { notFound } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;                  // ← await: params is a Promise in Next 15+
  const order = await orderService.getById(id);
  if (!order) notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-xl font-bold">Order #{order.id}</h1>
      <p>Status: {order.status}</p>
    </main>
  );
}
```

### Root layout

```tsx
// app/layout.tsx
import '@/styles/globals.css';
import { Providers } from '@/global/components/shared/Providers';

export const metadata = { title: 'Your App', description: 'Built with Next.js' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Route handler (API)

```ts
// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { orderService } from '@/features/orders/services/order.service';

export async function GET() {
  return NextResponse.json(await orderService.getAll());
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(await orderService.create(body), { status: 201 });
}
```

## Feature Layer

### Client component

```tsx
// features/auth/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { Button, Input } from '@/global/components/ui';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); login({ email, password }); }}
      className="space-y-4"
    >
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" loading={isPending}>Login</Button>
    </form>
  );
};
```

### Hook (TanStack Query)

```ts
// features/auth/hooks/useLogin.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/global/store/auth.store';
import type { LoginDto } from '../@types';

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: (data) => { setUser(data.user); router.push('/'); },
  });
};
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

### Server Action — `cookies()` is async in Next.js 15+

```ts
// features/auth/actions/auth.action.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authService } from '../services/auth.service';
import type { LoginDto } from '../@types';

export async function loginAction(dto: LoginDto) {
  const { token } = await authService.login(dto);
  (await cookies()).set('token', token, { httpOnly: true, secure: true });   // ← await cookies()
  redirect('/');
}
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
export { useRegister } from './hooks/useRegister';
export type { User, LoginDto, RegisterDto } from './@types';
```

## Global Layer

```tsx
// global/components/ui/Button.tsx
'use client';
import { cn } from '@/global/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button = ({ children, variant = 'primary', loading, className, ...props }: ButtonProps) => (
  <button
    className={cn(
      'rounded-lg px-5 py-2.5 font-semibold transition-colors disabled:opacity-50',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
      variant === 'secondary' && 'border border-blue-600 text-blue-600 hover:bg-blue-50',
      className,
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? 'Loading…' : children}
  </button>
);
```

```ts
// global/utils/cn.ts — className merge utility
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

```ts
// global/store/auth.store.ts — Zustand + persist
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
    { name: 'auth-storage' },
  ),
);
```

```ts
// global/config/apiClient.ts
import axios from 'axios';
import { env } from './env';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});
```

```tsx
// global/components/shared/Providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

## Server vs Client Components

Default to Server Components; add `'use client'` only when you need the right column.

| Use Server Components for | Use Client Components for |
|---------------------------|---------------------------|
| Data fetching, DB access | Interactive forms & inputs |
| Reading cookies/headers | Event handlers (`onClick`, `onChange`) |
| Static content, SEO metadata | Browser APIs (`localStorage`, etc.) |
| Passing initial data down | State & effects (`useState`, Zustand, React Query) |

**Pattern — server fetch + client interactivity:** the server page fetches and passes `initialOrders` to a `'use client'` `OrderList` that owns filtering/state (see `OrdersPage` + `OrderList` above).

## Writing Next.js Code: Do / Don't

**Default to Server Components; push `'use client'` to the leaf that needs it.**
```tsx
// ❌ Don't: 'use client' at the top of a page just to render a small interactive bit
'use client';
export default function OrdersPage() { /* whole page now ships to the browser */ }

// ✅ Do: server page fetches; only the interactive child is a client component
export default async function OrdersPage() {
  const orders = await orderService.getAll();
  return <OrderList initialOrders={orders} />;   // OrderList has 'use client'
}
```

**Fetch on the server; don't `useEffect`-fetch what the server can render.**
```tsx
// ❌ Don't: client waterfall for first-paint data
'use client';
useEffect(() => { fetch('/api/orders').then(/* ... */); }, []);

// ✅ Do: fetch in the Server Component (or a query hook for client-side updates)
const orders = await orderService.getAll();
```

**Await async request APIs (Next.js 15+).**
```tsx
// ❌ Don't (breaks in Next 15+): treating params/cookies as sync
function Page({ params }: { params: { id: string } }) { const id = params.id; }
const token = cookies().get('token');

// ✅ Do: await them
async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; }
const token = (await cookies()).get('token');
```

**Keep server-only clients out of client components; mutate via Server Actions.**
```ts
// ❌ Don't: import a DB/admin client into a 'use client' file, or write data ad hoc in a handler
'use client';
import { prisma } from '@/global/lib/prisma';   // leaks server code into the bundle

// ✅ Do: server-only client used in services/actions; mutations in actions/*.action.ts ('use server')
import { prisma } from '@/global/lib/prisma';    // only in server code paths
```

| Do | Don't |
|----|-------|
| Server Components by default | `'use client'` on whole pages/layouts |
| `await params` / `await cookies()` | Access them synchronously |
| Fetch in Server Components / services | `useEffect` + `fetch` for first paint |
| Mutations in `actions/*.action.ts` | Inline writes scattered in components |
| `lib/` server clients in server code only | Import Prisma/Supabase-admin into client UI |
| `loading.tsx` / `error.tsx` for UX states | Manual spinner/error boilerplate per page |

## Config

```jsonc
// tsconfig.json (paths)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/features/*": ["src/features/*"],
      "@/global/*": ["src/global/*"]
    },
    "plugins": [{ "name": "next" }]
  }
}
```

## Getting Started

```bash
npx create-next-app@latest --typescript --tailwind --app --src-dir
npm install zustand @tanstack/react-query axios clsx tailwind-merge
npm run dev
```

## Next.js-Specific Rules (in addition to SKILL.md)

- **Server-first.** Default to Server Components; add `'use client'` only at the leaf that needs interactivity, not the whole tree.
- **Mutations via Server Actions.** Put form submissions / writes in `actions/*.action.ts` (`'use server'`).
- **`lib/` holds server-only clients** (Prisma, Supabase admin). Never import them into client components.
- **State separation:** Zustand for client state, TanStack Query for server-state caching, Server Components for the first paint's data.
