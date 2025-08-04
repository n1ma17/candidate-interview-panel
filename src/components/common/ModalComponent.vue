<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
        @click.self="handleCancel"
      >
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="modelValue"
            class="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl dark:bg-gray-900"
          >
            <!-- Header -->
            <div class="p-6 pb-4">
              <slot name="header" :handleCancel="handleCancel">
                <!-- Default Header -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20"
                    >
                      <svg
                        class="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ title }}
                    </h3>
                  </div>
                  <button
                    @click="handleCancel"
                    class="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </slot>
            </div>

            <!-- Content -->
            <div class="px-6 pb-6">
              <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {{ description }}
              </p>

              <!-- Custom Content Slot -->
              <div class="mt-4">
                <slot name="content" />
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <slot name="footer" :handleConfirm="handleConfirm" :handleCancel="handleCancel">
                <!-- Default Footer -->
                <div v-if="showButtons" class="flex items-center justify-end gap-3">
                  <button
                    @click="handleCancel"
                    class="px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {{ cancelText }}
                  </button>
                  <button
                    @click="handleConfirm"
                    class="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg"
                  >
                    {{ confirmText }}
                  </button>
                </div>
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string,
  showButtons?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'درخواست دسترسی',
  description: 'برای ادامه، نیاز به دسترسی‌های زیر داریم:',
  confirmText: 'اجازه می‌دهم',
  cancelText: 'انصراف',
  showButtons: true,
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// Close modal on Escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    handleCancel()
  }
}

// Add/remove event listener when modal opens/closes
import { watch, onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Prevent body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  },
)
</script>
