<script setup>
import { useRouter } from 'vue-router'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const checkout = () => {
  cartStore.toggleCart()
  router.push('/checkout')
}
</script>

<template>
  <div>
    <!-- Backdrop -->
    <transition name="fade">
      <div 
        v-if="cartStore.isOpen" 
        @click="cartStore.toggleCart"
        class="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50"
      ></div>
    </transition>

    <!-- Drawer -->
    <transition name="slide-right">
      <div 
        v-if="cartStore.isOpen"
        class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <div class="flex items-center gap-3">
            <ShoppingBag class="w-6 h-6 text-luxury-gold" />
            <h2 class="text-xl font-serif font-semibold text-luxury-black">Your Order</h2>
          </div>
          <button 
            @click="cartStore.toggleCart"
            class="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-500"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-grow overflow-y-auto p-6">
          <div v-if="cartStore.items.length === 0" class="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
            <ShoppingBag class="w-16 h-16 opacity-20" />
            <p class="text-lg font-serif">Your cart is empty</p>
            <button @click="cartStore.toggleCart" class="text-luxury-gold hover:underline mt-2">Continue Browsing</button>
          </div>

          <div v-else class="space-y-6">
            <div 
              v-for="item in cartStore.items" 
              :key="item.id"
              class="flex gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-luxury-gold/30 transition-colors bg-white shadow-sm"
            >
              <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-xl" />
              <div class="flex-grow flex flex-col justify-between">
                <div>
                  <h3 class="font-medium text-luxury-black line-clamp-1">{{ item.name }}</h3>
                  <p class="text-luxury-gold font-semibold mt-1">${{ (typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0).toFixed(2) }}</p>
                </div>
                
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center gap-3 bg-neutral-50 rounded-full px-2 py-1 border border-neutral-200">
                    <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-luxury-black transition-colors disabled:opacity-50" :disabled="item.quantity <= 1">
                      <Minus class="w-3 h-3" />
                    </button>
                    <span class="text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
                    <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-luxury-black transition-colors">
                      <Plus class="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button @click="cartStore.removeFromCart(item.id)" class="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Checkout -->
        <div v-if="cartStore.items.length > 0" class="p-6 border-t border-neutral-100 bg-neutral-50">
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm text-neutral-600">
              <span>Delivery Fee</span>
              <span>${{ cartStore.deliveryFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-serif font-bold text-luxury-black pt-3 border-t border-neutral-200">
              <span>Total</span>
              <span>${{ cartStore.grandTotal.toFixed(2) }}</span>
            </div>
          </div>
          
          <button @click="checkout" class="w-full btn-luxury flex items-center justify-center gap-2 py-4">
            <span>Proceed to Checkout</span>
            <span class="opacity-50">·</span>
            <span>${{ cartStore.grandTotal.toFixed(2) }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
