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
            class="ml-3 flex items-center justify-center rounded-full h-10 w-10 text-white font-medium text-base"
            style="background-color: #1d2939"
          >
            {{ userInitials }}
          </span>
          <span class="block font-medium text-theme-sm">{{ user?.name || 'کاربر' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import ThemeToggler from '../common/ThemeToggler.vue'

const { user } = useAuth()

// Computed property for user initials
const userInitials = computed(() => {
  if (!user.value?.name) return 'کا' // Default Persian initials for "کاربر"

  const name = user.value.name.trim()
  const words = name.split(' ')

  if (words.length >= 2) {
    // Get first letter of first and last name
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  } else {
    // Get first two letters of single name
    return name.substring(0, 2).toUpperCase()
  }
})
</script>
