<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, Clock, Info, ArrowLeft, Plus, Heart, ShieldCheck, Minus } from 'lucide-vue-next'
import { useRestaurantStore } from '../stores/restaurant'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
import { handleImageError } from '../utils/helpers'
import { useSEO } from '../composables/useSEO'

const route = useRoute()
const router = useRouter()
const restaurantStore = useRestaurantStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const restaurantNameSlug = route.params.name
const restaurant = computed(() => restaurantStore.getRestaurantBySlug(restaurantNameSlug))

watchEffect(() => {
  if (restaurant.value) {
    useSEO({
      title: `${restaurant.value.name} | Order Online | Elysium Eats`,
      description: `Order from ${restaurant.value.name}. Specializing in ${restaurant.value.cuisine}. Rated ${restaurant.value.rating}/5. Delivery in ${restaurant.value.deliveryTime}.`,
      image: restaurant.value.image
    })
  }
})

const itemQuantities = ref({})

const goBack = () => {
  router.push('/')
}

const getItemQty = (itemId) => {
  const cartItem = cartStore.items.find(i => i.id === itemId)
  return cartItem ? cartItem.quantity : 0
}

const addToCart = (item) => {
  cartStore.addToCart({
    ...item,
    restaurantId: restaurant.value.id,
    restaurantName: restaurant.value.name
  })
}
</script>

<template>
  <div v-if="restaurant" class="bg-neutral-50 min-h-screen pb-20 animate-fade-in">
    <!-- Header Image -->
    <div class="relative h-[450px]">
      <img 
        :src="restaurant.image" 
        :alt="`${restaurant.name} - ${restaurant.cuisine} Premium Dining`" 
        @error="handleImageError($event, 'restaurant')"
        class="w-full h-full object-cover" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent"></div>

      <!-- Back Button -->
      <button
        @click="goBack"
        class="absolute top-8 left-4 md:left-8 bg-white/20 backdrop-blur-md p-3 rounded-xl text-white hover:bg-white hover:text-luxury-black transition-all duration-300"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>

      <!-- Favorite Button -->
      <button
        @click="favoritesStore.toggleRestaurantFavorite(restaurant.id)"
        class="absolute top-8 right-4 md:right-8 bg-white/20 backdrop-blur-md p-3 rounded-xl text-white hover:bg-white transition-all duration-300"
      >
        <Heart :class="['w-6 h-6', favoritesStore.isRestaurantFavorite(restaurant.id) ? 'text-red-500 fill-current' : '']" />
      </button>

      <!-- Restaurant Info Overlay -->
      <div class="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
        <div class="container mx-auto">
          <div v-if="restaurant.promo" class="inline-flex items-center gap-2 bg-luxury-gold/20 backdrop-blur-md border border-luxury-gold/30 px-4 py-2 rounded-full text-luxury-gold text-sm font-medium mb-4">
            <span>🎉 {{ restaurant.promo }}</span>
          </div>
          <p class="text-luxury-gold font-medium mb-2 uppercase tracking-widest text-sm">{{ restaurant.cuisine }}</p>
          <h1 class="text-4xl md:text-6xl font-serif mb-4">{{ restaurant.name }}</h1>

          <div class="flex flex-wrap gap-4 text-sm font-medium">
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Star class="w-5 h-5 text-luxury-gold fill-current" />
              <span>{{ restaurant.rating }}</span>
              <span class="text-white/60">({{ restaurant.reviewCount }}+)</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Clock class="w-5 h-5 text-luxury-gold" />
              <span>{{ restaurant.deliveryTime }}</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Info class="w-5 h-5 text-luxury-gold" />
              <span>Min. ${{ restaurant.minOrder }}</span>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex gap-2 mt-4">
            <span v-for="tag in restaurant.tags" :key="tag" class="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white/80 border border-white/10">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8 border-b border-neutral-200 pb-4">
        <h2 class="text-3xl font-serif text-luxury-black">Culinary Masterpieces</h2>
        <span class="text-neutral-500 text-sm">{{ restaurant.menu.length }} items</span>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="item in restaurant.menu"
          :key="item.id"
          class="bg-white rounded-2xl p-5 flex gap-5 border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
          <!-- Popular Badge -->
          <div v-if="item.popular" class="absolute top-3 left-3 bg-luxury-gold text-luxury-black px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider z-10">
            Popular
          </div>

          <!-- Item Details -->
          <div class="flex-grow flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-serif font-medium text-luxury-black mb-2">{{ item.name }}</h3>
              <p class="text-neutral-500 text-sm line-clamp-2 leading-relaxed">{{ item.description }}</p>
            </div>
            <div class="flex items-center justify-between mt-4">
              <span class="text-xl font-semibold text-luxury-gold">${{ item.price.toFixed(2) }}</span>

              <div class="flex items-center gap-2">
                <!-- Fav -->
                <button
                  @click="favoritesStore.toggleItemFavorite(item.id)"
                  class="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <Heart :class="['w-4 h-4', favoritesStore.isItemFavorite(item.id) ? 'text-red-500 fill-current' : 'text-neutral-400']" />
                </button>

                <!-- Add to Cart -->
                <div v-if="getItemQty(item.id) > 0" class="flex items-center gap-2 bg-luxury-black rounded-xl overflow-hidden">
                  <button @click="cartStore.updateQuantity(item.id, getItemQty(item.id) - 1)" class="p-2 text-white hover:bg-luxury-gold transition-colors">
                    <Minus class="w-4 h-4" />
                  </button>
                  <span class="text-white text-sm font-bold w-6 text-center">{{ getItemQty(item.id) }}</span>
                  <button @click="addToCart(item)" class="p-2 text-white hover:bg-luxury-gold transition-colors">
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
                <button
                  v-else
                  @click="addToCart(item)"
                  class="flex items-center gap-2 px-4 py-2 bg-luxury-black text-white rounded-xl text-sm font-medium hover:bg-luxury-gold hover:text-luxury-black transition-all active:scale-95"
                >
                  <Plus class="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>

          <!-- Item Image -->
          <div class="w-32 h-32 flex-shrink-0">
            <img 
              :src="item.image" 
              :alt="`${item.name} - ${restaurant.name} Signature Dish`" 
              @error="handleImageError($event)"
              class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Trust Bar -->
    <div class="container mx-auto px-4 pb-12">
      <div class="bg-white rounded-2xl p-6 border border-neutral-100 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-500">
        <div class="flex items-center gap-2"><ShieldCheck class="w-5 h-5 text-green-500" /> Quality Guaranteed</div>
        <div class="flex items-center gap-2"><Clock class="w-5 h-5 text-luxury-gold" /> Fast Delivery</div>
        <div class="flex items-center gap-2"><Star class="w-5 h-5 text-luxury-gold fill-current" /> Top Rated</div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-xl text-neutral-500 mb-4">Restaurant not found.</p>
      <button @click="goBack" class="btn-luxury">Back to Home</button>
    </div>
  </div>
</template>
