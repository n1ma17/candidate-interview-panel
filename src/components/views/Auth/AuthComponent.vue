<template>
  <div class="flex h-screen">
    <!-- Left Side -->
    <div class="flex flex-col w-full lg:w-1/2 py-10 items-center justify-center bg-[#fff]">

      <!-- Error message -->
      <div
        v-if="error"
        class="p-4 mb-5 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
      >
        {{ error }}
      </div>
      <div class="w-full lg:w-[80%] xl:w-[60%] min-h-[500px] p-8 lg:shadow-xl rounded-2xl bg-[#ffffff]">
        <div class="w-full mb-4 flex justify-between items-center">
          <span class="text-[48px] font-bold text-[#000]">
            {{ activeTab === 'login' ? 'ورود' : 'ثبت نام' }}
          </span>
          <img class="w-[160px] h-[68px]" src="/images/logo/logo-en.jpg" alt="Logo" />
        </div>
        <!-- Tabs -->
        <div class="flex justify-between mb-6 border-b">
          <button
            :class="[
              'flex-1 py-2 text-center font-semibold transition',
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600',
            ]"
            @click="activeTab = 'login'"
          >
            Login
          </button>
          <button
            :class="[
              'flex-1 py-2 text-center font-semibold transition',
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600',
            ]"
            @click="activeTab = 'register'"
          >
            Register
          </button>
        </div>
        <!-- Forms -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'login'" key="login">
            <LoginComponent />
          </div>
          <div v-else-if="activeTab === 'register'" key="register">
            <RegisterComponent />
          </div>
        </transition>
      </div>
    </div>

    <!-- Right Side -->
    <div
      class="hidden lg:flex w-1/2 bg-cover bg-center"
      style="background-image: url('/images/views/AI.jpg')"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginComponent from '@/components/views/Auth/LoginComponent.vue'
import RegisterComponent from '@/components/views/Auth/RegisterComponent.vue'
import { useAuthQuery } from '@/composables/useAuthQuery'
const { error } = useAuthQuery()

const activeTab = ref('login')
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
