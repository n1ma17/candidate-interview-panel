<template>
  <div class="w-full h-fit lg:w-1/3 lg:h-full p-0 px-3 lg:p-3 lg:p-4 bg-gray-200 dark:bg-gray-800 rounded-[12px] flex flex-col justify-between">
    <div class="w-full h-[calc(100%-60px)] hidden lg:flex flex-col">
      <!-- Notes Display -->
      <div class="flex-1 overflow-y-auto mb-3">
        <div class="space-y-3">
          <!-- Question Display -->
          <div v-if="currentQuestion" class="flex items-start gap-2">
            <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="flex-1 bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
              <p class="text-sm text-gray-900 dark:text-white font-medium">{{ currentQuestion.title }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">{{ currentQuestion.description }}</p>
            </div>
          </div>

          <!-- User Notes -->
          <div v-if="notes.length > 0" class="space-y-2">
            <div v-for="(note, index) in notes" :key="index" class="flex items-start gap-2 justify-end">
              <div class="flex-1 bg-primary text-white rounded-lg p-3 shadow-sm text-right max-w-[80%]">
                <p class="text-sm">{{ note.text }}</p>
                <p class="text-xs opacity-75 mt-1">{{ formatTimestamp(note.timestamp) }}</p>
              </div>
              <div class="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-3 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('chat.noMessages') }}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ t('chat.startTyping') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="w-full h-[60px] flex gap-2 items-center">
      <input
        v-model="noteText"
        :placeholder="t('notes.placeholder')"
        @keyup.enter="sendNote"
        class="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        @click="sendNote"
        :disabled="!noteText.trim()"
        class="flex items-center justify-center w-8 h-8 text-white bg-primary rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// Types
interface Question {
  id: number
  title: string
  description: string
}

interface Note {
  text: string
  timestamp: Date
}

// Props
interface Props {
  currentQuestion: Question | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'note-added': [note: Note]
}>()

// i18n
const { t } = useI18n()

// Local state
const noteText = ref('')
const notes = ref<Note[]>([])


// Methods
const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const sendNote = () => {
  if (!noteText.value.trim()) return

  const newNote: Note = {
    text: noteText.value.trim(),
    timestamp: new Date()
  }

  // Add to local array
  notes.value.push(newNote)

  // Emit to parent
  emit('note-added', newNote)

  // Clear input
  noteText.value = ''
}

// Watch for question changes and clear notes
watch(() => props.currentQuestion, (newQuestion, oldQuestion) => {
  if (newQuestion?.id !== oldQuestion?.id) {
    notes.value = []
  }
})

// Expose methods and data
defineExpose({
  notes,
  addNote: (note: Note) => notes.value.push(note),
  clearNotes: () => notes.value = [],
  getNotes: () => notes.value
})
</script>

<style scoped>
/* Custom scrollbar for notes display */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>
