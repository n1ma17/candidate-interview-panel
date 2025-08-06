<template>
  <admin-layout>
    <div
      class="min-h-fit rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mx-auto w-full max-w-[630px] text-center">
        <!-- Success message when interview is completed -->
        <div v-if="isInterviewCompleted" class="space-y-4">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/20">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            {{ t('home.interviewCompleted') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            {{ t('home.resultNotification') }}
          </p>
        </div>

        <!-- Original interview description -->
        <div v-else>
          <h3 class="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            {{ t('home.title') }}
          </h3>

          <ul class="flex flex-col gap-2 text-right list-disc">
            <li class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              {{ t('home.description1') }}
            </li>
            <li class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              {{ t('home.description2') }}
            </li>
            <li class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              {{ t('home.description3') }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Show start button only if interview is not completed -->
    <div v-if="!isInterviewCompleted" class="mt-8 space-y-4">
      <button
        @click="router.push('/interview')"
        class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-200 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {{ t('home.startProcess') }}
      </button>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const isInterviewCompleted = ref()

onMounted(() => {
  // Check if interview is completed in localStorage
  const completedInterview = localStorage.getItem('completeInterview')
  isInterviewCompleted.value = completedInterview
})
</script>
