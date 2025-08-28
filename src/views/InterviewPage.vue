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
import { ref, onMounted, computed } from 'vue'

import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import InterviewVideoRecorder from '@/components/InterviewVideoRecorder.vue'
import { useRouter } from 'vue-router'
import {
  type Question,
  type QuestionResponse,
  type QuestionPayload,
} from '@/services/questionsService'
import { useQuestionsQuery, usePostQuestionMutation } from '@/composables/useQuestionsQuery'

const currentPageTitle = ref('interview')
const router = useRouter()

// Component ref
const videoRecorderRef = ref()
// Questions Data via vue-query
const { data: questionsData } = useQuestionsQuery()
const questions = computed<Question[]>(() => questionsData?.value ?? [])

// Post question mutation
const postQuestionMutation = usePostQuestionMutation()

const responses = ref<QuestionResponse[]>([])

onMounted(async () => {
  // بررسی localStorage برای مصاحبه‌های قبلی
  const savedInterview = checkLocalStorage()
  if (savedInterview) {
    console.log('Found previous interview data:', savedInterview)
  }
})

// Event Handlers
const handleQuestionAnswered = async (response: QuestionResponse) => {
  try {
    const questionPayload: QuestionPayload = {
      question: response.question,
      video: response.video,
      audio: response.audio,
      note: response.note,
    }

    const result = await postQuestionMutation.mutateAsync(questionPayload)
    console.log('Question posted successfully:', result)

    responses.value.push(response)
  } catch (error) {
    console.error('Error posting question:', error)
    responses.value.push(response)
  }
}

const handleInterviewCompleted = (allResponses: QuestionResponse[]) => {
  responses.value = allResponses

  // Save to localStorage
  try {
    const interviewData = {
      completedAt: new Date().toISOString(),
      totalQuestions: questions.value.length,
      responses: responses.value.map((r) => ({
        question: r.question,
        video: r.video,
        audio: r.audio,
        note: r.note,
      })),
    }

    localStorage.setItem('completeInterview', JSON.stringify(interviewData))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }

  // Return to home after 2 seconds
  setTimeout(() => {
    router.push('/')
  }, 500)
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
