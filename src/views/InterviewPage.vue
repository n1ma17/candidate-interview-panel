<template>
  <FullScreenLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" disabled />

    <!-- Interview Video Recorder Component -->
    <InterviewVideoRecorder
      ref="videoRecorderRef"
      :questions="questions"
      @question-answered="handleQuestionAnswered"
      @interview-completed="handleInterviewCompleted"
    />
  </FullScreenLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import InterviewVideoRecorder from '@/components/InterviewVideoRecorder.vue'
import { useRouter } from 'vue-router'

const currentPageTitle = ref('interview')
const router = useRouter()

// Component ref
const videoRecorderRef = ref()

// Questions Data
const questions = ref([
  {
    id: 1,
    title: 'معرفی شخصی',
    description:
      'لطفاً خودتان را معرفی کنید و در مورد تجربه کاری و تحصیلات خود بگویید. (حداکثر 2 دقیقه)',
  },
  {
    id: 2,
    title: 'انگیزه و علاقه',
    description:
      'چرا برای این شغل/موقعیت علاقه‌مند هستید و چه چیزی شما را برای این نقش مناسب می‌کند؟ (حداکثر 2 دقیقه)',
  },
  {
    id: 3,
    title: 'تجربه چالش‌برانگیز',
    description:
      'در مورد یک چالش یا مشکل دشواری که در کار یا تحصیل با آن مواجه شده‌اید و چگونه آن را حل کردید، بگویید. (حداکثر 3 دقیقه)',
  },
])

// Interview responses storage
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

const responses = ref<QuestionResponse[]>([])

onMounted(() => {
  console.log('InterviewPage mounted')
  // بررسی localStorage برای مصاحبه‌های قبلی
  const savedInterview = checkLocalStorage()
  if (savedInterview) {
    console.log('Found previous interview data:', savedInterview)
  }
})

// Event Handlers
const handleQuestionAnswered = (response: QuestionResponse) => {
  console.log('Question answered:', response)
  responses.value.push(response)
}

const handleInterviewCompleted = (allResponses: QuestionResponse[]) => {
  console.log('Interview completed with responses:', allResponses)
  responses.value = allResponses

  // Save to localStorage
  try {
    const interviewData = {
      completedAt: new Date().toISOString(),
      totalQuestions: questions.value.length,
      responses: responses.value.map(r => ({
        questionNumber: r.questionNumber,
        questionTitle: r.questionTitle,
        duration: r.duration,
        timestamp: r.timestamp
      }))
    }

    localStorage.setItem('completeInterview', JSON.stringify(interviewData))
    console.log('Interview data saved to localStorage:', interviewData)
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }

  // Show responses
  showResponses()

  // Return to home after 2 seconds
  setTimeout(() => {
    router.push('/')
  }, 2000)
}

// Utility functions
const showResponses = () => {
  console.log('Responses Array:', responses.value)
  responses.value.forEach((response, index) => {
    console.log(`Response ${index + 1}:`, {
      questionNumber: response.questionNumber,
      questionTitle: response.questionTitle,
      duration: response.duration,
      hasVideo: !!response.videoBlob,
      hasAudio: !!response.audioBlob,
      timestamp: response.timestamp,
    })
  })
}

const checkLocalStorage = () => {
  try {
    const savedInterview = localStorage.getItem('completeInterview')
    if (savedInterview) {
      const interviewData = JSON.parse(savedInterview)
      console.log('Saved interview data:', interviewData)
      return interviewData
    } else {
      console.log('No saved interview data found')
      return null
    }
  } catch (error) {
    console.error('Error reading localStorage:', error)
    return null
  }
}
</script>

<style></style>
