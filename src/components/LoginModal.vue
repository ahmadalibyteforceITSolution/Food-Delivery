<script setup>
import { ref } from 'vue'
import { X, Mail, Lock, User, ArrowRight } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const isSignUp = ref(false)
const form = ref({
  name: '',
  email: '',
  password: ''
})

const submit = () => {
  if (isSignUp.value) {
    authStore.login({ name: form.value.name, email: form.value.email })
  } else {
    authStore.login({ name: form.value.email.split('@')[0], email: form.value.email })
  }
  form.value = { name: '', email: '', password: '' }
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="authStore.isLoginModalOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          @click="authStore.closeLoginModal"
          class="absolute inset-0 bg-luxury-black/70 backdrop-blur-sm"
        ></div>

        <!-- Modal -->
        <transition name="scale">
          <div
            v-if="authStore.isLoginModalOpen"
            class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <!-- Header gradient -->
            <div class="h-32 bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black flex items-center justify-center relative">
              <div class="absolute inset-0 opacity-20" style="background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'); background-size: cover; background-position: center;"></div>
              <h2 class="text-3xl font-serif text-white relative z-10">
                Elysium<span class="text-luxury-gold italic">Eats</span>
              </h2>
              <button
                @click="authStore.closeLoginModal"
                class="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="p-8">
              <h3 class="text-xl font-serif font-semibold text-luxury-black mb-1">
                {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
              </h3>
              <p class="text-neutral-500 text-sm mb-6">
                {{ isSignUp ? 'Join us for exclusive dining experiences' : 'Sign in to your account' }}
              </p>

              <form @submit.prevent="submit" class="space-y-4">
                <div v-if="isSignUp" class="relative">
                  <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Full Name"
                    class="input-luxury pl-12"
                    required
                  />
                </div>

                <div class="relative">
                  <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="Email Address"
                    class="input-luxury pl-12"
                    required
                  />
                </div>

                <div class="relative">
                  <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    v-model="form.password"
                    type="password"
                    placeholder="Password"
                    class="input-luxury pl-12"
                    required
                  />
                </div>

                <button type="submit" class="w-full btn-luxury py-4 flex items-center justify-center gap-2 text-base">
                  {{ isSignUp ? 'Create Account' : 'Sign In' }}
                  <ArrowRight class="w-5 h-5" />
                </button>
              </form>

              <div class="mt-6 text-center">
                <p class="text-sm text-neutral-500">
                  {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
                  <button
                    @click="isSignUp = !isSignUp"
                    class="text-luxury-gold font-semibold hover:underline ml-1"
                  >
                    {{ isSignUp ? 'Sign In' : 'Sign Up' }}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.scale-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
