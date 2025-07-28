import type { Ref } from '#imports';
import { isErrorResult, onMounted, onUnmounted, useState, useToast } from '#imports';
import { BehaviorSubject, catchError, finalize, of, switchMap, tap } from 'rxjs';
import type { Observable, Subscription } from 'rxjs';

export interface IRxFetchResult {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => void;
}

export function useRxFetch<T>(getter: () => Observable<T>, title: string) {
  const loadingRef = useState(() => false);

  const subject = new BehaviorSubject<void>(void 0);
  const handleRefetch = () => subject.next(void 0);

  if (import.meta.client) {
    const toast = useToast();
    let subscription: Subscription | null = null;
    onMounted(() => {
      subscription = subject
        .pipe(
          tap(() => (loadingRef.value = true)),
          switchMap(() =>
            getter().pipe(
              finalize(() => (loadingRef.value = false)),
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
    });
    onUnmounted(() => subscription?.unsubscribe());
  }

  return [loadingRef, handleRefetch] as const;
}
