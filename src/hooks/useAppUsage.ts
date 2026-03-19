import { useState, useEffect } from 'react';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

const USAGE_KEY = 'savicash_app_usage';
const SUBSCRIPTION_KEY = 'savicash_subscription';

interface AppUsageData {
  usageCount: number;
  lastUsed: string;
  firstUsed: string;
}

interface SubscriptionData {
  isSubscribed: boolean;
  subscribedAt: string | null;
  expiresAt: string | null;
  productId: string | null;
}

export const FREE_USAGE_LIMIT = 3;

export const useAppUsage = () => {
  // Initialize state from localStorage immediately to avoid stale state on tab switches
  const [usageData, setUsageData] = useState<AppUsageData>(() => {
    try {
      const stored = localStorage.getItem(USAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          usageCount: typeof parsed.usageCount === 'number' ? parsed.usageCount : 0,
          lastUsed: parsed.lastUsed || '',
          firstUsed: parsed.firstUsed || '',
        };
      }
    } catch {
      // Fall back to default
    }
    return { usageCount: 0, lastUsed: '', firstUsed: '' };
  });
  
  const [subscription, setSubscription] = useState<SubscriptionData>(() => {
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fall back to default
    }
    return { isSubscribed: false, subscribedAt: null, expiresAt: null, productId: null };
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Re-sync from localStorage on mount (handles potential stale state)
  useEffect(() => {
    loadUsageData();

    // Load and validate subscription data against RevenueCat as source of truth.
    // On web/simulator: always clear stored subscription (no IAP available).
    // On native: verify entitlement with RevenueCat; clear if no longer active.
    const validateSubscription = async () => {
      try {
        const stored = localStorage.getItem(SUBSCRIPTION_KEY);
        const parsed = stored ? JSON.parse(stored) : null;

        if (!Capacitor.isNativePlatform()) {
          // Web or simulator — no real IAP, clear any stored subscription
          const cleared = { isSubscribed: false, subscribedAt: null, expiresAt: null, productId: null };
          localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(cleared));
          setSubscription(cleared);
        } else if (parsed?.isSubscribed === true) {
          // Native platform — verify entitlement is still active with RevenueCat
          try {
            const { customerInfo } = await Purchases.getCustomerInfo();
            if (customerInfo.entitlements.active['premium']) {
              setSubscription(parsed);
            } else {
              const cleared = { isSubscribed: false, subscribedAt: null, expiresAt: null, productId: null };
              localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(cleared));
              setSubscription(cleared);
            }
          } catch (rcError) {
            console.error('Failed to verify subscription with RevenueCat:', rcError);
            // On RC error, trust local storage to avoid wrongly blocking a subscriber
            setSubscription(parsed);
          }
        } else if (parsed) {
          setSubscription(parsed);
        }
      } catch (error) {
        console.error('Failed to load subscription data:', error);
      }

      setIsLoading(false);
    };

    validateSubscription();
  }, []);

  const loadUsageData = () => {
    try {
      const stored = localStorage.getItem(USAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUsageData(parsed);
      }
    } catch (error) {
      console.error('Failed to load usage data:', error);
    }
  };


  // Increment usage count (call this when user performs a meaningful action)
  const incrementUsage = () => {
    const now = new Date().toISOString();

    // IMPORTANT: read current value from storage to avoid stale-closure issues
    // (can happen on some devices when callbacks fire with older state).
    let current: AppUsageData | null = null;
    try {
      const stored = localStorage.getItem(USAGE_KEY);
      if (stored) current = JSON.parse(stored);
    } catch {
      current = null;
    }

    const currentUsageCount = typeof current?.usageCount === 'number' ? current.usageCount : usageData.usageCount;
    const firstUsed = typeof current?.firstUsed === 'string' && current.firstUsed ? current.firstUsed : (usageData.firstUsed || now);

    const newData: AppUsageData = {
      usageCount: currentUsageCount + 1,
      lastUsed: now,
      firstUsed,
    };
    
    localStorage.setItem(USAGE_KEY, JSON.stringify(newData));
    setUsageData(newData);
    
    return newData.usageCount;
  };

  // Check if user has exceeded free usage
  const hasExceededFreeUsage = () => {
    return usageData.usageCount >= FREE_USAGE_LIMIT && !subscription.isSubscribed;
  };

  // Get remaining free uses
  const getRemainingFreeUses = () => {
    return Math.max(0, FREE_USAGE_LIMIT - usageData.usageCount);
  };

  // Set subscription status (called after successful purchase)
  const setSubscriptionActive = (productId: string, expiresAt?: string) => {
    const now = new Date().toISOString();
    const newSubscription: SubscriptionData = {
      isSubscribed: true,
      subscribedAt: now,
      expiresAt: expiresAt || null,
      productId,
    };
    
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSubscription));
    setSubscription(newSubscription);
  };

  // Clear subscription (for testing or when subscription expires)
  const clearSubscription = () => {
    const newSubscription: SubscriptionData = {
      isSubscribed: false,
      subscribedAt: null,
      expiresAt: null,
      productId: null,
    };
    
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSubscription));
    setSubscription(newSubscription);
  };

  // Reset usage (for testing)
  const resetUsage = () => {
    localStorage.removeItem(USAGE_KEY);
    setUsageData({
      usageCount: 0,
      lastUsed: '',
      firstUsed: '',
    });
  };

  return {
    usageData,
    subscription,
    isLoading,
    incrementUsage,
    hasExceededFreeUsage,
    getRemainingFreeUses,
    setSubscriptionActive,
    clearSubscription,
    resetUsage,
  };
};
