import { defineStore } from 'pinia'
import { apiService } from '../api'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: JSON.parse(localStorage.getItem('orders') || '[]'),
    activeOrder: null
  }),
  getters: {
    recentOrders: (state) => state.orders.slice().reverse().slice(0, 10),
    getOrderById: (state) => (id) => state.orders.find(o => o.id === id),
    hasActiveOrder: (state) => !!state.activeOrder
  },
  actions: {
    async placeOrder(orderData) {
      const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
      const order = {
        orderId,
        ...orderData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }

      try {
        const savedOrder = await apiService.createOrder(order);
        
        this.orders.push(savedOrder);
        this.activeOrder = savedOrder;
        localStorage.setItem('orders', JSON.stringify(this.orders));
        
        // Mock timeline for UI
        this.activeOrder.timeline = [
          { status: 'confirmed', label: 'Order Confirmed', time: new Date().toISOString(), done: true },
          { status: 'preparing', label: 'Preparing', time: null, done: false },
          { status: 'on-the-way', label: 'On The Way', time: null, done: false },
          { status: 'delivered', label: 'Delivered', time: null, done: false }
        ];

        return savedOrder;
      } catch (error) {
        console.error('Error placing order:', error);
        throw error;
      }
    },
    async fetchUserOrders(userId) {
      try {
        this.orders = await apiService.getOrders(userId);
        localStorage.setItem('orders', JSON.stringify(this.orders));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
  }
})
