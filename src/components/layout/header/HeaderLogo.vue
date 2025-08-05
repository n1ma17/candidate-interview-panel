<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden w-[80px]" src="/images/logo/logo-en.jpg" alt="Logo" />
    <img class="hidden dark:block w-[80px]" src="/images/logo/logo-en.jpg" alt="Logo" />
  </router-link>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>
