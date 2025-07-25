import type { H3Event } from 'h3';
import { defineEventHandler } from 'h3';
import { isErrorResponse, isSuccessResponse } from './typeGuards';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import type { Observable } from 'rxjs';

export function defineApi<T>(handler: (event: H3Event) => Promise<T | TResponse<T>> | Observable<T | TResponse<T>>) {
  function handleResponse(response: T | TResponse<T>) {
    if (isSuccessResponse(response)) return response;
    if (isErrorResponse(response)) return response;

    return { code: 0, data: response };
  }

  function handleError(err: unknown) {
    if (isErrorResponse(err)) return err;
    if (err instanceof Error) return { code: 500, msg: err.message };
    return { code: 500, msg: 'Internal server error' };
  }

  return defineEventHandler(async (event) => {
    const response = handler(event);
    if (response instanceof Promise) {
      try {
        const promiseHandler = handler as (event: H3Event) => Promise<T | TResponse<T>>;
        const data = await promiseHandler(event);
        return handleResponse(data);
      } catch (err: unknown) {
        return handleError(err);
      }
    } else {
      return await firstValueFrom(
        response.pipe(
          map(handleResponse),
          catchError((err) => of(handleError(err))),
        ),
      );
    }
  });
}
