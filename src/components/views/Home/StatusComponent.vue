<script setup lang="ts">
import AlertIcon from '@/icons/AlertIcon.vue'
import { computed } from 'vue';

// Props
interface Props {
  status?: string
  phase?: string
}
const props = withDefaults(defineProps<Props>(), {
  status: '',
  phase: '',
})
const description = computed(() => {
  if (props.phase === 'initiate') {
    return 'رزومه شما با موفقیت ثبت شد، لطفا تا 24 ساعت صبر کنید تا پس از بررسی مدارک با شما تماس بگیریم'
  } else{
    if(props.status === 'rejected'){
      return 'متاسفانه رزومه شما رد شده است، در صورت نیاز با پشتیبانی تماس بگیرید'
    } else {
      return 'زمان مصاحبه هماهنگ شده است، لطفا در زمان مصاحبه حضور داشته باشید'
    }
  }
})
</script>

<template>
  <div
    class="w-full mt-[32px] h-fit flex items-center justify-start gap-[24px] bg-primary dark:bg-gray-900 rounded-[12px] border border-gray-100 dark:border-gray-700 shadow-xs p-4"
  >
    <AlertIcon class="text-warning-400 w-[36px] h-[36px]" />
    <span class="text-warning-400 text-md">
      {{ description }}
    </span>
  </div>
</template>

<style lang="scss" scoped></style>
