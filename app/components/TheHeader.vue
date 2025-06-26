<template>
  <header class="bg-white dark:bg-gray-800 shadow">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          YnovBank
        </NuxtLink>

        <div class="flex items-center space-x-4">
          <NuxtLink to="/dashboard" class="nav-link">{{ $t('header.dashboard') }}</NuxtLink>
          <NuxtLink to="/auth/login" class="nav-link">Déconnexion</NuxtLink>
          <NuxtLink to="/profile" class="nav-link">{{ $t('header.profile') }}</NuxtLink>

          <button
            @click="toggleColorMode"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Icon
              :name="colorMode.value === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'"
              class="w-6 h-6"
            />
          </button>

          <select v-model="locale" class="bg-transparent border rounded px-2 py-1">
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const { locale } = useI18n();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors;
}
</style>
