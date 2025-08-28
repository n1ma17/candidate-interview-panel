import api from '@/plugins/axios'

export interface Question {
  id: number
  text: string
  phase: string
  order: number
  required: boolean
}

export interface QuestionsResponse {
  questions?: Question[]
  error?: string
}
export interface QuestionResponse {
  question: number
  video: File
  audio: File
  note: string
}
export interface QuestionPayload {
  question: number
  video: File
  audio: File
  note: string
}
class QuestionsService {
  // Get all questions
  async getQuestions(): Promise<Question[]> {
    try {
      const response = await api.get<Question[]>('questions/')
      return response.data
    } catch (error: unknown) {
      console.log(error)
      return []
    }
  }
  async postQuestion(question: QuestionPayload): Promise<QuestionResponse> {
    try {
      const formData = new FormData()
      formData.append('question', String(question.question))
      formData.append('video', question.video)
      formData.append('audio', question.audio)
      formData.append('note', question.note || '')

      const response = await api.post<QuestionResponse>('responses/', formData)
      return response.data
    } catch (error: unknown) {
      console.log(error)
      return {} as QuestionResponse
    }
  }
  // Get questions by phase
  async getQuestionsByPhase(phase: string): Promise<Question[]> {
    try {
      const response = await api.get<Question[]>(`questions/?phase=${phase}`)
      return response.data
    } catch (error: unknown) {
      console.log(error)
      return []
    }
  }

  // Get question by ID
  async getQuestionById(id: number): Promise<Question | null> {
    try {
      const response = await api.get<Question>(`questions/${id}/`)
      return response.data
    } catch (error: unknown) {
      console.log(error)
      return null
    }
  }
}

export default new QuestionsService()
