import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService, {
  type LoginRequest,
  type RegisterRequest,
} from '@/services/authService'
import cookieManager from '@/utils/cookies'

export const useAuthQuery = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // State
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => cookieManager.isAuthenticated())



  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response) => {
      console.log('🎯 Login response structure:', response)
      const responseData = response as unknown as {
        access?: unknown
        refresh_token?: unknown
        data?: { access?: unknown; refresh_token?: unknown }
      }
      const accessToken = responseData.access || responseData.data?.access
      const refreshToken = responseData.refresh_token || responseData.data?.refresh_token
      if (accessToken && typeof accessToken === 'string') {
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



      // Check if response has access token
      const responseData = response as unknown as {
        access?: unknown
        refresh_token?: unknown
        data?: { access?: unknown; refresh_token?: unknown }
      }
      const accessToken = responseData.access || responseData.data?.access
      const refreshToken = responseData.refresh_token || responseData.data?.refresh_token

      if (accessToken && typeof accessToken === 'string') {
        // Set tokens in cookies
        cookieManager.setAccessToken(accessToken, 15)
        if (refreshToken && typeof refreshToken === 'string')
          cookieManager.setRefreshToken(refreshToken, 7)

        error.value = null
        router.push('/')
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
      cookieManager.removeAllTokens()
      queryClient.clear()
      router.push('/auth')
    },
    onError: () => {
      // Even if logout fails, clear local state
      cookieManager.removeAllTokens()
      queryClient.clear()
      router.push('/auth')
    },
  })



  // Login function
  const login = async (email: string, password: string) => {
    error.value = null
    return loginMutation.mutate({ email, password })
  }

  // Register function
  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
    job_category?: number,
    resume?: File,
  ) => {
    error.value = null

    return registerMutation.mutate({
      email,
      password1: password,
      password2: confirmPassword,
      job_category,
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
    isLoading: computed(
      () =>
        loginMutation.isPending.value ||
        registerMutation.isPending.value ||
        logoutMutation.isPending.value,
    ),
    error: computed(() => error.value),
    isAuthenticated,

    // Methods
    login,
    register,
    logout,
    clearError,
    getAccessTokenExpiration,
    getRefreshTokenExpiration,
  }
}
