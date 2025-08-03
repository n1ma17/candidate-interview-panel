<template>
  <div class="space-y-4 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      نمونه‌های Toast
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Success Toast -->
      <button
        @click="showSuccessToast"
        class="p-4 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg transition-colors"
      >
        <div class="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full mx-auto mb-2">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-green-900 dark:text-green-100">Success Toast</h3>
        <p class="text-xs text-green-700 dark:text-green-300 mt-1">
          نمایش پیام موفقیت
        </p>
      </button>

      <!-- Error Toast -->
      <button
        @click="showErrorToast"
        class="p-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg transition-colors"
      >
        <div class="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full mx-auto mb-2">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-red-900 dark:text-red-100">Error Toast</h3>
        <p class="text-xs text-red-700 dark:text-red-300 mt-1">
          نمایش پیام خطا
        </p>
      </button>

      <!-- Warning Toast -->
      <button
        @click="showWarningToast"
        class="p-4 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg transition-colors"
      >
        <div class="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-yellow-900 dark:text-yellow-100">Warning Toast</h3>
        <p class="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
          نمایش پیام هشدار
        </p>
      </button>

      <!-- Info Toast -->
      <button
        @click="showInfoToast"
        class="p-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg transition-colors"
      >
        <div class="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100">Info Toast</h3>
        <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
          نمایش پیام اطلاعات
        </p>
      </button>
    </div>

    <!-- Advanced Examples -->
    <div class="mt-8 space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        نمونه‌های پیشرفته
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          @click="showPersistentToast"
          class="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors text-left"
        >
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            Toast ثابت (بدون auto-close)
          </h4>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            باید دستی بسته شود
          </p>
        </button>

        <button
          @click="showLongToast"
          class="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors text-left"
        >
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            Toast با مدت زمان طولانی
          </h4>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            10 ثانیه باز می‌ماند
          </p>
        </button>

        <button
          @click="showMultipleToasts"
          class="p-4 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-lg transition-colors text-left"
        >
          <h4 class="text-sm font-medium text-purple-900 dark:text-purple-100">
            چندین Toast همزمان
          </h4>
          <p class="text-xs text-purple-700 dark:text-purple-300 mt-1">
            نمایش توالی toast ها
          </p>
        </button>

        <button
          @click="clearAllToasts"
          class="p-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg transition-colors text-left"
        >
          <h4 class="text-sm font-medium text-red-900 dark:text-red-100">
            پاک کردن همه Toast ها
          </h4>
          <p class="text-xs text-red-700 dark:text-red-300 mt-1">
            حذف فوری همه پیام‌ها
          </p>
        </button>
      </div>
    </div>

    <!-- Code Examples -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        نحوه استفاده
      </h3>

      <div class="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
        <div class="space-y-2">
          <div>// Import</div>
          <div class="text-blue-300">import { toast } from '@/composables/useToast'</div>
          <div></div>
          <div>// Success</div>
          <div class="text-yellow-300">toast.success({</div>
          <div class="ml-4 text-white">title: 'موفقیت!',</div>
          <div class="ml-4 text-white">description: 'عملیات با موفقیت انجام شد.'</div>
          <div class="text-yellow-300">})</div>
          <div></div>
          <div>// Error</div>
          <div class="text-yellow-300">toast.error({</div>
          <div class="ml-4 text-white">title: 'خطا!',</div>
          <div class="ml-4 text-white">description: 'مشکلی پیش آمده است.'</div>
          <div class="text-yellow-300">})</div>
          <div></div>
          <div>// Custom duration</div>
          <div class="text-yellow-300">toast.info({</div>
          <div class="ml-4 text-white">title: 'اطلاعات',</div>
          <div class="ml-4 text-white">description: 'پیام مهم',</div>
          <div class="ml-4 text-white">autoClose: false, // یا duration: 10000</div>
          <div class="text-yellow-300">})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from '@/composables/useToast'

const showSuccessToast = () => {
  toast.success({
    title: 'عملیات موفق!',
    description: 'تغییرات با موفقیت ذخیره شد.'
  })
}

const showErrorToast = () => {
  toast.error({
    title: 'خطا رخ داد!',
    description: 'نتوانستیم عملیات را انجام دهیم. لطفاً دوباره تلاش کنید.'
  })
}

const showWarningToast = () => {
  toast.warning({
    title: 'هشدار!',
    description: 'توجه: این عملیات قابل بازگشت نیست.'
  })
}

const showInfoToast = () => {
  toast.info({
    title: 'اطلاعات مفید',
    description: 'این پیام حاوی اطلاعات مهمی است که باید بدانید.'
  })
}

const showPersistentToast = () => {
  toast.info({
    title: 'پیام ثابت',
    description: 'این پیام تا زمانی که آن را نبندید باقی می‌ماند.',
    autoClose: false
  })
}

const showLongToast = () => {
  toast.warning({
    title: 'پیام طولانی مدت',
    description: 'این پیام 10 ثانیه نمایش داده می‌شود.',
    duration: 10000
  })
}

const showMultipleToasts = () => {
  toast.success({ title: 'مرحله ۱', description: 'آغاز فرآیند...' })

  setTimeout(() => {
    toast.info({ title: 'مرحله ۲', description: 'در حال پردازش...' })
  }, 500)

  setTimeout(() => {
    toast.warning({ title: 'مرحله ۳', description: 'تقریباً تمام شد...' })
  }, 1000)

  setTimeout(() => {
    toast.success({ title: 'تمام!', description: 'همه مراحل با موفقیت انجام شد.' })
  }, 1500)
}

const clearAllToasts = () => {
  toast.clear()
  toast.info({
    title: 'پاک شد!',
    description: 'همه پیام‌های قبلی حذف شدند.'
  })
}
</script>
