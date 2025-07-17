import { BehaviorSubject, catchError, finalize, of, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';

export interface IRxFetchResult<T> {
  data: Ref<T>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => void;
}

export function useRxFetch<T>(getter: () => Observable<T>): IRxFetchResult<T>;
export function useRxFetch<T>(getter: () => Observable<T>, defaultValue: T): IRxFetchResult<T | undefined>;

export function useRxFetch<T>(getter: () => Observable<T>, defaultValue?: T) {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref(defaultValue ?? undefined);
  const handleRefetch = () => subject.next(void 0);
  const subject = new BehaviorSubject<void>(void 0);

  const subscription = subject
    .pipe(
      tap(() => (loading.value = true)),
      switchMap(() =>
        getter().pipe(
          finalize(() => (loading.value = false)),
          tap((value) => {
            data.value = value;
          }),
          catchError((err) => {
            if (err instanceof Error) {
              error.value = err;
            } else if (isErrorResult(err)) {
              error.value = err.error;
            } else {
              error.value = new Error(String(err));
            }
            return of(null);
          }),
        ),
      ),
    )
    .subscribe();
  onUnmounted(() => subscription.unsubscribe());

  return { data, error, loading, refetch: handleRefetch };
}
