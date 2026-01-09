import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.savicash.app',
  appName: 'savicash',
  webDir: 'dist',
  server: {
    url: 'https://472a9dd8-7da3-4013-8c38-c3a88cbefba1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
