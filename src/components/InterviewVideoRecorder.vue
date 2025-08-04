<template>
  <div class="w-full">
    <!-- Controls Section -->
    <div class="w-full text-center">
      <div class="w-full space-y-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <button
            @click="handleMainButton"
            :disabled="state.isProcessing"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-base font-medium text-white shadow-lg transition-all duration-200 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="state.isProcessing"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Question Section -->
    <div
              :class="[
          'question-box mt-3 min-h-[120px] rounded-2xl border transition-all duration-300 bg-white px-5 py-4 dark:bg-white/[0.03] xl:px-10 xl:py-5',
          state.isRecording
            ? 'border-red-500 shadow-lg shadow-red-500/20'
            : 'border-gray-200 dark:border-gray-800',
        ]"
    >
      <div class="w-full text-center">
        <div v-if="currentQuestion" class="space-y-4">
          <div class="flex items-center justify-between mb-6">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              سوال {{ state.currentQuestionIndex + 1 }} از {{ questions.length }}
            </span>
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="i <= state.currentQuestionIndex ? 'bg-primary' : 'bg-gray-300'"
                v-for="(_, i) in questions"
                :key="i"
              ></div>
            </div>
          </div>

          <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-2  text-left">
            {{ currentQuestion.description }}
          </h3>

          <!-- Video Display -->
          <div class="relative w-full">
            <div class="relative w-full h-100 bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref="previewVideo"
                autoplay
                muted
                playsinline
                class="absolute inset-0 w-full h-full object-cover"
                :class="[
                  state.isRecording ? 'border-2 border-red-500' : 'border-2 border-gray-300'
                ]"
                @loadedmetadata="() => console.log('Video metadata loaded')"
                @canplay="() => console.log('Video can play')"
                @playing="() => console.log('Video is playing')"
              ></video>
            </div>

            <!-- Recording indicators -->
            <div v-if="state.isRecording" class="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse z-10"></div>
            <div v-if="state.isRecording" class="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium z-10">
              {{ formatTime(state.recordingTime) }}
            </div>

            <!-- Ready indicator -->
            <div v-else-if="state.currentQuestionIndex >= 0" class="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium z-10">
              آماده
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden video element for recording -->
    <video ref="recordingVideo" style="display: none"></video>

    <!-- Permission Modal -->
    <ModalComponent
      v-model="modals.showPermissionModal"
      title="دسترسی به دوربین و میکروفون"
      description="برای شروع مصاحبه، نیاز به دسترسی به دوربین و میکروفون دارید. این دسترسی‌ها برای ضبط و ارزیابی مصاحبه شما استفاده می‌شود."
      confirm-text="اجازه می‌دهم"
      cancel-text="انصراف"
      @confirm="handlePermissionConfirm"
      @cancel="handlePermissionCancel"
    >
      <template #content>
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">دسترسی به دوربین</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">برای ضبط ویدیو در حین مصاحبه</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
              <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">دسترسی به میکروفون</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">برای ضبط صدا در حین مصاحبه</p>
            </div>
          </div>
        </div>
      </template>
    </ModalComponent>

    <!-- Countdown Modal -->
    <ModalComponent
      v-model="modals.showCountdownModal"
      title="آماده‌سازی برای شروع مصاحبه"
      description="لطفاً صبر کنید تا سیستم آماده شود..."
      :show-buttons="false"
    >
      <template #content>
        <div class="flex flex-col items-center justify-center py-8">
          <div class="text-center">
            <div class="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
              {{ modals.countdownTime }}
            </div>
            <p class="text-gray-600 dark:text-gray-300">مصاحبه در حال شروع است...</p>
          </div>
        </div>
      </template>
    </ModalComponent>

    <!-- Waiting Modal -->
    <ModalComponent
      v-model="modals.showWaitingModal"
      title="آماده‌سازی برای سوال بعدی"
      description="لطفاً صبر کنید تا سوال بعدی آماده شود..."
      :show-buttons="false"
    >
      <template #content>
        <div class="flex flex-col items-center justify-center py-8">
          <div class="text-center">
            <div class="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {{ modals.waitingTime }}
            </div>
            <p class="text-gray-600 dark:text-gray-300">سوال بعدی در حال آماده‌سازی است...</p>
          </div>
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ModalComponent from './common/ModalComponent.vue'
import { toast } from '@/composables/useToast'

// Types
interface Question {
  id: number
  title: string
  description: string
}

interface QuestionResponse {
  questionId: number
  questionTitle: string
  questionNumber: number
  videoBlob: Blob | null
  audioBlob: Blob | null
  transcript: string
  duration: number
  timestamp: Date
}

