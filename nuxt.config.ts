import tailwindcss from '@tailwindcss/vite';
import { eventHandler } from 'h3';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/eslint'],
  css: ['~/assets/styles/global.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  devServerHandlers: [
    {
      route: '/.well-known/appspecific',
      handler: eventHandler(() => new Response(null, { status: 204 })),
    },
  ],
});
