<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import SelectComponent from '@/components/common/SelectComponent.vue'
import { useAuthQuery } from '@/composables/useAuthQuery'
const { register, isLoading, clearError } = useAuthQuery()
import { toast } from '@/composables/useToast'
import categoriesService from '@/services/categoriesService'
import type { Category } from '@/services/categoriesService'

const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)
const selectedFile = ref<File | null>(null)

// Job categories from API
const jobPositions = ref<Category[]>([])
const isLoadingCategories = ref(false)
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  position: 0,
  resume: null as File | null,
})
const isRegisterFormValid = computed(() => {
  return (
    registerForm.value.name.trim() &&
    registerForm.value.email.trim() &&
    registerForm.value.password &&
    registerForm.value.confirmPassword &&
    registerForm.value.position > 0 &&
    registerForm.value.resume &&
    registerForm.value.password === registerForm.value.confirmPassword &&
    registerForm.value.password.length >= 8 &&
    /[A-Z]/.test(registerForm.value.password)
  )
})

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error({
        title: 'خطا در نوع فایل',
        description: 'فقط فایل‌های PDF قابل قبول هستند'
      })
      target.value = ''
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error({
        title: 'خطا در حجم فایل',
        description: 'حجم فایل نباید بیشتر از 5MB باشد'
      })
      target.value = ''
      return
    }

    selectedFile.value = file
    registerForm.value.resume = file
  }
}

// Fetch categories from API
const fetchCategories = async () => {
  isLoadingCategories.value = true
  try {
    const response = await categoriesService.getCategories()
    if (response && Array.isArray(response)) {
      jobPositions.value = response
    } else {
      toast.error({
        title: 'خطا در دریافت دسته‌بندی‌ها',
        description: 'خطا در بارگذاری موقعیت‌های شغلی'
      })
    }
  } catch {
    toast.error({
      title: 'خطا در دریافت دسته‌بندی‌ها',
      description: 'خطا در ارتباط با سرور'
    })
  } finally {
    isLoadingCategories.value = false
  }
}

// Fetch categories when component mounts
onMounted(() => {
  fetchCategories()
})

const handleRegister = async () => {
  clearError()

  // Validate form
  if (!isRegisterFormValid.value) {
    return
  }

  // Validate password match
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    return
  }

  // Validate password length
  if (registerForm.value.password.length < 8) {
    return
  }

  // Validate password has uppercase letter
  if (!/[A-Z]/.test(registerForm.value.password)) {
    return
      }

    await register(
    registerForm.value.name,
    registerForm.value.email,
    registerForm.value.password,
    registerForm.value.confirmPassword,
    registerForm.value.position,
    registerForm.value.resume || undefined
  )
}
</script>

<template>
  <form @submit.prevent="handleRegister">
    <div class="space-y-5">
      <!-- Username -->
      <div>
        <label
          for="register-username"
          class="mb-1.5 block text-sm font-medium text-gray-100 dark:text-gray-400"
        >
          نام کاربری<span class="text-error-500">*</span>
        </label>
        <input
          v-model="registerForm.name"
          type="text"
          id="register-username"
          name="username"
          placeholder="نام کاربری خود را وارد کنید"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-100 bg-transparent px-4 py-2.5 text-sm text-gray-100 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>
      <!-- Email -->
      <div>
        <label
          for="register-email"
          class="mb-1.5 block text-sm font-medium text-gray-100 dark:text-gray-400"
        >
          ایمیل<span class="text-error-500">*</span>
        </label>
        <input
          v-model="registerForm.email"
          type="email"
          id="register-email"
          name="email"
          placeholder="info@gmail.com"
          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-100 bg-transparent px-4 py-2.5 text-sm text-gray-100 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>
      <!-- Password -->
      <div>
        <label
          for="register-password"
          class="mb-1.5 block text-sm font-medium text-gray-100 dark:text-gray-400"
        >
          رمز عبور<span class="text-error-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="registerForm.password"
            :type="showRegisterPassword ? 'text' : 'password'"
            id="register-password"
            placeholder="رمز عبور خود را وارد کنید"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-100 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-100 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <span
            @click="showRegisterPassword = !showRegisterPassword"
            class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer left-4 top-1/2 dark:text-gray-400"
          >
            <svg
              v-if="!showRegisterPassword"
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                fill="#98A2B3"
              />
            </svg>
            <svg
              v-else
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30919 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                fill="#98A2B3"
              />
            </svg>
          </span>
        </div>
        <!-- Password requirements -->
        <div class="mt-2 text-xs text-gray-400">
          <p>رمز عبور باید حداقل ۸ کاراکتر و شامل یک حرف بزرگ باشد</p>
        </div>
      </div>
      <!-- Confirm Password -->
      <div>
        <label
          for="register-confirm-password"
          class="mb-1.5 block text-sm font-medium text-gray-100 dark:text-gray-400"
        >
          تکرار رمز عبور<span class="text-error-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="registerForm.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            id="register-confirm-password"
            placeholder="رمز عبور خود را تکرار کنید"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-100 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-100 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <span
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer left-4 top-1/2 dark:text-gray-400"
          >
            <svg
              v-if="!showConfirmPassword"
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                fill="#98A2B3"
              />
            </svg>
            <svg
              v-else
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30919 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                fill="#98A2B3"
              />
            </svg>
          </span>
        </div>
      </div>

      <!-- Position Selection -->
      <div>
        <label
          for="register-position"
          class="mb-1.5 block text-sm font-medium text-gray-100 dark:text-gray-400"
        >
          موقعیت شغلی<span class="text-error-500">*</span>
        </label>
        <SelectComponent
          v-model="registerForm.position"
          :options="jobPositions"
          placeholder="موقعیت شغلی خود را انتخاب کنید"
          id="register-position"
          :disabled="isLoadingCategories"
        />
        <div v-if="isLoadingCategories" class="mt-2 text-xs text-gray-400">
          <p>در حال بارگذاری موقعیت‌های شغلی...</p>
        </div>
      </div>

      <!-- PDF Upload -->
      <div>
        <label
          for="register-resume"
          class="mb-1.5 block text-sm font-medium text-gray-100 dark:text-gray-400"
        >
          رزومه (PDF)<span class="text-error-500">*</span>
        </label>
        <div class="relative">
          <input
            @change="handleFileUpload"
            type="file"
            id="register-resume"
            name="resume"
            accept=".pdf"
            class="hidden"
          />
          <label
            for="register-resume"
            class="flex items-center justify-center w-full h-11 px-4 py-2.5 text-sm text-gray-100 border border-gray-100 rounded-lg cursor-pointer hover:border-brand-300 transition-colors dark:border-gray-700 dark:hover:border-brand-800"
          >
            <FileUpload class="ml-4" />
            <span v-if="!registerForm.resume">انتخاب فایل PDF</span>
            <span v-else class="text-brand-300">{{ registerForm.resume.name }}</span>
          </label>
        </div>
        <div class="mt-2 text-xs text-gray-400">
          <p>فقط فایل‌های PDF قابل قبول هستند (حداکثر 5MB)</p>
        </div>
      </div>

      <!-- Button -->
      <div>
        <button
          type="submit"
          :disabled="isLoading || !isRegisterFormValid"
          class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {{ isLoading ? 'در حال ثبت نام...' : 'ثبت نام' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
