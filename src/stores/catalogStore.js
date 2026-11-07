import { defineStore } from 'pinia'
import { ref } from 'vue'
import localforage from 'localforage'

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref([])
  const isLoading = ref(false)

  const loadCatalog = async () => {
    isLoading.value = true
    try {
      const mockData = [
        { id: 1, category: 'Comidas', name: 'Torta de Limón (Porción)', price: 4.50, isLowStockAlertActive: false, quantity: 0, imageUrl: '' },
        { id: 2, category: 'Posters', name: 'Póster Jurassic Park', price: 10.00, isLowStockAlertActive: true, quantity: 1, imageUrl: '' },
        { id: 3, category: 'Artesanía', name: 'Collar en Resina', price: 5.00, isLowStockAlertActive: false, quantity: 0, imageUrl: '' },
        { id: 4, category: 'Comidas', name: 'Galletas de Chocolate', price: 3.00, isLowStockAlertActive: true, quantity: 3, imageUrl: '' }
      ]
      
      await new Promise(resolve => setTimeout(resolve, 500))
      products.value = mockData
      await localforage.setItem('catalog_cache', mockData)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return { products, isLoading, loadCatalog }
})