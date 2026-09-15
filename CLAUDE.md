# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint
npm run preview      # Preview production build
```

There is no test suite configured for this project.

To sync to native platforms after a web build:
```bash
npx cap sync         # Sync web assets to iOS/Android
npx cap open ios     # Open in Xcode
npx cap open android # Open in Android Studio
```

## Architecture

**SaviCash** is a mobile-first AI expense tracker built with React + TypeScript + Vite, wrapped with Capacitor for iOS/Android deployment.

### Data Flow

All user data (expenses, budget, usage count, subscription status) lives in **browser localStorage** — there is no server-side persistence. Supabase is used only for Edge Functions:
- `/chat` — AI expense parsing via natural language
- `/analyze-receipt` — OCR receipt image analysis

### Key Directories

- `src/components/views/` — The four main tab views: Chat, Stats, Recurring, History
- `src/components/onboarding/` — First-run onboarding screens (shell, question/insight step renderers, chart insights)
- `src/components/ui/` — shadcn-ui component library (don't modify these)
- `src/hooks/` — All state management; localStorage reads are synchronous to avoid race conditions
- `src/integrations/supabase/` — Supabase client configuration and generated types

### Onboarding Flow

- Gated in `src/App.tsx` on `useOnboarding().hasCompletedOnboarding` (localStorage key `savicash_onboarding`): the root route renders `Onboarding` instead of `Index` until it's marked complete
- `src/pages/Onboarding.tsx` drives one flat, data-driven array of 17 steps: 3 welcome slides → a branded "Get Started" / "Already got an account? Log in" screen → 10 personalization questions → 3 chart/insight payoff slides
- "Log in" is **not** a real auth system — this app has none. It calls the existing RevenueCat restore-purchases flow (`useInAppPurchase`); on a found entitlement it marks onboarding complete and skips straight to `Index`
- Answers (`OnboardingAnswers`) are persisted incrementally to localStorage as each question is answered, and are only used to personalize the 3 insight pages (spending breakdown chart, savings projection chart) — never wired into `useLocalStorage`'s real `Expense`/`BudgetLimit` records
- `framer-motion` was added for onboarding page transitions and staggered reveals — it's the first animation library in the codebase; existing Tailwind keyframes (`fade-in`, `slide-in`, `float`, `pulse-glow`) are still used for decorative/infinite-loop effects
- The 3 insight pages are the first real usage of `recharts` / `src/components/ui/chart.tsx` in the app (previously installed but unused)

### Freemium / Subscription Model

- `FREE_USAGE_LIMIT = 3` free AI prompts before the paywall triggers
- Tracked via `usageCount` in localStorage, managed by `useAppUsage` and `usePromptLimit` hooks
- RevenueCat (`@revenuecat/purchases-capacitor`) handles IAP; product ID: `com.savicash.subscription.monthly`
- Paywall only activates on native mobile platforms (iOS/Android); subscription state is cleared on web/simulator
- **The paywall is action-triggered only** — `Index.tsx` never auto-shows it on mount/app launch. It's shown only when a gated action is attempted past the free limit: `ChatView.handleSend` (sending a prompt) and `Index.handleAddExpense` (adding an expense) both read usage/subscription directly from localStorage at the moment of the action. This means a fresh cold launch (full force-quit + relaunch) always lands on the main Chat tab; the paywall reappears the instant the user tries to exceed the limit again
- **Important race condition fix:** Usage count must be checked, then incremented, then the AI call made — all in sequence to ensure exactly 3 free prompts are allowed

#### RevenueCat Configuration

- The iOS API key is read from `VITE_REVENUECAT_IOS_KEY` in `.env` — no hardcoded fallback
- Use the `appl_` production key for App Store builds; never commit `test_` keys
- `src/App.tsx` initializes RevenueCat on native platforms only via `Capacitor.isNativePlatform()`

### State Management Pattern

The app uses localStorage-backed custom hooks rather than a global store:
- `useLocalStorage` — Expenses and budget with month-aware auto-reset
- `useAppUsage` — Subscription status and usage count
- `usePromptLimit` — Free prompt enforcement
- `useOnboarding` — First-run onboarding completion flag and collected answers

Budget recalculates from the expense list on each update (rather than storing a running total) to prevent drift.

### Mobile-Specific Considerations

- Safe area insets handled via CSS `env()` variables and Capacitor config (`contentInset: never`)
- Voice recording uses native APIs via `useVoiceRecording`
- The `@` path alias maps to `./src/`
- TypeScript is intentionally lenient (`noImplicitAny: false`, `strictNullChecks: false`)
