import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),
  actions: {
    addNotification(message, type = 'success', duration = 3000) {
      const id = Date.now()
      this.notifications.push({ id, message, type })
      
      setTimeout(() => {
        this.removeNotification(id)
      }, duration)
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }
  }
})
