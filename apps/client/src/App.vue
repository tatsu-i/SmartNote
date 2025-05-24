<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import { SidebarProvider } from './components/ui/sidebar'
import { RouterView } from 'vue-router'
import AppSidebar from './views/AppSidebar.vue'
import { useMemoStore } from './stores/memoStore'

const authStore = useAuthStore()
const memoStore = useMemoStore()

onMounted(async () => {
  await authStore.initialize()
  await memoStore.getMemo()
})
</script>

<template>
  <div class="min-h-screen">
    <SidebarProvider>
      <AppSidebar />
      <RouterView />
    </SidebarProvider>
  </div>
</template>
