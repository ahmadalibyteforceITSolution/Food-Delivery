<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Edit3, Trash2, Store, Search, Star, Clock } from 'lucide-vue-next'
import { apiService } from '../../api'

const router = useRouter()
const token = localStorage.getItem('adminToken')
const restaurants = ref([])
const loading = ref(true)
const search = ref('')
const showAddModal = ref(false)
const form = ref({ name: '', cuisine: '', rating: 4.5, deliveryTime: '20-30 min', minOrder: 15, deliveryFee: 2.99, featured: false, promo: '', image: '', tags: [] })
const tagInput = ref('')
const saving = ref(false)

const filtered = ref([])

const load = async () => {
  loading.value = true
  try {
    restaurants.value = await apiService.getAdminRestaurants(token)
    filtered.value = restaurants.value
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const doSearch = () => {
  const q = search.value.toLowerCase()
  filtered.value = restaurants.value.filter(r =>
    r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
  )
}

const addTag = () => {
  if (tagInput.value.trim() && !form.value.tags.includes(tagInput.value.trim())) {
    form.value.tags.push(tagInput.value.trim())
  }
  tagInput.value = ''
}

const removeTag = (t) => {
  form.value.tags = form.value.tags.filter(x => x !== t)
}

const saveRestaurant = async () => {
  saving.value = true
  try {
    const saved = await apiService.createRestaurant(token, form.value)
    restaurants.value.push(saved)
    filtered.value = [...restaurants.value]
    showAddModal.value = false
    form.value = { name: '', cuisine: '', rating: 4.5, deliveryTime: '20-30 min', minOrder: 15, deliveryFee: 2.99, featured: false, promo: '', image: '', tags: [] }
  } catch (err) {
    alert(err.message)
  } finally {
    saving.value = false
  }
}

const deleteRestaurant = async (id, name) => {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
  try {
    await apiService.deleteRestaurant(token, id)
    restaurants.value = restaurants.value.filter(r => r.id !== id)
    filtered.value = [...restaurants.value]
  } catch (err) {
    alert(err.message)
  }
}

const editRestaurant = (id) => {
  router.push(`/admin/restaurants/${id}`)
}

const getCuisineColor = (c) => {
  const colors = {
    Italian: 'text-amber-400', Japanese: 'text-rose-400', Indian: 'text-emerald-400',
    American: 'text-red-400', Healthy: 'text-orange-400'
  }
  return colors[c] || 'text-neutral-400'
}

onMounted(load)
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-serif text-white font-bold">Restaurants</h1>
        <p class="text-neutral-500 mt-1">{{ restaurants.length }} total restaurants</p>
      </div>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center gap-2 bg-luxury-gold text-luxury-black px-5 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors"
      >
        <Plus class="w-5 h-5" /> Add Restaurant
      </button>
    </div>

    <!-- Search -->
    <div class="relative mb-6 max-w-md">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
      <input
        v-model="search"
        @input="doSearch"
        placeholder="Search restaurants..."
        class="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold transition-colors"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <!-- List -->
    <div v-else class="space-y-4">
      <div
        v-for="r in filtered"
        :key="r.id"
        class="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all"
      >
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800">
            <img :src="r.image" :alt="r.name" class="w-full h-full object-cover" @error="$event.target.style.display='none'" />
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-semibold text-white truncate">{{ r.name }}</h3>
              <span v-if="r.featured" class="text-[10px] bg-luxury-gold/10 text-luxury-gold px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
              <span :class="getCuisineColor(r.cuisine)">{{ r.cuisine }}</span>
              <span class="flex items-center gap-1"><Star class="w-3.5 h-3.5 text-amber-400" /> {{ r.rating }}</span>
              <span class="flex items-center gap-1"><Clock class="w-3.5 h-3.5" /> {{ r.deliveryTime }}</span>
              <span class="text-neutral-600">|</span>
              <span>{{ r.menu?.length || 0 }} dishes</span>
              <span v-if="r.promo" class="text-luxury-gold font-medium">{{ r.promo }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="editRestaurant(r.id)" class="p-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all" title="Edit">
              <Edit3 class="w-4 h-4" />
            </button>
            <button @click="deleteRestaurant(r.id, r.name)" class="p-2.5 rounded-xl bg-neutral-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all" title="Delete">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0 && !loading" class="text-center py-20 text-neutral-500">
        <Store class="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p class="text-lg">No restaurants found</p>
      </div>
    </div>

    <!-- Add Modal -->
    <transition name="fade">
      <div v-if="showAddModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showAddModal = false">
        <div class="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-neutral-800">
            <h2 class="text-xl font-serif text-white font-bold">New Restaurant</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="space-y-2">
              <label class="text-sm text-neutral-400">Name</label>
              <input v-model="form.name" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Cuisine</label>
                <select v-model="form.cuisine" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold">
                  <option>Italian</option><option>Japanese</option><option>Indian</option><option>American</option><option>Healthy</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Rating</label>
                <input v-model.number="form.rating" type="number" step="0.1" min="1" max="5" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Delivery Time</label>
                <input v-model="form.deliveryTime" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Min Order ($)</label>
                <input v-model.number="form.minOrder" type="number" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Delivery Fee ($)</label>
                <input v-model.number="form.deliveryFee" type="number" step="0.01" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Promo (optional)</label>
                <input v-model="form.promo" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm text-neutral-400">Image URL</label>
              <input v-model="form.image" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-neutral-400">Tags</label>
              <div class="flex gap-2 flex-wrap mb-2">
                <span v-for="t in form.tags" :key="t" class="inline-flex items-center gap-1 bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs">
                  {{ t }}
                  <button @click="removeTag(t)" class="text-neutral-500 hover:text-red-400">&times;</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input v-model="tagInput" @keydown.enter.prevent="addTag" placeholder="Add tag..." class="flex-grow bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold text-sm" />
                <button @click="addTag" class="px-4 py-2.5 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-700 text-sm">Add</button>
              </div>
            </div>
            <label class="flex items-center gap-3 text-sm text-neutral-400">
              <input v-model="form.featured" type="checkbox" class="rounded bg-neutral-800 border-neutral-700" />
              Featured Restaurant
            </label>
          </div>
          <div class="p-6 border-t border-neutral-800 flex justify-end gap-3">
            <button @click="showAddModal = false" class="px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors">Cancel</button>
            <button @click="saveRestaurant" :disabled="saving || !form.name" class="px-6 py-3 rounded-xl bg-luxury-gold text-luxury-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
