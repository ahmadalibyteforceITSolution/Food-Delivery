<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Plus, Edit3, Trash2, UtensilsCrossed, Save,
  Star, Search, X, Image
} from 'lucide-vue-next'
import { apiService } from '../../api'

const route = useRoute()
const router = useRouter()
const token = localStorage.getItem('adminToken')
const restaurant = ref(null)
const loading = ref(true)
const saving = ref(false)
const search = ref('')

// Edit restaurant form
const editForm = ref({ name: '', cuisine: '', rating: 4.5, deliveryTime: '', minOrder: 15, deliveryFee: 2.99, featured: false, promo: '', image: '', tags: [] })
const tagInput = ref('')
const showEditRestaurant = ref(false)

// Dish form
const showDishModal = ref(false)
const editingDish = ref(null)
const dishForm = ref({ name: '', description: '', price: '', image: '', popular: false })

const filteredMenu = computed(() => {
  if (!restaurant.value?.menu) return []
  const q = search.value.toLowerCase()
  return restaurant.value.menu.filter(m =>
    m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)
  )
})

const load = async () => {
  loading.value = true
  try {
    const all = await apiService.getAdminRestaurants(token)
    const id = parseInt(route.params.id)
    restaurant.value = all.find(r => r.id === id)
    if (restaurant.value) {
      editForm.value = {
        name: restaurant.value.name,
        cuisine: restaurant.value.cuisine,
        rating: restaurant.value.rating,
        deliveryTime: restaurant.value.deliveryTime,
        minOrder: restaurant.value.minOrder,
        deliveryFee: restaurant.value.deliveryFee,
        featured: restaurant.value.featured || false,
        promo: restaurant.value.promo || '',
        image: restaurant.value.image || '',
        tags: [...(restaurant.value.tags || [])]
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveRestaurant = async () => {
  saving.value = true
  try {
    const updated = await apiService.updateRestaurant(token, restaurant.value.id, editForm.value)
    Object.assign(restaurant.value, updated)
    showEditRestaurant.value = false
  } catch (err) {
    alert(err.message)
  } finally {
    saving.value = false
  }
}

const addTag = () => {
  if (tagInput.value.trim() && !editForm.value.tags.includes(tagInput.value.trim())) {
    editForm.value.tags.push(tagInput.value.trim())
  }
  tagInput.value = ''
}

const removeTag = (t) => {
  editForm.value.tags = editForm.value.tags.filter(x => x !== t)
}

const openAddDish = () => {
  editingDish.value = null
  dishForm.value = { name: '', description: '', price: '', image: '', popular: false }
  showDishModal.value = true
}

const openEditDish = (item) => {
  editingDish.value = item
  dishForm.value = {
    name: item.name,
    description: item.description || '',
    price: (item.price ?? '').toString(),
    image: item.image || '',
    popular: item.popular || false
  }
  showDishModal.value = true
}

const saveDish = async () => {
  if (!dishForm.value.name || !dishForm.value.price) return
  saving.value = true
  const payload = {
    name: dishForm.value.name,
    description: dishForm.value.description,
    price: parseFloat(dishForm.value.price) || 0,
    image: dishForm.value.image,
    popular: dishForm.value.popular
  }
  try {
    if (editingDish.value) {
      const updated = await apiService.updateMenuItem(token, restaurant.value.id, editingDish.value.id, payload)
      const idx = restaurant.value.menu.findIndex(m => m.id === editingDish.value.id)
      if (idx !== -1) Object.assign(restaurant.value.menu[idx], updated)
    } else {
      const created = await apiService.addMenuItem(token, restaurant.value.id, payload)
      restaurant.value.menu.push(created)
    }
    showDishModal.value = false
  } catch (err) {
    alert(err.message)
  } finally {
    saving.value = false
  }
}

const deleteDish = async (itemId, name) => {
  if (!confirm(`Delete "${name}"?`)) return
  try {
    await apiService.deleteMenuItem(token, restaurant.value.id, itemId)
    restaurant.value.menu = restaurant.value.menu.filter(m => m.id !== itemId)
  } catch (err) {
    alert(err.message)
  }
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
    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>

    <template v-else-if="restaurant">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <button @click="router.push('/admin/restaurants')" class="p-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div class="flex-grow">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-serif text-white font-bold">{{ restaurant.name }}</h1>
            <span v-if="restaurant.featured" class="text-[10px] bg-luxury-gold/10 text-luxury-gold px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-neutral-500 mt-1">
            <span :class="getCuisineColor(restaurant.cuisine)">{{ restaurant.cuisine }}</span>
            <span class="flex items-center gap-1"><Star class="w-3.5 h-3.5 text-amber-400" /> {{ restaurant.rating }}</span>
            <span>{{ restaurant.menu?.length || 0 }} dishes</span>
          </div>
        </div>
        <button @click="showEditRestaurant = true" class="inline-flex items-center gap-2 bg-neutral-800 text-neutral-300 px-4 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors text-sm">
          <Edit3 class="w-4 h-4" /> Edit Restaurant
        </button>
      </div>

      <!-- Menu Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 class="text-xl font-serif text-white font-bold flex items-center gap-2">
          <UtensilsCrossed class="w-5 h-5 text-luxury-gold" />
          Menu Items
        </h2>
        <div class="flex items-center gap-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input v-model="search" placeholder="Search dishes..." class="bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-luxury-gold w-48" />
          </div>
          <button @click="openAddDish" class="inline-flex items-center gap-2 bg-luxury-gold text-luxury-black px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors">
            <Plus class="w-4 h-4" /> Add Dish
          </button>
        </div>
      </div>

      <!-- Dishes Grid -->
      <div v-if="filteredMenu.length === 0" class="text-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
        <UtensilsCrossed class="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p class="text-lg">No dishes yet</p>
        <button @click="openAddDish" class="mt-4 text-luxury-gold hover:underline text-sm">Add your first dish</button>
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="item in filteredMenu"
          :key="item.id"
          class="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 hover:border-neutral-700 transition-all"
        >
          <!-- Dish Image -->
          <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800">
            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" @error="$event.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'" />
          </div>

          <!-- Dish Info -->
          <div class="flex-grow min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-white font-semibold">{{ item.name }}</h3>
                  <span v-if="item.popular" class="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">Popular</span>
                </div>
                <p class="text-neutral-500 text-sm mt-1 line-clamp-1">{{ item.description }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-luxury-gold font-bold">${{ (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0).toFixed(2) }}</p>
                <p class="text-neutral-600 text-xs mt-0.5">ID: {{ item.id }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-3">
              <button @click="openEditDish(item)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all text-xs">
                <Edit3 class="w-3.5 h-3.5" /> Edit
              </button>
              <button @click="deleteDish(item.id, item.name)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs">
                <Trash2 class="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Restaurant Modal -->
      <transition name="fade">
        <div v-if="showEditRestaurant" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showEditRestaurant = false">
          <div class="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-neutral-800">
              <h2 class="text-xl font-serif text-white font-bold">Edit Restaurant</h2>
            </div>
            <div class="p-6 space-y-5">
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Name</label>
                <input v-model="editForm.name" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Cuisine</label>
                  <select v-model="editForm.cuisine" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold">
                    <option>Italian</option><option>Japanese</option><option>Indian</option><option>American</option><option>Healthy</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Rating</label>
                  <input v-model.number="editForm.rating" type="number" step="0.1" min="1" max="5" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Delivery Time</label>
                  <input v-model="editForm.deliveryTime" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Min Order ($)</label>
                  <input v-model.number="editForm.minOrder" type="number" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Delivery Fee ($)</label>
                  <input v-model.number="editForm.deliveryFee" type="number" step="0.01" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Promo</label>
                  <input v-model="editForm.promo" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Image URL</label>
                <input v-model="editForm.image" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Tags</label>
                <div class="flex gap-2 flex-wrap mb-2">
                  <span v-for="t in editForm.tags" :key="t" class="inline-flex items-center gap-1 bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs">
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
                <input v-model="editForm.featured" type="checkbox" class="rounded bg-neutral-800 border-neutral-700" />
                Featured Restaurant
              </label>
            </div>
            <div class="p-6 border-t border-neutral-800 flex justify-end gap-3">
              <button @click="showEditRestaurant = false" class="px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors">Cancel</button>
              <button @click="saveRestaurant" :disabled="saving || !editForm.name" class="px-6 py-3 rounded-xl bg-luxury-gold text-luxury-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Add/Edit Dish Modal -->
      <transition name="fade">
        <div v-if="showDishModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showDishModal = false">
          <div class="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg">
            <div class="p-6 border-b border-neutral-800 flex items-center justify-between">
              <h2 class="text-xl font-serif text-white font-bold">{{ editingDish ? 'Edit Dish' : 'Add New Dish' }}</h2>
              <button @click="showDishModal = false" class="text-neutral-500 hover:text-white">
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="p-6 space-y-5">
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Dish Name *</label>
                <input v-model="dishForm.name" placeholder="e.g. Truffle Mushroom Risotto" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-neutral-400">Description</label>
                <textarea v-model="dishForm.description" rows="3" placeholder="Describe the dish..." class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold resize-none"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Price ($) *</label>
                  <input v-model="dishForm.price" type="number" step="0.01" min="0" placeholder="0.00" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-neutral-400">Image URL</label>
                  <input v-model="dishForm.image" placeholder="https://..." class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-luxury-gold" />
                </div>
              </div>
              <label class="flex items-center gap-3 text-sm text-neutral-400">
                <input v-model="dishForm.popular" type="checkbox" class="rounded bg-neutral-800 border-neutral-700" />
                Mark as Popular
              </label>
            </div>
            <div class="p-6 border-t border-neutral-800 flex justify-end gap-3">
              <button @click="showDishModal = false" class="px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors">Cancel</button>
              <button @click="saveDish" :disabled="saving || !dishForm.name || !dishForm.price" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-luxury-gold text-luxury-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                <Save class="w-4 h-4" /> {{ saving ? 'Saving...' : editingDish ? 'Update Dish' : 'Add Dish' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </template>

    <!-- Not Found -->
    <div v-else class="text-center py-20">
      <p class="text-neutral-500 text-lg">Restaurant not found.</p>
      <button @click="router.push('/admin/restaurants')" class="mt-4 text-luxury-gold hover:underline">Go back to restaurants</button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
