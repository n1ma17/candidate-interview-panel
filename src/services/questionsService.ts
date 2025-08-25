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
  id: number
  interview: string
  interview_phase: string
  question: Question
  video: Blob
  audio: Blob
  ai_transcript: string
  ai_summary: string
  score: number
  passed: boolean
  attempt: number
  created_at: Date
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
  async postQuestion(question: QuestionResponse): Promise<Question> {
    try {
      const response = await api.post<Question>('response/', question)
      return response.data
    } catch (error: unknown) {
      console.log(error)
      return {} as Question
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
