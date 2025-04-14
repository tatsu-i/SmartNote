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
import { dammyMemos } from '@/dammy'
import { cn } from '@/lib/utils'
import { ref } from 'vue'

const isCreatingMemo = ref(false)
</script>

<template>
  <div class="container mx-auto py-2">
    <div class="flex flex-col justify-center">
      <header class="py-7">
        <h1 class="text-4xl font-semibold">SmartNote</h1>
      </header>
      <div class="pb-5 border-b">
        <div class="relative w-full max-w-md items-center mb-5">
          <Input id="search" type="text" placeholder="Search..." class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-4 text-muted-foreground" />
          </span>
        </div>
        <div class="flex justify-between">
          <h2 class="font-bold text-xl">すべてのメモ</h2>
          <Button @click="() => (isCreatingMemo = !isCreatingMemo)" class="py-5">
            <PlusIcon class="mr-1 h-4 w-4" />
            新規メモ
          </Button>
        </div>
      </div>

      <div v-if="isCreatingMemo" class="rounded-lg border bg-card p-4 shadow-sm">
        <form v-on:submit="" class="space-y-4">
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
            <Button variant="ghost" size="icon">
              <X class="w-3 h-3" />
            </Button>
          </div>
        </form>
      </div>

      <div v-else-if="isCreatingMemo === false" class="grid gap-4 grid-cols-3 my-6">
        <div
          v-for="memo in dammyMemos"
          :key="memo.id"
          :class="
            cn(
              'group relative flex flex-col cursor-pointer h-full rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm',
              memo.isPinned ? 'border-primary/30 bg-primary/5' : '',
            )
          "
        >
          <div v-if="memo.isPinned" class="absolute right-2 top-2">
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
                <DropdownMenuItem @click="handlePin" class="cursor-pointer">
                  <Pin class="mr-2 h-4 w-4" />
                  {{ memo.isPinned ? 'ピン留めを解除' : 'ピン留め' }}
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
              {{ memo.content }}
            </code>
            <span v-else>{{ memo.content }}</span>
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
              {{ new Date(memo.updatedAt).toLocaleDateString('ja-JP') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