// Props
interface Props {
  questions: Question[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'interview-completed': [responses: QuestionResponse[]]
  'question-answered': [response: QuestionResponse]
}>()

// State Management
const state = ref({
  currentQuestionIndex: -1,
  isRecording: false,
  isProcessing: false,
  recordingTime: 0,
  mediaStream: null as MediaStream | null,
  mediaRecorder: null as MediaRecorder | null,
  recordingInterval: null as number | null,
  recordingChunks: [] as Blob[],
  responses: [] as QuestionResponse[]
})

// Modal States
const modals = ref({
  showPermissionModal: false,
  showCountdownModal: false,
  showWaitingModal: false,
  countdownTime: 5,
  waitingTime: 5
})

// Refs
const previewVideo = ref<HTMLVideoElement>()
const recordingVideo = ref<HTMLVideoElement>()

// Computed Properties
const currentQuestion = computed(() => {
  if (state.value.currentQuestionIndex >= 0 && state.value.currentQuestionIndex < props.questions.length) {
    return props.questions[state.value.currentQuestionIndex]
  }
  return null
})

const buttonText = computed(() => {
  if (state.value.currentQuestionIndex === -1) return 'شروع مصاحبه'
  if (state.value.isRecording) return 'پایان پاسخ'
  if (state.value.currentQuestionIndex < props.questions.length - 1) return 'سوال بعدی'
  return 'پایان مصاحبه'
})

// Utility Functions
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  state.value.recordingTime = 0
  state.value.recordingInterval = setInterval(() => {
    state.value.recordingTime++
  }, 1000)
}

const stopTimer = () => {
  if (state.value.recordingInterval) {
    clearInterval(state.value.recordingInterval)
    state.value.recordingInterval = null
  }
}

// Media Stream Management
const getMediaStream = async (): Promise<MediaStream | null> => {
  try {
    // Try modern API
    if (navigator.mediaDevices?.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    }
  } catch (error) {
    console.log('Modern API failed, trying legacy...', error)
  }

  // Try legacy APIs
  try {
    const nav = navigator as Navigator & {
      getUserMedia?: (constraints: MediaStreamConstraints, success: (stream: MediaStream) => void, error: (error: Error) => void) => void
      webkitGetUserMedia?: (constraints: MediaStreamConstraints, success: (stream: MediaStream) => void, error: (error: Error) => void) => void
      mozGetUserMedia?: (constraints: MediaStreamConstraints, success: (stream: MediaStream) => void, error: (error: Error) => void) => void
      msGetUserMedia?: (constraints: MediaStreamConstraints, success: (stream: MediaStream) => void, error: (error: Error) => void) => void
    }
    const getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia

    if (getUserMedia) {
      return new Promise<MediaStream>((resolve, reject) => {
        getUserMedia.call(navigator, { video: true, audio: true }, resolve, reject)
      })
    }
  } catch (error) {
    console.log('Legacy API also failed', error)
  }

  return null
}

// Video Management
const setupVideoPreview = async (stream: MediaStream): Promise<boolean> => {
  if (!previewVideo.value) return false

  try {
    console.log('Setting up video preview with stream:', stream)

    // Clear any existing stream
    if (previewVideo.value.srcObject) {
      previewVideo.value.srcObject = null
    }

    // Set new stream
    previewVideo.value.srcObject = stream

    // Wait a bit for the stream to be ready
    await new Promise(resolve => setTimeout(resolve, 300))

    // Check if video element is ready
    if (previewVideo.value.readyState >= 2) {
      console.log('Video is ready to play')
    }

    // Set video properties for better display
    previewVideo.value.style.width = '100%'
    previewVideo.value.style.height = '100%'
    previewVideo.value.style.objectFit = 'cover'

    // Try to play the video
    try {
      await previewVideo.value.play()
      console.log('Video started playing successfully')
    } catch (playError) {
      console.log('Auto-play failed, but video should still work:', playError)
      // Force play on user interaction
      previewVideo.value.play().catch(e => console.log('Manual play also failed:', e))
    }

    return true
  } catch (error) {
    console.error('Error setting up video preview:', error)
    return false
  }
}

// Recording Management
const startRecording = async () => {
  if (!state.value.mediaStream || state.value.isRecording) return

  try {
    state.value.isProcessing = true
    state.value.recordingChunks = []

    // Setup video preview - ensure it's working
    const videoSetupSuccess = await setupVideoPreview(state.value.mediaStream)
    if (!videoSetupSuccess) {
      console.warn('Video preview setup failed, but continuing with recording')
    }

    // Create MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4'

    state.value.mediaRecorder = new MediaRecorder(state.value.mediaStream, { mimeType })

    state.value.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        state.value.recordingChunks.push(event.data)
      }
    }

    state.value.mediaRecorder.onstop = () => {
      const videoBlob = new Blob(state.value.recordingChunks, { type: mimeType })
      saveQuestionResponse(videoBlob)
    }

    state.value.mediaRecorder.start(1000)
    state.value.isRecording = true
    startTimer()

    toast.success({
      title: 'ضبط شروع شد',
      description: 'پاسخ خود را ارائه دهید',
    })
  } catch (error) {
    console.error('Recording error:', error)
    toast.error({
      title: 'خطا در شروع ضبط',
      description: 'مشکلی در شروع ضبط پیش آمد',
    })
  } finally {
    state.value.isProcessing = false
  }
}

