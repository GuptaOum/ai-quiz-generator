import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                     // allow external access
    allowedHosts: [
      'unenslaved-supersensually-rufina.ngrok-free.dev',
      'tile-herein-loads-intellectual.trycloudflare.com',
      'harbour-agencies-annual-allied.trycloudflare.com'
    ]
  }
})
