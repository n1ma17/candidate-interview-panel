<template>
  <div class="relative">
    <button
      :id="id"
      @click="toggleDropdown"
      type="button"
      :disabled="disabled"
      :class="[
        'w-full h-11 px-4 py-2.5 text-sm text-left border rounded-lg focus:outline-hidden focus:ring-3 transition-colors flex items-center justify-between',
        buttonClasses,
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
    >
              <span :class="selectedItem ? 'text-gray-900' : 'text-gray-500'">
          {{ displayText }}
        </span>
      <ChevronDownIcon
        class="w-5 h-5 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      :class="[
        'absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar',
        shouldOpenUpward ? 'bottom-full mb-1' : 'top-full mt-1',
      ]"
    >
      <div
        v-for="item in options"
        :key="item.id"
        @click="selectItem(item)"
        class="px-4 py-3 text-sm text-gray-900 cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@/icons'

interface SelectOption {
  id: number | string
  name: string
}

interface Props {
  modelValue: number | string
  options: SelectOption[]
  placeholder?: string
  id?: string
  buttonClasses?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'انتخاب کنید',
  id: 'select-component',
  buttonClasses:
    'text-gray-900 bg-transparent border-gray-100 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | string]
}>()

// Local state
const isOpen = ref(false)

// Computed properties
const selectedItem = computed(() => {
  return props.options.find((item) => item.id === props.modelValue)
})

const displayText = computed(() => {
  if (!selectedItem.value) {
    return props.placeholder
  }
  return selectedItem.value.name
})

const shouldOpenUpward = computed(() => {
  if (typeof window === 'undefined') return false

  const button = document.getElementById(props.id)
  if (!button) return false

  const rect = button.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  // If there's more space above than below, open upward
  return spaceAbove > spaceBelow
})

// Methods
const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectItem = (item: SelectOption) => {
  emit('update:modelValue', item.id)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest(`#${props.id}`)) {
    isOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
