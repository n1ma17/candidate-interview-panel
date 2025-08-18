import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Time before inactive queries are garbage collected
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: 3,
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
})

// Export the plugin
export { VueQueryPlugin }
