<template>
  <teleport to="body">
    <transition-group
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
      tag="div"
      class="fixed top-4 right-4 z-999999 space-y-3 pointer-events-none"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto max-w-sm w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border-l-4 p-4 relative overflow-hidden',
          toastStyles[toast.type].border,
        ]"
      >
        <!-- Progress Bar -->
        <div
          v-if="toast.autoClose"
          :class="[
            'absolute top-0 left-0 h-1 transition-all duration-100 ease-linear',
            toastStyles[toast.type].progress,
          ]"
          :style="{ width: `${toast.progress}%` }"
        />

        <div class="flex items-start">
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-3',
              toastStyles[toast.type].iconBg,
            ]"
          >
            <component :is="toastStyles[toast.type].icon" :class="toastStyles[toast.type].iconColor" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4
              v-if="toast.title"
              class="text-sm font-semibold text-gray-900 dark:text-white mb-1"
            >
              {{ toast.title }}
            </h4>
            <p
              v-if="toast.description"
              class="text-sm text-gray-600 dark:text-gray-300"
            >
              {{ toast.description }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

// Icons
const CheckIcon = {
  template: `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `
}

const { toasts, removeToast } = useToast()

const toastStyles = computed(() => ({
  success: {
    border: 'border-l-green-500',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    progress: 'bg-green-500',
    icon: CheckIcon,
  },
  error: {
    border: 'border-l-red-500',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    progress: 'bg-red-500',
    icon: ErrorIcon,
  },
  warning: {
    border: 'border-l-yellow-500',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    progress: 'bg-yellow-500',
    icon: WarningIcon,
  },
  info: {
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    progress: 'bg-blue-500',
    icon: InfoIcon,
  },
}))
</script>
