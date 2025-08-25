<script setup lang="ts">
import { computed, ref } from 'vue'
import SelectComponent from '@/components/common/SelectComponent.vue'
import { useAuthQuery } from '@/composables/useAuthQuery'
import InputComponent from '@/components/common/InputComponent.vue'
const { register, isLoading, clearError } = useAuthQuery()
import { toast } from '@/composables/useToast'
import type { Category } from '@/services/categoriesService'
import { useCategoriesQuery } from '@/composables/useCategoriesQuery'

const selectedFile = ref<File | null>(null)

// Job categories from API via vue-query
const { data: categoriesData, isPending: isLoadingCategories } = useCategoriesQuery()
const jobCategories = computed<Category[]>(() => categoriesData.value ?? [])
const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
  job_category: 0,
  resume: null as File | null,
})
const isRegisterFormValid = computed(() => {
  return (
    registerForm.value.email.trim() &&
    registerForm.value.password &&
    registerForm.value.confirmPassword &&
    registerForm.value.job_category > 0 &&
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

// Errors are handled globally by toast in service callers if needed

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
    registerForm.value.email,
    registerForm.value.password,
    registerForm.value.confirmPassword,
    registerForm.value.job_category,
    registerForm.value.resume || undefined
  )
}
</script>

<template>
  <form @submit.prevent="handleRegister" autocomplete="off">
    <div class="space-y-5">

      <!-- Email -->
      <div>
        <label
          for="register-email"
          class="mb-1.5 block text-sm font-medium text-gray-900"
        >
          ایمیل<span class="text-error-500">*</span>
        </label>
        <InputComponent
          v-model="registerForm.email"
          type="email"
          id="register-email"
          name="register_email"
          autocomplete="off"
          placeholder="info@gmail.com"
        />
      </div>
      <!-- Password -->
      <div>
        <label
          for="register-password"
          class="mb-1.5 block text-sm font-medium text-gray-900"
        >
          رمز عبور<span class="text-error-500">*</span>
        </label>
        <InputComponent
          v-model="registerForm.password"
          type="password"
          id="register-password"
          name="new-password"
          autocomplete="new-password"
          placeholder="رمز عبور خود را وارد کنید"
        />
        <!-- Password requirements -->
        <div class="mt-2 text-xs text-gray-600">
          <p>رمز عبور باید حداقل ۸ کاراکتر و شامل یک حرف بزرگ باشد</p>
        </div>
      </div>
      <!-- Confirm Password -->
      <div>
        <label
          for="register-confirm-password"
          class="mb-1.5 block text-sm font-medium text-gray-900"
        >
          تکرار رمز عبور<span class="text-error-500">*</span>
        </label>
        <InputComponent
          v-model="registerForm.confirmPassword"
          type="password"
          id="register-confirm-password"
          name="confirm-new-password"
          autocomplete="new-password"
          placeholder="رمز عبور خود را تکرار کنید"
        />
      </div>

      <!-- Position Selection -->
      <div>
        <label
          for="register-job-category"
          class="mb-1.5 block text-sm font-medium text-gray-900"
        >
          دسته‌بندی شغلی<span class="text-error-500">*</span>
        </label>
        <SelectComponent
          v-model="registerForm.job_category"
          :options="jobCategories"
          placeholder="دسته‌بندی شغلی خود را انتخاب کنید"
          id="register-job-category"
          :disabled="isLoadingCategories"
        />
        <div v-if="isLoadingCategories" class="mt-2 text-xs text-gray-600">
          <p>در حال بارگذاری دسته‌بندی‌های شغلی...</p>
        </div>
      </div>

      <!-- PDF Upload -->
      <div>
        <label
          for="register-resume"
          class="mb-1.5 block text-sm font-medium text-gray-900"
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
            class="flex items-center justify-center w-full h-11 px-4 py-2.5 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer hover:border-brand-300 transition-colors"
          >
            <FileUpload class="ml-4" />
            <span v-if="!registerForm.resume" class="text-gray-500">انتخاب فایل PDF</span>
            <span v-else class="text-brand-300">{{ registerForm.resume.name }}</span>
          </label>
        </div>
        <div class="mt-2 text-xs text-gray-600">
          <p>فقط فایل‌های PDF قابل قبول هستند (حداکثر 5MB)</p>
        </div>
      </div>

      <!-- Button -->
      <div>
        <button
          type="submit"
          :disabled="isLoading || !isRegisterFormValid"
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
          {{ isLoading ? 'در حال ثبت نام...' : 'ثبت نام' }}
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
