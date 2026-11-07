<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('orders')
const pendingOrders = ref([
  { id: 'ORD-001', customer: 'Carlos Mendoza', amount: 25.00, method: 'Pago Móvil', ref: '987654', date: '06 Nov 10:30 AM' }
])
const inventory = ref([
  { id: 101, name: 'Torta de Limón', price: 15.00, isLowStockAlertActive: true }
])
const approveOrder = (id) => pendingOrders.value = pendingOrders.value.filter(o => o.id !== id)
const toggleLowStock = (item) => item.isLowStockAlertActive = !item.isLowStockAlertActive

const profileForm = ref({
  name: '',
  phone: '',
  docType: 'V',
  docNumber: ''
})
const showSuccessMsg = ref(false)
const showPasswordModal = ref(false)
const passwordConfirm = ref('')

onMounted(() => {
  if (authStore.user) {
    profileForm.value = {
      name: authStore.user.name || '',
      phone: authStore.user.phone || '',
      docType: authStore.user.docType || 'V',
      docNumber: authStore.user.docNumber || ''
    }
  }
})

const initiateSave = () => {
  showPasswordModal.value = true
  passwordConfirm.value = ''
}

const confirmSave = () => {
  authStore.updateUser(profileForm.value)
  showPasswordModal.value = false
  showSuccessMsg.value = true
  setTimeout(() => showSuccessMsg.value = false, 3000)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col gap-6 relative">
    <header class="bg-ivory dark:bg-darkcard p-6 rounded-2xl shadow-soft dark:shadow-none border border-transparent dark:border-gray-700">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-sage text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ authStore.user?.name || 'Usuario' }}</h1>
          <p class="text-sm text-sage dark:text-darkaccent">{{ authStore.user?.email || 'correo@ejemplo.com' }}</p>
        </div>
      </div>
    </header>

    <div v-if="authStore.isAdmin" class="flex flex-col gap-6">
      <div class="flex gap-2 bg-mist dark:bg-darkcard p-1 rounded-xl">
        <button @click="activeTab = 'orders'" :class="['flex-1 py-2 text-sm font-semibold rounded-lg transition-colors outline-none', activeTab === 'orders' ? 'bg-ivory dark:bg-gray-800 text-sage dark:text-darkaccent shadow-sm' : 'text-gray-600 dark:text-gray-400']">Pedidos</button>
        <button @click="activeTab = 'inventory'" :class="['flex-1 py-2 text-sm font-semibold rounded-lg transition-colors outline-none', activeTab === 'inventory' ? 'bg-ivory dark:bg-gray-800 text-sage dark:text-darkaccent shadow-sm' : 'text-gray-600 dark:text-gray-400']">Inventario</button>
      </div>

      <div v-if="activeTab === 'orders'" class="text-center py-10 text-gray-500">Panel de pedidos activo.</div>
      <div v-if="activeTab === 'inventory'" class="text-center py-10 text-gray-500">Panel de inventario activo.</div>
    </div>
    
    <div v-else class="flex flex-col gap-6">
      <div class="bg-ivory dark:bg-darkcard p-6 rounded-2xl shadow-soft dark:shadow-none border border-transparent dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Mis Datos Personales</h3>
        
        <form @submit.prevent="initiateSave" class="flex flex-col gap-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nombre Completo</label>
            <input v-model="profileForm.name" type="text" placeholder="Ej. Manuel Peroza" class="mt-1 p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-shadow" required />
          </div>
          
          <div>
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Documento de Identidad</label>
            <div class="flex gap-2 mt-1">
              <select v-model="profileForm.docType" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-20 transition-shadow cursor-pointer font-bold">
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="J">J</option>
                <option value="P">P</option>
              </select>
              <input v-model="profileForm.docNumber" type="text" placeholder="12345678" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none flex-1 transition-shadow" required />
            </div>
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teléfono (WhatsApp)</label>
            <input v-model="profileForm.phone" type="tel" placeholder="0414-1234567" class="mt-1 p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-shadow" required />
          </div>

          <button type="submit" class="w-full bg-sage dark:bg-darkaccent text-white dark:text-darkbg py-3 rounded-xl font-bold mt-2 active:scale-95 hover:brightness-110 transition-all outline-none">
            {{ showSuccessMsg ? '¡Datos Guardados!' : 'Guardar Cambios' }}
          </button>
        </form>
      </div>

      <div class="bg-ivory dark:bg-darkcard p-6 rounded-2xl shadow-soft dark:shadow-none border border-transparent dark:border-gray-700 text-center">
        <svg class="w-12 h-12 text-sage dark:text-darkaccent mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Mis Compras</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Aún no tienes pedidos registrados.</p>
      </div>
    </div>

    <button @click="handleLogout" class="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-bold active:scale-95 transition-all outline-none">
      Cerrar Sesión
    </button>

    <div v-if="showPasswordModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-ivory dark:bg-darkcard w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-transparent dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirmar identidad</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Ingresa tu contraseña actual para autorizar el cambio de datos personales.</p>
        
        <form @submit.prevent="confirmSave" class="flex flex-col gap-4">
          <input v-model="passwordConfirm" type="password" placeholder="Contraseña" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-shadow" required />
          <div class="flex gap-3 mt-2">
            <button type="button" @click="showPasswordModal = false" class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold active:scale-95 transition-all outline-none">Cancelar</button>
            <button type="submit" class="flex-1 bg-sage dark:bg-darkaccent text-white dark:text-darkbg py-3 rounded-xl font-bold active:scale-95 hover:brightness-110 transition-all outline-none">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>