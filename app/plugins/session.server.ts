import { defineNuxtPlugin, useRequestHeaders } from '#imports';
import type { Session } from '@auth/core/types';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin({
  name: 'session-loader',
  enforce: 'pre',
  async setup() {
    const { session, status } = useAuth();

    const headers = useRequestHeaders();
    const data = await $fetch<Session>('/api/auth/session', { headers });

    if (data && Object.keys(data).length > 0) {
      session.value = data;
      status.value = 'authenticated';
    } else {
      session.value = null;
      status.value = 'unauthenticated';
    }
  },
});
