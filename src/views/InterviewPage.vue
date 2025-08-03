<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <!-- Controls Section -->
    <div
      class="min-h-fit rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-5"
    >
      <div class="w-full text-center">
        <div class="w-full space-y-4 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <span class="mb-0">{{ controlText }}</span>
            <!-- Recording Indicator -->
            <div v-if="isRecording" class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-red-600 dark:text-red-400 font-medium">در حال ضبط...</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Webcam Preview (Small) -->
            <div v-if="isRecording" class="relative">
              <video
                ref="previewVideo"
                autoplay
                muted
                class="w-24 h-18 bg-gray-900 rounded-lg border-2 border-red-500"
              ></video>
              <div class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>

            <button
              @click="handleMainButton"
              :disabled="isProcessing"
              class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-base font-medium text-white shadow-lg transition-all duration-200 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Section -->
    <div
      :class="[
        'question-box mt-3 min-h-[120px] rounded-2xl border transition-all duration-300 bg-white px-5 py-4 dark:bg-white/[0.03] xl:px-10 xl:py-5',
        isRecording
          ? 'border-red-500 shadow-lg shadow-red-500/20'
          : 'border-gray-200 dark:border-gray-800'
      ]"
    >
      <div class="w-full text-center">
        <div v-if="currentQuestion" class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              سوال {{ currentQuestionIndex + 1 }} از {{ questions.length }}
            </span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full"
                   :class="i <= currentQuestionIndex ? 'bg-primary' : 'bg-gray-300'"
                   v-for="(_, i) in questions"
                   :key="i">
              </div>
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ currentQuestion.title }}
          </h3>

          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ currentQuestion.description }}
          </p>

          <!-- Timer -->
          <div v-if="isRecording" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-red-600 dark:text-red-400 font-mono text-lg">{{ formatTime(recordingTime) }}</span>
            </div>
          </div>
        </div>

        <div v-else class="text-gray-500 dark:text-gray-400">
          مصاحبه تکمیل شد! 🎉
          <div class="mt-4">
            <button
              @click="downloadResults"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              دانلود نتایج
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden video element for recording -->
    <video ref="recordingVideo" style="display: none;"></video>
  </AdminLayout>

  <!-- Permission Modal -->
  <ModalComponent
    v-model="showPermissionModal"
    title="دسترسی به دوربین و میکروفون"
    description="برای شروع مصاحبه، نیاز به دسترسی به دوربین و میکروفون دارید. این دسترسی‌ها برای ضبط و ارزیابی مصاحبه شما استفاده می‌شود."
    confirm-text="اجازه می‌دهم"
    cancel-text="انصراف"
    @confirm="handlePermissionConfirm"
    @cancel="handlePermissionCancel"
  >
    <template #content>
      <!-- Default Permissions List -->
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30"
          >
            <svg
              class="w-4 h-4 text-blue-600 dark:text-blue-400"
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
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">دسترسی به دوربین</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">برای ضبط ویدیو در حین مصاحبه</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <svg
              class="w-4 h-4 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
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
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ModalComponent from '../components/common/ModalComponent.vue'
import { toast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

const currentPageTitle = ref('interview')
const showPermissionModal = ref(false)
const router = useRouter()

// Interview State
const currentQuestionIndex = ref(-1) // -1 means not started
const isRecording = ref(false)
const isProcessing = ref(false)
const recordingTime = ref(0)
const mediaStream = ref<MediaStream | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordingInterval = ref<number | null>(null)

// Video refs
const previewVideo = ref<HTMLVideoElement>()
const recordingVideo = ref<HTMLVideoElement>()

// Data Storage
interface QuestionResponse {
  questionId: number
  questionTitle: string
  videoBlob: Blob | null
  audioBlob: Blob | null
  transcript: string
  duration: number
  timestamp: Date
}

const responses = ref<QuestionResponse[]>([])

onMounted(() => {
  showPermissionModal.value = true
})

onUnmounted(() => {
  // Clean up
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value)
  }
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
  }
})

// Questions Data
const questions = ref([
  {
    id: 1,
    title: 'معرفی شخصی',
    description: 'لطفاً خودتان را معرفی کنید و در مورد تجربه کاری و تحصیلات خود بگویید. (حداکثر 2 دقیقه)'
  },
  {
    id: 2,
    title: 'انگیزه و علاقه',
    description: 'چرا برای این شغل/موقعیت علاقه‌مند هستید و چه چیزی شما را برای این نقش مناسب می‌کند؟ (حداکثر 2 دقیقه)'
  },
  {
    id: 3,
    title: 'تجربه چالش‌برانگیز',
    description: 'در مورد یک چالش یا مشکل دشواری که در کار یا تحصیل با آن مواجه شده‌اید و چگونه آن را حل کردید، بگویید. (حداکثر 3 دقیقه)'
  }
])

