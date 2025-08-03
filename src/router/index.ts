import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/SigninPage.vue'),
      meta: {
        title: 'Signin',
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
  const isAuthenticated = !!(localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user'))

  // If route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/signin')
    return
  }

  // If user is authenticated and trying to access guest pages (signin/signup)
  // if (to.meta.guest && isAuthenticated) {
  //   next('/')
  //   return
  // }

  next()
})
