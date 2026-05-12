<script setup>
import { computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blog'
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-vue-next'
import { handleImageError } from '../utils/helpers'
import { useSEO } from '../composables/useSEO'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const blog = computed(() => blogStore.getBlogBySlug(route.params.slug))

watchEffect(() => {
  if (blog.value) {
    useSEO({ 
      title: blog.value.title,
      description: blog.value.excerpt,
      image: blog.value.image,
      type: 'article'
    })
  }
})

onMounted(() => {
  window.scrollTo(0, 0)
  if (!blog.value) {
    router.push('/blog')
  }
})

const otherBlogs = computed(() => {
  return blogStore.blogs
    .filter(b => b.slug !== route.params.slug)
    .slice(0, 3)
})
</script>

<template>
  <div v-if="blog" class="min-h-screen bg-white pt-24 pb-20">
    <!-- Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-1 bg-neutral-100 z-[60]">
      <div class="h-full bg-luxury-gold transition-all duration-300" style="width: 0%"></div>
    </div>

    <div class="container mx-auto px-4">
      <button @click="router.back()" class="flex items-center gap-2 text-neutral-500 hover:text-luxury-gold transition-colors mb-8 group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Articles
      </button>

      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-block px-4 py-1.5 bg-luxury-gold/10 text-luxury-gold rounded-full text-xs font-bold mb-6 uppercase tracking-widest">
            {{ blog.category }}
          </div>
          <h1 class="text-4xl md:text-6xl font-serif text-luxury-black mb-8 leading-tight">
            {{ blog.title }}
          </h1>
          <div class="flex items-center justify-center gap-6 text-neutral-500 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-luxury-black">
                {{ blog.author.split(' ').map(n => n[0]).join('') }}
              </div>
              <span class="font-medium">{{ blog.author }}</span>
            </div>
            <div class="w-1 h-1 bg-neutral-300 rounded-full"></div>
            <div class="flex items-center gap-2"><Calendar class="w-4 h-4" /> {{ blog.date }}</div>
            <div class="w-1 h-1 bg-neutral-300 rounded-full"></div>
            <div class="flex items-center gap-2"><Clock class="w-4 h-4" /> {{ blog.readTime }}</div>
          </div>
        </div>

        <!-- Main Image -->
        <div class="relative h-[500px] rounded-[2rem] overflow-hidden mb-16 shadow-2xl">
          <img :src="blog.image" :alt="blog.title" class="w-full h-full object-cover" />
        </div>

        <!-- Content -->
        <div class="grid md:grid-cols-[1fr_80px] gap-12">
          <div class="prose prose-lg max-w-none prose-neutral">
            <div v-html="blog.content" class="blog-content"></div>
            
            <!-- Tags -->
            <div class="mt-12 pt-12 border-t border-neutral-100 flex flex-wrap gap-2">
              <span v-for="tag in ['Food', 'Cuisine', 'Recipe', 'Dining']" :key="tag" class="px-4 py-2 bg-neutral-50 text-neutral-600 rounded-xl text-sm hover:bg-luxury-gold/10 hover:text-luxury-gold transition-colors cursor-pointer">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Share -->
          <div class="hidden md:flex flex-col gap-4 sticky top-32 h-fit">
            <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center mb-2">Share</p>
            <button class="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-luxury-gold hover:text-white transition-all"><Facebook class="w-5 h-5" /></button>
            <button class="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-luxury-gold hover:text-white transition-all"><Twitter class="w-5 h-5" /></button>
            <button class="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-luxury-gold hover:text-white transition-all"><LinkIcon class="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <!-- Related Posts -->
      <div class="max-w-6xl mx-auto mt-32">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-3xl font-serif text-luxury-black">Continue Reading</h2>
          <button @click="router.push('/blog')" class="text-luxury-gold font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All <ArrowLeft class="w-4 h-4 rotate-180" />
          </button>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="related in otherBlogs" 
            :key="related.id"
            @click="router.push(`/blog/${related.id}`)"
            class="group cursor-pointer"
          >
            <div class="h-48 rounded-2xl overflow-hidden mb-4">
              <img :src="related.image" :alt="related.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 class="text-lg font-bold text-luxury-black group-hover:text-luxury-gold transition-colors line-clamp-2">
              {{ related.title }}
            </h3>
            <p class="text-sm text-neutral-500 mt-2">{{ related.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@reference "../style.css";

.blog-content p {
  @apply mb-6 text-neutral-600 leading-relaxed text-lg;
}
.blog-content h2 {
  @apply text-2xl font-serif text-luxury-black mt-12 mb-6;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
