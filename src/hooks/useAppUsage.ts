import { useState, useEffect } from 'react';

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
  const [usageData, setUsageData] = useState<AppUsageData>({
    usageCount: 0,
    lastUsed: '',
    firstUsed: '',
  });
  const [subscription, setSubscription] = useState<SubscriptionData>({
    isSubscribed: false,
    subscribedAt: null,
    expiresAt: null,
    productId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadUsageData();
    loadSubscriptionData();
    setIsLoading(false);
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

  const loadSubscriptionData = () => {
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSubscription(parsed);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    }
  };

  // Increment usage count (call this when user performs a meaningful action)
  const incrementUsage = () => {
    const now = new Date().toISOString();
    const newData: AppUsageData = {
      usageCount: usageData.usageCount + 1,
      lastUsed: now,
      firstUsed: usageData.firstUsed || now,
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
