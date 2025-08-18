import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import authService, { type LoginRequest, type RegisterRequest, type AuthResponse } from '@/services/authService'
import cookieManager from '@/utils/cookies'

export const useAuthQuery = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // State
  const user = ref<AuthResponse['user'] | null>(null)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => cookieManager.isAuthenticated())

  // Initialize auth state from cookies and localStorage
  const initAuth = () => {
    const savedUser = localStorage.getItem('auth_user')

    if (savedUser && cookieManager.isAuthenticated()) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Error parsing saved user data:', e)
        localStorage.removeItem('auth_user')
        cookieManager.removeAllTokens()
      }
    }
  }

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        user.value = response.data.user
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        error.value = null
        router.push('/')
      } else {
        error.value = response.error || 'خطا در ورود به سیستم'
      }
    },
    onError: (err: Error) => {
      error.value = err.message || 'خطا در ورود به سیستم'
    }
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        user.value = response.data.user
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        error.value = null
        router.push('/')
      } else {
        error.value = response.error || 'خطا در ثبت نام'
      }
    },
    onError: (err: Error) => {
      error.value = err.message || 'خطا در ثبت نام'
    }
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      user.value = null
      localStorage.removeItem('auth_user')
      cookieManager.removeAllTokens()
      queryClient.clear()
      router.push('/signin')
    },
    onError: () => {
      // Even if logout fails, clear local state
      user.value = null
      localStorage.removeItem('auth_user')
      cookieManager.removeAllTokens()
      queryClient.clear()
      router.push('/signin')
    }
  })

  // Get current user query
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: cookieManager.isAuthenticated(),
  })

  // Watch for query data changes
  watch(currentUser, (response) => {
    if (response?.success && response.data) {
      user.value = response.data
      localStorage.setItem('auth_user', JSON.stringify(response.data))
    }
  })

  // Watch for query errors
  watch(() => currentUser.value, (response) => {
    if (response && !response.success) {
      // If getting user fails, clear auth state
      user.value = null
      localStorage.removeItem('auth_user')
      cookieManager.removeAllTokens()
    }
  })

  // Login function
  const login = async (username: string, password: string) => {
    error.value = null
    return loginMutation.mutate({ username, password })
  }

  // Register function
  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    error.value = null
    return registerMutation.mutate({ username: name, email, password1: password, password2: confirmPassword })
  }

  // Logout function
  const logout = () => {
    logoutMutation.mutate()
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Get token expiration info
  const getAccessTokenExpiration = () => cookieManager.getAccessTokenExpiration()
  const getRefreshTokenExpiration = () => cookieManager.getRefreshTokenExpiration()

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => loginMutation.isPending.value || registerMutation.isPending.value || logoutMutation.isPending.value),
    isLoadingUser: computed(() => isLoadingUser.value),
    error: computed(() => error.value),
    isAuthenticated,

    // Methods
    initAuth,
    login,
    register,
    logout,
    clearError,
    getAccessTokenExpiration,
    getRefreshTokenExpiration
  }
}
