import type { Observable } from 'rxjs';

export function useRxRef<T>(
  stream$: Observable<T>,
  comparator?: (a: T | undefined, b: T | undefined) => boolean,
): Ref<T | undefined>;

export function useRxRef<T>(stream$: Observable<T>, defaultValue: T, comparator?: (a: T, b: T) => boolean): Ref<T>;

export function useRxRef<T>(
  stream$: Observable<T>,
  defaultValue?: T,
  comparator: (a: T | undefined, b: T | undefined) => boolean = (a, b) => a === b,
) {
  const valueRef = ref<T | undefined>(defaultValue ?? undefined);

  const subscription = stream$.subscribe((value) => {
    if (!comparator(valueRef.value, value)) {
      valueRef.value = value;
    }
  });

  onUnmounted(() => {
    subscription.unsubscribe();
  });

  return valueRef;
}
