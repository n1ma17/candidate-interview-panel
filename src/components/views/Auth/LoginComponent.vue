<script setup lang="ts">
import { ref } from 'vue'
import { useAuthQuery } from '@/composables/useAuthQuery'
import InputComponent from '@/components/common/InputComponent.vue'

const { login, isLoading, clearError } = useAuthQuery()
const keepLoggedIn = ref(false)
const loginForm = ref({
  email: 'farzaddarvish@yahoo.com',
  password: 'Ferry1234',
})
const handleLogin = async () => {
  clearError()

  if (!loginForm.value.email || !loginForm.value.password) {
    return
  }

  await login(loginForm.value.email, loginForm.value.password)
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <div class="space-y-5">
      <!-- Username -->
      <div>
        <label
          for="login-email"
          class="mb-1.5 block text-xs font-medium text-gray-900"
        >
          ایمیل<span class="text-error-500">*</span>
        </label>
        <InputComponent
          v-model="loginForm.email"
          type="email"
          id="login-email"
          name="email"
          placeholder="ایمیل خود را وارد کنید"
        />
      </div>
      <!-- Password -->
      <div>
        <label
          for="login-password"
          class="mb-1.5 block text-xs font-medium text-gray-900"
        >
          رمز عبور<span class="text-error-500">*</span>
        </label>
        <InputComponent
          v-model="loginForm.password"
          type="password"
          id="login-password"
          placeholder="رمز عبور خود را وارد کنید"
        />
        <!-- Password requirements -->
        <div class="mt-2 text-xs text-gray-600">
          <p>رمز عبور باید حداقل ۸ کاراکتر و شامل یک حرف بزرگ باشد</p>
        </div>
      </div>
      <!-- Checkbox -->
      <div class="flex items-center justify-between">
        <div>
          <label
            for="keepLoggedIn"
            class="flex items-center text-sm font-normal text-gray-900 cursor-pointer select-none"
          >
            <div class="relative ml-3">
              <input v-model="keepLoggedIn" type="checkbox" id="keepLoggedIn" class="sr-only" />
              <div
                :class="
                  keepLoggedIn
                    ? 'border-brand-500 bg-brand-500'
                    : 'bg-transparent border-gray-300'
                "
                class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
              >
                <span :class="keepLoggedIn ? '' : 'opacity-0'">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                      stroke="white"
                      stroke-width="1.94437"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            مرا به خاطر بسپار
          </label>
        </div>
      </div>
      <!-- Button -->
      <div>
        <button
          type="submit"
          :disabled="isLoading || !loginForm.email || !loginForm.password"
          class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-primary shadow-theme-xs hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isLoading ? 'در حال ورود...' : 'ورود' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
