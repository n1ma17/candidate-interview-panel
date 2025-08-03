import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// User interface
interface User {
  id: string
  email: string
  name: string
}

// Authentication state
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Demo users for testing (in real app, this would come from API)
const DEMO_USERS = [
  { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
  { id: '2', email: 'user@example.com', password: 'user123', name: 'Regular User' },
]

export const useAuth = () => {
  const router = useRouter()

  // Computed properties
  const isAuthenticated = computed(() => user.value !== null)

  // Initialize auth state from localStorage or sessionStorage
  const initAuth = () => {
    // First check localStorage (permanent login)
    let savedUser = localStorage.getItem('auth_user')

    // If not found, check sessionStorage (session-only login)
    if (!savedUser) {
      savedUser = sessionStorage.getItem('auth_user')
    }

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Error parsing saved user data:', e)
        localStorage.removeItem('auth_user')
        sessionStorage.removeItem('auth_user')
      }
    }
  }

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find user in demo users (in real app, this would be API call)
      const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password)

      if (!foundUser) {
        throw new Error('ایمیل یا رمز عبور اشتباه است')
      }

      // Set user data
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      }

      user.value = userData

      // Save based on remember me choice
      if (rememberMe) {
        // Permanent login - save to localStorage
        localStorage.setItem('auth_user', JSON.stringify(userData))
      } else {
        // Session-only login - save to sessionStorage
        sessionStorage.setItem('auth_user', JSON.stringify(userData))
      }

      // Redirect to home page
      router.push('/')

      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'خطا در ورود به سیستم'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_user')
    sessionStorage.removeItem('auth_user')
    router.push('/signin')
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isAuthenticated,

    // Methods
    initAuth,
    login,
    logout,
    clearError
  }
}
