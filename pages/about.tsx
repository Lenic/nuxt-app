import { ClientOnly, UButton } from '#components';
import { map } from 'rxjs';

export default defineComponent({
  name: 'AboutPage',
  async setup() {
    const { data, error, loading, refetch } = useRxFetch(
      () => http$<{ hello: string }>('/api/hello').pipe(map((res) => res.hello)),
      'Hello (not initialized)',
    );

    const handleRefetch = () => {
      data.value = 'Hello (refetching)';
      refetch();
    };

    const { mutation, pending } = useRxEvent(
      () =>
        http$<{ hello: string }>({ url: '/api/hello', method: 'POST', body: { hello: data.value } }).pipe(
          map((res) => {
            data.value = res.hello;
          }),
        ),
      'Updated',
    );

    return () => (
      <div class="p-4 w-[50vw] mx-auto flex flex-col gap-4">
        <h1 class="text-2xl box-border">About page</h1>
        <UButton color="primary" onClick={handleRefetch}>
          Refetch
        </UButton>
        <ClientOnly>
          <div class="flex flex-row gap-2 items-center">
            {error.value ? <p>Error: {error.value.message}</p> : <p>NoError</p>}
            {loading.value ? <p>Loading...</p> : <p>Loaded</p>}
            {pending.value ? <p>Updating...</p> : <p>Updated</p>}
          </div>
        </ClientOnly>
        <input type="text" v-model={data.value} />
        <UButton color="primary" onClick={mutation}>
          Update
        </UButton>
      </div>
    );
  },
});
