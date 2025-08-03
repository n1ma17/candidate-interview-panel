<template>
  <admin-layout>
    <div
      class="min-h-fit rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mx-auto w-full max-w-[630px] text-center">
        <h3 class="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          توضیحات مصاحبه
        </h3>

        <ul class="flex flex-col gap-2 text-right list-disc">
          <li class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک
            است
          </li>
          <li class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک
            است
          </li>
          <li class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک
            است
          </li>
        </ul>
      </div>
    </div>
            <div class="mt-8 space-y-4">
          <button
            @click="router.push('/interview')"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-200 hover:bg-primary-hover hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            شروع فرآیند مصاحبه
          </button>
        </div>

  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()









</script>
