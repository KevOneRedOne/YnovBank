<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Account Overview -->
    <section class="mb-8">
      <h1 class="text-2xl font-bold mb-6 dark:text-white">{{ $t('dashboard.welcome') }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            {{ $t('dashboard.totalBalance') }}
          </h3>
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">€12,345.67</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            {{ $t('dashboard.income') }}
          </h3>
          <p class="text-3xl font-bold text-green-600 dark:text-green-400">+€2,500.00</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">
            {{ $t('dashboard.expenses') }}
          </h3>
          <p class="text-3xl font-bold text-red-600 dark:text-red-400">-€1,200.00</p>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="mb-8">
      <h2 class="text-xl font-bold mb-4 dark:text-white">{{ $t('dashboard.quickActions') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button v-for="action in quickActions" :key="action.name"
                class="p-4 bg-blue-600 text-white dark:bg-blue-500 rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-center font-semibold">
          <Icon :name="action.icon" class="w-8 h-8 mx-auto mb-2 text-white" />
          <span class="block text-sm font-medium">{{ action.name }}</span>
        </button>
      </div>
    </section>

    <!-- Recent Transactions -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold dark:text-white">{{ $t('dashboard.recentTransactions') }}</h2>
        <NuxtLink to="/transactions" class="text-blue-600 dark:text-blue-400 hover:underline">
          {{ $t('dashboard.viewAll') }}
        </NuxtLink>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('dashboard.transaction.date') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('dashboard.transaction.description') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('dashboard.transaction.amount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('dashboard.transaction.status') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="transaction in recentTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ transaction.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}€
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'">
                  {{ $t('dashboard.transaction.status.' + transaction.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Account Activity Chart -->
    <section>
      <h2 class="text-xl font-bold mb-4 dark:text-white">{{ $t('dashboard.accountActivity') }}</h2>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useI18n } from 'vue-i18n'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const { t } = useI18n()

const quickActions = [
  { name: t('dashboard.quickActions.transfer'), icon: 'ph:arrows-left-right-bold' },
  { name: t('dashboard.quickActions.payBills'), icon: 'ph:receipt-bold' },
  { name: t('dashboard.quickActions.invest'), icon: 'ph:chart-line-up-bold' },
  { name: t('dashboard.quickActions.support'), icon: 'ph:headset-bold' }
]

const recentTransactions = [
  {
    id: 1,
    date: '2024-02-15',
    description: t('dashboard.transaction.salaryDeposit'),
    amount: 2500,
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-02-14',
    description: t('dashboard.transaction.groceryStore'),
    amount: -85.50,
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-02-13',
    description: t('dashboard.transaction.electricBill'),
    amount: -120,
    status: 'pending'
  }
]

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Income',
      data: [2000, 2500, 2200, 2800, 2400, 2600],
      borderColor: 'rgb(34, 197, 94)',
      tension: 0.1
    },
    {
      label: 'Expenses',
      data: [1500, 1800, 1600, 2000, 1700, 1900],
      borderColor: 'rgb(239, 68, 68)',
      tension: 0.1
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
}
</script> 