// Computed Properties
const currentQuestion = computed(() => {
  if (currentQuestionIndex.value >= 0 && currentQuestionIndex.value < questions.value.length) {
    return questions.value[currentQuestionIndex.value]
  }
  return null
})

const controlText = computed(() => {
  if (currentQuestionIndex.value === -1) {
    return 'در صورت آمادگی روی دکمه شروع بزنید'
  }
  if (isRecording.value) {
    return 'در حال ضبط پاسخ شما...'
  }
  return 'آماده پاسخ دادن به سوال بعدی؟'
})

const buttonText = computed(() => {
  if (currentQuestionIndex.value === -1) {
    return 'شروع مصاحبه'
  }
  if (isRecording.value) {
    return 'پایان پاسخ'
  }
  if (currentQuestionIndex.value < questions.value.length - 1) {
    return 'سوال بعدی'
  }
  return 'پایان مصاحبه'
})

// Timer Functions
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  recordingTime.value = 0
  recordingInterval.value = setInterval(() => {
    recordingTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value)
    recordingInterval.value = null
  }
}

// Main Button Handler
const handleMainButton = async () => {
  if (isProcessing.value) return

  if (currentQuestionIndex.value === -1) {
    // شروع مصاحبه
    await startInterview()
  } else if (isRecording.value) {
    // پایان ضبط سوال فعلی
    await stopRecording()
  } else {
    // شروع سوال بعدی یا پایان مصاحبه
    if (currentQuestionIndex.value < questions.value.length - 1) {
      await nextQuestion()
    } else {
      await finishInterview()
    }
  }
}

// Interview Management
const startInterview = async () => {
  if (!mediaStream.value) {
    toast.error({
      title: 'خطا',
      description: 'دسترسی به دوربین و میکروفون موجود نیست'
    })
    return
  }

  currentQuestionIndex.value = 0
  await startRecording()
}

const nextQuestion = async () => {
  currentQuestionIndex.value++
  await startRecording()
}

const finishInterview = async () => {
  // پایان مصاحبه
  toast.success({
    title: 'مصاحبه تکمیل شد! 🎉',
    description: 'پاسخ‌های شما با موفقیت ذخیره شد.'
  })

  // نمایش آمار
  console.log('Interview Results:', responses.value)

  // Clean up
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }
}

// Recording Functions
const startRecording = async () => {
  if (!mediaStream.value || isRecording.value) return

  try {
    isProcessing.value = true

    // Setup video preview
    if (previewVideo.value) {
      previewVideo.value.srcObject = mediaStream.value
    }

    // Start MediaRecorder with fallback for different browsers
    const chunks: Blob[] = []
    let mimeType = 'video/webm'

    // Try different formats for better browser compatibility
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      mimeType = 'video/webm;codecs=vp9,opus'
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus'
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm'
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4'
    }

    mediaRecorder.value = new MediaRecorder(mediaStream.value, { mimeType })

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    mediaRecorder.value.onstop = () => {
      const videoBlob = new Blob(chunks, { type: mimeType })
      saveQuestionResponse(videoBlob, mimeType)
    }

    mediaRecorder.value.start()
    isRecording.value = true
    startTimer()

    toast.success({
      title: 'ضبط شروع شد',
      description: 'پاسخ خود را ارائه دهید'
    })

  } catch (error) {
    console.error('Recording error:', error)
    toast.error({
      title: 'خطا در شروع ضبط',
      description: 'مشکلی در شروع ضبط پیش آمد'
    })
  } finally {
    isProcessing.value = false
  }
}

const stopRecording = async () => {
  if (!isRecording.value || !mediaRecorder.value) return

  try {
    isProcessing.value = true

    mediaRecorder.value.stop()
    isRecording.value = false
    stopTimer()

    toast.info({
      title: 'ضبط متوقف شد',
      description: 'پاسخ شما ذخیره شد'
    })

  } catch (error) {
    console.error('Stop recording error:', error)
    toast.error({
      title: 'خطا در توقف ضبط',
      description: 'مشکلی در توقف ضبط پیش آمد'
    })
  } finally {
    isProcessing.value = false
  }
}

// Data Management
const saveQuestionResponse = (videoBlob: Blob, mimeType: string) => {
  if (!currentQuestion.value) return

  const response: QuestionResponse = {
    questionId: currentQuestion.value.id,
    questionTitle: currentQuestion.value.title,
    videoBlob: videoBlob,
    audioBlob: null, // Can be extracted from video if needed
    transcript: '', // Can be added later with speech recognition
    duration: recordingTime.value,
    timestamp: new Date()
  }

  responses.value.push(response)
  console.log('Question response saved:', response)
  console.log('Video format:', mimeType)
}

