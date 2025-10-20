# Modern React TypeScript Boilerplate

A comprehensive, production-ready React TypeScript boilerplate with Capacitor for cross-platform development. Built with modern tools and best practices for web and mobile applications.

![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.1.0-green.svg)
![Capacitor](https://img.shields.io/badge/Capacitor-7.1.0-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue.svg)

## Features

### Core Features
- **Vite** - Lightning fast development server and build tool
- **TypeScript** - Type-safe development with latest features
- **React 19** - Latest React with concurrent features
- **Capacitor** - Cross-platform mobile development
- **HeroUI** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework

### Authentication & Security
- JWT Authentication with auto-refresh
- Secure token management with encryption
- Biometric authentication support
- Protected routes and role-based access
- Secure cookie handling (web + mobile)

### Mobile Features
- Camera integration with capture
- Push notifications
- Geolocation services
- Native biometric authentication
- Local storage with Capacitor Preferences
- Network status detection

### UI/UX Features
- Dark/Light mode with system preference detection
- Fully responsive design
- Modern animations with Framer Motion
- Audio feedback with Howler.js
- Reusable component library
- Accessible UI components

### Developer Experience
- Hot module replacement
- ESLint + TypeScript ESLint
- Modern bundling with Vite
- Auto-import optimization
- Type checking and IntelliSense
- Ready for testing setup

### Data Management
- SWR for data fetching and caching
- Redux Toolkit for state management
- React Hook Form for form handling
- CSV/Excel file processing
- QR code scanning and generation

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript 5.7, Vite 6.1 |
| **Styling** | Tailwind CSS, HeroUI, Framer Motion |
| **Mobile** | Capacitor 7.1, Cordova Plugins |
| **State** | Redux Toolkit, SWR |
| **Forms** | React Hook Form |
| **Auth** | JWT, Biometric Auth |
| **Utils** | Crypto-js, Howler.js, PapaParse |

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd BOILERPLATE-v1
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

### Web Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Mobile Development

#### Android
```bash
# Add Android platform
npx cap add android

# Sync with native project
npx cap sync android

# Open in Android Studio
npx cap open android

# Build and run on device
npx cap run android
```

#### iOS
```bash
# Add iOS platform (macOS only)
npx cap add ios

# Sync with native project
npx cap sync ios

# Open in Xcode
npx cap open ios
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Navbar, Sidebar, etc.)
│   ├── layout/         # Layout components
│   └── forms/          # Form components
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   ├── useTheme.tsx    # Theme management
│   ├── useCrud.tsx     # API operations
│   └── ...
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard pages
│   └── ...
├── globals/            # Global configurations
│   ├── apiConfig.ts    # API configuration
│   ├── environment.ts  # Environment settings
│   └── sharedKey.ts    # Encryption keys
├── assets/             # Static assets
│   ├── images/         # Images
│   ├── icons/          # Icons
│   └── sounds/         # Audio files
└── types/              # TypeScript type definitions
```


### Capacitor Configuration
Update `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: process.env.VITE_APP_ID || 'com.example.app',
  appName: process.env.VITE_APP_NAME || 'My App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
```

## Customization

### Theme Configuration
The app supports both light and dark themes. Customize in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#0066ff",
        secondary: "#fcc036",
        success: "#27AE60",
        // Add your brand colors
      },
    },
  },
};
```

## Authentication Flow

The boilerplate includes a complete authentication system:

1. **Login with JWT tokens**
2. **Automatic token refresh**
3. **Biometric authentication**
4. **Protected routes**
5. **Role-based access control**


## Testing

```bash
# Run tests (when test setup is added)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Building & Deployment

### Web Deployment
```bash
# Build for production
npm run build

# The dist/ folder contains the built app
# Deploy dist/ to your web server
```

### Mobile App Deployment
```bash
# Android
npm run build
npx cap sync android
npx cap open android
# Build APK/AAB in Android Studio

# iOS
npm run build
npx cap sync ios
npx cap open ios
# Build IPA in Xcode
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- React Team for the amazing framework
- Capacitor Team for cross-platform capabilities  
- Tailwind CSS for the utility-first approach
- HeroUI for the beautiful components
- All contributors and the open-source community

---

Made with love by Zenpou21.
