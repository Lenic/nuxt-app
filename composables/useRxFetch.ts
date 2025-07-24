import { BehaviorSubject, catchError, finalize, of, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';

export interface IRxFetchResult {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => void;
}

export function useRxFetch<T>(getter: () => Observable<T>, title: string) {
  const loading = ref(false);
  const handleRefetch = () => subject.next(void 0);
  const subject = new BehaviorSubject<void>(void 0);

  const toast = useToast();
  const subscription = subject
    .pipe(
      tap(() => (loading.value = true)),
      switchMap(() =>
        getter().pipe(
          finalize(() => (loading.value = false)),
          catchError((err) => {
            if (isErrorResult(err)) {
              if (!err.handled) {
                toast.add({ title, description: err.error.message, color: 'error' });
              }
            } else if (err instanceof Error) {
              toast.add({ title, description: err.message, color: 'error' });
            } else {
              toast.add({ title, description: 'Unknown error', color: 'error' });
            }
            return of(null);
          }),
        ),
      ),
    )
    .subscribe();
  onUnmounted(() => subscription.unsubscribe());

  return [loading, handleRefetch] as const;
}
