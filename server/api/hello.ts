import { delay, from, map, of, timer } from 'rxjs';
import { z } from 'zod';
import { defineApi } from '~/utils/defineApi';

const helloSchema = z.object({
  hello: z.string(),
});

export default defineApi((event) => {
  if (event.method === 'GET') {
    return timer(Math.floor(Math.random() * 1000) + 1000).pipe(
      map(() => ({ hello: `world - ${new Date().toISOString()}` })),
    );
  } else if (event.method === 'POST') {
    return from(readBody(event)).pipe(
      delay(Math.floor(Math.random() * 1000) + 1000),
      map((body) => helloSchema.safeParse(body)),
      map((parsed) =>
        parsed.success && Date.now() % 2 === 0
          ? { hello: `responsed by server - ${new Date().toISOString()}` }
          : { code: 400, msg: parsed.error?.message ?? 'Parameters error' },
      ),
    );
  } else {
    return of({ code: 405, msg: 'Method not allowed' });
  }
});
