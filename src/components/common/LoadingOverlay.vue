<template>
  <teleport to="body">
    <div
      v-if="internalVisible"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex flex-col items-center gap-3  px-6 py-5">
        <span class="loader"></span>
        <span class="text-lg text-center text-gray-500 font-bold w-fit">
          {{ message }}
        </span>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

interface Props {
  visible: boolean
  message?: string
  minDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  message: 'در حال بارگذاری اطلاعات...',
  minDuration: 3000
})

const internalVisible = ref(false)
let hideTimer: number | null = null
let showStartedAt: number | null = null

watch(
  () => props.visible,
  (isShown) => {
    if (isShown) {
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
      showStartedAt = Date.now()
      internalVisible.value = true
      return
    }

    const started = showStartedAt ?? Date.now()
    const elapsed = Date.now() - started
    const remaining = Math.max(0, props.minDuration - elapsed)
    if (remaining === 0) {
      internalVisible.value = false
    } else {
      if (hideTimer) clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => {
        internalVisible.value = false
        hideTimer = null
      }, remaining)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<style scoped>
.loader {
    position: relative;
    width: 100px;
    height: 130px;
    background: var(--color-primary);
    border-radius: 4px;
  }
  .loader:before{
    content: '';
    position: absolute;
    width: 54px;
    height: 25px;
    left: 50%;
    top: 0;
    background-image:
    radial-gradient(ellipse at center, #0000 24%,#fffdfd 25%,#ffffff 64%,#0000 65%),
    linear-gradient(to bottom, #0000 34%,#d9d8d8 35%);
    background-size: 12px 12px , 100% auto;
    background-repeat: no-repeat;
    background-position: center top;
    transform: translate(-50% , -65%);
    box-shadow: 0 -3px rgba(0, 0, 0, 0.25) inset;
  }
 .loader:after{
    content: '';
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    width: 66%;
    height: 60%;
    background: linear-gradient(to bottom, #f5f5f4 30%, #0000 31%);
    background-size: 100% 16px;
    animation: writeDown 2s ease-out infinite;
 }

 @keyframes writeDown {
    0% { height: 0%; opacity: 0;}
    20%{ height: 0%; opacity: 1;}
    80% { height: 65%; opacity: 1;}
    100% { height: 65%; opacity: 0;}
 }

</style>