const downloadResults = () => {
  // Create and download a summary file
  const summary = {
    timestamp: new Date(),
    totalQuestions: questions.value.length,
    totalDuration: responses.value.reduce((total, r) => total + r.duration, 0),
    responses: responses.value.map(r => ({
      questionId: r.questionId,
      questionTitle: r.questionTitle,
      duration: r.duration,
      timestamp: r.timestamp,
      hasVideo: !!r.videoBlob,
      hasAudio: !!r.audioBlob
    }))
  }

  const dataStr = JSON.stringify(summary, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `interview-results-${new Date().toISOString().split('T')[0]}.json`
  link.click()

  // Also download individual video files
  responses.value.forEach((response, index) => {
    if (response.videoBlob) {
      const videoLink = document.createElement('a')
      videoLink.href = URL.createObjectURL(response.videoBlob)

      // Determine file extension based on blob type
      let extension = 'webm'
      if (response.videoBlob.type.includes('mp4')) {
        extension = 'mp4'
      }

      videoLink.download = `question-${index + 1}-${response.questionTitle.replace(/\s+/g, '-')}.${extension}`
      videoLink.click()
    }
  })

  toast.success({
    title: 'فایل‌ها دانلود شد',
    description: 'نتایج مصاحبه و ویدیوها دانلود شدند'
  })
}

// Type definition برای Legacy APIs
interface LegacyNavigator extends Navigator {
  getUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void,
  ) => void
  webkitGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void,
  ) => void
  mozGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void,
  ) => void
  msGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: Error) => void,
  ) => void
}
const handlePermissionConfirm = async () => {
  let stream: MediaStream | null = null

  try {
    // تلاش 1: Modern API - navigator.mediaDevices.getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('تلاش با Modern API...')
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
    }
  } catch (error) {
    console.log('Modern API موفق نبود، تلاش با Legacy APIs...', error)
  }

  // تلاش 2: Legacy APIs اگر Modern API کار نکرد
  if (!stream) {
    try {
      const nav = navigator as LegacyNavigator
      const getUserMedia =
        nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia

      if (getUserMedia) {
        console.log('تلاش با Legacy API...')
        stream = await new Promise<MediaStream>((resolve, reject) => {
          getUserMedia.call(
            navigator,
            { video: true, audio: true },
            (mediaStream: MediaStream) => {
              toast.info({
                title: 'دسترسی با روش Legacy',
                description: 'دسترسی با روش سازگاری مرورگرهای قدیمی موفق بود.',
              })
              resolve(mediaStream)
            },
            (error: Error) => reject(error),
          )
        })
      }
    } catch (error) {
      console.log('Legacy API هم موفق نبود', error)
    }
  }

  // بررسی نهایی: آیا موفق شدیم؟
  if (stream) {
    console.log('Media stream obtained:', stream)

    // ذخیره stream برای استفاده در مصاحبه
    mediaStream.value = stream

    // نمایش پیام موفقیت
    toast.success({
      title: 'دسترسی با موفقیت دریافت شد! 🎉',
      description: 'حالا می‌توانید مصاحبه را شروع کنید.',
    })

    // بستن مودال
    showPermissionModal.value = false
  } else {
    // هیچ روشی کار نکرد - نمایش راهنمایی‌های تفصیلی
    console.error('هیچ روشی برای دسترسی به Media موفق نبود')

    // بررسی دقیق‌تر مشکل
    const hasModernAPI = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    const nav = navigator as LegacyNavigator
    const hasLegacyAPI = !!(
      nav.getUserMedia ||
      nav.webkitGetUserMedia ||
      nav.mozGetUserMedia ||
      nav.msGetUserMedia
    )

    if (!hasModernAPI && !hasLegacyAPI) {
      toast.error({
        title: 'مرورگر پشتیبانی نمی‌کند',
        description:
          'این مرورگر از هیچ روش دسترسی به دوربین/میکروفون پشتیبانی نمی‌کند. لطفاً Chrome, Firefox, Edge یا Safari استفاده کنید.',
      })
    } else {
      toast.error({
        title: 'خطا در دریافت دسترسی',
        description:
          'علیرغم تلاش با روش‌های مختلف، دسترسی به دوربین/میکروفون موفق نبود. لطفاً دوربین را وصل کنید و مجددا تلاش کنید.',
      })
    }
  }
}

const handlePermissionCancel = () => {
  toast.info({
    title: 'عملیات لغو شد',
    description: 'درخواست دسترسی لغو شد. می‌توانید مجدداً تلاش کنید.',
  })
  showPermissionModal.value = false
  router.push('/')
}
</script>

<style></style>
