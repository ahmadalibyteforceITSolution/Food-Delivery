<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-vue-next'
import { apiService } from '../../api'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const login = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await apiService.adminLogin({ email: email.value, password: password.value })
    localStorage.setItem('adminToken', res.token)
    localStorage.setItem('adminUser', JSON.stringify(res.user))
    router.push('/admin')
  } catch (err) {
    error.value = err.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-luxury-gold/10 mb-4">
          <UtensilsCrossed class="w-8 h-8 text-luxury-gold" />
        </div>
        <h1 class="text-3xl font-serif text-white font-bold">Admin Login</h1>
        <p class="text-neutral-500 mt-2 text-sm">Elysium Eats Management</p>
      </div>

      <form @submit.prevent="login" class="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 space-y-6">
        <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
          {{ error }}
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-neutral-300">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@elysiumeats.com"
            class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold transition-colors"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-neutral-300">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold transition-colors pr-12"
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-luxury-gold text-luxury-black font-bold py-3.5 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>
