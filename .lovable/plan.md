
# Fix Apple App Store Guideline 3.1.2 Compliance

## Problem
Apple rejected the app because the subscription purchase flow doesn't clearly display all required information. Even though the links and info exist, they may not be prominent or explicit enough for Apple's reviewers.

## Apple's Required Information (must be clearly visible in the app)
1. Title of auto-renewing subscription
2. Length of subscription
3. Price of subscription (and price per unit)
4. Functional link to Terms of Use (EULA)
5. Functional link to Privacy Policy

## Changes to Make

### 1. Update Subscription Paywall Information
Make the subscription details more explicit and prominent:

- Change "Pro Monthly" to "SaviCash Pro Monthly" (exact product name)
- Add explicit subscription length text: "1 Month • Auto-Renewable"
- Keep the price prominent with clearer "per month" text
- Make the renewal terms more visible (not just tiny fine print)

### 2. Fix the Terms/Privacy Links
The current links use `<Link to="/terms">` which works via React Router, but Apple may test these in a way where they don't work as expected. We should:

- Use `useNavigate()` with `onClick` handlers instead of `<Link>` component
- Add touch feedback to make links clearly tappable on mobile
- Ensure links have larger touch targets

### 3. Add More Prominent Subscription Terms Section
Create a dedicated subscription terms section that clearly lists:
- Auto-renewal information
- When they will be charged
- How to cancel
- Links to legal documents

---

## Technical Details

### File: `src/components/subscription/SubscriptionPaywall.tsx`

**Changes:**
1. Replace `<Link>` components with buttons using `useNavigate()`
2. Update title from "Pro Monthly" to "SaviCash Pro Monthly"
3. Add explicit "1 Month" subscription length text
4. Create a more prominent subscription terms box before the fine print
5. Make Terms/Privacy links larger and more tappable

The updated structure will look like:
```text
[App Icon]
SaviCash

Unlock Pro
(usage message)

┌─────────────────────────────────┐
│        [Crown Icon]             │
│   SaviCash Pro Monthly          │
│      $2.99/month                │
│       1 Month                   │
│                                 │
│  ✓ Unlimited expense tracking   │
│  ✓ AI-powered insights          │
│  ✓ Budget alerts                │
│  ✓ Full history & stats         │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Subscription auto-renews │    │
│  │ monthly at $2.99/month.  │    │
│  │ Cancel anytime in App    │    │
│  │ Store settings.          │    │
│  └─────────────────────────┘    │
│                                 │
│   [ Subscribe Now Button ]      │
│                                 │
│   Restore Purchase link         │
│                                 │
│   [Terms of Use]  [Privacy]     │
│     (tappable buttons)          │
└─────────────────────────────────┘
```

This layout makes all Apple-required information immediately visible and ensures the links are clearly tappable buttons.
