import { defineStore } from 'pinia'
import { ref } from 'vue'
import { signInWithGoogle, signOut, signUp, supabase } from '../supabase/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref()
  const loading = ref(true)
  const error = ref()
  const initializeError = ref()
  const logoutError = ref()

  const initialize = async () => {
    loading.value = true
    try {
      const { data, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      user.value = data.user
    } catch (err) {
      initializeError.value = err
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    loading.value = true
    try {
      const { error: signInError } = await signInWithGoogle()
      if (signInError) throw signInError
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const signUpWithPassword = async (email, password) => {
    loading.value = true
    try {
      const { error: signUpError } = await signUp(email, password)
      if (signUpError) throw signUpError
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      const { error: signOutError } = await signOut()
      if (signOutError) throw signOutError
      user.value = null
    } catch (err) {
      logoutError.value = err
    } finally {
      loading.value = false
    }
  }

  // 認証状態の監視
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })

  return {
    user,
    loading,
    initializeError,
    error,
    logoutError,
    initialize,
    loginWithGoogle,
    signUpWithPassword,
    logout,
  }
})
