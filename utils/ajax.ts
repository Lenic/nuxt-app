import { ajax } from 'rxjs/ajax';
import type { AjaxConfig } from 'rxjs/ajax';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import type { Observable } from 'rxjs';

export const handleError = (err: Error): Observable<IErrorResult<Error>> => {
  if (err instanceof Error) {
    return of({ handled: false, error: err });
  }
  return of({ handled: true, error: new Error(String(err)) });
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

export function http$<T = unknown>(urlOrOptions: string | HttpOptions): Observable<T> {
  const options = typeof urlOrOptions === 'string' ? { url: urlOrOptions } : urlOrOptions;
  const { auth = true, timeoutMs = 15000, headers = {}, ...rest } = options;

  const headers$ = auth ? getAccessToken().pipe(map((token) => ({ Authorization: `Bearer ${token}` }))) : of({});
  return headers$.pipe(
    map((upriver) => ({ ...headers, ...upriver, 'Content-Type': headers['Content-Type'] || 'application/json' })),
    switchMap((headers) => ajax({ ...rest, headers })),
    timeout(timeoutMs),
    map((res) => res.response as T),
    catchError((err) => handleError(err).pipe(switchMap((res) => throwError(() => res)))),
  );
}
