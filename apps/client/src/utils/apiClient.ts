import { getAnonymousId } from './anonymousId'

export const apiRequest = (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Anonymous-ID': getAnonymousId(),
    ...(options.headers as Record<string, string>),
  }

  // 認証済みユーザーの場合はJWTトークンも追加
  const token = localStorage.getItem('supabase.auth.token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers,
  })
}
