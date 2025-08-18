export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  },
  jwt: {
    accessTokenExpiry: import.meta.env.VITE_JWT_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: import.meta.env.VITE_JWT_REFRESH_TOKEN_EXPIRY || '7d',
  },
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'Vue Tailwind Admin Dashboard',
  },
} as const
