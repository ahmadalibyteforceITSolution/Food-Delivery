import { defineStore } from 'pinia'
import { useNotificationStore } from './notification'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false,
  }),
  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((acc, item) => acc + ((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * item.quantity), 0),
    deliveryFee: () => 5.00,
    grandTotal() {
      return this.totalPrice + this.deliveryFee
    }
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      
      const notificationStore = useNotificationStore()
      notificationStore.addNotification(`${product.name} added to cart!`)
      
      this.isOpen = true
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
    },
    clearCart() {
      this.items = []
    },
    toggleCart() {
      this.isOpen = !this.isOpen
    }
  }
})
