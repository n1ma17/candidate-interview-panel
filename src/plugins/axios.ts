import axios from 'axios'
import cookieManager from '@/utils/cookies'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  },
  withCredentials: true, // Enable cookies
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = cookieManager.getAccessToken()

    if (token) {
      config.headers.Authorization = `JWT ${token}`
    }

    // Add CORS headers
    config.headers['Origin'] = window.location.origin
    config.headers['Access-Control-Allow-Origin'] = '*'

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS Error:', error.message)
      return Promise.reject(new Error('خطا در ارتباط با سرور. لطفاً مطمئن شوید که سرور در دسترس است.'))
    }

    const originalRequest = error.config

    // Handle 401 errors and try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = cookieManager.getRefreshToken()

        if (refreshToken && !cookieManager.isRefreshTokenExpired()) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refresh_token: refreshToken },
            { withCredentials: true }
          )

          if (response.data.success && response.data.data) {
            // Set new tokens
            cookieManager.setAccessToken(response.data.data.access_token, 15) // 15 minutes
            cookieManager.setRefreshToken(response.data.data.refresh_token, 7) // 7 days

            // Retry original request with new token
            const newToken = cookieManager.getAccessToken()
            if (newToken) {
              originalRequest.headers.Authorization = `JWT ${newToken}`
              return api(originalRequest)
            }
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }

      // If refresh fails, clear all tokens and redirect to login
      cookieManager.removeAllTokens()
      localStorage.removeItem('auth_user')
      window.location.href = '/signin'
    }

    return Promise.reject(error)
  }
)

export default api
