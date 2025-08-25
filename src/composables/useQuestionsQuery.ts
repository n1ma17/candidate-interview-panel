import { useQuery } from '@tanstack/vue-query'
import questionsService, { type Question } from '@/services/questionsService'

export const useQuestionsQuery = () => {
  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: () => questionsService.getQuestions(),
  })
}

export const useQuestionsByPhaseQuery = (phase: string) => {
  return useQuery<Question[]>({
    queryKey: ['questions', 'phase', phase],
    queryFn: () => questionsService.getQuestionsByPhase(phase),
    enabled: !!phase,
  })
}


