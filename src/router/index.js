import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import MobileFirstLayout from '../layouts/MobileFirstLayout.vue'

const routes = [
  {
    path: '/',
    component: MobileFirstLayout,
    children: [
      {
        path: '',
        name: 'Catalog',
        component: () => import('../pages/catalog/Home.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../pages/checkout/PaymentGateway.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'dashboard',
        name: 'SellerDashboard',
        component: () => import('../pages/dashboard/SellerPanel.vue'),
        meta: { 
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/auth/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } 
  else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Catalog' })
  }
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Catalog' })
  }
  else {
    next()
  }
})

export default router