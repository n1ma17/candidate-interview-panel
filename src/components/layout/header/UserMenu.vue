<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span
        v-if="userData"
        class="mr-3 flex items-center justify-center rounded-full h-9 w-9 text-white font-medium text-xs"
        :style="{ backgroundColor: avatarColor }"
      >
        {{ userInitials }}
      </span>

      <span v-if="userData" class="block mr-2 font-medium text-theme-sm">
        {{ userDisplayName }}
      </span>
      <span v-else class="block mr-2 font-medium text-theme-sm">کاربر</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="mr-1" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute left-0 mt-[24px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span v-if="userData" class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userDisplayName }}
        </span>
        <span v-if="userData" class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userData.email }}
        </span>
        <span v-else class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          کاربر
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <div
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-400 rounded-lg group text-theme-sm cursor-not-allowed dark:text-gray-600"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-400 dark:text-gray-600"
            />
            {{ item.text }}
          </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthQuery } from '@/composables/useAuthQuery'

const { t } = useI18n()
const { logout } = useAuthQuery()

interface UserData {
  pk: number
  email: string
  first_name: string
  last_name: string
}

const userData = ref<UserData | null>(null)

// Fixed avatar color
const avatarColor = '#1D2939'

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
  // Read user data from localStorage
  try {
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      userData.value = JSON.parse(storedUserData)
      console.log('👤 User data loaded in UserMenu from localStorage:', userData.value)
    }
  } catch (error) {
    console.error('❌ Error reading user data from localStorage in UserMenu:', error)
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
