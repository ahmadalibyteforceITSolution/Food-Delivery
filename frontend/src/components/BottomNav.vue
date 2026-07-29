<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, Heart, ClipboardList, User, ShoppingBag } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

const tabs = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Favorites', icon: Heart, path: '/favorites' },
  { name: 'Orders', icon: ClipboardList, path: '/orders' },
  { name: 'Profile', icon: User, path: authStore.isLoggedIn ? '/profile' : '#', action: 'profile' },
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const cartCount = computed(() => cartStore.totalItems)

const handleTab = (tab) => {
  if (tab.action === 'profile' && !authStore.isLoggedIn) {
    authStore.openLoginModal()
    return
  }
  router.push(tab.path)
}
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-200 safe-area-bottom">
    <div class="flex items-center justify-around py-1">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="handleTab(tab)"
        :class="[
          'flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all relative min-w-0',
          isActive(tab.path)
            ? 'text-luxury-gold'
            : 'text-neutral-400 hover:text-neutral-600'
        ]"
      >
        <component :is="tab.icon" class="w-5 h-5" />
        <span class="text-[10px] font-medium">{{ tab.name }}</span>
      </button>

      <!-- Cart Button -->
      <button
        @click="cartStore.toggleCart()"
        class="relative -mt-4"
      >
        <div class="w-12 h-12 rounded-full bg-luxury-black flex items-center justify-center shadow-lg hover:bg-luxury-gold transition-colors">
          <ShoppingBag class="w-5 h-5 text-white" />
        </div>
        <span
          v-if="cartCount > 0"
          class="absolute -top-1 -right-1 bg-luxury-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow"
        >
          {{ cartCount > 99 ? '99+' : cartCount }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
