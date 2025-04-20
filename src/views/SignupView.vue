<script lang="ts">
export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full p-4 lg:p-0'
</script>
<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

const authStore = useAuthStore()
const statusMessage = ref()

const router = useRouter()

const handleGoogleLogin = async () => {
  await authStore.loginWithGoogle()
  statusMessage.value = authStore.error
    ? 'サインアップに失敗しました'
    : 'サインアップに成功しました'
}

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .required('メールアドレスは必須です')
      .email('有効なメールアドレスを入力してください'),
    password: yup.string().required().min(6, '6文字以上入力してください'),
  }),
})

const [email, emailProps] = defineField('email', {
  validateOnModelUpdate: false,
})

const [password, passwordProps] = defineField('password', {
  validateOnModelUpdate: false,
})

const onSubmit = handleSubmit(async (values) => {
  //   console.log(values)
  const { email, password } = values
  await authStore.signUpWithPassword(email, password)
  if (authStore.error) {
    statusMessage.value = 'サインアップに失敗しました'
  } else {
    statusMessage.value = 'サインアップに成功しました'
    router.push('/auth/callback')
  }
})
</script>

<template>
  <div class="w-full h-screen lg:grid lg:grid-cols-2">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">SignUp</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div @submit="onSubmit" class="grid gap-4">
          <form action="">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                v-model="email"
                v-bind="emailProps"
                required
              />
              <div class="text-red-900 mb-4">{{ errors.email }}</div>
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                v-model="password"
                v-bind="passwordProps"
                required
              />
              <div class="text-red-900 mb-4">{{ errors.password }}</div>
            </div>
            <Button type="submit" class="w-full mb-4"> SignUp </Button>
            <Button variant="outline" @click="handleGoogleLogin" class="w-full">
              SignUp with Google
            </Button>
            <div class="flex justify-center p-4">
              <div class="text-red-900">
                {{ statusMessage }}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="/placeholder.svg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
