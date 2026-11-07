<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCatalogStore } from '../../stores/catalogStore'
import ProductCard from '../../components/catalog/ProductCard.vue'

const catalogStore = useCatalogStore()
const categorias = ref(['Todo', 'Comidas', 'Posters', 'Artesanía'])
const categoriaActiva = ref('Todo')

const productosFiltrados = computed(() => {
  if (categoriaActiva.value === 'Todo') return catalogStore.products
  return catalogStore.products.filter(p => p.category === categoriaActiva.value)
})

onMounted(() => {
  catalogStore.loadCatalog()
})
</script>

<template>
  <div class="flex flex-col gap-5 mt-2">
    <div class="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
      <button 
        v-for="cat in categorias" 
        :key="cat" 
        @click="categoriaActiva = cat"
        class="shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all outline-none" 
        :class="categoriaActiva === cat ? 'bg-sage dark:bg-darkaccent text-white dark:text-darkbg shadow-soft dark:shadow-none' : 'bg-mist dark:bg-darkcard text-sage dark:text-gray-300 hover:bg-sage/20 dark:hover:bg-gray-700'"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="catalogStore.isLoading && catalogStore.products.length === 0" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-sage" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      <ProductCard 
        v-for="product in productosFiltrados" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>