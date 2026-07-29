<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import {
  LayoutDashboard, Store, LogOut, Menu, X, ChevronDown,
  UtensilsCrossed, Home, Package
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Restaurants', path: '/admin/restaurants', icon: Store },
]

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const logout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  router.push('/admin/login')
}

const goToSite = () => router.push('/')
</script>

<template>
  <div class="min-h-screen bg-neutral-900 flex">
    <!-- Sidebar Overlay -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      ></div>
    </transition>

    <!-- Sidebar -->
    <transition name="slide-left">
      <aside
        class="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col transform transition-transform lg:transform-none"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <div class="p-6 border-b border-neutral-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-luxury-gold/20 flex items-center justify-center">
                <UtensilsCrossed class="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h2 class="text-white font-serif font-bold text-lg">Admin</h2>
                <p class="text-neutral-500 text-xs">Elysium Eats</p>
              </div>
            </div>
            <button @click="sidebarOpen = false" class="lg:hidden text-neutral-500 hover:text-white">
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav class="flex-grow p-4 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            @click="sidebarOpen = false"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              isActive(item.path)
                ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </router-link>
        </nav>

        <div class="p-4 border-t border-neutral-800 space-y-2">
          <button
            @click="goToSite"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 w-full transition-all border border-transparent"
          >
            <Home class="w-5 h-5" />
            View Site
          </button>
          <button
            @click="logout"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-all border border-red-500/20"
          >
            <LogOut class="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </transition>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <button @click="sidebarOpen = true" class="lg:hidden text-neutral-400 hover:text-white">
          <Menu class="w-6 h-6" />
        </button>
        <div class="flex-grow"></div>
        <div class="flex items-center gap-3 text-sm text-neutral-400">
          <span class="hidden sm:inline">{{ adminUser.name || 'Admin' }}</span>
          <div class="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-bold text-xs">
            {{ (adminUser.name || 'A')[0].toUpperCase() }}
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 bg-neutral-950 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
