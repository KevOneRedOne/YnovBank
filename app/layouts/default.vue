<script setup lang="ts">
    import { useRoute } from 'vue-router'
    import Header from '@/components/AppHeader.vue'
    
    const route = useRoute()
    
    const isAuthPage = computed(() =>
      ['login', 'register'].includes(route.name?.toString() || '')
    )
</script>

<template>
  <div>
    <Header v-if="!isAuthPage" />
    <slot />
  </div>
</template>