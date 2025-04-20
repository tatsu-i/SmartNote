<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import { SidebarProvider } from './components/ui/sidebar'
import { RouterView } from 'vue-router'
import AppSidebar from './views/AppSidebar.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
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
