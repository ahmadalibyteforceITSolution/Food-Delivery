<script setup>
import { useSEO } from '../composables/useSEO'
import { FileText, Shield, UserCheck, CreditCard, Truck, RefreshCcw } from 'lucide-vue-next'

useSEO({
  title: 'Terms & Conditions | Elysium Eats',
  description: 'Read our terms and conditions. Understand the rules and regulations for using the Elysium Eats platform.'
})

const sections = [
  {
    icon: Shield,
    title: '1. Acceptance of Terms',
    content: 'By accessing and using Elysium Eats, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.'
  },
  {
    icon: UserCheck,
    title: '2. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account information and password. You must be at least 18 years old to create an account.'
  },
  {
    icon: CreditCard,
    title: '3. Pricing and Payment',
    content: 'All prices are in USD. We reserve the right to change prices at any time. Payments are processed securely through our authorized payment partners.'
  },
  {
    icon: Truck,
    title: '4. Delivery Policy',
    content: 'Delivery times are estimates and may vary due to traffic, weather, or restaurant preparation times. We strive to deliver all orders within the estimated window.'
  },
  {
    icon: RefreshCcw,
    title: '5. Refunds and Cancellations',
    content: 'Cancellations are only possible before the restaurant starts preparing your order. Refund requests will be evaluated on a case-by-case basis.'
  }
]
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pt-24 pb-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-luxury-gold/10 text-luxury-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <FileText class="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-serif text-luxury-black mb-6">Terms & Conditions</h1>
          <p class="text-neutral-500 text-lg">Last updated: May 12, 2026</p>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-100 space-y-12">
          <div v-for="section in sections" :key="section.title" class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center flex-shrink-0">
                <component :is="section.icon" class="w-6 h-6 text-luxury-gold" />
              </div>
              <h2 class="text-2xl font-serif text-luxury-black">{{ section.title }}</h2>
            </div>
            <p class="text-neutral-600 leading-relaxed text-lg ml-16">
              {{ section.content }}
            </p>
          </div>

          <div class="pt-12 border-t border-neutral-100">
            <h2 class="text-2xl font-serif text-luxury-black mb-4">Contact Our Legal Team</h2>
            <p class="text-neutral-600 mb-6">If you have any questions regarding our Terms and Conditions, please contact us at:</p>
            <div class="bg-neutral-50 p-6 rounded-2xl inline-block">
              <p class="font-bold text-luxury-black">Legal Department</p>
              <p class="text-neutral-500">legal@elysiumeats.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
