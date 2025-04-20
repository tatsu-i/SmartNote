<script setup lang="ts">
import {
  FileText,
  MoreVertical,
  Pin,
  Search,
  Trash,
  Code,
  HelpCircle,
  PlusIcon,
  Sparkles,
  X,
  Tag,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Badge from '@/components/ui/badge/Badge.vue'
import { cn } from '@/lib/utils'
import { computed, onMounted, ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'
import { useMemoStore } from '@/stores/memoStore'

const isCreatingMemo = ref(false)
const memoContent = ref('')
const tags = ref<string[]>([])
const selectedTab = ref<'text' | 'code' | 'question'>('text')

const memoStore = useMemoStore()
const memos = computed(() => memoStore.memos)
const sortedMemos = computed(() => {
  return [...memos.value].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) {
      return b.is_pinned ? 1 : -1
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
})

const handlePin = (id: string) => {
  memoStore.togglePin(id)
}

const handleSubmit = async () => {
  await memoStore.addMemo(memoContent.value, selectedTab.value, tags.value)
  if (!memoStore.error) {
    memoContent.value = ''
    tags.value = []
    isCreatingMemo.value = false
  }
}

const cancelCreateMemo = () => {
  isCreatingMemo.value = false
}

onMounted(async () => {
  await memoStore.getMemo()
})
</script>

<template>
  <div class="container mx-auto py-2">
    <div class="flex flex-col justify-center">
      <header class="py-7">
        <h1 class="text-4xl font-semibold">SmartNote</h1>
      </header>
      <div class="pb-3 border-b">
        <div class="relative w-full max-w-md items-center mb-5">
          <Input id="search" type="text" placeholder="Search..." class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-4 text-muted-foreground" />
          </span>
        </div>
        <div class="flex justify-between items-center">
          <h2 class="font-bold text-xl">すべてのメモ</h2>
          <Button @click="() => (isCreatingMemo = true)" class="py-5">
            <PlusIcon class="mr-1 h-4 w-4" />
            新規メモ
          </Button>
        </div>
      </div>

      <div v-if="isCreatingMemo" class="rounded-lg border bg-card p-4 shadow-sm">
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h2 class="font-semibold text-lg">新しいメモ</h2>
              <div
                class="flex items-center gap-1 rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
              >
                <Sparkles class="h-3 w-3" />
                <span>AIがタイトルとタグを自動生成</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" @click="cancelCreateMemo">
              <X class="w-3 h-3" />
            </Button>
          </div>
          <Tabs v-model="selectedTab" default-value="text" class="w-full">
            <TabsList class="w-full grid grid-cols-3">
              <TabsTrigger value="text">
                <div class="flex items-center gap-2">
                  <FileText class="h-4 w-4" />
                  <span>テキスト</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="code">
                <div class="flex items-center gap-2">
                  <Code class="h-4 w-4" />
                  <span>コード</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="question">
                <div class="flex items-center gap-2">
                  <HelpCircle class="h-4 w-4" />
                  <span>質問</span>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" class="mt-2">
              <Textarea
                placeholder="メモの内容を入力..."
                v-model="memoContent"
                class="min-h-[150px] w-full resize-y"
              />
            </TabsContent>
            <TabsContent value="code" class="mt-2">
              <Textarea
                placeholder="コードスニペットを入力..."
                v-model="memoContent"
                class="min-h-[150px] w-full resize-y font-mono"
              />
            </TabsContent>
            <TabsContent value="question" class="mt-2">
              <Textarea
                placeholder="質問内容を入力..."
                v-model="memoContent"
                class="min-h-[150px] w-full resize-y"
              />
            </TabsContent>
          </Tabs>

          <div class="border rounded-mg p-3">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <Tag class="h-4 w-4" />
                <span class="text-muted-foreground text-sm">タグ</span>
              </div>
              <div
                class="flex items-center gap-1 rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
              >
                <Sparkles class="h-3 w-3" />
                <span>AI生成</span>
              </div>
            </div>
            <TagsInput v-model="tags" class="py-3 my-2">
              <TagsInputItem v-model="tags" v-for="tag in tags" :key="tag" :value="tag">
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>

              <TagsInputInput placeholder="タグを追加" />
            </TagsInput>
            <p class="mt-3 text-xs text-muted-foreground">
              Enterキーでタグを追加、Backspaceキーで最後のタグを削除
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              タグを追加すると、AIが生成するタグと組み合わせて使用されます。入力は任意です。
            </p>
          </div>

          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="cancelCreateMemo">キャンセル</Button>
            <Button type="submit" :disabled="!memoContent" class="relative">
              <span
                v-if="memoStore.loading"
                class="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  class="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              <span :class="{ 'opacity-0': memoStore.loading }" class="flex items-center gap-1">
                <Sparkles class="mr-1 h-4 w-4" />
                保存
              </span>
            </Button>
          </div>
          <p v-if="memoStore.error" class="text-red-600 text-right text-sm">
            {{ memoStore.error }}
          </p>
        </form>
      </div>

      <div v-else-if="isCreatingMemo === false" class="grid gap-4 grid-cols-3 my-6">
        <div
          v-for="memo in sortedMemos"
          :key="memo.id"
          :class="
            cn(
              'group relative flex flex-col cursor-pointer h-full rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm',
              memo.is_pinned ? 'border-primary/30 bg-primary/5' : '',
            )
          "
        >
          <div v-if="memo.is_pinned" class="absolute right-2 top-2">
            <Pin class="h-4 w-4 text-primary" fill="currentColor" />
          </div>
          <div class="mb-2 flex items-center gap-2 pr-1">
            <div
              :class="
                cn(
                  'rounded p-1',
                  memo.type === 'text' && 'bg-blue-100 text-blue-700',
                  memo.type === 'code' && 'bg-green-100 text-green-700',
                  memo.type === 'question' && 'bg-amber-100 text-amber-700',
                )
              "
            >
              <FileText v-if="memo.type === 'text'" class="h-4 w-4" />
              <Code v-else-if="memo.type === 'code'" class="h-4 w-4" />
              <HelpCircle v-else-if="memo.type === 'question'" class="h-4 w-4" />
            </div>
            <h3 class="flex-1 truncate font-medium">{{ memo.title }}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="handlePin(memo.id)" class="cursor-pointer">
                  <Pin class="mr-2 h-4 w-4" />
                  {{ memo.is_pinned ? 'ピン留めを解除' : 'ピン留め' }}
                </DropdownMenuItem>
                <DropdownMenuItem class="text-destructive focus:text-destructive cursor-pointer">
                  <Trash class="mr-2 h-4 w-4" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p class="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
            <code v-if="memo.type === 'code'" class="block whitespace-pre-wrap font-mono text-xs">
              {{ memo.user_memo }}
            </code>
            <span v-else>{{ memo.user_memo }}</span>
          </p>
          <div class="mt-auto">
            <div class="mb-2 flex flex-wrap gap-1">
              <Badge
                v-for="tag in memo.tags.slice(0, 3)"
                :key="tag"
                variant="secondary"
                class="text-xs rounded-xl"
                >{{ tag }}</Badge
              >
              <Badge v-if="memo.tags.length > 3" variant="outline" class="text-xs"
                >+{{ memo.tags.length - 3 }}</Badge
              >
            </div>
            <div class="text-xs text-muted-foreground">
              {{ new Date(memo.updated_at).toLocaleDateString('ja-JP') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
