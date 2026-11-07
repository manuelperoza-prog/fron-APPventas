<script setup>
import { computed } from 'vue'
import { useCartStore } from '../../stores/cartStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const isLowStock = computed(() => props.product.isLowStockAlertActive)
const quantity = computed(() => props.product.quantity || 0)

const handleAddToCart = () => {
  cartStore.addItem(props.product)
}
</script>

<template>
  <div class="bg-ivory dark:bg-darkcard rounded-2xl p-3 shadow-soft dark:shadow-none border border-transparent dark:border-gray-700 flex flex-col transition-all">
    
    <div class="h-32 bg-mist dark:bg-gray-700 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
      <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
      <svg v-else class="w-8 h-8 text-sage/50 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
    
    <div class="flex flex-col flex-1">
      <h2 class="text-sm font-medium leading-snug mb-1">{{ product.name }}</h2>
      <p class="text-sage dark:text-darkaccent font-semibold mb-3">${{ product.price.toFixed(2) }}</p>
      
      <div class="mt-auto">
        <div v-if="isLowStock" class="flex justify-between items-center bg-amberwarn/10 text-amberwarn text-[10px] uppercase tracking-wide font-bold px-3 py-1.5 rounded-lg mb-3">
          <span>Quedan</span>
          <span>{{ quantity }} unds</span>
        </div>
        
        <button 
          @click="handleAddToCart"
          class="w-full bg-mist dark:bg-gray-700 text-sage dark:text-gray-200 hover:bg-sage hover:text-white dark:hover:bg-darkaccent dark:hover:text-darkbg transition-colors py-2.5 rounded-xl text-sm font-semibold outline-none active:scale-95"
        >
          Comprar
        </button>
      </div>
    </div>
  </div>
</template>