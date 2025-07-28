import { defineNuxtRouteMiddleware } from '#imports';
import { registerClient } from '~/sections';

export default defineNuxtRouteMiddleware(() => {
  registerClient();
});
