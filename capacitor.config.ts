import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.focusbubble.app',
  appName: 'FocusBubble',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    // Handle deep links for auth callbacks
    App: {
      launchUrl: 'com.focusbubble.app'
    }
  }
};

export default config;
