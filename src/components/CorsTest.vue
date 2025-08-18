<template>
  <div class="p-4 bg-gray-100 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">🧪 CORS Test</h3>

    <div class="space-y-4">
      <!-- Test Connection -->
      <div>
        <button
          @click="testConnection"
          :disabled="isTesting"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isTesting ? 'در حال تست...' : 'تست اتصال' }}
        </button>
      </div>

      <!-- Results -->
      <div v-if="testResult" class="p-3 rounded text-sm">
        <div v-if="testResult.success" class="text-green-700 bg-green-100">
          ✅ اتصال موفق: {{ testResult.message }}
        </div>
        <div v-else class="text-red-700 bg-red-100">
          ❌ خطا در اتصال: {{ testResult.message }}
        </div>
      </div>

      <!-- Debug Info -->
      <div v-if="debugInfo" class="text-xs bg-gray-200 p-3 rounded">
        <h4 class="font-semibold mb-2">اطلاعات دیباگ:</h4>
        <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/plugins/axios'

const isTesting = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)
const debugInfo = ref<any>(null)

const testConnection = async () => {
  isTesting.value = true
  testResult.value = null
  debugInfo.value = null

  try {
    console.log('🧪 Testing connection to:', api.defaults.baseURL)

    // Test with a simple GET request
    const response = await api.get('/')

    testResult.value = {
      success: true,
      message: 'اتصال به سرور موفقیت‌آمیز بود'
    }

    debugInfo.value = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    }

  } catch (error: unknown) {
    const errorData = error as any

    testResult.value = {
      success: false,
      message: errorData.message || 'خطای نامشخص'
    }

    debugInfo.value = {
      code: errorData.code,
      message: errorData.message,
      status: errorData.response?.status,
      statusText: errorData.response?.statusText,
      headers: errorData.response?.headers,
      config: {
        baseURL: api.defaults.baseURL,
        url: errorData.config?.url,
        method: errorData.config?.method
      }
    }

    console.error('❌ Connection test failed:', errorData)
  } finally {
    isTesting.value = false
  }
}
</script>
