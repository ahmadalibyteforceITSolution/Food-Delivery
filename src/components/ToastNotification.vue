<script setup>
import { useNotificationStore } from '../stores/notification'
import { CheckCircle, AlertCircle, X } from 'lucide-vue-next'

const notificationStore = useNotificationStore()
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="notification">
      <div
        v-for="n in notificationStore.notifications"
        :key="n.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl min-w-[300px] border"
        :class="[
          n.type === 'success' ? 'bg-white border-emerald-100' : 'bg-white border-rose-100'
        ]"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :class="[
            n.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
          ]"
        >
          <CheckCircle v-if="n.type === 'success'" class="w-5 h-5" />
          <AlertCircle v-else class="w-5 h-5" />
        </div>
        
        <div class="flex-grow">
          <p class="text-sm font-medium text-luxury-black">{{ n.message }}</p>
        </div>

        <button 
          @click="notificationStore.removeNotification(n.id)"
          class="text-neutral-400 hover:text-luxury-black transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
</style>
