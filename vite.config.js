import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "pwa-192x192.png",
        "pwa-512x512.png",
        "maskable-icon-512x512.png",
        "og-image.webp"
      ],
      manifest: {
        name: "No Mas Paciente",
        short_name: "NMP",
        description: "Conoce tus derechos de salud publica en Mexico. IMSS, ISSSTE, IMSS-Bienestar.",
        theme_color: "#3D3066",
        background_color: "#FAF6F0",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "es-MX",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,png,webp,svg,ico}"]
      }
    })
  ],
});
