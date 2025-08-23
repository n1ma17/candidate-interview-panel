<template>
  <admin-layout>
    <div class="pb-24 md:pb-0">
      <DashboardHeader :phase="phase" :status="status" />
      <StatusComponent :status="status" :phase="phase" />
      <InterviewDescription v-if="phase !== 'initiate'" class="mt-[32px]" />
    </div>

    <!-- Show start button only if interview is not completed -->
    <div
      v-if="showInetrviewBtn"
      class="fixed bottom-0 left-0 right-0 p-4 md:mt-[38px] bg-white rounded-t-[12px] dark:bg-gray-900 border-t-3 dark:border-t-1 border-gray-100 dark:border-gray-700 md:relative md:p-0 md:bg-transparent md:border-0"
    >
      <button
        @click="router.push('/interview')"
        class="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-200 hover:bg-primary-hover dark:hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {{ t('home.startProcess') }}
      </button>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import authService from '../services/authService'
import DashboardHeader from '../components/views/Home/DashboardHeader.vue'
import InterviewDescription from '../components/views/Home/InterviewDescription.vue'
import StatusComponent from '../components/views/Home/StatusComponent.vue'

const router = useRouter()
const { t } = useI18n()

const status = ref('')
const phase = ref('')
const showInetrviewBtn = ref(false)


onMounted(async () => {
  // Fetch user data from API and store in localStorage
  try {
    const userResponse = await authService.getUserData()
    if (userResponse.success && userResponse.data) {
      status.value = userResponse.data.status
      phase.value = userResponse.data.phase
      if (status.value === 'in_progress' || phase.value === 'initiate') {
        showInetrviewBtn.value = false
      } else {
        showInetrviewBtn.value = true
      }
    } else {
      console.error('❌ Failed to fetch user data:', userResponse.error)
    }
  } catch (error) {
    console.error('❌ Error fetching user data:', error)
  }
})
</script>
