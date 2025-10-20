import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@aparajita/capacitor-biometric-auth',
      '@capacitor/camera',
      'ol'
    ],
  },
})
