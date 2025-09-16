import type { Adapter } from '@auth/core/adapters';

import { createIdentifier } from '~/composables/container';

export const INextAuthAdapter = createIdentifier<Adapter>(Symbol('INextAuthAdapter'));
