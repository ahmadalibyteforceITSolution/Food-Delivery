<script setup>
import { useSEO } from '../composables/useSEO'
import { ShieldCheck, Eye, Database, Lock, Share2, Bell } from 'lucide-vue-next'

useSEO({
  title: 'Privacy Policy | Elysium Eats',
  description: 'Learn how Elysium Eats collects, uses, and protects your personal information. Your privacy is our top priority.'
})

const policies = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, such as your name, email, phone number, and delivery address when you create an account or place an order.'
  },
  {
    icon: Database,
    title: 'How We Use Your Data',
    content: 'We use your information to process orders, provide customer support, personalize your experience, and send you important updates about our services.'
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: 'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.'
  },
  {
    icon: Share2,
    title: 'Third-Party Sharing',
    content: 'We only share your information with restaurants and delivery partners to fulfill your orders. We never sell your personal data to third parties.'
  },
  {
    icon: Bell,
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal information at any time. You can manage your preferences through your account settings.'
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
            <ShieldCheck class="w-4 h-4" />
            <span>Privacy & Security</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-serif text-luxury-black mb-6">Privacy Policy</h1>
          <p class="text-neutral-500 text-lg">Last updated: May 12, 2026</p>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-100 space-y-12">
          <div v-for="policy in policies" :key="policy.title" class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center flex-shrink-0">
                <component :is="policy.icon" class="w-6 h-6 text-luxury-gold" />
              </div>
              <h2 class="text-2xl font-serif text-luxury-black">{{ policy.title }}</h2>
            </div>
            <p class="text-neutral-600 leading-relaxed text-lg ml-16">
              {{ policy.content }}
            </p>
          </div>

          <div class="pt-12 border-t border-neutral-100 bg-neutral-50 -mx-8 md:-mx-12 px-8 md:px-12 py-10 rounded-b-[2.5rem]">
            <h2 class="text-2xl font-serif text-luxury-black mb-4">Privacy Concerns?</h2>
            <p class="text-neutral-600 mb-6">If you have any questions or concerns about how we handle your data, please reach out to our Data Protection Officer:</p>
            <p class="font-bold text-luxury-black">privacy@elysiumeats.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
