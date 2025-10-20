import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.tsx_boilerplate',
  appName: 'tsx_boilerplate',
  webDir: 'dist',
  server: {
    cleartext: true,
    allowNavigation: ["flowcsolutions.com"],
  }
};

export default config;
