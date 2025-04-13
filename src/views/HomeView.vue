<script setup lang="ts">
import { FileText, MoreVertical, Pin, Search, Trash } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Badge from '@/components/ui/badge/Badge.vue'
</script>

<template>
  <div class="container mx-auto py-2">
    <div class="flex flex-col justify-center">
      <header class="py-7">
        <h1 class="text-4xl font-semibold">SmartNote</h1>
      </header>
      <div class="pb-6 border-b">
        <div class="relative w-full max-w-md items-center">
          <Input id="search" type="text" placeholder="Search..." class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <Search class="size-4 text-muted-foreground" />
          </span>
        </div>
      </div>
      <div class="grid gap-4 grid-cols-3 my-6">
        <div
          class="group relative flex flex-col cursor-pointer h-full rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
        >
          <div class="absolute right-2 top-2">
            <Pin class="h-4 w-4 text-primary" fill="currentColor" />
          </div>
          <div class="mb-2 flex items-center gap-2 pr-1">
            <div class="rounded p-1 bg-blue-100 text-blue-700">
              <FileText class="h-4 w-4" />
            </div>
            <h3 class="flex-1 truncate font-medium">メモタイトル</h3>
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
                <DropdownMenuItem class="cursor-pointer">
                  <Pin class="mr-2 h-4 w-4" />
                  ピン留め
                </DropdownMenuItem>
                <DropdownMenuItem class="text-destructive focus:text-destructive cursor-pointer">
                  <Trash class="mr-2 h-4 w-4" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p class="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">ジェネリクスについて</p>

          <div class="mt-auto">
            <div class="mb-2 flex flex-wrap gap-1">
              <Badge variant="secondary" class="text-xs rounded-xl">React</Badge>
            </div>
            <div class="text-xs text-muted-foreground">2025/4/10</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
