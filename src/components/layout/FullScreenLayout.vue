<template>
  <div>
    <FullScreenHeader />
    <div class="w-full p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
      <slot></slot>
    </div>

    <!-- Toast Container -->
    <ToastComponent />
  </div>
</template>

<script setup lang="ts">
import FullScreenHeader from './FullScreenHeader.vue'
import ToastComponent from '../common/ToastComponent.vue'
</script>
