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
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            <span v-if="accountsPending">Chargement...</span>
            <span v-else>€{{ totalBalance.toFixed(2) }}</span>
          </p>
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
      <h2 class="text-xl font-bold mb-4 dark:text-white">
        {{ $t('dashboard.quickActions') }}
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <!-- Bouton pour créer un compte -->
        <button
          @click="createAccount"
          :disabled="isCreatingAccount"
          class="p-4 bg-green-600 text-white dark:bg-green-500 rounded-lg shadow hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="ph:plus-circle-bold" class="w-8 h-8 mx-auto mb-2 text-white" />
          <span class="block text-sm font-medium">
            {{ isCreatingAccount ? 'Création...' : 'Créer un compte' }}
          </span>
        </button>
        
        <!-- Actions existantes -->
        <button
          v-for="action in quickActions"
          :key="action.name"
          @click="handleQuickAction(action)"
          class="p-4 bg-blue-600 text-white dark:bg-blue-500 rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-center font-semibold"
        >
          <Icon :name="action.icon" class="w-8 h-8 mx-auto mb-2 text-white" />
          <span class="block text-sm font-medium">{{ action.name }}</span>
        </button>
              </div>
      </section>

      <!-- Accounts Overview -->
      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4 dark:text-white">
          {{ $t('dashboard.accounts') }}
        </h2>
        <div v-if="accountsPending" class="p-6 text-center text-gray-500 dark:text-gray-400">
          {{ $t('dashboard.loading') }}
        </div>
        <div v-else-if="accountsError" class="p-6 text-center text-red-500 dark:text-red-400">
          Erreur lors du chargement des comptes: {{ accountsError }}
        </div>
        <div v-else-if="!accountsData?.accounts || accountsData.accounts.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
          Aucun compte trouvé. Créez votre premier compte !
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="account in accountsData.accounts"
            :key="account.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ getAccountTypeName(account.accountType) }}
              </h3>
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="account.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'"
              >
                {{ account.isActive ? $t('dashboard.active') : $t('dashboard.inactive') }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ account.accountNumber }}
            </p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              €{{ parseFloat(account.balance).toFixed(2) }}
            </p>
            <div class="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Transactions: {{ account._count.transactionsFrom + account._count.transactionsTo }}</span>
              <span>Créé: {{ formatDate(account.createdAt) }}</span>
            </div>
          </div>
        </div>
    </section>

    <!-- Recent Transactions -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold dark:text-white">
          {{ $t('dashboard.recentTransactions') }}
        </h2>
        <NuxtLink to="/transactions" class="text-blue-600 dark:text-blue-400 hover:underline">
          {{ $t('dashboard.viewAll') }}
        </NuxtLink>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t('dashboard.transaction.date') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t('dashboard.transaction.description') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t('dashboard.transaction.amount') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
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
              <td
                class="px-6 py-4 whitespace-nowrap text-sm"
                :class="
                  transaction.amount > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                "
              >
                {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}€
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="
                    transaction.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  "
                >
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
      <h2 class="text-xl font-bold mb-4 dark:text-white">
        {{ $t('dashboard.accountActivity') }}
      </h2>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </section>
  </div>

  <!-- Modal de virement -->
  <div v-if="showTransferModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Effectuer un virement
        </h3>
        <button @click="closeTransferModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon name="ph:x-bold" class="w-6 h-6" />
        </button>
      </div>
      
      <form @submit.prevent="performTransfer" class="space-y-4">
        <!-- Compte source -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Depuis le compte
          </label>
          <select v-model="transferForm.fromAccountId" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Sélectionnez un compte</option>
            <option v-for="account in accountsData?.accounts" :key="account.id" :value="account.id">
              {{ getAccountTypeName(account.accountType) }} - {{ account.accountNumber }} (€{{ parseFloat(account.balance).toFixed(2) }})
            </option>
          </select>
        </div>

        <!-- Compte destinataire -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vers le compte (numéro)
          </label>
          <input v-model="transferForm.toAccountNumber" type="text" required
                 placeholder="ACC1234567890"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Montant -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Montant (€)
          </label>
          <input v-model.number="transferForm.amount" type="number" step="0.01" min="0.01" required
                 placeholder="0.00"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input v-model="transferForm.description" type="text" required
                 placeholder="Virement familial"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Boutons -->
        <div class="flex gap-3 pt-4">
          <button type="button" @click="closeTransferModal"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Annuler
          </button>
          <button type="submit" :disabled="isTransferring"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isTransferring ? 'Envoi...' : 'Envoyer' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de dépôt -->
  <div v-if="showDepositModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Effectuer un dépôt
        </h3>
        <button @click="closeDepositModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon name="ph:x-bold" class="w-6 h-6" />
        </button>
      </div>
      
      <form @submit.prevent="performDeposit" class="space-y-4">
        <!-- Compte destinataire -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sur le compte
          </label>
          <select v-model="depositForm.accountId" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Sélectionnez un compte</option>
            <option v-for="account in accountsData?.accounts" :key="account.id" :value="account.id">
              {{ getAccountTypeName(account.accountType) }} - {{ account.accountNumber }} (€{{ parseFloat(account.balance).toFixed(2) }})
            </option>
          </select>
        </div>

        <!-- Montant -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Montant (€)
          </label>
          <input v-model.number="depositForm.amount" type="number" step="0.01" min="0.01" required
                 placeholder="0.00"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input v-model="depositForm.description" type="text" required
                 placeholder="Dépôt de salaire"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Boutons -->
        <div class="flex gap-3 pt-4">
          <button type="button" @click="closeDepositModal"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Annuler
          </button>
          <button type="submit" :disabled="isDepositing"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isDepositing ? 'Dépôt...' : 'Déposer' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de retrait -->
  <div v-if="showWithdrawalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Effectuer un retrait
        </h3>
        <button @click="closeWithdrawalModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon name="ph:x-bold" class="w-6 h-6" />
        </button>
      </div>
      
      <form @submit.prevent="performWithdrawal" class="space-y-4">
        <!-- Compte source -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Depuis le compte
          </label>
          <select v-model="withdrawalForm.accountId" required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Sélectionnez un compte</option>
            <option v-for="account in accountsData?.accounts" :key="account.id" :value="account.id">
              {{ getAccountTypeName(account.accountType) }} - {{ account.accountNumber }} (€{{ parseFloat(account.balance).toFixed(2) }})
            </option>
          </select>
        </div>

        <!-- Montant -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Montant (€)
          </label>
          <input v-model.number="withdrawalForm.amount" type="number" step="0.01" min="0.01" required
                 placeholder="0.00"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input v-model="withdrawalForm.description" type="text" required
                 placeholder="Retrait DAB"
                 class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <!-- Boutons -->
        <div class="flex gap-3 pt-4">
          <button type="button" @click="closeWithdrawalModal"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Annuler
          </button>
          <button type="submit" :disabled="isWithdrawing"
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isWithdrawing ? 'Retrait...' : 'Retirer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useI18n } from 'vue-i18n';
import { useRuntimeConfig } from '#app';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { t } = useI18n();

interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

const config = useRuntimeConfig();
const API_BASE = config.public.apiBase;

const userCookie = useCookie<User | null>('user', {
  default: () => null
});
const tokenCookie = useCookie<string | null>('token', {
  default: () => null,
  secure: false,
  sameSite: 'lax',
});

const userToken = tokenCookie.value;
const userObj = userCookie.value;

// State pour le bouton de création de compte
const isCreatingAccount = ref(false);

// State pour le modal de virement
const showTransferModal = ref(false);
const isTransferring = ref(false);
const transferForm = ref({
  fromAccountId: '',
  toAccountNumber: '',
  amount: 0,
  description: ''
});

// State pour le modal de dépôt
const showDepositModal = ref(false);
const isDepositing = ref(false);
const depositForm = ref({
  accountId: '',
  amount: 0,
  description: ''
});

// State pour le modal de retrait
const showWithdrawalModal = ref(false);
const isWithdrawing = ref(false);
const withdrawalForm = ref({
  accountId: '',
  amount: 0,
  description: ''
});

// Fonctions pour le modal de virement
function openTransferModal() {
  showTransferModal.value = true;
}

function closeTransferModal() {
  showTransferModal.value = false;
  // Reset du formulaire
  transferForm.value = {
    fromAccountId: '',
    toAccountNumber: '',
    amount: 0,
    description: ''
  };
}

