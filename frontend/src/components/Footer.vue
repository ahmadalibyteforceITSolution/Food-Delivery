<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Facebook, Instagram, Twitter, Youtube, Send, MapPin, Phone, Mail } from 'lucide-vue-next'
import { useNotificationStore } from '../stores/notification'

const notificationStore = useNotificationStore()
const email = ref('')
const isSubmitting = ref(false)

const subscribe = async () => {
  if (!email.value) return
  
  isSubmitting.value = true
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${API_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    
    if (response.ok) {
      notificationStore.addNotification('Thank you for subscribing!', 'success')
      email.value = ''
    } else {
      notificationStore.addNotification('Something went wrong. Please try again.', 'error')
    }
  } catch (error) {
    notificationStore.addNotification('Connection error. Please try again.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <footer class="bg-luxury-black text-white pt-20 pb-10">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <!-- Brand Section -->
        <div class="space-y-6">
          <RouterLink to="/" class="flex items-center gap-2 group">
            <div class="w-12 h-12 rounded-2xl bg-luxury-gold flex items-center justify-center group-hover:bg-white transition-colors duration-300">
              <span class="text-luxury-black font-serif font-bold text-xl">E</span>
            </div>
            <span class="text-2xl font-serif font-bold text-white tracking-tight">
              Elysium<span class="text-luxury-gold italic">Eats</span>
            </span>
          </RouterLink>
          <p class="text-neutral-400 text-sm leading-relaxed max-w-xs">
            Elevating your dining experience with gourmet masterpieces from the world's finest cuisines, delivered to your door with pristine care.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all">
              <Twitter class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-serif font-bold mb-8 text-luxury-gold">Quick Links</h3>
          <ul class="space-y-4">
            <li><RouterLink to="/" class="text-neutral-400 hover:text-white transition-colors">Home</RouterLink></li>
            <li><RouterLink to="/blog" class="text-neutral-400 hover:text-white transition-colors">Culinary Blog</RouterLink></li>
            <li><RouterLink to="/favorites" class="text-neutral-400 hover:text-white transition-colors">My Favorites</RouterLink></li>
            <li><RouterLink to="/orders" class="text-neutral-400 hover:text-white transition-colors">Order History</RouterLink></li>
          </ul>
        </div>

        <!-- Support & Legal -->
        <div>
          <h3 class="text-lg font-serif font-bold mb-8 text-luxury-gold">Support</h3>
          <ul class="space-y-4">
            <li><RouterLink to="/contact" class="text-neutral-400 hover:text-white transition-colors">Contact Us</RouterLink></li>
            <li><RouterLink to="/support" class="text-neutral-400 hover:text-white transition-colors">Help Center / FAQ</RouterLink></li>
            <li><RouterLink to="/terms" class="text-neutral-400 hover:text-white transition-colors">Terms & Conditions</RouterLink></li>
            <li><RouterLink to="/privacy" class="text-neutral-400 hover:text-white transition-colors">Privacy Policy</RouterLink></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-serif font-bold mb-8 text-luxury-gold">Newsletter</h3>
          <p class="text-neutral-400 text-sm mb-6">Subscribe to receive updates on new restaurants and exclusive offers.</p>
          <form @submit.prevent="subscribe" class="relative">
            <input 
              v-model="email"
              type="email" 
              placeholder="Your email address" 
              required
              class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm outline-none focus:border-luxury-gold/50 transition-colors"
            />
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="absolute right-2 top-2 bottom-2 px-4 bg-luxury-gold text-luxury-black rounded-xl hover:bg-white transition-colors disabled:opacity-50"
            >
              <Send v-if="!isSubmitting" class="w-4 h-4" />
              <span v-else class="w-4 h-4 border-2 border-luxury-black border-t-transparent rounded-full animate-spin"></span>
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-500">
        <p>© 2026 Elysium Eats. All rights reserved.</p>
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2">
            <MapPin class="w-4 h-4 text-luxury-gold" />
            <span>New York, NY</span>
          </div>
          <div class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-luxury-gold" />
            <span>+1 (888) ELYSIUM</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
