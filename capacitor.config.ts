import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.slcompany.warehouse_management_system',
  appName: 'SL WMS',
  webDir: 'dist',
  server: {
    cleartext: true,
    allowNavigation: ["flowcsolutions.com"],
  }
};

export default config;
