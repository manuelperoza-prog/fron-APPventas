import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  // Utiliza una variable de entorno, o por defecto el puerto 8080 de Spring Boot
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de peticiones (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    // Si hay un token guardado en Pinia, lo inyecta en la cabecera Authorization
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de respuestas (Response Interceptor) - Opcional pero recomendado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend responde con 401 (No autorizado) o 403 (Prohibido), cerramos sesión
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const authStore = useAuthStore()
      authStore.logout()
      // Opcional: Redirigir al login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api