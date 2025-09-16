import { Auth } from '@auth/core';
import GitHub from '@auth/core/providers/github';
import type { AuthConfig } from '@auth/core/types';
import { toWebRequest } from 'h3';

import { INextAuthAdapter } from '~/services/drizzle-adapter';
import { registerServices } from '~/services/register';
import { ServiceLocator } from '~/composables/container';

registerServices();

export const authOptions: AuthConfig = {
  basePath: '/api/auth',
  trustHost: true,
  secret: process.env.NUXT_AUTH_SECRET,
  adapter: ServiceLocator.default.get(INextAuthAdapter),
  providers: [
    GitHub({
      clientId: process.env.NUXT_AUTH_GITHUB_ID,
      clientSecret: process.env.NUXT_AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    // error: '/auth/error',
    // signOut: '/auth/signout' // 登出页面
  },
};

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  return await Auth(request, authOptions);
});
