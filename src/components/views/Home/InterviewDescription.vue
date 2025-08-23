<template>
  <div
    class="w-full h-fit rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6"
  >
    <h3 class="mb-8 font-semibold text-primary text-center dark:text-white/90 sm:text-2xl flex items-center justify-center gap-2">
      <DocIcon />
      {{ t('home.title') }}
    </h3>

    <ul class="w-full text-right flex flex-wrap justify-between items-center gap-y-3 md:gap-y-5">
      <li
        v-for="item in 4"
        :key="item"
        class="w-full md:w-[45%] text-left text-[14px] text-gray-500 dark:text-gray-400"
      >
        - {{ t('home.description1') }}
      </li>
    </ul>
    <span
      class="cursor-pointer mt-8 w-full flex items-center justify-end gap-2 text-xs font-semibold dark:text-white text-primary"
    >
      مشاهده قوانین
      <ChevronLeftIcon />
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DocIcon from '@/icons/DocIcon.vue'
import { ChevronLeftIcon } from '@/icons'

const { t } = useI18n()
</script>
