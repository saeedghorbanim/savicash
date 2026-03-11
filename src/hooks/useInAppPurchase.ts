import { useState, useEffect, useCallback } from 'react';

// Product ID - You'll set this up in App Store Connect
export const SUBSCRIPTION_PRODUCT_ID = 'savicash_monthly_299';

interface PurchaseState {
  isReady: boolean;
  isLoading: boolean;
  isPurchasing: boolean;
  error: string | null;
  product: any | null;
}

// Type definitions for CdvPurchase
declare global {
  interface Window {
    CdvPurchase?: {
      store: any;
      ProductType: {
        PAID_SUBSCRIPTION: string;
        CONSUMABLE: string;
        NON_CONSUMABLE: string;
      };
      Platform: {
        APPLE_APPSTORE: string;
        GOOGLE_PLAY: string;
      };
      LogLevel: {
        DEBUG: number;
        INFO: number;
        WARNING: number;
        ERROR: number;
      };
    };
  }
}

export const useInAppPurchase = (onPurchaseSuccess?: (productId: string) => void) => {
  const [state, setState] = useState<PurchaseState>({
    isReady: false,
    isLoading: true,
    isPurchasing: false,
    error: null,
    product: null,
  });

  useEffect(() => {
    // Wait for deviceready before initializing (works in both Capacitor and web)
    const init = () => initializeStore();

    if (typeof window !== 'undefined' && (window as any).cordova) {
      document.addEventListener('deviceready', init, false);
      return () => document.removeEventListener('deviceready', init, false);
    } else {
      // In web/browser mode, run immediately
      init();
    }
  }, []);

  const initializeStore = async () => {
    if (!window.CdvPurchase) {
      console.log('CdvPurchase not available - running in web mode');
      setState(prev => ({
        ...prev,
        isLoading: false,
        isReady: false,
        error: 'In-app purchases only available in the iOS app',
      }));
      return;
    }

    try {
      const { store, ProductType, Platform, LogLevel } = window.CdvPurchase;

      store.verbosity = LogLevel.DEBUG;

      // Register the subscription product
      store.register({
        id: SUBSCRIPTION_PRODUCT_ID,
        type: ProductType.PAID_SUBSCRIPTION,
        platform: Platform.APPLE_APPSTORE,
      });

      // Listen for product metadata being loaded from the App Store
      store.when().productUpdated((product: any) => {
        if (product.id === SUBSCRIPTION_PRODUCT_ID) {
          console.log('Product loaded:', product);
          setState(prev => ({
            ...prev,
            isReady: true,
            isLoading: false,
            product,
          }));
        }
      });

      // Handle approved purchases
      store.when()
        .approved((transaction: any) => {
          console.log('Purchase approved:', transaction);
          transaction.verify();
        })
        .verified((receipt: any) => {
          console.log('Purchase verified:', receipt);
          receipt.finish();

          if (onPurchaseSuccess) {
            onPurchaseSuccess(SUBSCRIPTION_PRODUCT_ID);
          }

          setState(prev => ({ ...prev, isPurchasing: false }));
        })
        .finished((transaction: any) => {
          console.log('Purchase finished:', transaction);
        });

      // Handle errors
      store.error((error: any) => {
        console.error('Store error:', error);
        setState(prev => ({
          ...prev,
          error: error.message || 'Purchase failed',
          isPurchasing: false,
        }));
      });

      // Initialize the store — product metadata will load asynchronously
      await store.initialize([Platform.APPLE_APPSTORE]);

      // Try to get the product right after init (may already be cached)
      const product = store.get(SUBSCRIPTION_PRODUCT_ID, Platform.APPLE_APPSTORE);
      if (product) {
        setState(prev => ({
          ...prev,
          isReady: true,
          isLoading: false,
          product,
        }));
      } else {
        // Product metadata is still loading — productUpdated callback will fire
        // Keep isLoading: true until it fires
        console.log('Product not yet available, waiting for productUpdated callback...');
      }
    } catch (error) {
      console.error('Failed to initialize store:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isReady: false,
        error: 'Failed to connect to App Store',
      }));
    }
  };

  // Purchase the subscription
  const purchase = useCallback(async () => {
    if (!window.CdvPurchase) {
      console.log('CdvPurchase not available');
      return false;
    }

    if (!state.isReady) {
      console.log('Store not ready for purchase');
      return false;
    }

    setState(prev => ({ ...prev, isPurchasing: true, error: null }));

    try {
      const { store, Platform } = window.CdvPurchase;
      const product = store.get(SUBSCRIPTION_PRODUCT_ID, Platform.APPLE_APPSTORE);

      if (!product) {
        throw new Error('Product not found');
      }

      const offer = product.getOffer();
      if (offer) {
        await store.order(offer);
      } else {
        throw new Error('No offer available for this product');
      }

      return true;
    } catch (error: any) {
      console.error('Purchase error:', error);
      setState(prev => ({
        ...prev,
        isPurchasing: false,
        error: error.message || 'Purchase failed',
      }));
      return false;
    }
  }, [state.isReady]);

  // Restore previous purchases
  const restore = useCallback(async () => {
    if (!window.CdvPurchase || !state.isReady) {
      console.log('Store not ready for restore');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { store } = window.CdvPurchase;
      await store.restorePurchases();

      setState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error('Restore error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to restore purchases',
      }));
      return false;
    }
  }, [state.isReady]);

  // Get formatted price
  const getFormattedPrice = () => {
    if (state.product?.pricing?.price) {
      return state.product.pricing.price;
    }
    return '$2.99'; // Fallback display price
  };

  return {
    ...state,
    purchase,
    restore,
    getFormattedPrice,
  };
};
