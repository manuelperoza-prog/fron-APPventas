<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()
const cartStore = useCartStore()
</script>

<template>
  <div class="min-h-screen bg-ivory dark:bg-darkbg text-gray-800 dark:text-gray-100 transition-colors duration-300">
    
    <header class="sticky top-0 z-50 w-full bg-ivory/80 dark:bg-darkbg/80 backdrop-blur-md border-b border-transparent dark:border-gray-800 p-4 md:px-8 flex justify-between items-center shadow-sm dark:shadow-none">
      <h1 class="text-2xl font-semibold tracking-tight">Tienda</h1>
      
      <nav class="hidden md:flex items-center gap-6 mr-auto ml-10">
        <router-link to="/" class="flex items-center gap-2 font-medium transition-colors hover:text-sage dark:hover:text-darkaccent" :class="route.path === '/' ? 'text-sage dark:text-darkaccent' : 'text-gray-500'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Inicio
        </router-link>
        
        <router-link to="/cart" class="flex items-center gap-2 font-medium transition-colors hover:text-sage dark:hover:text-darkaccent relative" :class="route.path === '/cart' ? 'text-sage dark:text-darkaccent' : 'text-gray-500'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          Carrito
          <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-3 bg-amberwarn text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            {{ cartStore.totalItems }}
          </span>
        </router-link>
        
        <router-link to="/dashboard" class="flex items-center gap-2 font-medium transition-colors hover:text-sage dark:hover:text-darkaccent" :class="route.path.includes('/dashboard') ? 'text-sage dark:text-darkaccent' : 'text-gray-500'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Perfil
        </router-link>
      </nav>

      <div class="flex items-center gap-4">
        <button 
          @click="toggleDark()" 
          class="p-2 rounded-full bg-mist dark:bg-gray-700 text-sage dark:text-darkaccent transition-all duration-300 hover:bg-sage/20 dark:hover:bg-gray-600 outline-none"
          title="Alternar tema"
        >
          <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        </button>
      </div>
    </header>

    <main class="w-full max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-12">
      <router-view />
    </main>

    <nav class="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-ivory dark:bg-darkcard shadow-soft dark:shadow-none border border-transparent dark:border-gray-700 rounded-2xl flex justify-around p-2 z-50">
      <router-link to="/" class="flex flex-col items-center p-3 rounded-xl w-16 transition-colors" :class="route.path === '/' ? 'text-sage dark:text-darkaccent bg-mist dark:bg-gray-800' : 'text-moss dark:text-gray-500'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </router-link>
      
      <router-link to="/cart" class="flex flex-col items-center p-3 rounded-xl w-16 transition-colors relative" :class="route.path === '/cart' ? 'text-sage dark:text-darkaccent bg-mist dark:bg-gray-800' : 'text-moss dark:text-gray-500'">
        <div v-if="cartStore.totalItems > 0" class="absolute top-1 right-2 bg-amberwarn text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
          {{ cartStore.totalItems }}
        </div>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      </router-link>
      
      <router-link to="/dashboard" class="flex flex-col items-center p-3 rounded-xl w-16 transition-colors" :class="route.path.includes('/dashboard') ? 'text-sage dark:text-darkaccent bg-mist dark:bg-gray-800' : 'text-moss dark:text-gray-500'">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </router-link>
    </nav>
    
  </div>
</template>