import { defineNuxtRouteMiddleware } from '#imports';
import { registerClient } from '@/sections/client';

export default defineNuxtRouteMiddleware(() => {
  registerClient();
});
