import { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment';

const config: CapacitorConfig = {
  appId: 'com.transport.app',
  appName: 'transport-app',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: environment.serverClientIdGoogleAuth,
      forceCodeForRefreshToken: false,
    },
  },
};

export default config;
