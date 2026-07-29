<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Store, UtensilsCrossed, TrendingUp, Star, Package, DollarSign, ArrowRight } from 'lucide-vue-next'
import { apiService } from '../../api'

const router = useRouter()
const token = localStorage.getItem('adminToken')
const restaurants = ref([])
const loading = ref(true)

const stats = computed(() => ({
  totalRestaurants: restaurants.value.length,
  totalDishes: restaurants.value.reduce((sum, r) => sum + (r.menu?.length || 0), 0),
  popularDishes: restaurants.value.reduce((sum, r) => sum + (r.menu?.filter(m => m.popular)?.length || 0), 0),
  avgRating: restaurants.value.length ? (restaurants.value.reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.value.length).toFixed(1) : '0'
}))

onMounted(async () => {
  try {
    restaurants.value = await apiService.getAdminRestaurants(token)
  } catch (err) {
    console.error('Failed to load restaurants:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-serif text-white font-bold">Dashboard</h1>
      <p class="text-neutral-500 mt-1">Overview of your restaurant platform</p>
    </div>

    <!-- Stats Cards -->
    <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
            <Store class="w-6 h-6 text-luxury-gold" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white">{{ stats.totalRestaurants }}</p>
            <p class="text-sm text-neutral-500">Restaurants</p>
          </div>
        </div>
      </div>

      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <UtensilsCrossed class="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white">{{ stats.totalDishes }}</p>
            <p class="text-sm text-neutral-500">Total Dishes</p>
          </div>
        </div>
      </div>

      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white">{{ stats.popularDishes }}</p>
            <p class="text-sm text-neutral-500">Popular Items</p>
          </div>
        </div>
      </div>

      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Star class="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p class="text-3xl font-bold text-white">{{ stats.avgRating }}</p>
            <p class="text-sm text-neutral-500">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <!-- Quick Links -->
    <div class="grid md:grid-cols-2 gap-6">
      <button
        @click="router.push('/admin/restaurants')"
        class="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-left hover:border-luxury-gold/30 transition-all group"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-serif text-white font-bold mb-2">Manage Restaurants</h3>
            <p class="text-neutral-500 text-sm">Add, edit, or remove restaurants and their menus</p>
          </div>
          <ArrowRight class="w-6 h-6 text-luxury-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
        </div>
      </button>

      <button
        @click="router.push('/admin/restaurants')"
        class="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-left hover:border-luxury-gold/30 transition-all group"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-serif text-white font-bold mb-2">Add New Dishes</h3>
            <p class="text-neutral-500 text-sm">Create new menu items for any restaurant</p>
          </div>
          <ArrowRight class="w-6 h-6 text-luxury-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
        </div>
      </button>
    </div>
  </div>
</template>
