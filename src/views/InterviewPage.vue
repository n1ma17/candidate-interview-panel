<template>
  <AdminLayout>
    <PageBreadcrumb  :pageTitle="currentPageTitle" />
    <div
      class="min-h-fit rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mx-auto w-full max-w-[630px] text-center">

      </div>
    </div>
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
import { ref, onMounted } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ModalComponent from '../components/common/ModalComponent.vue'
import { toast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
const currentPageTitle = ref("interview");
const showPermissionModal = ref(false)
const router = useRouter()
onMounted(() => {
  showPermissionModal.value = true
})
// Type definition برای Legacy APIs
interface LegacyNavigator extends Navigator {
  getUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: Error) => void) => void
  webkitGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: Error) => void) => void
  mozGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: Error) => void) => void
  msGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: Error) => void) => void
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
      const getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia

      if (getUserMedia) {
        console.log('تلاش با Legacy API...')
        stream = await new Promise<MediaStream>((resolve, reject) => {
          getUserMedia.call(navigator,
            { video: true, audio: true },
            (mediaStream: MediaStream) => {
              toast.info({
                title: 'دسترسی با روش Legacy',
                description: 'دسترسی با روش سازگاری مرورگرهای قدیمی موفق بود.'
              })
              resolve(mediaStream)
            },
            (error: Error) => reject(error)
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

    // نمایش پیام موفقیت
    toast.success({
      title: 'دسترسی با موفقیت دریافت شد!',
      description: 'حالا می‌توانید مصاحبه را شروع کنید.'
    })

    // بستن stream - در عمل شما احتمالاً آن را برای مصاحبه نگه می‌دارید
    stream.getTracks().forEach((track) => track.stop())

  } else {
    // هیچ روشی کار نکرد - نمایش راهنمایی‌های تفصیلی
    console.error('هیچ روشی برای دسترسی به Media موفق نبود')

    // بررسی دقیق‌تر مشکل
    const hasModernAPI = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    const nav = navigator as LegacyNavigator
    const hasLegacyAPI = !!(nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia)

    if (!hasModernAPI && !hasLegacyAPI) {
      toast.error({
        title: 'مرورگر پشتیبانی نمی‌کند',
        description: 'این مرورگر از هیچ روش دسترسی به دوربین/میکروفون پشتیبانی نمی‌کند. لطفاً Chrome, Firefox, Edge یا Safari استفاده کنید.'
      })
    } else {
      toast.error({
        title: 'خطا در دریافت دسترسی',
        description: 'علیرغم تلاش با روش‌های مختلف، دسترسی به دوربین/میکروفون موفق نبود. لطفاً دوربین را وصل کنید و مجددا تلاش کنید.'
      })
    }
  }
}

const handlePermissionCancel = () => {
  toast.info({
    title: 'عملیات لغو شد',
    description: 'درخواست دسترسی لغو شد. می‌توانید مجدداً تلاش کنید.'
  })
  showPermissionModal.value = false
  router.push('/')
}
</script>

<style></style>
