<template>
  <div>
    <div v-if="status === 'loading'">
      <span class="text-gray-400">...</span>
    </div>
    <div v-else-if="isAuthenticated">
      <button
        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-semibold"
        @click="signOut"
      >
        登出
      </button>
    </div>
    <div v-else>
      <NuxtLink
        to="/auth/signin"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold"
      >
        登录
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { status, isAuthenticated, signOut } = useAuth();
</script>
