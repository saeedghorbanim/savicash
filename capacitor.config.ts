import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.savicash.app',
  appName: 'savicash',
  webDir: 'dist',
  ios: {
    // Never auto-adjust content insets so CSS env(safe-area-inset-*) values work correctly
    contentInsetAdjustmentBehavior: 'never',
  },
};

export default config;
