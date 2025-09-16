<template>
  <div class="p-8 bg-gray-50 min-h-screen font-sans">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <header class="flex justify-between items-center pb-4 border-b">
        <h1 class="text-2xl font-bold text-gray-800">Nuxt.js 3 Auth Demo</h1>
        <AuthButton />
      </header>

      <main class="mt-6">
        <!-- NuxtPage 用于渲染匹配当前路由的页面组件 -->
        <NuxtPage />

        <!-- 根据认证状态显示不同内容 -->
        <div v-if="status === 'loading'" class="text-center text-gray-500 mt-4">正在加载会话信息...</div>
        <div
          v-else-if="isAuthenticated && session?.user"
          class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <h2 class="text-xl font-semibold text-gray-700">欢迎, {{ session.user.name }}!</h2>
          <div class="flex items-center mt-4">
            <img
              :src="session.user.image!"
              alt="User Avatar"
              class="w-16 h-16 rounded-full mr-4 border-2 border-white shadow-sm"
            />
            <div>
              <p class="text-gray-600">邮箱: {{ session.user.email }}</p>
              <p class="text-gray-600">你已成功登录。</p>
            </div>
          </div>
        </div>
        <div v-else class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-gray-600 text-center">你当前未登录。请点击右上角按钮登录。</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

// 获取认证状态和会话信息
const { status, session, isAuthenticated } = useAuth();

// 在客户端加载时，如果状态仍然是 loading，则手动获取一次会话
// 这可以处理从其他页面导航过来的情况
onMounted(() => {
  if (status.value === 'loading') {
    useAuth().fetchSession();
  }
});
</script>
