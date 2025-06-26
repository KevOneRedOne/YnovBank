<template>
  <div>
    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-xl mb-8 text-blue-100">
            {{ $t('home.hero.subtitle') }}
          </p>
          <div class="flex justify-center space-x-4">
            <NuxtLink to="/auth/register" class="btn-primary">
              {{ $t('home.hero.getStarted') }}
            </NuxtLink>
            <NuxtLink to="/" class="btn-secondary">
              {{ $t('home.hero.learnMore') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 dark:text-white">
          {{ $t('home.features.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div class="text-blue-600 mb-4">
              <Icon :name="feature.icon" class="w-12 h-12" />
            </div>
            <h3 class="text-xl font-semibold mb-2 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 dark:text-white">
          {{ $t('home.testimonials.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="p-6 rounded-lg bg-white dark:bg-gray-800 shadow"
          >
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ testimonial.content }}
            </p>
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div class="ml-4">
                <h4 class="font-semibold dark:text-white">
                  {{ testimonial.name }}
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ testimonial.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const features = [
  {
    icon: 'ph:shield-check-bold',
    title: t('home.features.secureBanking'),
    description: t('home.features.secureBankingDesc'),
  },
  {
    icon: 'ph:chart-line-up-bold',
    title: t('home.features.smartInvestments'),
    description: t('home.features.smartInvestmentsDesc'),
  },
  {
    icon: 'ph:device-mobile-bold',
    title: t('home.features.mobileBanking'),
    description: t('home.features.mobileBankingDesc'),
  },
];

const testimonials = [
  {
    content: t('home.testimonials.testimonial1.content'),
    name: t('home.testimonials.testimonial1.name'),
    role: t('home.testimonials.testimonial1.role'),
  },
  {
    content: t('home.testimonials.testimonial2.content'),
    name: t('home.testimonials.testimonial2.name'),
    role: t('home.testimonials.testimonial2.role'),
  },
];
</script>

<style scoped>
.btn-primary {
  @apply bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors;
}

.btn-secondary {
  @apply border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors;
}
</style>
