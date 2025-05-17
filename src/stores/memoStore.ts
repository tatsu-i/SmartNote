import { supabase } from '@/supabase/supabase'
import { type aiQuickResponse, type aiResponse, type memoContent } from '@/utils/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from './authStore'

export const useMemoStore = defineStore('memo', () => {
  const authStore = useAuthStore()

  const user_id = computed(() => authStore.user.id)
  const memos = ref<memoContent[]>([])
  const aiData = ref<aiResponse>()
  const aiQuickData = ref<aiQuickResponse>()
  const loading = ref(false)
  const error = ref('')

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

  const addNormalMemo = async (newMemo: string, type: 'text' | 'code', tags: string[]) => {
    const userData = {
      memo_type: type,
      user_memo: newMemo,
      user_tags: tags,
    }

    const tempMemo: memoContent = {
      id: crypto.randomUUID(),
      user_id: user_id.value,
      title: '生成中...',
      is_pinned: false,
      type,
      user_memo: newMemo,
      ai_explanation: '生成中...',
      tags,
      created_at: new Date().toISOString(),
      isGenerating: true,
    }

    memos.value.push(tempMemo)

    try {
      loading.value = true
      const response = await fetch('http://localhost:3000/memo-ai-completions/normal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      aiData.value = await response.json()
      // console.log(aiData.value)

      const memo: memoContent = {
        id: tempMemo.id,
        user_id: user_id.value,
        title: aiData.value!.title,
        is_pinned: false,
        type,
        user_memo: newMemo,
        ai_explanation: aiData.value!.explanation,
        tags: aiData.value!.ai_tags,
        created_at: new Date().toISOString(),
      }

      const { data, error: insertError } = await supabase.from('memos').insert(memo).select()
      if (insertError) throw insertError
      if (data) {
        const index = memos.value.findIndex((m) => m.id === tempMemo.id)
        if (index !== -1) {
          memos.value[index] = data[0]
        }
      }
    } catch (err) {
      memos.value = memos.value.filter((m) => m.id !== tempMemo.id)
      error.value = `AIの生成に失敗しました:${err}`
    } finally {
      loading.value = false
    }
  }

  const addQuickMemo = async (quickMemo: string) => {
    const tempMemo: memoContent = {
      id: crypto.randomUUID(),
      user_id: user_id.value,
      title: '生成中...',
      is_pinned: false,
      type: 'text',
      user_memo: quickMemo,
      ai_explanation: '生成中...',
      tags: [],
      created_at: new Date().toISOString(),
      isGenerating: true,
    }

    memos.value.push(tempMemo)

    try {
      loading.value = true
      const response = await fetch('http://localhost:3000/memo-ai-completions/quick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_memo: quickMemo }),
      })

      aiQuickData.value = await response.json()
      console.log(aiQuickData.value)

      const memo: memoContent = {
        id: tempMemo.id,
        user_id: user_id.value,
        title: aiQuickData.value!.title,
        is_pinned: false,
        type: aiQuickData.value!.memo_type,
        user_memo: quickMemo,
        ai_explanation: aiQuickData.value!.explanation,
        tags: aiQuickData.value!.ai_tags,
        created_at: new Date().toISOString(),
      }

      const { data, error: insertError } = await supabase.from('memos').insert(memo).select()
      if (insertError) throw insertError
      if (data) {
        const index = memos.value.findIndex((m) => m.id === tempMemo.id)
        if (index !== -1) {
          memos.value[index] = data[0]
        }
      }
    } catch (err) {
      memos.value = memos.value.filter((m) => m.id !== tempMemo.id)
      error.value = `AIの生成に失敗しました:${err}`
    } finally {
      loading.value = false
    }
  }

  const deleteMemo = async (id: string) => {
    const memo = memos.value.find((memo) => memo.id === id)
    if (memo) {
      const { error: deleteError } = await supabase.from('memos').delete().eq('id', id)

      if (deleteError) {
        console.error('Delete Error:', deleteError)
        return
      }
      memos.value = memos.value.filter((memo) => memo.id !== id)
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

  const editTags = async (id: string, updatedTags: string[]) => {
    try {
      loading.value = true
      const memo = memos.value.find((memo) => memo.id === id)
      if (memo) {
        const { error: tagsError } = await supabase
          .from('memos')
          .update({ tags: updatedTags })
          .eq('id', id)
        if (tagsError) {
          throw tagsError
        }
        memo.tags = updatedTags
      }
    } catch (err) {
      console.error('Error editing tags:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    memos,
    loading,
    error,
    getMemo,
    addNormalMemo,
    addQuickMemo,
    deleteMemo,
    togglePin,
    editTags,
  }
})
