import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/sakkedzo/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-512x512.png',
      ],
      manifest: {
        name: 'SakkEdző',
        short_name: 'SakkEdző',
        description: 'Taktikai sakkedzés 1000–1500 Elo játékosoknak',
        lang: 'hu',
        dir: 'ltr',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#0f1419',
        background_color: '#0f1419',
        start_url: '/sakkedzo/',
        scope: '/sakkedzo/',
        categories: ['games', 'education'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Bump cacheId so clients invalidate old precache after in-place correction fix
        cacheId: 'sakkedzo-v20260911-helyben-v4',
        // Version marker for PWA cache bust (in-place wrong-move correction)
        additionalManifestEntries: [
          { url: 'sakkedzo-build-id.txt', revision: '20260911-helyben-v4' },
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-v20260911-helyben-v4',
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
})
