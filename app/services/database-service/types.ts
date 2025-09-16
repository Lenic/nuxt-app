import type { drizzle } from 'drizzle-orm/neon-serverless';

import { createIdentifier } from '~/composables/container';

export interface IPostgreSQLConnectionService {
  instance: ReturnType<typeof drizzle>;
}
export const IPostgreSQLConnectionService = createIdentifier<IPostgreSQLConnectionService>(
  Symbol('IPostgreSQLConnectionService'),
);
