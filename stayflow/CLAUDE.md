# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15+ application built with TypeScript, using Supabase for authentication and data storage. It follows the App Router architecture and implements cookie-based authentication using `@supabase/ssr`. The UI is built with shadcn/ui components and styled with Tailwind CSS.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Setup

Before running the application, copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

Get these values from the Supabase project's API settings.

## Architecture

### Authentication System

The application uses cookie-based authentication with three distinct Supabase client configurations:

1. **Client-side** ([lib/supabase/client.ts](lib/supabase/client.ts)): For use in Client Components
   - Created with `createBrowserClient()`
   - Used in forms and client-side interactions

2. **Server-side** ([lib/supabase/server.ts](lib/supabase/server.ts)): For use in Server Components, Route Handlers, and Server Actions
   - Created with `createServerClient()` using Next.js cookies
   - Used for authenticated data fetching

3. **Proxy/Middleware** ([lib/supabase/proxy.ts](lib/supabase/proxy.ts)): For session management across requests
   - Implements `updateSession()` function called from [proxy.ts](proxy.ts)
   - Handles automatic redirection of unauthenticated users to `/auth/login`
   - **CRITICAL**: Never run code between `createServerClient()` and `supabase.auth.getClaims()` to prevent session issues

**Important**: With Fluid compute, always create a new client for each request/function. Never store clients in global variables.

### Route Structure

```
app/
├── layout.tsx          # Root layout with ThemeProvider
├── page.tsx            # Landing page
├── auth/               # Authentication routes
│   ├── confirm/        # Email confirmation handler (route.ts)
│   ├── login/          # Login page
│   ├── sign-up/        # Registration page
│   ├── forgot-password/
│   ├── update-password/
│   └── error/          # Auth error handling
└── protected/          # Protected routes (requires authentication)
    ├── layout.tsx      # Protected layout
    └── page.tsx        # Protected page example
```

Protected routes are automatically guarded by the proxy middleware, which redirects unauthenticated users to `/auth/login`.

### Component Organization

- **components/**: Reusable components including auth forms
  - `login-form.tsx`, `sign-up-form.tsx`: Client-side auth forms using Supabase client
  - `auth-button.tsx`: Server component that checks auth state
  - `tutorial/`: Step-by-step guide components
- **components/ui/**: shadcn/ui components (button, card, input, label, dropdown-menu, badge, checkbox)
  - Configured via [components.json](components.json) with "new-york" style
  - Uses Lucide React for icons

### Styling System

- **Tailwind CSS** with custom theme extending HSL color variables
- **Dark mode** enabled via `next-themes` with class-based switching
- **CSS variables** defined in [app/globals.css](app/globals.css)
- **shadcn/ui** with "new-york" style and neutral base color

### Path Aliases

TypeScript path aliases configured in [tsconfig.json](tsconfig.json):
- `@/*` maps to project root
- `@/components`, `@/lib`, `@/hooks` for organized imports

## Key Implementation Patterns

### Authentication Flow

1. **Sign up**: Client form → `supabase.auth.signUp()` → email confirmation → `/protected`
2. **Login**: Client form → `supabase.auth.signInWithPassword()` → `/protected`
3. **Email confirmation**: Email link → `/auth/confirm` route → OTP verification → redirect
4. **Session persistence**: Managed automatically by proxy middleware via cookies

### Supabase Client Usage

- Use `@/lib/supabase/client` in Client Components (forms, client-side interactions)
- Use `@/lib/supabase/server` in Server Components, Route Handlers, Server Actions
- Always create fresh clients for each request (no global variables)

### Adding shadcn/ui Components

The project uses shadcn/ui with pre-configured settings:
```bash
npx shadcn@latest add [component-name]
```

Components are added to `components/ui/` and configured to use the existing theme.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Database/Auth**: Supabase (with @supabase/ssr)
- **Styling**: Tailwind CSS 3.4 + tailwindcss-animate
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

## Important Notes

- The middleware pattern uses [proxy.ts](proxy.ts) which exports a `proxy` function and config matcher
- Authentication state is managed via HTTP-only cookies for security
- All authentication-related pages are under `/auth` route group
- Protected content is under `/protected` route with automatic auth checks
