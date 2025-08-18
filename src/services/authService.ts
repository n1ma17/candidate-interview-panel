import api from '@/plugins/axios'
import cookieManager from '@/utils/cookies'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password1: string
  password2: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
  }
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Error type for API responses
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

class AuthService {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('auth/login/', credentials)

      if (response.data.success && response.data.data) {
        // Set tokens in cookies
        cookieManager.setAccessToken(response.data.data.access_token, 15) // 15 minutes
        cookieManager.setRefreshToken(response.data.data.refresh_token, 7) // 7 days
      }

      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در ورود به سیستم'
      const apiError = (error as ApiError)?.response?.data?.message
      return {
        success: false,
        error: apiError || errorMessage
      }
    }
  }

  // Register
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('auth/registration/', userData)

      if (response.data.success && response.data.data) {
        // Set tokens in cookies
        cookieManager.setAccessToken(response.data.data.access_token, 15) // 15 minutes
        cookieManager.setRefreshToken(response.data.data.refresh_token, 7) // 7 days
      }

      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در ثبت نام'
      const apiError = (error as ApiError)?.response?.data?.message
      return {
        success: false,
        error: apiError || errorMessage
      }
    }
  }

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    try {
      // Clear tokens from cookies
      cookieManager.removeAllTokens()

      return { success: true }
    } catch (error: unknown) {
      // Even if logout fails, clear local tokens
      cookieManager.removeAllTokens()

      const errorMessage = error instanceof Error ? error.message : 'خطا در خروج از سیستم'
      const apiError = (error as ApiError)?.response?.data?.message
      return {
        success: false,
        error: apiError || errorMessage
      }
    }
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
    try {
      const response = await api.get<ApiResponse<AuthResponse['user']>>('/auth/me')
      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در دریافت اطلاعات کاربر'
      const apiError = (error as ApiError)?.response?.data?.message
      return {
        success: false,
        error: apiError || errorMessage
      }
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    try {
      const refreshToken = cookieManager.getRefreshToken()

      if (!refreshToken) {
        throw new Error('Refresh token not found')
      }

      const response = await api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', {
        refresh_token: refreshToken
      })

      if (response.data.success && response.data.data) {
        // Update tokens in cookies
        cookieManager.setAccessToken(response.data.data.access_token, 15) // 15 minutes
        cookieManager.setRefreshToken(response.data.data.refresh_token, 7) // 7 days
      }

      return response.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در تمدید توکن'
      const apiError = (error as ApiError)?.response?.data?.message
      return {
        success: false,
        error: apiError || errorMessage
      }
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return cookieManager.isAuthenticated()
  }

  // Get access token expiration
  getAccessTokenExpiration(): Date | null {
    return cookieManager.getAccessTokenExpiration()
  }

  // Get refresh token expiration
  getRefreshTokenExpiration(): Date | null {
    return cookieManager.getRefreshTokenExpiration()
  }
}

export default new AuthService()
