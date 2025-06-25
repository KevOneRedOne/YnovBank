<template>
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8 card p-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {{ $t('register.title') }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {{ $t('register.subtitle') }}
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="name" class="sr-only">{{ $t('register.name') }}</label>
              <input
                id="name"
                name="name"
                type="name"
                autocomplete="name"
                required
                v-model="name"
                class="input"
                :placeholder="$t('register.name')"
              />
            </div>
            <div>
              <label for="email" class="sr-only">{{ $t('register.email') }}</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="input"
                :placeholder="$t('register.email')"
              />
            </div>
            <div class="mt-4">
              <label for="password" class="sr-only">{{ $t('register.password') }}</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="password"
                class="input"
                :placeholder="$t('register.password')"
              />
            </div>
          </div>
          <div>
            <button type="submit" class="btn-primary w-full">
              {{ $t('register.signUp') }}
            </button>
          </div>
        </form>
        <div class="text-sm text-center mt-4">
          {{ $t('register.allreadyRegister') }}
          <NuxtLink
            to="/auth/login"
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {{ $t('register.login') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useFetch } from '@vueuse/core';
    import { useCookies } from '@vueuse/integrations/useCookies';
    import { useRuntimeConfig } from '#app';
  
    const email = ref('');
    const password = ref('');
    const name = ref('');
    const rememberMe = ref(false);
    const router = useRouter();
  
    const config = useRuntimeConfig();
    const API_BASE = config.public.apiBase;
  
    async function handleRegister() {
      try {
        const { data, error } = await useFetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          body: JSON.stringify({
            email: email.value,
            password: password.value,
            name: name.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (error.value) {
          console.error('Register failed:', error.value);
          alert('Register failed. Please check your credentials.');
          return;
        }
  
        if (data.value.sucess && data.value.user) {
          cookies.set('user', user, { path: '/', maxAge: rememberMe.value ? 604800 : undefined });
          cookies.set('token', data.value.token, { path: '/', maxAge: rememberMe.value ? 604800 : undefined });
          router.push('/dashboard');
        } else {
          alert( data.value.message || 'Register failed. Please try again.');
        }
      } catch (err) {
        console.error('An error occurred during register:', err);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  </script>
  