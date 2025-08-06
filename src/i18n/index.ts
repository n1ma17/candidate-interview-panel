import { createI18n } from 'vue-i18n'
import fa from './locales/fa.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'fa',
  fallbackLocale: 'en',
  messages: {
    fa,
    en
  }
})

export default i18n
