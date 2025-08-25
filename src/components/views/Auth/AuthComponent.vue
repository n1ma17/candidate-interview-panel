<template>
  <div
    class="flex h-screen w-screen md:p-2 justify-center items-center lg:justify-none lg:items-none"
  >
    <!-- Error message -->
    <div
      v-if="error"
      class="p-4 mb-5 text-sm text-red-800 bg-red-50 border border-red-200 rounded-[12px] dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
    >
      {{ error }}
    </div>
    <!-- form Side -->
    <div
      class="rounded-[12px] flex flex-col w-full h-full lg:h-fit lg:w-1/3 py-10 items-center justify-between lg:p-4"
    >
      <div class="w-full flex flex-col px-4 justify-between items-center">
        <img class="w-[400px] h-[150px] lg:w-[120px] lg:h-[58px]" src="/images/logo/logo-en.jpg" alt="Logo" />
        <span class="text-[48px] lg:text-[24px] font-bold text-[#000]">
          {{ activeTab === 'login' ? 'ورود' : 'ثبت نام' }}
        </span>
      </div>
      <div class="h-full w-[80%] xl:w-[100%] min-h-fit lg:min-h-[500px] flex flex-col justify-center">
        <!-- Forms -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'login'" key="login">
            <LoginComponent />
          </div>
          <div v-else-if="activeTab === 'register'" key="register">
            <RegisterComponent />
          </div>
        </transition>

        <!-- Switch between forms text -->
        <div class="mt-6 text-center text-sm text-gray-600">
          <p v-if="activeTab === 'login'">
            حساب کاربری ندارید؟
            <button
              @click="activeTab = 'register'"
              class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {{ t('auth.register') }}
            </button>
          </p>
          <p v-else>
            قبلاً حساب کاربری دارید؟
            <button
              @click="activeTab = 'login'"
              class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {{ t('auth.login') }}
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- left Side -->
    <div
      class="rounded-[12px] shadow-xl hidden lg:flex w-2/3 h-full bg-cover bg-center bg-[url('/images/views/ai.png')]"

    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LoginComponent from '@/components/views/Auth/LoginComponent.vue'
import RegisterComponent from '@/components/views/Auth/RegisterComponent.vue'
import { useAuthQuery } from '@/composables/useAuthQuery'


const { t } = useI18n()
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
