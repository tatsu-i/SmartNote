<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ChartPie, FolderKanban, Library, Settings, Sparkles } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

const handleLoginLogout = () => {
  if (authStore.user) {
    authStore.logout()
  } else {
    router.push('/login')
  }
}

const handleSignUp = () => {
  router.push('/signup')
}

const mainItems = [
  {
    title: 'マイライブラリ',
    url: '/',
    icon: Library,
  },
  {
    title: 'プロジェクト',
    url: '/trend',
    icon: FolderKanban,
  },
  {
    title: '統計',
    url: '/recent',
    icon: ChartPie,
  },
]

const publicItems = [
  {
    title: 'パブリックメモ',
    url: '/mylibrary',
    icon: Library,
  },
]

const settingItems = [
  {
    title: '設定',
    url: '/mylibrary',
    icon: Settings,
  },
]
</script>

<template>
  <Sidebar>
    <div class="flex justify-center pt-2">
      <SidebarHeader class="text-2xl font-semibold">
        <RouterLink to="/">SmartNote</RouterLink>
      </SidebarHeader>
    </div>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-medium text-muted-foreground"
          >メインメニュー</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="mainItem in mainItems" :key="mainItem.title">
              <SidebarMenuButton asChild>
                <RouterLink
                  :to="mainItem.url"
                  :class="
                    cn(
                      'flex items-center gap-3 px-3 py-5 rounded-md text-sm transition-colors',
                      route.path === mainItem.url
                        ? 'bg-primary/10 text-primary font-medium hover:bg-primary/10 hover:text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )
                  "
                >
                  <component :is="mainItem.icon" class="h-4 w-4" />
                  <span>{{ mainItem.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-medium text-muted-foreground"
          >パブリック</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="publicItem in publicItems" :key="publicItem.title">
              <SidebarMenuButton asChild>
                <RouterLink
                  :to="authStore.user ? publicItem.url : '/login'"
                  :class="
                    cn(
                      'flex items-center gap-3 px-3 py-5 rounded-md text-sm transition-colors',
                      authStore.user ? '' : 'opacity-50',
                      route.path === publicItem.url
                        ? 'bg-primary/10 text-primary font-medium hover:bg-primary/10 hover:text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )
                  "
                >
                  <component :is="publicItem.icon" class="h-4 w-4" />
                  <span>{{ publicItem.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-medium text-muted-foreground"
          >設定</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="settingItem in settingItems" :key="settingItem.title">
              <SidebarMenuButton asChild>
                <RouterLink
                  :to="authStore.user ? settingItem.url : '/login'"
                  :class="
                    cn(
                      'flex items-center gap-3 px-3 py-5 rounded-md text-sm transition-colors',
                      authStore.user ? '' : 'opacity-50',
                      route.path === settingItem.url
                        ? 'bg-primary/10 text-primary font-medium hover:bg-primary/10 hover:text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )
                  "
                >
                  <component :is="settingItem.icon" class="h-4 w-4" />
                  <span>{{ settingItem.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <div v-if="!authStore.user">
        <div class="rounded-lg border border-primary/30 bg-primary/5 px-3 py-4 mb-4">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <Sparkles class="h-5 w-5 text-primary" />
              <h3 class="font-medium">プレミアムプランにアップグレード</h3>
            </div>
            <p class="text-sm text-muted-foreground">
              無制限のメモ作成、高度なAI解析などが利用可能に
            </p>
            <Button size="sm" class="mt-1 w-full py-5 text-sm"> アップグレード </Button>
          </div>
        </div>
      </div>
      <Button @click="handleLoginLogout" class="py-5 mb-0.5">{{
        authStore.user ? 'ログアウト' : 'ログイン'
      }}</Button>
      <Button
        @click="handleSignUp"
        :disabled="authStore.user"
        variant="outline"
        class="py-5 mb-5"
        >{{ authStore.user ? 'アカウント作成済み' : 'アカウント作成' }}</Button
      >
    </SidebarFooter>
  </Sidebar>
</template>
