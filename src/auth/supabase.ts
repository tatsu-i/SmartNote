import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

export const signUp = async (email, password) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}
