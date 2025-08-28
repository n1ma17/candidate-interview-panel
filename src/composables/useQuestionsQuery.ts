import { useQuery, useMutation } from '@tanstack/vue-query'
import questionsService, { type Question, type QuestionPayload, type QuestionResponse } from '@/services/questionsService'

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

export const usePostQuestionMutation = () => {
  return useMutation<QuestionResponse, Error, QuestionPayload>({
    mutationFn: (questionPayload: QuestionPayload) => questionsService.postQuestion(questionPayload),
  })
}


