<template>
  <footer class="bg-white dark:bg-gray-800 shadow-inner mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">YnovBank</h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('footer.description') }}
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ $t('footer.quickLinks') }}
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/about"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {{ $t('footer.about') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {{ $t('footer.contact') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/privacy"
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {{ $t('footer.privacy') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ $t('footer.contact') }}
          </h3>
          <ul class="space-y-2 text-gray-600 dark:text-gray-400">
            <li>Email: contact@ynovbank.com</li>
            <li>Phone: +33 1 23 45 67 89</li>
            <li>Address: 123 Banking Street, 75000 Paris</li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400"
      >
        <p>&copy; {{ new Date().getFullYear() }} YnovBank. {{ $t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
