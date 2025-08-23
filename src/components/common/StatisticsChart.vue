<template>
  <div
    class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div
      class="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6"
    >
      <div class="relative max-h-[195px]">
        <div id="chartTwo" class="h-full">
          <div class="radial-bar-chart">
            <VueApexCharts type="radialBar" height="330" :options="chartOptions" :series="series" />
          </div>
        </div>
        <span
          class="absolute left-1/2 top-[85%] -translate-x-1/2 -translate-y-[85%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
          >+10%</span
        >
      </div>
      <div class="w-full flex items-end justify-between mt-4">
        <div class="w-half flex flex-col items-start justify-start gap-2">
          <h3 class="text-lg font-semibold truncate text-gray-800 dark:text-white">وضعیت</h3>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { ChevronLeftIcon } from '@/icons'

const props = defineProps({
  value: {
    type: Number,
    default: 75.55,
  },
  status: {
    type: String,
    default: '',
  },
})

const series = computed(() => [props.value])

const chartOptions = {
  colors: ['#465FFF'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: {
        size: '80%',
      },
      track: {
        background: '#E4E7EC',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: '36px',
          fontWeight: '600',
          offsetY: 60,
          color: '#1D2939',
          formatter: function (val: number) {
            return val.toFixed(2) + '%'
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ['#465FFF'],
  },
  stroke: {
    lineCap: 'round',
  },
  labels: ['Progress'],
}
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
</script>

<style scoped>
.radial-bar-chart {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
}
</style>
