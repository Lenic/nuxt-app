import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';

export function useRxFetch<T>(getter: () => Observable<T>): {
  data: Ref<T | undefined>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  refetch: () => void;
};

export function useRxFetch<T>(
  getter: () => Observable<T>,
  defaultValue: T,
): {
  data: Ref<T>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  refetch: () => void;
};

export function useRxFetch<T>(getter: () => Observable<T>, defaultValue?: T) {
  const data = ref(defaultValue ?? undefined);
  const error = ref<Error | null>(null);
  const loading = ref(false);
  const subject = new BehaviorSubject<void>(void 0);

  const subscription = subject
    .pipe(
      tap(() => {
        loading.value = true;
      }),
      switchMap(() => getter().pipe(finalize(() => (loading.value = false)))),
    )
    .subscribe({
      next: (value) => {
        data.value = value;
      },
      error: (err) => {
        error.value = err;
      },
      complete: () => {
        loading.value = false;
      },
    });

  onUnmounted(() => {
    subscription.unsubscribe();
  });

  const refetch = () => {
    subject.next(void 0);
  };

  return { data, error, loading, refetch };
}
