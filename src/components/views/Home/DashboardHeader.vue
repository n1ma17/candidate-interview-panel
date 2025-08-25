<template>
  <div class="w-full h-full flex flex-col lg:flex-row lg:items-start justify-center">
    <div class="w-full lg:h-[230px] flex flex-col items-start justify-between lg:gap-unset gap-4">
      <div class="w-full flex flex-col items-start justify-start">
        <h1 class="text-lg sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {{ welcomTitle }}
        </h1>
        <p class="text-gray-400 dark:text-gray-400 text-sm">
          {{ persianDate }}
        </p>
      </div>
      <div class="w-full lg:w-fit flex flex-col sm:flex-row items-center justify-start gap-8 lg:gap-2">
        <div
          :class="[
            'w-full sm:w-[30%] text-white lg:w-[120px] h-[100px] p-4 flex flex-col items-center justify-center gap-4 rounded-[12px] cursor-pointer shadow-md transition-all duration-200',
            phase === 'initiate'
              ? status === 'accepted'
                ? 'bg-success-700 opacity-100'
                : status === 'rejected'
                  ? 'bg-error-700'
                  : 'bg-primary opacity-100'
              : 'bg-success-700 opacity-50',
          ]"
        >
          <InvestigatIcon
            v-if="phase === 'initiate' && status === 'in_progress'"
            class="text-white w-[32px] h-[32px]"
          />
          <InvestigatComplete
            v-else-if="phase === 'initiate' && status === 'accepted'"
            class="text-white w-[32px] h-[32px]"
          />
          <InvestigateReject
            v-else-if="phase === 'initiate' && status === 'rejected'"
            class="text-white w-[32px] h-[32px]"
          />
          <AcceptIcon v-else-if="phase !== 'initiate'" class="text-white w-[32px] h-[32px]" />
          <span class="text-white text-sm"> بررسی مدارک </span>
        </div>
        <StepArrowIcon class="rotate-[-90deg] sm:rotate-0 text-gray-400 w-[24px] h-[24px]" />
        <div
          :class="[
            'w-full sm:w-[30%] lg:w-[120px] h-[100px] p-4 flex flex-col items-center justify-center gap-4 rounded-[12px] shadow-md text-white transition-all duration-200',
            phase === 'hr'
              ? status === 'accepted'
                ? 'bg-success-700 opacity-100'
                : status === 'rejected'
                  ? 'bg-error-700'
                  : 'bg-primary opacity-100'
              : phase === 'hr'
                ? 'bg-success-700 opacity-80'
                : phase === 'tech'
                  ? 'bg-success-700 opacity-50'
                  : 'bg-gray-400 opacity-80',
          ]"
        >
          <InvestigatIcon v-if="phase === 'hr' && status === 'in_progress'" class="text-white" />
          <AcceptIcon v-else-if="phase === 'tech'" class="text-white w-[32px] h-[32px]" />
          <InvestigatComplete
            v-else-if="phase === 'hr' && status === 'accepted'"
            class="text-white"
          />
          <InvestigateReject
            v-else-if="phase === 'hr' && status === 'rejected'"
            class="text-white"
          />
          <InvestigatIcon v-else-if="phase !== 'hr'" class="text-white" />
          <span class="text-white text-sm"> منابع انسانی </span>
        </div>
        <StepArrowIcon class="rotate-[-90deg] sm:rotate-0 text-gray-400 w-[24px] h-[24px]" />
        <div
          :class="[
            'w-full sm:w-[30%] lg:w-[120px] h-[100px] p-4 flex flex-col items-center justify-center gap-4 rounded-[12px] shadow-md text-white transition-all duration-200',
            phase === 'tech'
              ? status === 'accepted'
                ? 'bg-success-700 opacity-100'
                : status === 'rejected'
                  ? 'bg-error-700'
                  : 'bg-primary opacity-100'
              : phase === 'tech'
                ? 'bg-success-700 opacity-80'
                : 'bg-gray-400 opacity-80',
          ]"
        >
          <InvestigatIcon
            v-if="phase === 'tech' && status === 'in_progress'"
            class="text-white"
          />
          <AcceptIcon
            v-else-if="phase === 'tech' && status === 'accepted'"
            class="text-white"
          />
          <InvestigateReject
            v-else-if="phase === 'tech' && status === 'rejected'"
            class="text-white"
          />
          <InvestigatIcon v-else-if="phase !== 'tech'" class="text-white" />
          <span class="text-white text-sm"> مصاحبه فنی </span>
        </div>
      </div>
    </div>
    <!-- User Status Card -->
    <div class="w-full lg:w-[500px] mt-8 lg:mt-0">
      <ProgressChart :status="status" :phase="phase" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import InvestigatIcon from '@/icons/InvestigatIcon.vue'
import InvestigatComplete from '@/icons/InvestigatComplete.vue'
import InvestigateReject from '@/icons/InvestigateReject.vue'
import AcceptIcon from '@/icons/AcceptIcon.vue'
import StepArrowIcon from '@/icons/StepArrowIcon.vue'
import ProgressChart from '@/components/common/ProgressChart.vue'

// Props
interface Props {
  status?: string
  phase?: string
}

withDefaults(defineProps<Props>(), {
  status: '',
  phase: '',
})

// Welcome title based on time
const welcomTitle = computed(() => {
  const currentHour = new Date().getHours()
  let greeting = ''

  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'روز بخیر'
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'ظهر بخیر'
  } else {
    greeting = 'شب بخیر'
  }

  // Get user name from localStorage
  try {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      const firstName = user.first_name || user.email || 'کاربر'
      return `${greeting} ${firstName.split('@')[0]}`
    }
  } catch (error) {
    console.error('Error reading user data:', error)
  }

  return greeting
})

// Persian date
const persianDate = computed(() => {
  const now = new Date()
  const persianMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ]

  const persianWeekDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه']

  // Convert to Persian calendar (approximate)
  const persianYear = now.getFullYear() - 621
  const persianMonth = now.getMonth()
  const persianDay = now.getDate()
  const weekDay = now.getDay()

  return `${persianWeekDays[weekDay]} ${persianDay} ${persianMonths[persianMonth]} ${persianYear}`
})
</script>
