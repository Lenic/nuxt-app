import { register } from '~/composables/container';
import { IPostgreSQLConnectionService, PostgreSQLConnectionService } from './database-service';
import { DrizzleAdapter, INextAuthAdapter } from './drizzle-adapter';

export function registerServices() {
  register(IPostgreSQLConnectionService, PostgreSQLConnectionService);
  register(INextAuthAdapter, DrizzleAdapter, [IPostgreSQLConnectionService]);
}