async function performTransfer() {
  if (!userToken) {
    alert('Token d\'authentification manquant');
    return;
  }

  isTransferring.value = true;

  try {
    const response = await $fetch<TransferResponse>(`${API_BASE}/api/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: {
        fromAccountId: parseInt(transferForm.value.fromAccountId),
        toAccountNumber: transferForm.value.toAccountNumber,
        amount: transferForm.value.amount,
        description: transferForm.value.description
      }
    });

    if (response && response.success) {
      console.log('Transfer successful:', response);
      closeTransferModal();
      await refreshAccounts();
    } else {
      console.error('Transfer failed:', response);
      alert('Échec du virement: ' + (response.message || 'Erreur inconnue'));
    }
  } catch (error) {
    console.error('Error during transfer:', error);
    alert('Erreur lors du virement. Veuillez réessayer.');
  } finally {
    isTransferring.value = false;
  }
}

// Fonction pour gérer les actions rapides
function handleQuickAction(action: any) {
  if (action.name === t('dashboard.quickActions.transfer')) {
    openTransferModal();
  } else if (action.name === "Dépôt") {
    openDepositModal();
  } else if (action.name === "Retrait") {
    openWithdrawalModal();
  } else {
    console.log('Action not implemented yet:', action.name);
    alert('Cette fonctionnalité sera bientôt disponible !');
  }
}

// Fonctions pour le modal de dépôt
function openDepositModal() {
  showDepositModal.value = true;
}

function closeDepositModal() {
  showDepositModal.value = false;
  // Reset du formulaire
  depositForm.value = {
    accountId: '',
    amount: 0,
    description: ''
  };
}

async function performDeposit() {
  if (!userToken) {
    alert('Token d\'authentification manquant');
    return;
  }

  isDepositing.value = true;

  try {
    const response = await $fetch<DepositResponse>(`${API_BASE}/api/transactions/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: {
        accountId: parseInt(depositForm.value.accountId),
        amount: depositForm.value.amount,
        description: depositForm.value.description
      }
    });

    if (response && response.success) {
      console.log('Deposit successful:', response);
      const selectedAccount = accountsData.value?.accounts.find(acc => acc.id === parseInt(depositForm.value.accountId));
      alert(`${response.message}\n\nMontant: €${depositForm.value.amount}\nCompte: ${selectedAccount?.accountNumber}\nDescription: ${depositForm.value.description}\nRéférence: ${response.transaction.reference}`);
      
      // Fermer le modal et rafraîchir les comptes
      closeDepositModal();
      await refreshAccounts();
    } else {
      console.error('Deposit failed:', response);
      alert('Échec du dépôt: ' + (response.message || 'Erreur inconnue'));
    }
  } catch (error) {
    console.error('Error during deposit:', error);
    alert('Erreur lors du dépôt. Veuillez réessayer.');
  } finally {
    isDepositing.value = false;
  }
}

// Fonctions pour le modal de retrait
function openWithdrawalModal() {
  showWithdrawalModal.value = true;
}

function closeWithdrawalModal() {
  showWithdrawalModal.value = false;
  // Reset du formulaire
  withdrawalForm.value = {
    accountId: '',
    amount: 0,
    description: ''
  };
}

