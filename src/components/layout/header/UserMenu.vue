<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span
        class="mr-3 flex items-center justify-center rounded-full h-11 w-11 text-white font-medium text-lg"
        :style="{ backgroundColor: avatarColor }"
      >
        {{ userInitials }}
      </span>

      <span class="block mr-2 font-medium text-theme-sm">{{ user?.name || 'کاربر' }} </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="mr-1" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute left-0 mt-[24px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ user?.name || 'کاربر گرامی' }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ user?.email || 'user@example.com' }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <button
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-right"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        {{ t('navigation.logout') }}
      </button>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'

const { t } = useI18n()
const { user, logout } = useAuth()

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

// Fixed avatar color
const avatarColor = '#1D2939'

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: t('navigation.profile') },
  { href: '/settings', icon: SettingsIcon, text: t('navigation.settings') },
  { href: '/support', icon: InfoCircleIcon, text: t('navigation.support') },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  logout()
  closeDropdown()
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && event.target && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
