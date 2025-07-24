import { NuxtPage, NuxtRouteAnnouncer, UApp } from '#components';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <UApp>
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </UApp>
    );
  },
});
