import { ajax } from 'rxjs/ajax';
import type { AjaxConfig } from 'rxjs/ajax';
import {
  catchError,
  map,
  shareReplay,
  switchMap,
  take,
  timeout,
  firstValueFrom,
  of,
  throwError,
  Observable,
  TimeoutError,
} from 'rxjs';
import { useToast, effectScope, isSuccessResponse } from '#imports';

export const toast$ = new Observable<ReturnType<typeof useToast>>((observer) => {
  const scope = effectScope(true);

  scope.run(() => {
    const toast = useToast();
    observer.next(toast);
  });

  return () => scope.stop();
}).pipe(shareReplay(1));

export const handleError = (err: Error): Observable<IErrorResult<Error>> => {
  if (err instanceof TimeoutError) {
    toast$.pipe(take(1)).subscribe((toast) => {
      toast.add({ title: 'Request time exceeded expectations', color: 'error' });
    });
    return of({ handled: true, error: err });
  } else if (err instanceof HttpError) {
    toast$.pipe(take(1)).subscribe((toast) => {
      toast.add({ title: err.response.msg ?? 'Unknown error', color: 'error' });
    });
    return of({ handled: true, error: err });
  } else if (err instanceof Error) {
    return of({ handled: false, error: err });
  } else {
    return of({ handled: false, error: new Error(String(err)) });
  }
};

function getAccessToken() {
  return of('AccessToken');
}

export interface HttpOptions extends AjaxConfig {
  /**
   * 是否需要认证
   *
   * - 默认**需要认证**
   * - 如果需要认证，则会在请求头中添加 Authorization 字段，值为 Bearer ${getAccessToken()}
   * - 如果不需要认证，则不会添加 Authorization 字段
   */
  auth?: boolean;
  /**
   * 请求超时时间，单位：毫秒
   *
   * - 默认 15000 毫秒，如果设置为 0，则不设置超时时间
   */
  timeoutMs?: number;
}

export function http<T>(urlOrOptions: string | HttpOptions): Promise<T>;
export function http<T, R>(
  urlOrOptions: string | HttpOptions,
  chain: (stream: Observable<T>) => Observable<R>,
): Promise<R>;

export function http<T, R>(
  urlOrOptions: string | HttpOptions,
  chain?: (stream: Observable<T>) => Observable<R>,
): Promise<R> {
  const stream$ = http$<T>(urlOrOptions);
  return firstValueFrom(chain ? chain(stream$) : (stream$ as unknown as Observable<R>));
}

export function http$<T>(urlOrOptions: string | HttpOptions): Observable<T> {
  const options = typeof urlOrOptions === 'string' ? { url: urlOrOptions } : urlOrOptions;
  const { auth = true, timeoutMs = 15000, headers = {}, ...rest } = options;

  const headers$ = auth ? getAccessToken().pipe(map((token) => ({ Authorization: `Bearer ${token}` }))) : of({});
  return headers$.pipe(
    map((stream) => ({ ...headers, ...stream, 'Content-Type': headers['Content-Type'] || 'application/json' })),
    switchMap((headers) => ajax({ ...rest, headers })),
    timeout(timeoutMs),
    map((res) => {
      const response = res.response as TResponse<T>;
      if (isSuccessResponse(response)) {
        return response.data;
      } else {
        throw new HttpError(response);
      }
    }),
    catchError((err) => handleError(err).pipe(switchMap((res) => throwError(() => res)))),
  );
}

export class HttpError extends Error {
  constructor(public readonly response: IErrorResponse) {
    super(response.msg);
    this.name = 'HttpError';
  }
}
