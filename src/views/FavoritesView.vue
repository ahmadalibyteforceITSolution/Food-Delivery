<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, Star, Clock, ArrowRight, ShoppingBag, Trash2 } from 'lucide-vue-next'
import { useFavoritesStore } from '../stores/favorites'
import { useRestaurantStore } from '../stores/restaurant'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const restaurantStore = useRestaurantStore()
const cartStore = useCartStore()

const favoriteRestaurants = computed(() => {
  return restaurantStore.restaurants.filter(r => favoritesStore.isRestaurantFavorite(r.id))
})

const favoriteItems = computed(() => {
  const items = []
  restaurantStore.restaurants.forEach(r => {
    r.menu.filter(m => favoritesStore.isItemFavorite(m.id)).forEach(m => {
      items.push({ ...m, restaurantId: r.id, restaurantName: r.name })
    })
  })
  return items
})

const goToRestaurant = (id) => router.push(`/restaurant/${id}`)

const addToCart = (item) => {
  cartStore.addToCart({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    restaurantId: item.restaurantId,
    restaurantName: item.restaurantName
  })
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-12 animate-fade-in">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="mb-12">
        <h1 class="text-4xl font-serif text-luxury-black mb-2">My Favorites</h1>
        <p class="text-neutral-500">Your curated collection of culinary gems</p>
      </div>

      <!-- Favorite Restaurants -->
      <div v-if="favoriteRestaurants.length > 0" class="mb-16">
        <h2 class="text-2xl font-serif text-luxury-black mb-6 flex items-center gap-3">
          <Heart class="w-6 h-6 text-red-500 fill-current" />
          Favorite Restaurants
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="restaurant in favoriteRestaurants"
            :key="restaurant.id"
            @click="goToRestaurant(restaurant.id)"
            class="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div class="relative h-44 overflow-hidden">
              <img :src="restaurant.image" :alt="restaurant.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <button
                @click.stop="favoritesStore.toggleRestaurantFavorite(restaurant.id)"
                class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart class="w-4 h-4 text-red-500 fill-current" />
              </button>
              <div class="absolute bottom-3 left-3 text-white">
                <p class="text-luxury-gold text-xs font-medium mb-1">{{ restaurant.cuisine }}</p>
                <h3 class="text-lg font-serif">{{ restaurant.name }}</h3>
              </div>
            </div>
            <div class="p-4 flex items-center justify-between">
              <div class="flex gap-3 text-xs text-neutral-500">
                <span class="flex items-center gap-1"><Star class="w-3.5 h-3.5 text-luxury-gold fill-current" /> {{ restaurant.rating }}</span>
                <span class="flex items-center gap-1"><Clock class="w-3.5 h-3.5" /> {{ restaurant.deliveryTime }}</span>
              </div>
              <ArrowRight class="w-4 h-4 text-neutral-400 group-hover:text-luxury-gold transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <!-- Favorite Items -->
      <div v-if="favoriteItems.length > 0" class="mb-16">
        <h2 class="text-2xl font-serif text-luxury-black mb-6 flex items-center gap-3">
          <Heart class="w-6 h-6 text-red-500 fill-current" />
          Favorite Dishes
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="item in favoriteItems"
            :key="item.id"
            class="bg-white rounded-2xl p-4 flex gap-4 border border-neutral-100 shadow-sm hover:shadow-md transition-all group"
          >
            <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
            <div class="flex-grow flex flex-col justify-between">
              <div>
                <p class="text-xs text-neutral-400">{{ item.restaurantName }}</p>
                <h3 class="font-semibold text-luxury-black">{{ item.name }}</h3>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-luxury-gold font-bold">${{ item.price.toFixed(2) }}</span>
                <div class="flex gap-2">
                  <button @click="favoritesStore.toggleItemFavorite(item.id)" class="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <button @click="addToCart(item)" class="flex items-center gap-1.5 px-3 py-1.5 bg-luxury-black text-white rounded-lg text-xs font-medium hover:bg-luxury-gold hover:text-luxury-black transition-all">
                    <ShoppingBag class="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="favoriteRestaurants.length === 0 && favoriteItems.length === 0" class="text-center py-24">
        <div class="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <Heart class="w-10 h-10 text-neutral-300" />
        </div>
        <h3 class="text-2xl font-serif text-neutral-400 mb-2">No favorites yet</h3>
        <p class="text-neutral-500 mb-8">Start exploring and save your favorites</p>
        <button @click="router.push('/')" class="btn-luxury">Explore Restaurants</button>
      </div>
    </div>
  </div>
</template>
