import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const setAuth = (userData, authToken) => {
    user.value = {
      phone: '',
      docType: 'V',
      docNumber: '',
      ...userData
    }
    token.value = authToken
  }

  const updateUser = (data) => {
    if (user.value) {
      user.value = { ...user.value, ...data }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    setAuth,
    updateUser,
    logout
  }
}, {
  persist: true
})