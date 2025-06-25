<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <main class="flex-grow">
      <NuxtPage />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/main.css';
</script>
