import { ref, nextTick } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  description?: string
  autoClose: boolean
  duration: number
  progress: number
  timer?: NodeJS.Timeout
  progressTimer?: NodeJS.Timeout
}

export interface ToastOptions {
  title?: string
  description?: string
  autoClose?: boolean
  duration?: number
}

// Global toast state
const toasts = ref<Toast[]>([])

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Remove toast
const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    const toast = toasts.value[index]
    // Clear timers
    if (toast.timer) clearTimeout(toast.timer)
    if (toast.progressTimer) clearInterval(toast.progressTimer)

    toasts.value.splice(index, 1)
  }
}

// Add toast with progress animation
const addToast = (type: ToastType, options: ToastOptions = {}) => {
  const {
    title = '',
    description = '',
    autoClose = true,
    duration = 5000
  } = options

  const toast: Toast = {
    id: generateId(),
    type,
    title,
    description,
    autoClose,
    duration,
    progress: 100
  }

  toasts.value.push(toast)

  if (autoClose) {
    // Progress bar animation
    let progressValue = 100
    const progressStep = 100 / (duration / 50) // Update every 50ms

    toast.progressTimer = setInterval(() => {
      progressValue -= progressStep
      toast.progress = Math.max(0, progressValue)

      if (progressValue <= 0) {
        if (toast.progressTimer) clearInterval(toast.progressTimer)
      }
    }, 50)

    // Auto remove after duration
    toast.timer = setTimeout(() => {
      removeToast(toast.id)
    }, duration)
  }

  return toast.id
}

// Clear all toasts
const clearAll = () => {
  toasts.value.forEach(toast => {
    if (toast.timer) clearTimeout(toast.timer)
    if (toast.progressTimer) clearInterval(toast.progressTimer)
  })
  toasts.value = []
}

// Toast methods
const success = (options: ToastOptions) => addToast('success', options)
const error = (options: ToastOptions) => addToast('error', options)
const warning = (options: ToastOptions) => addToast('warning', options)
const info = (options: ToastOptions) => addToast('info', options)

// Pause toast on hover
const pauseToast = (id: string) => {
  const toast = toasts.value.find(t => t.id === id)
  if (toast?.timer) {
    clearTimeout(toast.timer)
    if (toast.progressTimer) clearInterval(toast.progressTimer)
  }
}

// Resume toast
const resumeToast = (id: string) => {
  const toast = toasts.value.find(t => t.id === id)
  if (toast && toast.autoClose) {
    const remainingTime = (toast.progress / 100) * toast.duration

    // Resume progress animation
    let progressValue = toast.progress
    const progressStep = toast.progress / (remainingTime / 50)

    toast.progressTimer = setInterval(() => {
      progressValue -= progressStep
      toast.progress = Math.max(0, progressValue)

      if (progressValue <= 0) {
        if (toast.progressTimer) clearInterval(toast.progressTimer)
      }
    }, 50)

    // Resume auto remove
    toast.timer = setTimeout(() => {
      removeToast(toast.id)
    }, remainingTime)
  }
}

export function useToast() {
  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    pauseToast,
    resumeToast,
    success,
    error,
    warning,
    info
  }
}

// Global toast instance for easy access
export const toast = {
  success,
  error,
  warning,
  info,
  clear: clearAll
}
