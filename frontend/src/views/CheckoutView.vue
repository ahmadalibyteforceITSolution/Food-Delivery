<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, CreditCard, MapPin, Phone, User, CheckCircle2, Wallet, Banknote, Mail } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

const paymentMethod = ref('card')

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  address: authStore.user?.address || '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  notes: ''
})

const isProcessing = ref(false)

const processOrder = () => {
  if (cartStore.items.length === 0) return
  isProcessing.value = true

  setTimeout(async () => {
    try {
      await ordersStore.placeOrder({
        userId: authStore.user?.id || 'guest',
        userEmail: form.value.email, // Use email from form
        items: [...cartStore.items],
        total: cartStore.grandTotal,
        subtotal: cartStore.totalPrice,
        deliveryFee: cartStore.deliveryFee,
        deliveryAddress: form.value.address,
        customerName: form.value.name,
        paymentMethod: paymentMethod.value,
        notes: form.value.notes
      })
      isProcessing.value = false
      cartStore.clearCart()
      router.push('/order-success')
    } catch (error) {
      isProcessing.value = false
      alert('Failed to place order. Please try again.')
    }
  }, 2000)
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="bg-neutral-50 min-h-screen py-12 animate-fade-in">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <button @click="goBack" class="p-2.5 hover:bg-white rounded-xl transition-colors text-neutral-600">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-3xl font-serif text-luxury-black">Secure Checkout</h1>
          <p class="text-neutral-500 text-sm mt-1">Complete your order</p>
        </div>
      </div>

      <div v-if="cartStore.items.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-neutral-100">
        <p class="text-xl text-neutral-500 mb-4">Your cart is empty. Add some items before checking out.</p>
        <button @click="goBack" class="btn-luxury">Return to Menu</button>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Delivery Details -->
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
            <h2 class="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
              <MapPin class="text-luxury-gold w-5 h-5" /> Delivery Details
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-neutral-600">Full Name</label>
                <div class="relative">
                  <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input v-model="form.name" type="text" class="input-luxury pl-12" placeholder="John Doe" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-neutral-600">Email Address</label>
                <div class="relative">
                  <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input v-model="form.email" type="email" class="input-luxury pl-12" placeholder="john@example.com" required />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-neutral-600">Phone Number</label>
                <div class="relative">
                  <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input v-model="form.phone" type="tel" class="input-luxury pl-12" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-neutral-600">Delivery Address</label>
                <div class="relative">
                  <MapPin class="absolute left-4 top-4 w-5 h-5 text-neutral-400" />
                  <textarea v-model="form.address" rows="3" class="input-luxury pl-12 py-4 resize-none" placeholder="123 Luxury Avenue, Suite 100..."></textarea>
                </div>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-neutral-600">Order Notes (Optional)</label>
                <textarea v-model="form.notes" rows="2" class="input-luxury py-3 resize-none" placeholder="Special instructions for your order..."></textarea>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
            <h2 class="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
              <Wallet class="text-luxury-gold w-5 h-5" /> Payment Method
            </h2>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <button
                @click="paymentMethod = 'card'"
                :class="['p-4 rounded-2xl border-2 flex items-center gap-3 transition-all', paymentMethod === 'card' ? 'border-luxury-gold bg-luxury-gold/5' : 'border-neutral-200 hover:border-neutral-300']"
              >
                <CreditCard :class="['w-6 h-6', paymentMethod === 'card' ? 'text-luxury-gold' : 'text-neutral-400']" />
                <div class="text-left">
                  <p class="font-medium text-sm">Credit Card</p>
                  <p class="text-xs text-neutral-500">Visa, Mastercard</p>
                </div>
              </button>
              <button
                @click="paymentMethod = 'cash'"
                :class="['p-4 rounded-2xl border-2 flex items-center gap-3 transition-all', paymentMethod === 'cash' ? 'border-luxury-gold bg-luxury-gold/5' : 'border-neutral-200 hover:border-neutral-300']"
              >
                <Banknote :class="['w-6 h-6', paymentMethod === 'cash' ? 'text-luxury-gold' : 'text-neutral-400']" />
                <div class="text-left">
                  <p class="font-medium text-sm">Cash on Delivery</p>
                  <p class="text-xs text-neutral-500">Pay at door</p>
                </div>
              </button>
            </div>

            <div v-if="paymentMethod === 'card'" class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-neutral-600">Card Number</label>
                <div class="relative">
                  <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input v-model="form.cardNumber" type="text" class="input-luxury pl-12" placeholder="0000 0000 0000 0000" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-neutral-600">Expiry Date</label>
                  <input v-model="form.expiry" type="text" class="input-luxury" placeholder="MM/YY" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-neutral-600">CVV</label>
                  <input v-model="form.cvv" type="password" class="input-luxury" placeholder="123" maxlength="3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 sticky top-24">
            <h2 class="text-xl font-serif font-semibold mb-6">Order Summary</h2>

            <div class="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-3 items-center">
                <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-grow min-w-0">
                  <p class="text-sm font-medium text-luxury-black line-clamp-1">{{ item.name }}</p>
                  <p class="text-xs text-neutral-500">x{{ item.quantity }}</p>
                </div>
                <span class="font-medium text-luxury-black text-sm">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="border-t border-neutral-100 pt-6 space-y-3 mb-6">
              <div class="flex justify-between text-sm text-neutral-500">
                <span>Subtotal</span>
                <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm text-neutral-500">
                <span>Delivery Fee</span>
                <span>${{ cartStore.deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xl font-serif font-bold text-luxury-black pt-3 border-t border-neutral-100">
                <span>Total</span>
                <span>${{ cartStore.grandTotal.toFixed(2) }}</span>
              </div>
            </div>

            <button
              @click="processOrder"
              :disabled="isProcessing"
              class="w-full btn-luxury py-4 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <span :class="{'opacity-0': isProcessing}">Confirm & Pay ${{ cartStore.grandTotal.toFixed(2) }}</span>
              <div v-if="isProcessing" class="absolute inset-0 flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </button>
            <div class="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 class="w-4 h-4 text-green-500" />
              <span>Secure encrypted payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
