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

    return () => (
      <div class="p-4 w-[50vw] mx-auto">
        <h1 class="text-2xl box-border">About page</h1>
        <button onClick={handleRefetch}>Refetch</button>
        {error.value && <p>Error: {error.value.message}</p>}
        {loading.value ? <p>Loading...</p> : <p>Loaded</p>}
        <pre>{JSON.stringify(data.value, null, 2)}</pre>
      </div>
    );
  },
});
