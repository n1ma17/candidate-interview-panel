import { useQuery } from '@tanstack/vue-query'
import categoriesService, { type Category } from '@/services/categoriesService'

export const useCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
    staleTime: 5 * 60 * 1000,
  })
}


