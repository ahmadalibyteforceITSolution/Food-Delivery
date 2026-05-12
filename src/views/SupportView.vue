<script setup>
import { ref } from 'vue'
import { useSEO } from '../composables/useSEO'
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone, LifeBuoy } from 'lucide-vue-next'

useSEO({
  title: 'Support Center | Elysium Eats',
  description: 'Find answers to frequently asked questions and get support for your Elysium Eats experience.'
})

const faqs = ref([
  {
    question: 'How do I track my order?',
    answer: 'Once your order is confirmed, you can track its status in real-time through the "My Orders" section in your profile. We provide updates from preparation to delivery.',
    open: true
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express) as well as digital wallets like Apple Pay and Google Pay.',
    open: false
  },
  {
    question: 'Can I change my delivery address after ordering?',
    answer: 'If the order hasn\'t been picked up by the delivery partner yet, you may be able to change the address by contacting our support team immediately.',
    open: false
  },
  {
    question: 'How do I apply a promo code?',
    answer: 'You can enter your promo code at the checkout page before finalizing your order. The discount will be applied to the subtotal automatically.',
    open: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pt-24 pb-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-luxury-gold/10 text-luxury-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <LifeBuoy class="w-4 h-4" />
            <span>Help Center</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-serif text-luxury-black mb-6">How can we help?</h1>
          <p class="text-neutral-500 text-lg">Find answers to common questions or reach out to our support team.</p>
        </div>

        <!-- Support Channels -->
        <div class="grid md:grid-cols-2 gap-8 mb-16">
          <div class="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm text-center group hover:shadow-xl transition-all duration-500">
            <div class="w-16 h-16 bg-luxury-gold/10 text-luxury-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-serif font-bold text-luxury-black mb-2">Live Chat</h3>
            <p class="text-neutral-500 mb-6 text-sm">Chat with our support experts in real-time for immediate assistance.</p>
            <button class="w-full py-4 bg-luxury-black text-white rounded-2xl font-bold hover:bg-luxury-gold hover:text-luxury-black transition-all">Start Chatting</button>
          </div>
          <div class="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm text-center group hover:shadow-xl transition-all duration-500">
            <div class="w-16 h-16 bg-luxury-gold/10 text-luxury-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Phone class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-serif font-bold text-luxury-black mb-2">Call Support</h3>
            <p class="text-neutral-500 mb-6 text-sm">Prefer talking? Our team is available via phone for urgent matters.</p>
            <button class="w-full py-4 bg-white border-2 border-luxury-black text-luxury-black rounded-2xl font-bold hover:bg-luxury-black hover:text-white transition-all">Call +1 (888) ELYSIUM</button>
          </div>
        </div>

        <!-- FAQs -->
        <div class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-100">
          <h2 class="text-3xl font-serif text-luxury-black mb-10 flex items-center gap-4">
            <HelpCircle class="w-8 h-8 text-luxury-gold" /> Frequently Asked Questions
          </h2>
          
          <div class="space-y-4">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index"
              class="border-b border-neutral-100 last:border-0 pb-4"
            >
              <button 
                @click="toggleFaq(index)"
                class="w-full flex items-center justify-between py-4 text-left group"
              >
                <span class="text-lg font-medium text-luxury-black group-hover:text-luxury-gold transition-colors">{{ faq.question }}</span>
                <ChevronDown v-if="!faq.open" class="w-5 h-5 text-neutral-400" />
                <ChevronUp v-else class="w-5 h-5 text-luxury-gold" />
              </button>
              <transition name="fade">
                <div v-if="faq.open" class="pb-4 text-neutral-500 leading-relaxed">
                  {{ faq.answer }}
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
