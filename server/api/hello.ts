import { delay, from, map, of, switchMap, timer } from 'rxjs';
import { z } from 'zod';
import { defineApi, readBody } from '#imports';
import { getHello, setHello } from '../sections/hello';

const helloSchema = z.object({
  hello: z.string(),
});

export default defineApi((event) => {
  if (event.method === 'GET') {
    return timer(Math.floor(Math.random() * 1000) + 1000).pipe(
      switchMap(() => from(getHello())),
      map((hello) => ({ hello })),
    );
  } else if (event.method === 'POST') {
    return from(readBody(event)).pipe(
      delay(Math.floor(Math.random() * 1000) + 1000),
      map((body) => helloSchema.safeParse(body)),
      switchMap((parsed) =>
        parsed.success && Date.now() % 2 === 0
          ? from(setHello(parsed.data.hello)).pipe(map((hello) => ({ hello })))
          : of({ code: 400, msg: parsed.error?.message ?? 'Parameters error' }),
      ),
    );
  } else {
    return of({ code: 405, msg: 'Method not allowed' });
  }
});
