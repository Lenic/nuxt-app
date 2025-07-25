import { isErrorResult, onUnmounted, ref, useToast } from '#imports';
import { catchError, finalize, of, Subject, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';

export function useRxEvent<T = Event, R = unknown>(
  fn: (event: T) => Observable<R>,
  title: string,
  tipOrFn?: string | ((args: R) => string),
) {
  const pending = ref(false);
  const subject = new Subject<T>();
  const handleMutation = (args: T) => subject.next(args);

  const toast = useToast();
  const subscription = subject
    .pipe(
      tap(() => (pending.value = true)),
      switchMap((event) =>
        fn(event).pipe(
          finalize(() => (pending.value = false)),
          tap((value) => {
            let description: string | undefined = undefined;
            if (typeof tipOrFn === 'string') {
              description = tipOrFn;
            } else if (typeof tipOrFn === 'function') {
              description = tipOrFn(value);
            }
            toast.add({ title, description, color: 'success' });
          }),
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

  return [handleMutation, pending] as const;
}
