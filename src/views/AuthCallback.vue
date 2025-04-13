<script setup lang="ts">
import { useAuthStore } from '@/auth/authStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
  router.push('/')
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p>認証処理中...</p>
  </div>
</template>
