import tailwindcss from '@tailwindcss/vite';
import { eventHandler } from 'h3';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-25',
  devtools: { enabled: false },
  sourcemap: true,
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
