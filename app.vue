<script setup lang="ts">
const count = ref(1);
const doubleCount = computed(() => count.value * 2);
</script>

<template>
  <div>
    <div>
      <NuxtRouteAnnouncer />
      <h1>Hello World</h1>
      <p>Count: {{ count }}</p>
      <p>Double Count: {{ doubleCount }}</p>
      <button class="bg-blue-500 text-white p-2 rounded-md" @click="count++">Increment</button>
    </div>
    <div>
      <div class="flex gap-4 bg-gray-100 p-4 rounded-md">
        <NuxtLink
          class="text-blue-500 hover:text-blue-600 border-b-2 border-transparent pb-2 hover:border-blue-600 box-border"
          to="/about"
        >
          About
        </NuxtLink>
        <NuxtLink
          class="text-blue-500 hover:text-blue-600 border-b-2 border-transparent pb-2 hover:border-blue-600 box-border"
          to="/setting"
        >
          Setting
        </NuxtLink>
      </div>
      <NuxtPage />
    </div>
  </div>
</template>
