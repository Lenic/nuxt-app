export type TTail<TPrefix extends unknown[], T extends TPrefix> = T extends [...TPrefix, ...infer Rest] ? Rest : never;

export function useSingleCache<TItem, TRest extends unknown[]>(callback: (item: TItem, ...args: TRest) => void) {
  const cache = new Map<TItem, (...args: TRest) => void>();

  return (item: TItem) => {
    const handler = cache.get(item);
    if (!handler) {
      const newHandler = (...args: TRest) => callback(item, ...args);
      cache.set(item, newHandler);
      return newHandler;
    }
    return handler;
  };
}

export function useMultipleCache<TPrefix extends unknown[], TRest extends unknown[]>(
  callback: (...args: [...TPrefix, ...TRest]) => void,
) {
  const cache = new Map<string, (...args: TRest) => void>();

  return (key: string, ...args: TPrefix) => {
    const handler = cache.get(key);
    if (!handler) {
      const newHandler = (...restArgs: TRest) => callback(...args, ...restArgs);
      cache.set(key, newHandler);
      return newHandler;
    }
    return handler;
  };
}
