import { catchError, finalize, of, Subject, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';

export function useRxEvent<T = Event, R = unknown>(
  fn: (event: T) => Observable<R>,
  tipFn?: string | ((args: R | string) => string),
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
            let title = 'Success';
            if (typeof tipFn === 'string') {
              title = tipFn;
            } else if (typeof tipFn === 'function') {
              title = tipFn(value ?? title);
            } else {
              title = value?.toString() ?? title;
            }
            toast.add({ title, color: 'success' });
          }),
          catchError((err) => {
            if (isErrorResult(err)) {
              // do nothing
            } else if (err instanceof Error) {
              toast.add({ title: err.message, color: 'error' });
            } else {
              toast.add({ title: 'Unknown error', color: 'error' });
            }
            return of(null);
          }),
        ),
      ),
    )
    .subscribe();
  onUnmounted(() => subscription.unsubscribe());

  return { mutation: handleMutation, pending };
}
