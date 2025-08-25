<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
    <LoadingOverlay :visible="isLoading" />
  </ThemeProvider>
</template>

<script setup lang="ts">
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
const { isLoading } = useUserQuery()
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import { useUserQuery } from './composables/useUserQuery'
</script>
