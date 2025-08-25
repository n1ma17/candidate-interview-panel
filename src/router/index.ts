import { createRouter, createWebHistory } from 'vue-router'
import cookieManager from '@/utils/cookies'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomePage.vue'),
      meta: {
        title: 'eCommerce Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/interview',
      name: 'Interview',
      component: () => import('../views/InterviewPage.vue'),
      meta: {
        title: 'Interview',
        requiresAuth: true,
      },
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../views/Auth/AuthPages.vue'),
      meta: {
        title: 'Authentication',
        guest: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/HomePage.vue'),
      meta: {
        title: 'NotFound',
      },
    },
  ],
})

export default router

// Authentication guard
router.beforeEach((to, from, next) => {


  // Check authentication status (both localStorage and sessionStorage)
  const isAuthenticated = !!(cookieManager.isAuthenticated())

  // If route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
    return
  }

  // If user is authenticated and trying to access guest pages (auth)
  // if (to.meta.guest && isAuthenticated) {
  //   next('/')
  //   return
  // }

  next()
})
