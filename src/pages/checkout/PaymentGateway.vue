<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import api from '../../api/axios'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isPaymentDrawerOpen = ref(false)
const isSubmitting = ref(false)

const selectedMethod = ref('pago_movil')

const sellerPaymentInfo = ref({
  pago_movil: {
    bank: 'Banesco (0134)',
    phone: '0414-1234567',
    dni: 'V-12345678',
    name: 'María Pérez'
  },
  transferencia: {
    bank: 'Banco Mercantil',
    account: '0105-0000-0000-0000-1234',
    dni: 'V-12345678',
    name: 'María Pérez',
    email: 'ventas@ejemplo.com'
  }
})

const formData = ref({
  phone: authStore.user?.phone || '',
  docType: authStore.user?.docType || 'V',
  docNumber: authStore.user?.docNumber || '',
  reference: '',
  bank: '',
  screenshot: null,
  otherMethodName: ''
})

const handleFileUpload = (event) => {
  formData.value.screenshot = event.target.files[0]
}

const submitPayment = async () => {
  if (cartStore.items.length === 0) return
  
  isSubmitting.value = true
  
  try {
    const payload = new FormData()
    
    payload.append('paymentMethod', selectedMethod.value)
    payload.append('totalAmount', cartStore.totalPrice.toFixed(2))
    payload.append('items', JSON.stringify(cartStore.items))
    
    if (selectedMethod.value === 'pago_movil' || selectedMethod.value === 'transferencia') {
      payload.append('docType', formData.value.docType)
      payload.append('docNumber', formData.value.docNumber)
      payload.append('reference', formData.value.reference)
      
      if (selectedMethod.value === 'pago_movil') {
        payload.append('phone', formData.value.phone)
      } else {
        payload.append('bank', formData.value.bank)
      }
      
      if (formData.value.screenshot) {
        payload.append('screenshot', formData.value.screenshot)
      }
    } else if (selectedMethod.value === 'otros') {
      payload.append('otherMethodName', formData.value.otherMethodName)
    }

    await api.post('/orders', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    cartStore.clearCart()
    isPaymentDrawerOpen.value = false
    router.push('/dashboard')
    
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 relative">
    
    <div class="flex-1 flex flex-col gap-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tu Carrito</h2>
      
      <div v-if="cartStore.items.length === 0" class="text-center py-16 text-gray-500 dark:text-gray-400">
        Tu carrito está vacío.
      </div>
      
      <div v-else class="flex flex-col gap-3">
        <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4 bg-ivory dark:bg-darkcard p-3 rounded-2xl shadow-soft dark:shadow-none border border-transparent dark:border-gray-700 transition-colors">
          
          <div class="w-20 h-20 bg-mist dark:bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
            <svg v-else class="w-8 h-8 text-sage/50 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          
          <div class="flex-1">
            <h3 class="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{{ item.name }}</h3>
            <p class="text-sage dark:text-darkaccent font-bold mt-1">${{ item.price.toFixed(2) }}</p>
          </div>
          
          <div class="flex items-center gap-3 bg-mist dark:bg-gray-800 px-2 py-1 rounded-xl">
            <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-300 active:scale-90 transition-transform outline-none">-</button>
            <span class="font-semibold w-4 text-center text-gray-900 dark:text-white">{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-300 active:scale-90 transition-transform outline-none">+</button>
          </div>
        </div>

        <div class="mt-4 p-5 bg-mist dark:bg-gray-800 rounded-2xl flex justify-between items-center">
          <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total a pagar:</span>
          <span class="text-2xl font-bold text-sage dark:text-darkaccent">${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>

        <button @click="isPaymentDrawerOpen = true" class="md:hidden sticky bottom-[5.5rem] mt-4 w-full bg-sage dark:bg-darkaccent text-white dark:text-darkbg py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform z-10 outline-none">
          Empezar Pago (${{ cartStore.totalPrice.toFixed(2) }})
        </button>
      </div>
    </div>

    <div v-if="isPaymentDrawerOpen" @click="isPaymentDrawerOpen = false" class="md:hidden fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"></div>

    <div :class="[
      'z-[70] bg-ivory dark:bg-darkcard transition-transform duration-300 ease-out overscroll-contain',
      'md:relative md:w-[400px] lg:w-[450px] md:h-auto md:p-6 md:rounded-2xl md:shadow-soft dark:md:shadow-none md:border md:border-transparent dark:md:border-gray-700 md:translate-y-0 md:block',
      'fixed inset-x-0 bottom-0 h-[87.5vh] rounded-t-3xl shadow-2xl p-6 pb-12 md:pb-6 overflow-y-auto',
      isPaymentDrawerOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
    ]">
      
      <div class="flex justify-between items-center mb-6 md:hidden">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Procesar Pago</h2>
        <button @click="isPaymentDrawerOpen = false" class="p-2 bg-mist dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 active:scale-90 outline-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <h2 class="hidden md:block text-xl font-semibold text-gray-900 dark:text-white mb-6">Método de Pago</h2>

      <select v-model="selectedMethod" class="w-full p-3 mb-6 rounded-xl border-none bg-mist dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none transition-shadow cursor-pointer">
        <option value="pago_movil">Pago Móvil</option>
        <option value="transferencia">Transferencia Bancaria</option>
        <option value="efectivo">Efectivo</option>
        <option value="otros">Otros</option>
      </select>

      <form v-if="selectedMethod === 'pago_movil'" @submit.prevent="submitPayment" class="flex flex-col gap-4">
        
        <div class="mb-2 p-4 bg-sage/10 dark:bg-darkaccent/10 border border-sage/20 dark:border-darkaccent/20 rounded-xl">
          <h3 class="text-sm font-bold text-sage dark:text-darkaccent mb-2 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Datos para Pago Móvil
          </h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <p class="text-gray-600 dark:text-gray-400">Banco:</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.pago_movil.bank }}</p>
            <p class="text-gray-600 dark:text-gray-400">Teléfono:</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.pago_movil.phone }}</p>
            <p class="text-gray-600 dark:text-gray-400">Cédula:</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.pago_movil.dni }}</p>
            <p class="text-gray-600 dark:text-gray-400">Titular:</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.pago_movil.name }}</p>
          </div>
        </div>

        <input v-model="formData.phone" type="tel" placeholder="Teléfono" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700" required />
        
        <div class="flex gap-2">
          <select v-model="formData.docType" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-20 transition-shadow cursor-pointer font-bold">
            <option value="V">V</option>
            <option value="E">E</option>
            <option value="J">J</option>
            <option value="P">P</option>
          </select>
          <input v-model="formData.docNumber" type="text" placeholder="Número de Documento" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none flex-1 transition-all hover:bg-gray-200 dark:hover:bg-gray-700" required />
        </div>
        
        <input v-model="formData.reference" type="text" placeholder="Número de Referencia" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700" required />

        <label class="flex flex-col gap-2 mt-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Captura de pantalla (Requerido)</span>
          <div class="relative w-full overflow-hidden rounded-xl border-2 border-dashed border-sage dark:border-darkaccent bg-sage/5 hover:bg-sage/10 dark:bg-darkaccent/10 dark:hover:bg-darkaccent/20 transition-colors duration-200">
            <input type="file" accept="image/*" @change="handleFileUpload" class="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-3 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-sage file:text-white dark:file:bg-darkaccent dark:file:text-darkbg cursor-pointer" required />
          </div>
        </label>

        <button type="submit" :disabled="isSubmitting" class="w-full bg-sage dark:bg-darkaccent text-white dark:text-darkbg py-3.5 rounded-xl font-bold mt-6 active:scale-95 hover:brightness-110 hover:shadow-md transition-all outline-none disabled:opacity-70 disabled:hover:brightness-100 flex items-center justify-center min-h-[52px]">
          <span v-if="!isSubmitting">Reportar Pago</span>
          <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </form>

      <form v-if="selectedMethod === 'transferencia'" @submit.prevent="submitPayment" class="flex flex-col gap-4">
        
        <div class="mb-2 p-4 bg-sage/10 dark:bg-darkaccent/10 border border-sage/20 dark:border-darkaccent/20 rounded-xl">
          <h3 class="text-sm font-bold text-sage dark:text-darkaccent mb-2 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Datos para Transferencia
          </h3>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Banco:</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.transferencia.bank }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Cuenta:</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.transferencia.account }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Cédula/RIF:</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.transferencia.dni }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Titular:</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ sellerPaymentInfo.transferencia.name }}</span>
            </div>
          </div>
        </div>

        <input v-model="formData.bank" type="text" placeholder="Banco de origen (ej. Banesco, BDV)" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700" required />

        <div class="flex gap-2">
          <select v-model="formData.docType" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-20 transition-shadow cursor-pointer font-bold">
            <option value="V">V</option>
            <option value="E">E</option>
            <option value="J">J</option>
            <option value="P">P</option>
          </select>
          <input v-model="formData.docNumber" type="text" placeholder="Número de Documento del titular" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none flex-1 transition-all hover:bg-gray-200 dark:hover:bg-gray-700" required />
        </div>
        
        <input v-model="formData.reference" type="text" placeholder="Número de Referencia" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700" required />

        <label class="flex flex-col gap-2 mt-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Captura de la transferencia (Requerido)</span>
          <div class="relative w-full overflow-hidden rounded-xl border-2 border-dashed border-sage dark:border-darkaccent bg-sage/5 hover:bg-sage/10 dark:bg-darkaccent/10 dark:hover:bg-darkaccent/20 transition-colors duration-200">
            <input type="file" accept="image/*" @change="handleFileUpload" class="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-3 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-sage file:text-white dark:file:bg-darkaccent dark:file:text-darkbg cursor-pointer" required />
          </div>
        </label>

        <button type="submit" :disabled="isSubmitting" class="w-full bg-sage dark:bg-darkaccent text-white dark:text-darkbg py-3.5 rounded-xl font-bold mt-6 active:scale-95 hover:brightness-110 hover:shadow-md transition-all outline-none disabled:opacity-70 disabled:hover:brightness-100 flex items-center justify-center min-h-[52px]">
          <span v-if="!isSubmitting">Reportar Transferencia</span>
          <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </form>

      <div v-if="selectedMethod === 'efectivo'" class="flex flex-col gap-6">
        <div class="p-4 rounded-xl bg-amberwarn/10 border border-amberwarn/50">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-amberwarn shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm text-amberwarn font-medium">
              Instrucciones de pago contra entrega: Por favor, ten el monto exacto al momento de recibir tu pedido. El repartidor no garantiza tener cambio.
            </p>
          </div>
        </div>
        
        <button @click="submitPayment" :disabled="isSubmitting" class="w-full bg-sage dark:bg-darkaccent text-white dark:text-darkbg py-3.5 rounded-xl font-bold active:scale-95 hover:brightness-110 hover:shadow-md transition-all outline-none disabled:opacity-70 disabled:hover:brightness-100 flex items-center justify-center min-h-[52px]">
          <span v-if="!isSubmitting">Confirmar Pedido en Efectivo</span>
          <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>

      <form v-if="selectedMethod === 'otros'" @submit.prevent="submitPayment" class="flex flex-col gap-4">
        <div class="p-4 rounded-xl bg-mist dark:bg-gray-800 border border-transparent dark:border-gray-700 mb-2">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-sage dark:text-darkaccent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Indica qué método de pago deseas utilizar (ej. Binance, Zinli, PayPal). El vendedor te contactará para coordinar.
            </p>
          </div>
        </div>
        
        <input v-model="formData.otherMethodName" type="text" placeholder="Escribe tu método de pago preferido" class="p-3 rounded-xl bg-mist dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-sage dark:focus:ring-darkaccent outline-none w-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700" required />
        
        <button type="submit" :disabled="isSubmitting" class="w-full bg-sage dark:bg-darkaccent text-white dark:text-darkbg py-3.5 rounded-xl font-bold mt-2 active:scale-95 hover:brightness-110 hover:shadow-md transition-all outline-none disabled:opacity-70 disabled:hover:brightness-100 flex items-center justify-center min-h-[52px]">
          <span v-if="!isSubmitting">Continuar con este método</span>
          <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </form>
    </div>
    
  </div>
</template>