const stopRecording = async () => {
  if (!state.value.isRecording) return

  try {
    state.value.isProcessing = true

    if (state.value.mediaRecorder?.state === 'recording') {
      state.value.mediaRecorder.stop()
    }

    state.value.isRecording = false
    stopTimer()

    await new Promise(resolve => setTimeout(resolve, 500))

    toast.success({
      title: 'ضبط متوقف شد',
      description: 'پاسخ شما ذخیره شد',
    })

    if (state.value.currentQuestionIndex >= props.questions.length - 1) {
      await finishInterview()
    } else {
      modals.value.showWaitingModal = true
      startWaitingCountdown()
    }
  } catch (error) {
    console.error('Stop recording error:', error)
    toast.error({
      title: 'خطا در توقف ضبط',
      description: 'مشکلی در توقف ضبط پیش آمد',
    })
  } finally {
    state.value.isProcessing = false
  }
}

// Data Management
const saveQuestionResponse = (videoBlob: Blob) => {
  if (!currentQuestion.value) return

  const response: QuestionResponse = {
    questionId: currentQuestion.value.id,
    questionTitle: currentQuestion.value.title,
    questionNumber: state.value.currentQuestionIndex + 1,
    videoBlob: videoBlob,
    audioBlob: null,
    transcript: '',
    duration: state.value.recordingTime,
    timestamp: new Date(),
  }

  state.value.responses.push(response)
  emit('question-answered', response)
}

// Interview Flow
const startInterview = async (stream: MediaStream) => {
  state.value.mediaStream = stream
  state.value.currentQuestionIndex = 0

  // Setup video preview first
  await setupVideoPreview(stream)

  await startRecording()
}

const nextQuestion = async () => {
  state.value.currentQuestionIndex++

  if (state.value.currentQuestionIndex < props.questions.length) {
    // Ensure video preview is set up for the new question
    if (state.value.mediaStream) {
      await setupVideoPreview(state.value.mediaStream)
    }
    await startRecording()
  } else {
    await finishInterview()
  }
}

const finishInterview = async () => {
  toast.success({
    title: 'مصاحبه تکمیل شد! 🎉',
    description: 'پاسخ‌های شما با موفقیت ذخیره شد.',
  })

  // Clean up
  if (state.value.mediaStream) {
    state.value.mediaStream.getTracks().forEach(track => track.stop())
    state.value.mediaStream = null
  }

  emit('interview-completed', state.value.responses)
}

// Main Button Handler
const handleMainButton = async () => {
  if (state.value.isProcessing) return

  if (state.value.currentQuestionIndex === -1) {
    modals.value.showPermissionModal = true
  } else if (state.value.isRecording) {
    await stopRecording()
  } else {
    if (state.value.currentQuestionIndex < props.questions.length - 1) {
      await nextQuestion()
    } else {
      await finishInterview()
    }
  }
}

// Permission Handling
const handlePermissionConfirm = async () => {
  const stream = await getMediaStream()

  if (stream) {
    toast.success({
      title: 'دسترسی با موفقیت دریافت شد! 🎉',
      description: 'آماده‌سازی برای شروع مصاحبه...',
    })
    modals.value.showPermissionModal = false
    modals.value.showCountdownModal = true
    startCountdown(stream)
  } else {
    toast.error({
      title: 'خطا در دریافت دسترسی',
      description: 'لطفاً دوربین را وصل کنید و مجددا تلاش کنید.',
    })
  }
}

const handlePermissionCancel = () => {
  toast.warning({
    title: 'دسترسی لغو شد',
    description: 'برای شروع مصاحبه نیاز به دسترسی به دوربین و میکروفون دارید.',
  })
  modals.value.showPermissionModal = false
}

// Countdown Functions
const startCountdown = (stream: MediaStream) => {
  modals.value.countdownTime = 5

  const countdownInterval = setInterval(() => {
    modals.value.countdownTime--

    if (modals.value.countdownTime <= 0) {
      clearInterval(countdownInterval)
      modals.value.showCountdownModal = false
      startInterview(stream)
    }
  }, 1000)
}

const startWaitingCountdown = () => {
  modals.value.waitingTime = 3

  const waitingInterval = setInterval(() => {
    modals.value.waitingTime--

    if (modals.value.waitingTime <= 0) {
      clearInterval(waitingInterval)
      modals.value.showWaitingModal = false
      nextQuestion()
    }
  }, 1000)
}

// Lifecycle
onMounted(() => {
  console.log('InterviewVideoRecorder mounted')
})

onUnmounted(() => {
  if (state.value.recordingInterval) {
    clearInterval(state.value.recordingInterval)
  }
  if (state.value.mediaStream) {
    state.value.mediaStream.getTracks().forEach(track => track.stop())
  }
})

// Debug function to check video status
const checkVideoStatus = () => {
  if (previewVideo.value) {
    console.log('Video status:', {
      srcObject: !!previewVideo.value.srcObject,
      readyState: previewVideo.value.readyState,
      paused: previewVideo.value.paused,
      currentTime: previewVideo.value.currentTime,
      videoWidth: previewVideo.value.videoWidth,
      videoHeight: previewVideo.value.videoHeight
    })
  }
}

// Expose methods
defineExpose({
  startInterview,
  checkVideoStatus
})
</script>

<style></style>



