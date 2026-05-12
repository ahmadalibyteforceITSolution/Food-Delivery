<script setup>
import { ref, computed } from 'vue'
import { useBlogStore } from '../stores/blog'
import { useRouter } from 'vue-router'
import { Calendar, User, Clock, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { handleImageError } from '../utils/helpers'
import { useSEO } from '../composables/useSEO'

const blogStore = useBlogStore()
const router = useRouter()

useSEO({
  title: 'Food Blog | Culinary Stories & Insights | Elysium Eats',
  description: 'Explore our collection of articles, from chef secrets to the latest food trends. Your guide to gourmet living.'
})

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 9

const filteredBlogs = computed(() => {
  if (!searchQuery.value) return blogStore.blogs
  const q = searchQuery.value.toLowerCase()
  return blogStore.blogs.filter(b => 
    b.title.toLowerCase().includes(q) || 
    b.excerpt.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filteredBlogs.value.length / itemsPerPage))

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBlogs.value.slice(start, end)
})

const goToBlog = (id) => {
  router.push(`/blog/${id}`)
}

const handleSearch = () => {
  currentPage.value = 1
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pt-24 pb-16">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h1 class="text-4xl md:text-5xl font-serif text-luxury-black mb-4">Culinary Stories & Insights</h1>
        <p class="text-neutral-500 text-lg">Explore our collection of articles, from chef secrets to the latest food trends.</p>
        
        <!-- Search -->
        <div class="mt-8 relative max-w-xl mx-auto">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            type="text" 
            placeholder="Search articles..." 
            class="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-neutral-100 shadow-sm focus:ring-2 focus:ring-luxury-gold/20 outline-none transition-all"
          />
        </div>
      </div>

      <!-- Blog Grid -->
      <div v-if="paginatedBlogs.length > 0" class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="blog in paginatedBlogs" 
          :key="blog.id"
          @click="goToBlog(blog.id)"
          class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer border border-neutral-100"
        >
          <div class="relative h-64 overflow-hidden">
            <img 
              :src="blog.image" 
              :alt="blog.title" 
              @error="handleImageError($event)"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-luxury-black">
              {{ blog.category }}
            </div>
          </div>
          <div class="p-8">
            <div class="flex items-center gap-4 text-xs text-neutral-400 mb-4">
              <span class="flex items-center gap-1.5"><Calendar class="w-3.5 h-3.5" /> {{ blog.date }}</span>
              <span class="flex items-center gap-1.5"><Clock class="w-3.5 h-3.5" /> {{ blog.readTime }}</span>
            </div>
            <h3 class="text-xl font-serif font-bold text-luxury-black mb-3 group-hover:text-luxury-gold transition-colors line-clamp-2">
              {{ blog.title }}
            </h3>
            <p class="text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-3">
              {{ blog.excerpt }}
            </p>
            <div class="flex items-center justify-between pt-6 border-t border-neutral-50">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-luxury-black">
                  {{ blog.author.split(' ').map(n => n[0]).join('') }}
                </div>
                <span class="text-xs font-medium text-neutral-600">{{ blog.author }}</span>
              </div>
              <span class="text-luxury-gold text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Read More <ArrowRight class="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-serif text-luxury-black mb-2">No articles found</h3>
        <p class="text-neutral-500">Try adjusting your search criteria</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-16 flex justify-center items-center gap-4">
        <button 
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="p-2 rounded-xl border border-neutral-200 disabled:opacity-30 hover:bg-white transition-colors"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <div class="flex gap-2">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            v-show="Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages"
            :class="[
              'w-10 h-10 rounded-xl font-medium transition-all',
              currentPage === page ? 'bg-luxury-black text-white' : 'hover:bg-white text-neutral-600'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-xl border border-neutral-200 disabled:opacity-30 hover:bg-white transition-colors"
        >
          <ChevronRight class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
