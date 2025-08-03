import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)

// Initialize authentication state
const { initAuth } = useAuth()
initAuth()

app.mount('#app')
