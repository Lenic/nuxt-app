import { defineComponent } from 'vue';
import { ContainerRegister } from '@/sections/client';
import { NuxtPage, NuxtRouteAnnouncer, UApp } from '#components';

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
