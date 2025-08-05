<template>
  <div class="w-screen">
    <slot></slot>
  </div>
  <ToastComponent />
</template>

<script setup lang="ts">
import ToastComponent from '../common/ToastComponent.vue'
</script>
