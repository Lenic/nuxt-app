import { ServiceLocator } from '@/composables/container';
import { IHelloService } from '@/sections/client/hello';
import { ClientOnly, UButton } from '#components';
import { defineComponent, useRxRef, useRxFetch, useRxEvent } from '#imports';

export default defineComponent({
  name: 'AboutPage',
  setup() {
    const service = ServiceLocator.default.get(IHelloService);

    const helloRef = useRxRef(service.$hello, service.hello);
    const [loadingRef, refetch] = useRxFetch(() => service.load(), 'Load Data');
    const [mutation, pendingRef] = useRxEvent(() => service.update(helloRef.value), 'Update Data', 'Updated');

    const handleRefetch = () => {
      service.set('Hello (refetching)');
      refetch();
    };

    return () => (
      <div class="p-4 w-[50vw] mx-auto flex flex-col gap-4">
        <h1 class="text-2xl box-border">About page</h1>
        <UButton color="primary" onClick={handleRefetch}>
          Refetch
        </UButton>
        <ClientOnly>
          <div class="flex flex-row gap-2 items-center">
            {loadingRef.value ? <p>Loading...</p> : <p>Loaded</p>}
            {pendingRef.value ? <p>Updating...</p> : <p>Updated</p>}
          </div>
        </ClientOnly>
        <input type="text" v-model={helloRef.value} />
        <UButton color="primary" onClick={mutation}>
          Update
        </UButton>
      </div>
    );
  },
});