async function performWithdrawal() {
  if (!userToken) {
    alert('Token d\'authentification manquant');
    return;
  }

  isWithdrawing.value = true;

  try {
    const response = await $fetch<WithdrawalResponse>(`${API_BASE}/api/transactions/withdrawal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: {
        accountId: parseInt(withdrawalForm.value.accountId),
        amount: withdrawalForm.value.amount,
        description: withdrawalForm.value.description
      }
    });

    if (response && response.success) {
      console.log('Withdrawal successful:', response);
      const selectedAccount = accountsData.value?.accounts.find(acc => acc.id === parseInt(withdrawalForm.value.accountId));
      alert(`${response.message}\n\nMontant: €${withdrawalForm.value.amount}\nCompte: ${selectedAccount?.accountNumber}\nDescription: ${withdrawalForm.value.description}\nRéférence: ${response.transaction.reference}`);
      
      // Fermer le modal et rafraîchir les comptes
      closeWithdrawalModal();
      await refreshAccounts();
    } else {
      console.error('Withdrawal failed:', response);
      alert('Échec du retrait: ' + (response.message || 'Erreur inconnue'));
    }
  } catch (error) {
    console.error('Error during withdrawal:', error);
    alert('Erreur lors du retrait. Veuillez réessayer.');
  } finally {
    isWithdrawing.value = false;
  }
}

// Interface pour les comptes
interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: string;
  isActive: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    transactionsFrom: number;
    transactionsTo: number;
  };
}

interface AccountsResponse {
  success: boolean;
  accounts: Account[];
}

interface BalanceResponse {
  balance: number;
}

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: string;
  isActive: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface AccountsResponse {
  success: boolean;
  accounts: Account[];
}

interface CreateAccountResponse {
  success: boolean;
  message: string;
  account: {
    id: number;
    accountNumber: string;
    accountType: string;
    balance: string;
    isActive: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      email: string;
      name: string;
    };
  };
}

interface TransferResponse {
  success: boolean;
  message: string;
  transaction?: {
    id: number;
    amount: string;
    description: string;
    fromAccountId: number;
    toAccountId: number;
    createdAt: string;
  };
}

interface DepositResponse {
  success: boolean;
  message: string;
  transaction: {
    id: number;
    amount: string;
    type: string;
    status: string;
    description: string;
    reference: string;
    fromAccountId: number | null;
    toAccountId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface WithdrawalResponse {
  success: boolean;
  message: string;
  transaction: {
    id: number;
    amount: string;
    type: string;
    status: string;
    description: string;
    reference: string;
    fromAccountId: number;
    toAccountId: number | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Fonction pour créer un nouveau compte
async function createAccount() {
  if (!userToken) {
    alert('Token d\'authentification manquant');
    return;
  }

  isCreatingAccount.value = true;
  
  try {
    const response = await $fetch<CreateAccountResponse>(`${API_BASE}/api/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: {
        accountType: 'CHECKING',
        initialBalance: 1000
      }
    });

    if (response && response.success) {
      console.log('Account created successfully:', response.account);
      
      // Message de succès plus détaillé
      const account = response.account;
      alert(`${response.message}\n\nDétails du compte:\n• Numéro: ${account.accountNumber}\n• Type: ${account.accountType}\n• Solde initial: ${account.balance}€`);
      
      // Rafraîchir la liste des comptes
      await refreshAccounts();
    } else {
      console.error('Failed to create account:', response);
      alert('Échec de la création du compte: ' + (response.message || 'Erreur inconnue'));
    }
  } catch (error) {
    console.error('Error creating account:', error);
    alert('Erreur lors de la création du compte. Veuillez réessayer.');
  } finally {
    isCreatingAccount.value = false;
  }
}

// Récupération des comptes avec useFetch
const { data: accountsData, pending: accountsPending, error: accountsError, refresh: refreshAccounts } = await useFetch<AccountsResponse>(`${API_BASE}/api/accounts`, {
  headers: {
    'Authorization': `Bearer ${userToken}`,
  },
  server: false
});

// Calculated property pour le solde total de tous les comptes
const totalBalance = computed(() => {
  if (!accountsData.value?.accounts || !Array.isArray(accountsData.value.accounts)) {
    return 0;
  }
  
  return accountsData.value.accounts.reduce((total, account) => {
    const balance = parseFloat(account.balance) || 0;
    return total + balance;
  }, 0);
});

// Vérifier que l'utilisateur existe avant de faire la requête - Cette partie peut être supprimée maintenant
/*
let balanceData = null;
if (userObj && userObj.id) {
  try {
    const { data } = await useFetch<BalanceResponse>(`${API_BASE}/api/accounts/${userObj.id}/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    });
    balanceData = data;
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}
*/

// Fonctions utilitaires
const getAccountTypeName = (type: string) => {
  const types: Record<string, string> = {
    CHECKING: t('dashboard.accountTypes.checking'),
    SAVINGS: t('dashboard.accountTypes.savings'),
    BUSINESS: t('dashboard.accountTypes.business')
  };
  return types[type] || type;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const quickActions = [
  { name: t('dashboard.quickActions.transfer'), icon: 'ph:arrows-left-right-bold' },
  { name: "Dépôt", icon: 'ph:receipt-bold' },
  { name: "Retrait", icon: 'ph:chart-line-up-bold' },
  { name: t('dashboard.quickActions.support'), icon: 'ph:headset-bold' },
];

const recentTransactions = [
  {
    id: 1,
    date: '2024-02-15',
    description: t('dashboard.transaction.salaryDeposit'),
    amount: 2500,
    status: 'completed',
  },
  {
    id: 2,
    date: '2024-02-14',
    description: t('dashboard.transaction.groceryStore'),
    amount: -85.5,
    status: 'completed',
  },
  {
    id: 3,
    date: '2024-02-13',
    description: t('dashboard.transaction.electricBill'),
    amount: -120,
    status: 'pending',
  },
];

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Income',
      data: [2000, 2500, 2200, 2800, 2400, 2600],
      borderColor: 'rgb(34, 197, 94)',
      tension: 0.1,
    },
    {
      label: 'Expenses',
      data: [1500, 1800, 1600, 2000, 1700, 1900],
      borderColor: 'rgb(239, 68, 68)',
      tension: 0.1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};
</script>
