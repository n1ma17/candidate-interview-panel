import api from '@/plugins/axios'

export interface Category {
  id: number
  name: string
  description: string
}

export interface CategoriesResponse {
  categories?: Category[]
  error?: string
}

class CategoriesService {
  // Get all job categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>('categories/')
      return response.data
    } catch (error: unknown) {
      console.log(error);
      return []
    }
  }
}

export default new CategoriesService()
