<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Mail, Phone, MapPin, Save, LogOut, Camera, Shield } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { useFavoritesStore } from '../stores/favorites'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const favoritesStore = useFavoritesStore()

const isEditing = ref(false)
const editForm = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  address: authStore.user?.address || ''
})

const stats = computed(() => [
  { label: 'Total Orders', value: ordersStore.orders.length, icon: '📦' },
  { label: 'Favorites', value: favoritesStore.favoriteCount, icon: '❤️' },
  { label: 'Member Since', value: authStore.user ? new Date(authStore.user.joinedAt).toLocaleDateString([], { month: 'short', year: 'numeric' }) : 'N/A', icon: '📅' }
])

const saveProfile = () => {
  authStore.updateProfile(editForm.value)
  isEditing.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-12 animate-fade-in">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- Not logged in -->
      <div v-if="!authStore.isLoggedIn" class="text-center py-24">
        <div class="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <User class="w-10 h-10 text-neutral-300" />
        </div>
        <h3 class="text-2xl font-serif text-neutral-400 mb-2">Sign in to view your profile</h3>
        <p class="text-neutral-500 mb-8">Create an account to track orders, save favorites, and more</p>
        <button @click="authStore.openLoginModal" class="btn-luxury">Sign In / Sign Up</button>
      </div>

      <!-- Logged in -->
      <div v-else>
        <!-- Profile Header -->
        <div class="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm mb-8">
          <div class="h-32 bg-gradient-to-br from-luxury-black via-luxury-charcoal to-luxury-black relative">
            <div class="absolute inset-0 opacity-10" style="background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800'); background-size: cover;"></div>
          </div>
          <div class="px-8 pb-8 -mt-12 relative">
            <div class="flex items-end gap-6">
              <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-luxury-gold to-amber-600 flex items-center justify-center text-white text-3xl font-serif font-bold shadow-xl border-4 border-white">
                {{ authStore.userInitials }}
              </div>
              <div class="pb-2">
                <h1 class="text-2xl font-serif text-luxury-black">{{ authStore.userName }}</h1>
                <p class="text-neutral-500 text-sm">{{ authStore.user?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl p-5 border border-neutral-100 text-center shadow-sm">
            <span class="text-2xl mb-2 block">{{ stat.icon }}</span>
            <p class="text-xl font-bold text-luxury-black">{{ stat.value }}</p>
            <p class="text-xs text-neutral-500 mt-1">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-serif font-semibold text-luxury-black">Personal Information</h2>
            <button
              @click="isEditing = !isEditing"
              class="text-sm text-luxury-gold hover:text-luxury-black font-medium transition-colors"
            >
              {{ isEditing ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <div class="space-y-5">
            <div class="grid md:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="text-sm font-medium text-neutral-600 flex items-center gap-2">
                  <User class="w-4 h-4 text-neutral-400" /> Full Name
                </label>
                <input
                  v-model="editForm.name"
                  :disabled="!isEditing"
                  type="text"
                  :class="['input-luxury', !isEditing && 'bg-neutral-50 cursor-default']"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-neutral-600 flex items-center gap-2">
                  <Mail class="w-4 h-4 text-neutral-400" /> Email
                </label>
                <input
                  v-model="editForm.email"
                  :disabled="!isEditing"
                  type="email"
                  :class="['input-luxury', !isEditing && 'bg-neutral-50 cursor-default']"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <Phone class="w-4 h-4 text-neutral-400" /> Phone Number
              </label>
              <input
                v-model="editForm.phone"
                :disabled="!isEditing"
                type="tel"
                placeholder="Add phone number"
                :class="['input-luxury', !isEditing && 'bg-neutral-50 cursor-default']"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <MapPin class="w-4 h-4 text-neutral-400" /> Default Address
              </label>
              <textarea
                v-model="editForm.address"
                :disabled="!isEditing"
                rows="2"
                placeholder="Add delivery address"
                :class="['input-luxury resize-none', !isEditing && 'bg-neutral-50 cursor-default']"
              ></textarea>
            </div>

            <button
              v-if="isEditing"
              @click="saveProfile"
              class="btn-luxury flex items-center gap-2"
            >
              <Save class="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        <!-- Logout -->
        <button
          @click="handleLogout"
          class="w-full py-4 bg-white border border-red-200 text-red-500 rounded-2xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut class="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  </div>
</template>
