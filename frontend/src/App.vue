<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import BottomNav from './components/BottomNav.vue'
import Footer from './components/Footer.vue'
import CartDrawer from './components/CartDrawer.vue'
import LoginModal from './components/LoginModal.vue'
import ToastNotification from './components/ToastNotification.vue'
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <template v-if="!isAdminRoute">
      <Navbar />
      <main class="flex-grow pt-20 pb-20 md:pb-0">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <BottomNav />
      <Footer />
      <CartDrawer />
      <LoginModal />
      <ToastNotification />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.container {
  max-width: 1200px;
}
</style>
