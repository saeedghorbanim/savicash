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
- `src/components/ui/` — shadcn-ui component library (don't modify these)
- `src/hooks/` — All state management; localStorage reads are synchronous to avoid race conditions
- `src/integrations/supabase/` — Supabase client configuration and generated types

### Freemium / Subscription Model

- `FREE_USAGE_LIMIT = 3` free AI prompts before the paywall triggers
- Tracked via `usageCount` in localStorage, managed by `useAppUsage` and `usePromptLimit` hooks
- RevenueCat (`@revenuecat/purchases-capacitor`) handles IAP; product ID: `com.savicash.subscription.monthly`
- Paywall only activates on native mobile platforms (iOS/Android); subscription state is cleared on web/simulator
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

Budget recalculates from the expense list on each update (rather than storing a running total) to prevent drift.

### Mobile-Specific Considerations

- Safe area insets handled via CSS `env()` variables and Capacitor config (`contentInset: never`)
- Voice recording uses native APIs via `useVoiceRecording`
- The `@` path alias maps to `./src/`
- TypeScript is intentionally lenient (`noImplicitAny: false`, `strictNullChecks: false`)
