<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Star, Clock, ChevronRight, Search, MapPin, Heart, TrendingUp, Zap, ArrowRight, ArrowUp } from 'lucide-vue-next'
import { useRestaurantStore } from '../stores/restaurant'
import { useFavoritesStore } from '../stores/favorites'
import { useCartStore } from '../stores/cart'
import { useBlogStore } from '../stores/blog'
import { handleImageError, slugify } from '../utils/helpers'
import { useSEO } from '../composables/useSEO'

const router = useRouter()
const route = useRoute()
const restaurantStore = useRestaurantStore()
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const blogStore = useBlogStore()

useSEO({
  title: 'Elysium Eats | Gourmet Food Delivery',
  description: 'Discover and order the finest culinary masterpieces from Michelin-starred restaurants delivered to your doorstep.'
})

const searchInput = ref('')
const activeSlide = ref(0)
const showBackToTop = ref(false)
const visibleDishesCount = ref(8)

const loadMoreDishes = () => {
  visibleDishesCount.value += 8
}

const latestBlogs = computed(() => blogStore.latestBlogs)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 1000
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const restaurants = computed(() => restaurantStore.filteredRestaurants)
const categories = computed(() => restaurantStore.categories)
const deals = computed(() => restaurantStore.deals)
const popularItems = computed(() => restaurantStore.popularItems)
const allDishes = computed(() => {
  let dishes = restaurantStore.allDishes
  if (restaurantStore.activeCategory) {
    const cat = categories.value.find(c => c.id === restaurantStore.activeCategory)
    if (cat) {
      const catName = cat.name.toLowerCase()
      dishes = dishes.filter(d => 
        d.cuisine.toLowerCase().includes(catName) || 
        d.name.toLowerCase().includes(catName) ||
        d.tags?.some(t => t.toLowerCase().includes(catName))
      )
    }
  }
  if (searchInput.value) {
    const q = searchInput.value.toLowerCase()
    dishes = dishes.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.description.toLowerCase().includes(q)
    )
  }
  return dishes
})

const displayedDishes = computed(() => allDishes.value.slice(0, visibleDishesCount.value))

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await restaurantStore.fetchRestaurants()
  if (route.query.search) {
    searchInput.value = route.query.search
    restaurantStore.setSearchQuery(route.query.search)
  }
  // Auto-rotate deals
  setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % deals.value.length
  }, 4000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleSearch = () => {
  restaurantStore.setSearchQuery(searchInput.value)
}

const goToRestaurant = (name) => {
  router.push(`/restaurant/${slugify(name)}`)
}

