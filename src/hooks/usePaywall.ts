import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { RevenueCatUI, PAYWALL_RESULT, type PresentPaywallOptions } from '@revenuecat/purchases-capacitor-ui';
import { SUBSCRIPTION_PRODUCT_ID } from './useInAppPurchase';

export const usePaywall = (onPurchased?: (productId: string) => void) => {
  const [isPresenting, setIsPresenting] = useState(false);

  const presentPaywall = async (options?: PresentPaywallOptions): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('RevenueCat paywall not available in web mode');
      return false;
    }

    setIsPresenting(true);
    try {
      const { result } = await RevenueCatUI.presentPaywall(options);
      if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        onPurchased?.(SUBSCRIPTION_PRODUCT_ID);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to present paywall:', error);
      return false;
    } finally {
      setIsPresenting(false);
    }
  };

  return { presentPaywall, isPresenting };
};
