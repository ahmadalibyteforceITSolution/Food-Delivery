<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ShoppingBag, Search, Menu, X, Heart, User, LogOut, ClipboardList } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const cartItemsCount = computed(() => cartStore.totalItems)
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isProfileOpen = ref(false)
const isSearchExpanded = ref(false)
const searchQuery = ref('')

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'home', query: { search: searchQuery.value } })
    isSearchExpanded.value = false
  }
}

const handleProfileAction = (action) => {
  isProfileOpen.value = false
  if (action === 'profile') router.push('/profile')
  if (action === 'orders') router.push('/orders')
  if (action === 'favorites') router.push('/favorites')
  if (action === 'logout') authStore.logout()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-dropdown')) {
      isProfileOpen.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed w-full z-40 transition-all duration-500',
      isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 py-3' : 'bg-transparent py-5'
    ]"
  >
    <div class="container mx-auto px-4 flex justify-between items-center">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-xl bg-luxury-black flex items-center justify-center group-hover:bg-luxury-gold transition-colors duration-300">
          <span class="text-luxury-gold group-hover:text-white font-serif font-bold text-lg transition-colors duration-300">E</span>
        </div>
        <span class="text-xl font-serif font-bold text-luxury-black tracking-tight hidden sm:block">
          Elysium<span class="text-luxury-gold italic">Eats</span>
        </span>
      </RouterLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center space-x-8">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/blog" class="nav-link">Blog</RouterLink>
        <RouterLink to="/favorites" class="nav-link">Favorites</RouterLink>
        <RouterLink to="/orders" class="nav-link">My Orders</RouterLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <!-- Search Toggle -->
        <div class="relative">
          <button
            @click="isSearchExpanded = !isSearchExpanded"
            class="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-luxury-gold"
          >
            <Search class="w-5 h-5" />
          </button>
          <transition name="search-expand">
            <div
              v-if="isSearchExpanded"
              class="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 p-3 z-50"
            >
              <form @submit.prevent="handleSearch" class="flex gap-2">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  class="flex-1 px-4 py-2.5 bg-neutral-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-luxury-gold/30 border border-neutral-200"
                  autofocus
                />
                <button type="submit" class="px-4 py-2.5 bg-luxury-black text-white rounded-xl hover:bg-luxury-gold transition-colors">
                  <Search class="w-4 h-4" />
                </button>
              </form>
            </div>
          </transition>
        </div>

        <!-- Favorites -->
        <RouterLink
          to="/favorites"
          class="hidden sm:flex p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-luxury-gold relative"
        >
          <Heart class="w-5 h-5" />
          <span
            v-if="favoritesStore.favoriteCount > 0"
            class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full"
          >
            {{ favoritesStore.favoriteCount }}
          </span>
        </RouterLink>

        <!-- Cart -->
        <button
          @click="cartStore.toggleCart"
          class="relative p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-luxury-gold group"
        >
          <ShoppingBag class="w-5 h-5" />
          <span
            v-if="cartItemsCount > 0"
            class="absolute -top-0.5 -right-0.5 bg-luxury-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce-once"
          >
            {{ cartItemsCount }}
          </span>
        </button>

        <!-- Profile / Login -->
        <div class="relative profile-dropdown">
          <button
            v-if="authStore.isLoggedIn"
            @click="isProfileOpen = !isProfileOpen"
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-luxury-gold to-amber-600 text-white font-bold flex items-center justify-center text-sm hover:scale-105 transition-transform"
          >
            {{ authStore.userInitials }}
          </button>
          <button
            v-else
            @click="authStore.openLoginModal"
            class="flex items-center gap-2 px-4 py-2.5 bg-luxury-black text-white rounded-xl text-sm font-medium hover:bg-luxury-gold hover:text-luxury-black transition-all"
          >
            <User class="w-4 h-4" />
            <span class="hidden sm:inline">Sign In</span>
          </button>

          <!-- Profile Dropdown -->
          <transition name="dropdown">
            <div
              v-if="isProfileOpen && authStore.isLoggedIn"
              class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 overflow-hidden"
            >
              <div v-if="authStore.isLoggedIn" class="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                <p class="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Signed in as</p>
                <p class="text-sm font-bold text-luxury-black truncate">{{ authStore.user?.email }}</p>
              </div>
              <div class="p-2 space-y-1">
                <button @click="handleProfileAction('profile')" class="dropdown-item rounded-xl">
                  <User class="w-4 h-4" /> My Profile
                </button>
                <button @click="handleProfileAction('orders')" class="dropdown-item rounded-xl">
                  <ClipboardList class="w-4 h-4" /> My Orders
                </button>
                <button @click="handleProfileAction('favorites')" class="dropdown-item rounded-xl">
                  <Heart class="w-4 h-4" /> Favorites
                </button>
                <div class="border-t border-neutral-100 mt-1 pt-1">
                  <button @click="handleProfileAction('logout')" class="dropdown-item rounded-xl text-red-500 hover:bg-red-50">
                    <LogOut class="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Mobile Toggle -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 text-neutral-600 rounded-xl hover:bg-neutral-100">
          <Menu v-if="!isMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-menu">
      <div v-if="isMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-t border-neutral-100 p-6 flex flex-col space-y-4">
        <RouterLink @click="isMenuOpen = false" to="/" class="mobile-link">Home</RouterLink>
        <RouterLink @click="isMenuOpen = false" to="/blog" class="mobile-link">Blog</RouterLink>
        <RouterLink @click="isMenuOpen = false" to="/favorites" class="mobile-link">Favorites</RouterLink>
        <RouterLink @click="isMenuOpen = false" to="/orders" class="mobile-link">My Orders</RouterLink>
        <RouterLink @click="isMenuOpen = false" to="/profile" class="mobile-link">Profile</RouterLink>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
@reference "../style.css";

.nav-link {
  @apply text-sm font-medium text-neutral-600 transition-colors relative;
}
.nav-link:hover {
  @apply text-luxury-gold;
}
.nav-link.router-link-active {
  @apply text-luxury-gold;
}
.nav-link.router-link-active::after {
  content: '';
  @apply absolute -bottom-1 left-0 w-full h-0.5 bg-luxury-gold rounded-full;
}
.dropdown-item {
  @apply w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left;
}
.mobile-link {
  @apply text-lg font-medium text-luxury-black transition-colors py-2 border-b border-neutral-100;
}
.mobile-link:hover {
  @apply text-luxury-gold;
}
.search-expand-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.search-expand-leave-active {
  transition: all 0.2s ease;
}
.search-expand-enter-from, .search-expand-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.dropdown-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.mobile-menu-enter-active {
  transition: all 0.3s ease;
}
.mobile-menu-leave-active {
  transition: all 0.2s ease;
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes bounce-once {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.animate-bounce-once {
  animation: bounce-once 0.4s ease;
}
</style>
