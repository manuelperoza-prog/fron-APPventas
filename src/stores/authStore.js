import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/axios'

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

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    setAuth(response.data.user, response.data.token)
    return response
  }

  const register = async (data) => {
    const response = await api.post('/auth/register', data)
    setAuth(response.data.user, response.data.token)
    return response
  }

  const updateUser = async (data) => {
    const response = await api.put('/users/profile', data)
    if (user.value) {
      user.value = { ...user.value, ...response.data }
    }
    return response
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
    login,
    register,
    updateUser,
    logout
  }
}, {
  persist: true
})