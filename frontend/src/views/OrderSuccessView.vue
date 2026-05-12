<script setup>
import { useRouter } from 'vue-router'
import { CheckCircle, ArrowRight, Utensils, MapPin, ClipboardList } from 'lucide-vue-next'
import { useOrdersStore } from '../stores/orders'
import { computed } from 'vue'

const router = useRouter()
const ordersStore = useOrdersStore()

const latestOrder = computed(() => ordersStore.orders[ordersStore.orders.length - 1])

const goHome = () => {
  router.push('/')
}

const goToOrders = () => {
  router.push('/orders')
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-4 animate-fade-in">
    <div class="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl border border-neutral-100 relative overflow-hidden">
      <!-- Confetti-like decorations -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold"></div>
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/5 rounded-full"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500/5 rounded-full"></div>

      <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative" style="animation: scaleIn 0.5s ease-out;">
        <div class="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
        <CheckCircle class="w-12 h-12 text-green-500" />
      </div>

      <h1 class="text-3xl font-serif text-luxury-black mb-3">Order Confirmed!</h1>
      <p class="text-neutral-500 mb-6 leading-relaxed">
        Your culinary masterpiece is being prepared with care. We'll notify you when it's on the way.
      </p>

      <!-- Order ID -->
      <div v-if="latestOrder" class="bg-neutral-50 rounded-2xl p-4 mb-6 border border-neutral-100">
        <p class="text-xs text-neutral-500 mb-1">Order Number</p>
        <p class="text-lg font-bold text-luxury-black font-mono">{{ latestOrder.orderId || latestOrder._id || latestOrder.id }}</p>
      </div>

      <div class="bg-neutral-50 rounded-2xl p-6 mb-8 text-left border border-neutral-100">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
            <Utensils class="w-5 h-5 text-luxury-gold" />
          </div>
          <div>
            <p class="text-sm text-neutral-500">Estimated Delivery</p>
            <p class="font-semibold text-luxury-black">25 - 35 Minutes</p>
          </div>
        </div>
        <div class="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-luxury-gold to-amber-400 w-1/4 rounded-full" style="animation: progressGrow 2s ease-out forwards;"></div>
        </div>
        <p class="text-xs text-neutral-400 mt-3 text-center flex items-center justify-center gap-1.5">
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Order confirmed · Preparing soon
        </p>
      </div>

      <div class="space-y-3">
        <button @click="goToOrders" class="w-full btn-luxury flex items-center justify-center gap-2">
          <ClipboardList class="w-5 h-5" /> Track My Order
        </button>
        <button @click="goHome" class="w-full py-3 text-neutral-600 hover:text-luxury-gold font-medium transition-colors flex items-center justify-center gap-2 text-sm">
          Continue Browsing <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes progressGrow {
  0% { width: 0%; }
  100% { width: 25%; }
}
</style>
