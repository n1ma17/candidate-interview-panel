import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import authService, {
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from '@/services/authService'
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
      console.log('🎯 Login response structure:', response)
      const responseData = response as unknown as {
        user?: unknown
        access?: unknown
        refresh_token?: unknown
        data?: { user?: unknown; access?: unknown; refresh_token?: unknown }
      }
      const userData = responseData.user || responseData.data?.user || responseData
      const accessToken = responseData.access || responseData.data?.access
      const refreshToken = responseData.refresh_token || responseData.data?.refresh_token
      if (userData && accessToken && typeof accessToken === 'string') {
        user.value = userData as AuthResponse['user']
        localStorage.setItem('auth_user', JSON.stringify(userData))
        // Set tokens in cookies
        cookieManager.setAccessToken(accessToken, 15)
        if (refreshToken && typeof refreshToken === 'string')
          cookieManager.setRefreshToken(refreshToken, 7)

        error.value = null
        router.push('/')
      }
    },
    onError: (err: Error) => {
      error.value = err.message || 'خطا در ورود به سیستم3'
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (response) => {
      console.log('🎯 Register response structure:', response)



      // Check if user data is directly in response or in nested structure
      const responseData = response as unknown as {
        user?: unknown
        access?: unknown
        refresh_token?: unknown
        data?: { user?: unknown; access?: unknown; refresh_token?: unknown }
      }
      const userData = responseData.user || responseData.data?.user || responseData
      const accessToken = responseData.access || responseData.data?.access
      const refreshToken = responseData.refresh_token || responseData.data?.refresh_token

      if (userData && accessToken && typeof accessToken === 'string') {
        user.value = userData as AuthResponse['user']
        localStorage.setItem('auth_user', JSON.stringify(userData))

        // Set tokens in cookies
        cookieManager.setAccessToken(accessToken, 15)
        if (refreshToken && typeof refreshToken === 'string')
          cookieManager.setRefreshToken(refreshToken, 7)

        error.value = null
        router.push('/')
      } else {
        error.value = 'اطلاعات کاربر یا توکن در دسترس نیست'
      }
    },
    onError: (err: Error) => {
      error.value = err.message || 'خطا در ثبت نام'
    },
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
    },
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
  watch(
    () => currentUser.value,
    (response) => {
      if (response && !response.success) {
        // If getting user fails, clear auth state
        user.value = null
        localStorage.removeItem('auth_user')
        cookieManager.removeAllTokens()
      }
    },
  )

  // Login function
  const login = async (username: string, password: string) => {
    error.value = null
    return loginMutation.mutate({ username, password })
  }

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    position?: number,
    resume?: File,
  ) => {
    error.value = null

    return registerMutation.mutate({
      username: name,
      email,
      password1: password,
      password2: confirmPassword,
      position,
      resume,
    })
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
    isLoading: computed(
      () =>
        loginMutation.isPending.value ||
        registerMutation.isPending.value ||
        logoutMutation.isPending.value,
    ),
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
    getRefreshTokenExpiration,
  }
}
