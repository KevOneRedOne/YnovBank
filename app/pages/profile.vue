<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <!-- Profile header -->
    <div class="md:flex md:items-center md:justify-between md:space-x-5">
      <div class="flex items-start space-x-5">
        <div class="flex-shrink-0">
          <div class="relative">
            <img
              class="h-16 w-16 rounded-full"
              src="https://via.placeholder.com/150"
              alt="Profile picture"
            />
            <span class="absolute inset-0 shadow-inner rounded-full" aria-hidden="true"></span>
          </div>
        </div>
        <div class="pt-1.5">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('profile.title') }}
          </h1>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ $t('profile.memberSince') }} {{ memberSince }}
          </p>
        </div>
      </div>
      <div
        class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3"
      >
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ $t('profile.editProfile') }}
        </button>
      </div>
    </div>

    <!-- Profile content -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Personal Information -->
      <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {{ $t('profile.personalInfo.title') }}
          </h3>
          <div class="mt-5 border-t border-gray-200 dark:border-gray-700">
            <dl class="divide-y divide-gray-200 dark:divide-gray-700">
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('profile.personalInfo.name') }}
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  Jean Dupont
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('profile.personalInfo.email') }}
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  jean.dupont@example.com
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('profile.personalInfo.phone') }}
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  +33 6 12 34 56 78
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {{ $t('profile.security.title') }}
          </h3>
          <div class="mt-5 border-t border-gray-200 dark:border-gray-700">
            <dl class="divide-y divide-gray-200 dark:divide-gray-700">
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('profile.security.password') }}
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  <button
                    type="button"
                    class="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    {{ $t('profile.security.changePassword') }}
                  </button>
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('profile.security.2fa') }}
                </dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  <button
                    type="button"
                    class="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    {{ $t('profile.security.enable2fa') }}
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const memberSince = new Date().toLocaleDateString();
</script>
