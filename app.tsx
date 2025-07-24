import { NuxtPage, NuxtRouteAnnouncer, UApp } from '#components';
import { ContainerRegister } from './sections/client';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <UApp>
        <ContainerRegister />
        <NuxtRouteAnnouncer />
        <NuxtPage />
      </UApp>
    );
  },
});
