<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 card p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('login.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          {{ $t('login.subtitle') }}
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="input"
              :placeholder="$t('login.email')"
            />
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">{{ $t('login.password') }}</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="input"
              :placeholder="$t('login.password')"
            />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              v-model="rememberMe"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember_me" class="ml-2 block text-sm text-gray-900 dark:text-gray-200">
              {{ $t('login.rememberMe') }}
            </label>
          </div>
          <div class="text-sm">
            <NuxtLink
              to="/auth/forgot-password"
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {{ $t('login.forgotPassword') }}
            </NuxtLink>
          </div>
        </div>
        <div>
          <button type="submit" class="btn-primary w-full">
            {{ $t('login.signIn') }}
          </button>
        </div>
      </form>
      <div class="text-sm text-center mt-4">
        {{ $t('login.noAccount') }}
        <NuxtLink
          to="/auth/register"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {{ $t('login.register') }}
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
  const rememberMe = ref(false);
  const router = useRouter();

  const config = useRuntimeConfig();
  const API_BASE = config.public.apiBase;

  async function handleLogin() {
    try {
      const { data, error } = await useFetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error.value) {
        console.error('Login failed:', error.value);
        alert('Login failed. Please check your credentials.');
        return;
      }

      if (data.value.sucess && data.value.user) {
        cookies.set('user', user, { path: '/', maxAge: rememberMe.value ? 604800 : undefined });
        cookies.set('token', data.value.token, { path: '/', maxAge: rememberMe.value ? 604800 : undefined });
        router.push('/dashboard');
      } else {
        alert( data.value.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('An error occurred during login:', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  }
</script>
