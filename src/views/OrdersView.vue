<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ClipboardList, Clock, CheckCircle, Truck, ChefHat, Package, ArrowRight, RotateCcw } from 'lucide-vue-next'
import { useOrdersStore } from '../stores/orders'

const router = useRouter()
const ordersStore = useOrdersStore()

const orders = computed(() => ordersStore.recentOrders)
const activeOrder = computed(() => ordersStore.activeOrder)

const getStatusColor = (status) => {
  const colors = {
    'confirmed': 'bg-blue-500',
    'preparing': 'bg-orange-500',
    'on-the-way': 'bg-purple-500',
    'delivered': 'bg-green-500'
  }
  return colors[status] || 'bg-neutral-400'
}

const getStatusLabel = (status) => {
  const labels = {
    'confirmed': 'Order Confirmed',
    'preparing': 'Being Prepared',
    'on-the-way': 'On The Way',
    'delivered': 'Delivered'
  }
  return labels[status] || status
}

const formatTime = (iso) => {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-12 animate-fade-in">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="mb-12">
        <h1 class="text-4xl font-serif text-luxury-black mb-2">My Orders</h1>
        <p class="text-neutral-500">Track and review your culinary journey</p>
      </div>

      <!-- Active Order Tracker -->
      <div v-if="activeOrder" class="bg-white rounded-3xl p-8 border border-neutral-100 shadow-lg mb-12 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold animate-pulse-soft"></div>
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="text-xs text-luxury-gold font-semibold uppercase tracking-wider mb-1">Live Tracking</p>
            <h2 class="text-2xl font-serif text-luxury-black">{{ activeOrder.id }}</h2>
          </div>
          <div :class="['px-4 py-2 rounded-full text-white text-sm font-medium', getStatusColor(activeOrder.status)]">
            {{ getStatusLabel(activeOrder.status) }}
          </div>
        </div>

        <!-- Timeline -->
        <div class="flex items-center justify-between relative mb-8">
          <div class="absolute top-5 left-0 w-full h-0.5 bg-neutral-200"></div>
          <div
            class="absolute top-5 left-0 h-0.5 bg-luxury-gold transition-all duration-1000"
            :style="{ width: activeOrder.timeline.filter(t => t.done).length / activeOrder.timeline.length * 100 + '%' }"
          ></div>

          <div
            v-for="(step, idx) in activeOrder.timeline"
            :key="idx"
            class="relative z-10 flex flex-col items-center gap-2"
          >
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500', step.done ? 'bg-luxury-gold text-white shadow-lg shadow-luxury-gold/30' : 'bg-neutral-200 text-neutral-400']">
              <CheckCircle v-if="step.done && idx === 0" class="w-5 h-5" />
              <ChefHat v-else-if="idx === 1" class="w-5 h-5" />
              <Truck v-else-if="idx === 2" class="w-5 h-5" />
              <Package v-else-if="idx === 3" class="w-5 h-5" />
              <CheckCircle v-else class="w-5 h-5" />
            </div>
            <span :class="['text-xs font-medium text-center', step.done ? 'text-luxury-black' : 'text-neutral-400']">
              {{ step.label }}
            </span>
            <span class="text-[10px] text-neutral-400">{{ step.time ? formatTime(step.time) : '' }}</span>
          </div>
        </div>

        <!-- Order Items Summary -->
        <div v-if="activeOrder.items" class="bg-neutral-50 rounded-xl p-4">
          <p class="text-xs text-neutral-500 mb-2">{{ activeOrder.items.length }} items · ${{ activeOrder.total?.toFixed(2) }}</p>
          <div class="flex gap-2 overflow-x-auto">
            <div v-for="item in activeOrder.items" :key="item.id" class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <!-- Order History -->
      <div v-if="orders.length > 0">
        <h2 class="text-2xl font-serif text-luxury-black mb-6">Order History</h2>
        <div class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all"
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-semibold text-luxury-black">{{ order.id }}</h3>
                <p class="text-xs text-neutral-500">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div :class="['px-3 py-1 rounded-full text-xs font-medium text-white', getStatusColor(order.status)]">
                {{ getStatusLabel(order.status) }}
              </div>
            </div>

            <div v-if="order.items" class="flex items-center gap-3 mb-4">
              <div v-for="item in order.items.slice(0, 4)" :key="item.id" class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <span v-if="order.items.length > 4" class="text-sm text-neutral-500">+{{ order.items.length - 4 }} more</span>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span class="font-semibold text-luxury-gold">${{ order.total?.toFixed(2) || '0.00' }}</span>
              <button class="flex items-center gap-2 text-sm text-neutral-600 hover:text-luxury-gold transition-colors">
                <RotateCcw class="w-4 h-4" /> Reorder
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0 && !activeOrder" class="text-center py-24">
        <div class="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <ClipboardList class="w-10 h-10 text-neutral-300" />
        </div>
        <h3 class="text-2xl font-serif text-neutral-400 mb-2">No orders yet</h3>
        <p class="text-neutral-500 mb-8">Your culinary adventures await</p>
        <button @click="router.push('/')" class="btn-luxury">Start Ordering</button>
      </div>
    </div>
  </div>
</template>
