import { useQuery } from '@tanstack/vue-query'
import authService, { type UserData, type ApiResponse } from '@/services/authService'

export const useUserQuery = () => {
  return useQuery<UserData | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const res: ApiResponse<UserData> = await authService.getUserData()
      if (res.success && res.data) return res.data
      throw new Error(res.error || 'Failed to fetch user')
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}


