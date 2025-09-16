<template>
  <div class="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">登录</h1>
    <div v-if="status === 'unauthenticated'">
      <button
        class="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center"
        @click="handleSignIn('github')"
      >
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
            clip-rule="evenodd"
          ></path>
        </svg>
        使用 GitHub 登录
      </button>
    </div>
    <div v-else-if="status === 'authenticated'">
      <p class="text-green-600">你已经登录了。</p>
      <NuxtLink to="/" class="text-blue-500 hover:underline mt-2">返回首页</NuxtLink>
    </div>
    <div v-else class="text-gray-500">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, navigateTo } from '#imports';
import { useAuth } from '~/composables/useAuth';

// 设置页面布局和中间件
definePageMeta({
  layout: 'default',
  // 如果已登录，可以考虑将用户重定向到首页
  middleware: [
    function (to) {
      const { isAuthenticated } = useAuth();
      if (isAuthenticated.value && to.path === '/auth/signin') {
        return navigateTo('/');
      }
    },
  ],
});

const { signIn, status } = useAuth();

const handleSignIn = (provider: 'github') => {
  signIn(provider).catch((err) => {
    console.error('Sign in failed', err);
    // 你可以在这里处理登录失败的 UI 提示
  });
};
</script>
