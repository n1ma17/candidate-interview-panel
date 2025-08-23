<template>
  <header
    class="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b"
  >
    <div class="flex items-center justify-between w-full px-6 py-4">
      <!-- Logo Section -->
      <div class="flex items-center">
        <img class="dark:hidden h-16" src="/images/logo/logo-en.jpg" alt="Logo" />
        <img class="hidden dark:block h-16" src="/images/logo/logo-en.jpg" alt="Logo" />
      </div>

      <!-- User Section -->
      <div class="flex items-center gap-3">
        <ThemeToggler />
        <div class="flex items-center text-gray-700 dark:text-gray-400">
          <span
            v-if="userData"
            class="ml-3  items-center hidden md:flex justify-center rounded-full h-10 w-10 text-white font-medium text-base"
            style="background-color: #1d2939"
          >
            {{ userInitials }}
          </span>
          <span v-if="userData" class="block font-medium text-theme-sm">
            {{ userDisplayName }}
          </span>
          <span v-else class="block font-medium text-theme-sm">کاربر</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggler from '../common/ThemeToggler.vue'
import { ref, computed, onMounted } from 'vue'

interface UserData {
  pk: number
  email: string
  first_name: string
  last_name: string
}

const userData = ref<UserData | null>(null)

// Compute user initials from first and last name
const userInitials = computed(() => {
  if (!userData.value) return ''
  const first = userData.value.first_name?.charAt(0) || ''
  const last = userData.value.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
})

// Compute display name
const userDisplayName = computed(() => {
  if (!userData.value) return ''
  const firstName = userData.value.first_name || ''
  const lastName = userData.value.last_name || ''
  return `${firstName} ${lastName}`.trim() || userData.value.email.split('@')[0]
})

onMounted(() => {
  // Read user data from localStorage
  try {
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      userData.value = JSON.parse(storedUserData)
      console.log('👤 User data loaded from localStorage:', userData.value)
    }
  } catch (error) {
    console.error('❌ Error reading user data from localStorage:', error)
  }
})
</script>
