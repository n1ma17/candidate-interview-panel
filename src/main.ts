import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import i18n from './i18n'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.use(i18n)

app.mount('#app')
