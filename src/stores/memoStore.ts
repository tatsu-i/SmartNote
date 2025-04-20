import { supabase } from '@/supabase/supabase'
import type { memoContent } from '@/utils/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from './authStore'

export const useMemoStore = defineStore('memo', () => {
  const authStore = useAuthStore()

  const user_id = computed(() => authStore.user.id)
  const memos = ref<memoContent[]>([])
  const loading = ref(false)
  const error = ref('')

  const addMemo = async (newMemo: string, type: 'text' | 'code' | 'question', tags: string[]) => {
    try {
      // console.log(user_id.value)
      loading.value = true
      const memo: memoContent = {
        id: crypto.randomUUID(),
        user_id: user_id.value,
        title: 'メモのタイトル',
        is_pinned: false,
        type,
        user_memo: newMemo,
        ai_explanation: 'AIによる説明',
        tags,
        created_at: new Date().toISOString(),
      }

      const { data, error: insertError } = await supabase.from('memos').insert(memo).select()
      if (insertError) throw insertError
      // console.log(data)
      if (data) {
        memos.value.push(data[0])
      }
    } catch (err) {
      error.value = `メモを追加できませんでした：${err}`
    } finally {
      loading.value = false
    }
  }

  const getMemo = async () => {
    try {
      loading.value = true
      const { data, error: getError } = await supabase
        .from('memos')
        .select()
        .eq('user_id', user_id.value)
      if (getError) throw getError
      if (data) memos.value = data
    } catch (err) {
      error.value = `メモを取得できませんでした：${err}`
    } finally {
      loading.value = false
    }
  }

  const togglePin = async (id: string) => {
    const memo = memos.value.find((memo) => memo.id === id)
    if (memo) {
      const { error: toggleError } = await supabase
        .from('memos')
        .update({ is_pinned: !memo.is_pinned })
        .eq('id', id)
      if (toggleError) {
        console.error('Error toggling pin:', toggleError)
        return
      }
      memo.is_pinned = !memo.is_pinned
    }
  }

  return {
    memos,
    loading,
    addMemo,
    error,
    getMemo,
    togglePin,
  }
})
