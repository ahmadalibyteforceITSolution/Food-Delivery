<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartDrawer from './components/CartDrawer.vue'
import LoginModal from './components/LoginModal.vue'
import ToastNotification from './components/ToastNotification.vue'
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-grow pt-20">
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />

    <CartDrawer />
    <LoginModal />
    <ToastNotification />
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
