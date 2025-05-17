<script setup lang="ts">
import {
  FileText,
  MoreVertical,
  Pin,
  Search,
  Trash,
  Code,
  PlusIcon,
  Sparkles,
  X,
  Tag,
  Copy,
  Edit,
  Clock,
  ChevronUp,
  ChevronDown,
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
import { computed, onMounted, ref, watch } from 'vue'
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { memoContent } from '@/utils/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'

const isCreatingMemo = ref(false)
const memoContent = ref('')
const tags = ref<string[]>([])
const selectedTab = ref<'text' | 'code'>('text')
const selectedMemo = ref<memoContent>()
const showDeleteDialog = ref(false)
const editingTags = ref(false)
const quickMemoIsOpen = ref(true)
const quickMemoContent = ref('')

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

const handleSelectMemo = (memo: memoContent) => {
  selectedMemo.value = memo
}

const handlePin = (id: string) => {
  memoStore.togglePin(id)
}

const handleDelete = (id: string) => {
  memoStore.deleteMemo(id)
}

const startEditingTags = () => {
  tags.value = selectedMemo.value?.tags ? [...selectedMemo.value.tags] : []
  editingTags.value = true
}

const handleEditTags = async (id: string) => {
  await memoStore.editTags(id, tags.value)
  tags.value = []
  editingTags.value = false
}

let quickParseTimer: number | null = null

watch(quickMemoContent, () => {
  if (quickParseTimer) {
    clearTimeout(quickParseTimer)
  }

  quickParseTimer = window.setTimeout(() => {
    if (quickMemoContent.value) {
      memoStore.addQuickMemo(quickMemoContent.value)
      quickParseTimer = null
      quickMemoContent.value = ''
    }
  }, 5000)
})

const handleSubmit = async () => {
  isCreatingMemo.value = false
  await memoStore.addNormalMemo(memoContent.value, selectedTab.value, tags.value)
  if (!memoStore.error) {
    memoContent.value = ''
    tags.value = []
    // isCreatingMemo.value = false
  }
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

        <div class="relative bg-muted/50 p-3 rounded-md mb-5">
          <div
            @click="quickMemoIsOpen = !quickMemoIsOpen"
            class="flex items-center justify-between gap-2 mb-2 cursor-pointer"
          >
            <div class="flex items-center">
              <h3 class="px-3 text-sm font-semibold">クイックメモ</h3>
              <div class="flex items-center gap-1 text-sm text-muted-foreground opacity-100">
                <Clock class="h-3 w-3" />
                <span>5秒後に自動解析</span>
              </div>
            </div>
            <ChevronUp v-if="quickMemoIsOpen" class="h-4 w-4 text-muted-foreground" />
            <ChevronDown v-else class="h-4 w-4 text-muted-foreground" />
          </div>
          <div
            :class="
              cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                quickMemoIsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
              )
            "
          >
            <div class="flex flex-col gap-2 rounded-lg p-3">
              <textarea
                v-model="quickMemoContent"
                placeholder="単語やコードを入力すると、5秒後にAIが自動的に解説します..."
                class="w-full resize-none rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
              />
              <div class="flex justify-end">
                <Button type="button" size="sm" variant="outline" class="py-4 rounded-md">
                  <Sparkles class="mr-1 h-3 w-3" />
                  今すぐ解析
                </Button>
              </div>
              <p v-if="memoStore.error" class="text-red-600 text-right text-sm">
                {{ memoStore.error }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <h2 class="font-bold text-xl">すべてのメモ</h2>
          <Button @click="() => (isCreatingMemo = true)" class="py-5">
            <PlusIcon class="mr-1 h-4 w-4" />
            新規メモ
          </Button>
        </div>
      </div>

      <div v-if="isCreatingMemo" class="rounded-lg border bg-card p-4 my-6 shadow-sm">
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
            <Button variant="ghost" size="icon" @click="isCreatingMemo = false">
              <X class="w-3 h-3" />
            </Button>
          </div>
          <Tabs v-model="selectedTab" default-value="text" class="w-full">
            <TabsList class="w-full grid grid-cols-2">
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
            </TabsList>
            <TabsContent value="text" class="mt-2">
              <Textarea
                placeholder="メモの内容を入力..."
                v-model="memoContent"
                class="min-h-[150px] w-full resize-y focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </TabsContent>
            <TabsContent value="code" class="mt-2">
              <Textarea
                placeholder="コードスニペットを入力..."
                v-model="memoContent"
                class="min-h-[150px] w-full resize-y font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30"
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
            <Button type="button" variant="outline" @click="isCreatingMemo = false"
              >キャンセル</Button
            >
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

      <div
        v-else-if="isCreatingMemo === false && !selectedMemo"
        class="grid gap-4 grid-cols-3 my-6"
      >
        <div
          v-for="memo in sortedMemos"
          :key="memo.id"
          @click="() => handleSelectMemo(memo)"
          :class="
            cn(
              'group relative flex flex-col cursor-pointer h-full rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm',
              memo.is_pinned ? 'border-primary/30 bg-primary/5' : '',
              memo.isGenerating ? 'animate-pulse bg-muted/30' : '',
            )
          "
        >
          <div v-if="memo.is_pinned" class="absolute right-2 top-2">
            <Pin class="h-4 w-4 text-primary" fill="currentColor" />
          </div>
          <div class="mb-2 flex items-center gap-1 pr-1">
            <div
              :class="
                cn(
                  'rounded p-1',
                  memo.type === 'text' && !memo.isGenerating && 'bg-blue-100 text-blue-700',
                  memo.type === 'code' && !memo.isGenerating && 'bg-green-100 text-green-700',
                )
              "
            >
              <div v-if="memo.isGenerating" class="flex justify-center items-center">
                <div class="relative h-4 w-4">
                  <div
                    class="absolute inset-0 rounded-full border-2 border-t-primary/80 border-r-primary/40 border-b-primary/20 border-l-primary/60 animate-spin"
                  ></div>
                </div>
              </div>
              <template v-else>
                <FileText v-if="memo.type === 'text'" class="h-4 w-4" />
                <Code v-else-if="memo.type === 'code'" class="h-4 w-4" />
              </template>
            </div>
            <h3
              v-if="memo.isGenerating"
              class="flex-1 truncate font-medium flex items-center gap-2"
            >
              <span class="text-primary/70">生成中</span>
              <span class="flex gap-1">
                <span class="animate-bounce delay-0 h-1 w-1 rounded-full bg-primary/40"></span>
                <span class="animate-bounce delay-100 h-1 w-1 rounded-full bg-primary/60"></span>
                <span class="animate-bounce delay-200 h-1 w-1 rounded-full bg-primary/80"></span>
              </span>
            </h3>
            <h3 v-else class="flex-1 truncate font-medium">{{ memo.title }}</h3>
            <template v-if="!memo.isGenerating">
              <DropdownMenu>
                <DropdownMenuTrigger asChild @click.stop>
                  <Button
                    variant="ghost"
                    size="icon"
                    :class="
                      cn(
                        'h-8 w-8 mr-0.5 opacity-0 transition-opacity group-hover:opacity-100',
                        memo.is_pinned ? 'hover:bg-primary/10' : 'hover:bg-secondary/80',
                      )
                    "
                    class=""
                  >
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click.stop="handlePin(memo.id)" class="cursor-pointer">
                    <Pin class="mr-2 h-4 w-4" />
                    {{ memo.is_pinned ? 'ピン留めを解除' : 'ピン留め' }}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="handleDelete(memo.id)"
                    class="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash class="mr-2 h-4 w-4" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </template>
          </div>
          <template v-if="memo.isGenerating">
            <div class="space-y-2 flex-1">
              <Skeleton class="h-4 w-[90%]" />
              <Skeleton class="h-4 w-[70%]" />
              <Skeleton class="h-4 w-[80%]" />
            </div>
          </template>
          <template v-else>
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
                {{
                  memo.updated_at
                    ? new Date(memo.updated_at).toLocaleDateString('ja-JP')
                    : new Date(memo.created_at).toLocaleDateString('ja-JP')
                }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-if="selectedMemo" class="p-4">
        <Card class="overflow-hidden">
          <CardHeader class="flex flex-row items-center justify-between bg-muted/30 pb-2">
            <div class="flex items-center gap-2">
              <div
                :class="
                  cn(
                    'rounded-md p-1',
                    selectedMemo.type === 'text' && 'bg-blue-100 text-blue-700',
                    selectedMemo.type === 'code' && 'bg-green-100 text-green-700',
                  )
                "
              >
                <FileText v-if="selectedMemo.type === 'text'" class="h-4 w-4" />
                <Code v-else-if="selectedMemo.type === 'code'" class="h-4 w-4" />
              </div>
              <div class="flex items-center gap-2">
                <CardTitle class="text-base">{{ selectedMemo.title }}</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Sparkles class="h-4 w-4 text-primary" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AIが生成したタイトル</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                @click="() => handlePin(selectedMemo!.id)"
                :class="cn(selectedMemo.is_pinned ? 'text-primary' : 'text-muted-foreground')"
              >
                <Pin class="h-4 w-4" :fill="selectedMemo.is_pinned ? 'currentColor' : 'none'" />
              </Button>
              <Button variant="ghost" size="icon" @click="showDeleteDialog = !showDeleteDialog">
                <Trash class="h-4 w4" />
              </Button>
              <Button variant="ghost" size="icon" @click="selectedMemo = undefined">
                <X class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-4 space-y-6">
            <div>
              <h3 class="class=mb-2 text-sm font-medium text-muted-foreground">メモ内容</h3>
              <div v-if="selectedMemo.type === 'code'" class="relative">
                <pre
                  class="max-h-[300px] overflow-auto rounded-md bg-secondary p-4 font-mono text-sm"
                >
                  {{ selectedMemo.user_memo }}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  class="absolute top-2 right-2 hover:bg-primary/10 hover:text-primary"
                >
                  <Copy class="mr-1 h-3 w-3" />
                  コピー
                </Button>
              </div>
              <div v-else class="max-h-[300px] overflow-auto rounded-md bg-muted/30 p-4">
                <p class="whitespace-pre-wrap">{{ selectedMemo.user_memo }}</p>
              </div>
              <div class="mt-5">
                <div class="mb-2 flex items-center gap-2">
                  <h3 class="text-sm font-medium text-muted-foreground">AIによる解説</h3>
                  <Sparkles class="h-3 w-3 text-primary" />
                </div>
                <div class="rounded-md bg-secondary/40 p-4 relative">
                  <p class="whitespace-pre-wrap">{{ selectedMemo.ai_explanation }}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter class="flex flex-col items-start gap-4 border-t bg-muted/30 px-4 py-3">
            <div v-if="editingTags" class="w-full">
              <TagsInput v-model="tags" class="py-3 my-2">
                <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
                <TagsInputInput placeholder="タグを追加" />
              </TagsInput>
              <p class="mt-3 text-xs text-muted-foreground">
                Enterキーでタグを追加、Backspaceキーで最後のタグを削除
              </p>
              <div class="mt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="editingTags = false">
                  キャンセル
                </Button>
                <Button size="sm" @click="handleEditTags(selectedMemo.id)">
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
                    保存
                  </span>
                </Button>
              </div>
            </div>
            <div v-else class="w-full">
              <div class="mt-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-medium text-muted-foreground">タグ</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Sparkles class="h-4 w-4 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AIが生成したタイトル</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="startEditingTags"
                  class="h-7 px-2 text-xs"
                >
                  <Edit class="mr-1 h-4 w-4" />
                  編集
                </Button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <Badge
                  v-for="tag in selectedMemo.tags"
                  :key="tag"
                  variant="outline"
                  class="bg-background rounded-xl"
                >
                  {{ tag }}
                </Badge>
              </div>
            </div>
            <div class="flex w-full items-center justify-end gap-3 text-xs text-muted-foreground">
              <span
                >作成日：{{ new Date(selectedMemo.created_at).toLocaleDateString('ja-JP') }}</span
              >
              <span
                >更新日：{{
                  selectedMemo.updated_at
                    ? new Date(selectedMemo.updated_at).toLocaleDateString('ja-JP')
                    : '未更新'
                }}</span
              >
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
