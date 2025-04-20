export interface memoContent {
  id: string
  user_id: string
  title: string
  user_memo: string
  type: 'text' | 'code' | 'question'
  tags: string[]
  is_pinned: boolean
  ai_explanation?: string
  created_at: string
  updated_at?: string
}
