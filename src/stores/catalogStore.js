import { defineStore } from 'pinia'
import { ref } from 'vue'
import localforage from 'localforage'
import api from '../api/axios'

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref([])
  const isLoading = ref(false)

  const loadCatalog = async () => {
    isLoading.value = true
    try {
      const cachedData = await localforage.getItem('catalog_cache')
      if (cachedData) {
        products.value = cachedData
      }

      const response = await api.get('/catalog')
      products.value = response.data
      await localforage.setItem('catalog_cache', response.data)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return { products, isLoading, loadCatalog }
})