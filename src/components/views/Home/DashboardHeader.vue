<template>
  <div class="w-full h-full flex flex-col md:flex-row md:items-start justify-center">
    <div class="w-full md:h-[230px] flex flex-col items-start justify-between md:gap-unset gap-4">
      <div class="w-full flex flex-col items-start justify-start">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {{ welcomTitle }}
        </h1>
        <p class="text-gray-400 dark:text-gray-400 text-sm">
          {{ persianDate }}
        </p>
      </div>
      <div class="w-full md:w-unset flex items-center justify-start gap-8">
        <div
          :class="[
            'w-[30%] text-white md:w-[120px] h-[100px] p-4 flex flex-col items-center justify-center gap-4 rounded-[12px] cursor-pointer shadow-md transition-all duration-200',
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
        <StepArrowIcon class="text-gray-400 w-[24px] h-[24px]" />
        <div
          :class="[
            'w-[30%] md:w-[120px] h-[100px] p-4 flex flex-col items-center justify-center gap-4 rounded-[12px] shadow-md text-white transition-all duration-200',
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
        <StepArrowIcon class="text-gray-400 w-[24px] h-[24px]" />
        <div
          :class="[
            'w-[30%] md:w-[120px] h-[100px] p-4 flex flex-col items-center justify-center gap-4 rounded-[12px] shadow-md text-white transition-all duration-200',
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
    <div class="w-full md:w-[500px] mt-8 md:mt-0">
      <div
        class="w-full md:h-[230px] bg-primary text-white dark:bg-primary rounded-[12px] border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
      >
        <div class="w-full flex items-start justify-between">
          <div class="w-fit p-4 bg-[#293a51] dark:bg-[#293a51] rounded-[12px]">
            <ListIcon />
          </div>
          <!-- Donut Chart -->
          <VueApexCharts
            type="donut"
            :options="chartOptions"
            :series="chartSeries"
            width="100"
            height="100"
          />
        </div>
        <div class="w-full flex items-end justify-between mt-4">
          <!-- User Info -->
          <div class="w-half flex flex-col items-start justify-start gap-2">
            <h3 class="text-lg font-semibold truncate">وضعیت</h3>
            <p
              class="text-[12px] text-gray-500 dark:text-gray-400 truncate"
              :class="`${colorHandler}`"
            >
              {{ $t(`dashboard.${status}`) }}
            </p>
          </div>
          <span
            class="cursor-pointer w-half flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            مشاهده جزئیات
            <ChevronLeftIcon />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import ListIcon from '@/icons/ListIcon.vue'
import { ChevronLeftIcon } from '@/icons'
import InvestigatIcon from '@/icons/InvestigatIcon.vue'
import InvestigatComplete from '@/icons/InvestigatComplete.vue'
import InvestigateReject from '@/icons/InvestigateReject.vue'
import AcceptIcon from '@/icons/AcceptIcon.vue'
import StepArrowIcon from '@/icons/StepArrowIcon.vue'

// Props
interface Props {
  status?: string
  phase?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: '',
  phase: '',
})
const colorHandler = computed(() => {
  if (props.status === 'rejected') {
    return 'text-red-500'
  } else if (props.status === 'in_progress') {
    return 'text-yellow-500'
  } else if (props.status === 'completed') {
    return 'text-blue-500'
  } else if (props.status === 'accepted') {
    return 'text-success-500'
  } else {
    return 'text-gray-500'
  }
})
// Interview progress data
const interviewProgress = ref(75) // Progress percentage

// Chart configuration
const chartSeries = computed(() => [interviewProgress.value, 100 - interviewProgress.value])

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
  },
  labels: ['تکمیل شده', 'باقی‌مانده'],
  colors: ['#61a8af', '#293a51'],
  stroke: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
      },
    },
  },
}))

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
      return `${greeting} ${firstName}`
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
