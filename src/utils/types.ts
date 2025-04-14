export interface memoContent {
  id: number
  title: string
  content: string
  type: 'text' | 'question' | 'code'
  tags: []
  isPinned: boolean
  AIExplanation: string
  created_at: Date
  updated_at?: Date
}
