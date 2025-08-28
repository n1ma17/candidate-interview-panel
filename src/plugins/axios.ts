import axios from 'axios'
import cookieManager from '@/utils/cookies'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json, text/plain, */*',
    Pragma: 'no-cache',
  },
  withCredentials: true, // Enable cookies

})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = cookieManager.getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add Origin header only
    config.headers['Origin'] = window.location.origin

    // Ensure correct Content-Type for FormData uploads
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers) {
        // Let the browser set the correct multipart boundary automatically
        delete (config.headers as any)['Content-Type']
      }
    }

    // Debug CORS request
    console.log('🚀 Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      baseURL: config.baseURL
    })

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
      console.error('🚨 CORS Error Details:', {
        code: error.code,
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      })
      return Promise.reject(new Error('خطا در ارتباط با سرور. لطفاً مطمئن شوید که سرور در دسترس است.'))
    }

    const originalRequest = error.config

    // Handle 401 errors and try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Don't redirect for certain endpoints that might fail due to authentication
      const skipRedirectEndpoints = ['/auth/user', 'auth/user']
      const shouldSkipRedirect = skipRedirectEndpoints.some(endpoint =>
        originalRequest.url?.includes(endpoint)
      )

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
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return api(originalRequest)
            }
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }

      // If refresh fails and we should redirect, clear all tokens and redirect to login
      if (!shouldSkipRedirect) {
        cookieManager.removeAllTokens()
        localStorage.removeItem('auth_user')
        window.location.href = '/auth'
      } else {
        console.log('🔄 Skipping redirect for endpoint:', originalRequest.url)
      }
    }

    return Promise.reject(error)
  }
)

export default api