const addPopularToCart = (item) => {
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
  <div class="animate-fade-in">
    <!-- Hero Section -->
    <section class="relative h-[650px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Dining"
          class="w-full h-full object-cover scale-105"
          style="animation: slowZoom 20s ease-in-out infinite alternate;"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-luxury-black/90 via-luxury-black/70 to-luxury-black/40"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div class="inline-flex items-center gap-2 bg-luxury-gold/20 backdrop-blur-md border border-luxury-gold/30 px-4 py-2 rounded-full text-luxury-gold text-sm font-medium">
            <Zap class="w-4 h-4" />
            <span>Premium Delivery in 20 min</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-serif text-white leading-tight">
            Elevate Your <br />
            <span class="text-luxury-gold italic">Dining Experience</span>
          </h1>
          <p class="text-lg text-neutral-300 max-w-lg leading-relaxed">
            Discover the finest culinary masterpieces curated from top-tier restaurants, delivered to your door with pristine care.
          </p>

          <!-- Search Bar -->
          <form @submit.prevent="handleSearch" class="bg-white p-2 rounded-2xl flex items-center shadow-2xl max-w-xl">
            <div class="flex items-center gap-3 px-4 flex-grow border-r border-neutral-200">
              <MapPin class="text-luxury-gold w-5 h-5 flex-shrink-0" />
              <input
                v-model="searchInput"
                type="text"
                placeholder="Search restaurants, cuisines..."
                class="w-full py-3 outline-none text-luxury-black placeholder-neutral-400 text-sm"
              />
            </div>
            <button type="submit" class="bg-luxury-black text-white p-4 rounded-xl hover:bg-luxury-gold transition-all duration-300 ml-2 hover:scale-105 active:scale-95">
              <Search class="w-5 h-5" />
            </button>
          </form>

          <!-- Stats -->
          <div class="flex gap-8 text-white/80">
            <div><span class="text-2xl font-bold text-luxury-gold">500+</span><p class="text-xs mt-1">Restaurants</p></div>
            <div><span class="text-2xl font-bold text-luxury-gold">15K+</span><p class="text-xs mt-1">Happy Diners</p></div>
            <div><span class="text-2xl font-bold text-luxury-gold">4.9</span><p class="text-xs mt-1">Avg Rating</p></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deals Carousel -->
    <section class="py-8 -mt-12 relative z-10">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-4">
          <div
            v-for="(deal, index) in deals"
            :key="deal.id"
            :class="[
              'relative rounded-2xl p-6 text-white overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl',
              `bg-gradient-to-br ${deal.bg}`
            ]"
          >
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 class="text-xl font-serif font-bold mb-1">{{ deal.title }}</h3>
            <p class="text-sm opacity-90 mb-3">{{ deal.subtitle }}</p>
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold">
              Code: {{ deal.code }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl font-serif text-luxury-black">Cuisine Collections</h2>
            <p class="text-neutral-500 text-sm mt-1">Explore by your favorite cuisine</p>
          </div>
        </div>

        <div class="flex gap-6 overflow-x-auto pb-8 hide-scrollbar">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="restaurantStore.setActiveCategory(category.id)"
            :class="[
              'min-w-[140px] flex flex-col items-center gap-4 p-4 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer group hover:shadow-xl',
              restaurantStore.activeCategory === category.id
                ? 'border-luxury-gold bg-luxury-gold/5 shadow-lg scale-105'
                : 'border-neutral-100 bg-white hover:border-luxury-gold/40'
            ]"
          >
            <div class="w-20 h-20 rounded-2xl overflow-hidden shadow-inner">
              <img 
                :src="category.image" 
                :alt="category.name" 
                @error="handleImageError($event)"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span class="font-bold text-xs uppercase tracking-widest text-luxury-black group-hover:text-luxury-gold transition-colors">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Popular Items -->
    <section class="py-16 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
              <TrendingUp class="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <h2 class="text-3xl font-serif text-luxury-black">Trending Now</h2>
              <p class="text-neutral-500 text-sm mt-1">Most ordered dishes this week</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="item in popularItems"
            :key="item.id"
            class="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div class="relative h-40 overflow-hidden">
              <img 
                :src="item.image" 
                :alt="`${item.name} from ${item.restaurantName}`" 
                @error="handleImageError($event)"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <button
                @click.stop="favoritesStore.toggleItemFavorite(item.id)"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart :class="['w-4 h-4 transition-colors', favoritesStore.isItemFavorite(item.id) ? 'text-red-500 fill-current' : 'text-neutral-600']" />
              </button>
              <span class="absolute bottom-3 left-3 text-xs text-white/80 font-medium">{{ item.restaurantName }}</span>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-luxury-black text-sm line-clamp-1">{{ item.name }}</h3>
              <div class="flex items-center justify-between mt-3">
                <span class="text-luxury-gold font-bold">${{ item.price.toFixed(2) }}</span>
                <button
                  @click.stop="addPopularToCart(item)"
                  class="w-8 h-8 rounded-lg bg-luxury-black text-white flex items-center justify-center hover:bg-luxury-gold transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Restaurants Grid -->
    <section id="restaurants" class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 class="text-4xl font-serif text-luxury-black">Exclusive Partnerships</h2>
          <p class="text-neutral-500">Curated selection of Michelin-starred and highly acclaimed establishments.</p>
        </div>

        <div v-if="restaurants.length === 0" class="text-center py-20">
          <p class="text-2xl font-serif text-neutral-400 mb-4">No restaurants found</p>
          <p class="text-neutral-500 mb-6">Try adjusting your search or category filter</p>
          <button @click="restaurantStore.setSearchQuery(''); restaurantStore.activeCategory = null" class="btn-luxury">
            Clear Filters
          </button>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            @click="goToRestaurant(restaurant.name)"
            class="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <div class="relative h-56 overflow-hidden">
              <img 
                :src="restaurant.image" 
                :alt="`${restaurant.name} - ${restaurant.cuisine} Restaurant`" 
                @error="handleImageError($event, 'restaurant')"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-luxury-black/80 to-transparent"></div>

              <button
                @click.stop="favoritesStore.toggleRestaurantFavorite(restaurant.id)"
                class="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <Heart :class="['w-5 h-5 transition-colors', favoritesStore.isRestaurantFavorite(restaurant.id) ? 'text-red-500 fill-current' : 'text-white']" />
              </button>

              <div v-if="restaurant.promo" class="absolute top-4 right-4 bg-luxury-gold text-luxury-black px-3 py-1 rounded-full text-xs font-bold">
                {{ restaurant.promo }}
              </div>
              <div v-else-if="restaurant.featured" class="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                Featured
              </div>

              <div class="absolute bottom-0 left-0 w-full p-6 text-white">
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-luxury-gold font-medium text-sm mb-1">{{ restaurant.cuisine }}</p>
                    <h3 class="text-2xl font-serif">{{ restaurant.name }}</h3>
                  </div>
                  <div class="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Star class="w-4 h-4 text-luxury-gold fill-current" />
                    <span class="font-bold text-sm">{{ restaurant.rating }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-5 flex justify-between items-center bg-white">
              <div class="flex gap-4 text-sm text-neutral-500">
                <div class="flex items-center gap-1.5">
                  <Clock class="w-4 h-4 text-luxury-gold" />
                  <span>{{ restaurant.deliveryTime }}</span>
                </div>
                <span class="text-neutral-300">·</span>
                <span class="font-medium">Min. ${{ restaurant.minOrder }}</span>
              </div>
              <div class="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-white group-hover:border-luxury-gold transition-all duration-300">
                <ArrowRight class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Real Dishes Section (Global Collection) -->
    <section class="py-24 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 bg-luxury-gold/10 text-luxury-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <Zap class="w-4 h-4" />
              <span>Signature Selections</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-serif text-luxury-black">
              Real <span class="text-luxury-gold italic">Dishes</span>
            </h2>
            <p class="text-neutral-500 max-w-xl">
              Authentic culinary masterpieces from our partner restaurants, prepared with fresh ingredients and artisanal passion.
            </p>
          </div>
        </div>

        <!-- Dishes Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="item in displayedDishes"
            :key="item.id"
            class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-100 flex flex-col"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="item.image"
                :alt="`${item.name} - ${item.cuisine} delicacy`"
                @error="handleImageError($event)"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div class="absolute top-4 left-4">
                <div class="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-luxury-black uppercase tracking-wider shadow-sm border border-neutral-100">
                  {{ item.cuisine }}
                </div>
              </div>

              <button
                @click="addPopularToCart(item)"
                class="absolute bottom-4 right-4 bg-luxury-gold text-luxury-black p-3 rounded-2xl shadow-xl transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-luxury-black hover:text-white"
              >
                <Zap class="w-5 h-5" />
              </button>
            </div>

            <div class="p-6 flex-grow flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-serif text-xl text-luxury-black group-hover:text-luxury-gold transition-colors duration-300">
                  {{ item.name }}
                </h3>
                <span class="text-luxury-gold font-bold font-serif">${{ item.price }}</span>
              </div>
              <p class="text-neutral-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                {{ item.description }}
              </p>
              <div class="mt-auto flex items-center justify-between pt-4 border-t border-neutral-50">
                <div class="flex items-center gap-2 text-xs text-neutral-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ item.restaurantName }}
                </div>
                <div v-if="item.popular" class="flex items-center gap-1 text-amber-500">
                  <Star class="w-3 h-3 fill-current" />
                  <span class="text-[10px] font-bold uppercase">Popular</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="visibleDishesCount < allDishes.length" class="mt-16 text-center">
          <button 
            @click="loadMoreDishes"
            class="group inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-luxury-black text-luxury-black rounded-2xl font-bold hover:bg-luxury-black hover:text-white transition-all duration-300 active:scale-95"
          >
            Load More Dishes
            <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="allDishes.length === 0" class="py-20 text-center">
          <div class="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search class="w-10 h-10 text-neutral-300" />
          </div>
          <h3 class="text-2xl font-serif text-luxury-black mb-2">No dishes found</h3>
          <p class="text-neutral-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      </div>
    </section>

    <!-- Latest Blogs Section -->
    <section class="py-24 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-16">
          <div>
            <h2 class="text-4xl font-serif text-luxury-black">Culinary Insights</h2>
            <p class="text-neutral-500 mt-2">Latest stories, recipes, and news from our food experts.</p>
          </div>
          <RouterLink to="/blog" class="group flex items-center gap-3 text-luxury-gold font-bold hover:gap-4 transition-all">
            Explore All Articles <ArrowRight class="w-5 h-5" />
          </RouterLink>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="blog in latestBlogs" 
            :key="blog.id"
            @click="router.push(`/blog/${blog.id}`)"
            class="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer border border-neutral-100/50"
          >
            <div class="relative h-64 overflow-hidden">
              <img :src="blog.image" :alt="blog.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-luxury-black uppercase tracking-widest shadow-sm">
                {{ blog.category }}
              </div>
            </div>
            <div class="p-8">
              <div class="flex items-center gap-4 text-[11px] text-neutral-400 mb-4 uppercase tracking-wider font-bold">
                <span>{{ blog.date }}</span>
                <span class="w-1 h-1 bg-neutral-200 rounded-full"></span>
                <span>{{ blog.readTime }}</span>
              </div>
              <h3 class="text-xl font-serif font-bold text-luxury-black mb-4 group-hover:text-luxury-gold transition-colors line-clamp-2">
                {{ blog.title }}
              </h3>
              <p class="text-neutral-500 text-sm leading-relaxed line-clamp-2">
                {{ blog.excerpt }}
              </p>
              <div class="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between">
                <span class="text-xs font-bold text-neutral-400">By {{ blog.author }}</span>
                <span class="text-luxury-gold text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Read Article</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top Button -->
    <transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 left-8 z-40 bg-luxury-black text-white p-4 rounded-2xl shadow-2xl hover:bg-luxury-gold transition-all duration-300 group"
      >
        <ArrowUp class="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>
    </transition>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes slowZoom {
  0% { transform: scale(1.05); }
  100% { transform: scale(1.15); }
}
</style>
