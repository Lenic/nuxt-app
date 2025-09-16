import { defineNuxtPlugin, useRequestHeaders } from '#imports';
import type { Session } from '@auth/core/types';
import { useAuth } from '~/composables/useAuth';

// 定义一个仅在服务端运行的插件 (通过 .server.ts 后缀)
export default defineNuxtPlugin({
  name: 'session-loader',
  enforce: 'pre', // 确保在其他插件之前运行
  async setup() {
    const { session, status } = useAuth();

    // 在服务端渲染期间，从 API 获取会话信息
    // `useRequestFetch` 会将请求的 cookie 和 headers 转发到 API 端点
    const headers = useRequestHeaders();
    const data = await $fetch<Session>('/api/auth/session', { headers });

    // 如果获取到了有效的会话数据，则更新状态
    if (data && Object.keys(data).length > 0) {
      session.value = data;
      status.value = 'authenticated';
    } else {
      session.value = null;
      status.value = 'unauthenticated';
    }
  },
});
