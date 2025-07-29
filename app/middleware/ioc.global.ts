import { defineNuxtRouteMiddleware } from '#imports';
import { registerServices } from '~/sections';

export default defineNuxtRouteMiddleware(() => {
  registerServices();
});
