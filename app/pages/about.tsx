import { ServiceLocator } from '@/composables/container';
import { IHelloService } from '~/sections/hello';
import { ClientOnly, UButton } from '#components';
import { defineComponent, useRxRef, useRxEvent, useAsyncData, http$, watch, http } from '#imports';
import { map, tap } from 'rxjs';
import { getHello } from '~~/server/sections/hello';

export default defineComponent({
  name: 'AboutPage',
  async setup() {
    const service = ServiceLocator.default.get(IHelloService);
    const { data, error, refresh, status } = await useAsyncData(() => {
      if (import.meta.server) {
        return getHello();
      }
      return http<{ hello: string }, string>({ url: '/api/hello', method: 'GET' }, (stream$) =>
        stream$.pipe(map((res) => res.hello)),
      );
    });

    watch(data, (value) => service.set(value ?? ''), { immediate: true });

    if (error.value) return () => <div>Error: {error.value?.message}</div>;

    const helloRef = useRxRef(service.$hello, service.hello);
    const [mutation, pendingRef] = useRxEvent(
      () =>
        http$<{ hello: string }>({ url: '/api/hello', method: 'POST', body: { hello: helloRef.value } }).pipe(
          tap((res) => service.set(res.hello)),
        ),
      'Update Data',
      'Updated',
    );

    const handleRefetch = () => {
      service.set('Hello (refetching)');
      refresh();
    };

    return () => (
      <div class="p-4 w-[50vw] mx-auto flex flex-col gap-4">
        <h1 class="text-2xl box-border">About page</h1>
        <UButton loading={status.value === 'pending'} color="primary" onClick={handleRefetch}>
          Refetch
        </UButton>
        <ClientOnly>
          <div class="flex flex-row gap-2 items-center">
            {status.value === 'pending' ? <p>Loading...</p> : <p>Loaded</p>}
            {pendingRef.value ? <p>Updating...</p> : <p>Updated</p>}
          </div>
        </ClientOnly>
        <input type="text" v-model={helloRef.value} />
        <UButton loading={pendingRef.value} color="primary" onClick={mutation}>
          Update
        </UButton>
      </div>
    );
  },
});
