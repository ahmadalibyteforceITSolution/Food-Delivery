<script setup>
import { ref } from 'vue'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-vue-next'
import { useSEO } from '../composables/useSEO'

useSEO({
  title: 'Contact Us | Elysium Eats',
  description: 'Get in touch with the Elysium Eats team. We are here to help you with your orders, feedback, or any inquiries.'
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  isSubmitting.value = false
  submitted.value = true
  form.value = { name: '', email: '', subject: '', message: '' }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 pt-24 pb-20">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-serif text-luxury-black mb-6">Get in Touch</h1>
          <p class="text-neutral-500 text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need assistance? Our dedicated team is ready to help you elevate your dining experience.
          </p>
        </div>

        <div class="grid lg:grid-cols-[1fr_400px] gap-12">
          <!-- Contact Form -->
          <div class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-100">
            <h2 class="text-2xl font-serif text-luxury-black mb-8 flex items-center gap-3">
              <MessageSquare class="w-6 h-6 text-luxury-gold" /> Send us a Message
            </h2>

            <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-bold text-neutral-400 uppercase tracking-widest ml-1">Your Name</label>
                  <input 
                    v-model="form.name" 
                    required 
                    type="text" 
                    placeholder="Enter your name"
                    class="w-full px-6 py-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-bold text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    v-model="form.email" 
                    required 
                    type="email" 
                    placeholder="Enter your email"
                    class="w-full px-6 py-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-neutral-400 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  v-model="form.subject" 
                  required 
                  type="text" 
                  placeholder="How can we help?"
                  class="w-full px-6 py-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-neutral-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  v-model="form.message" 
                  required 
                  rows="6" 
                  placeholder="Tell us more about your inquiry..."
                  class="w-full px-6 py-4 bg-neutral-50 rounded-2xl border border-neutral-100 outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full md:w-auto px-10 py-4 bg-luxury-black text-white rounded-2xl font-bold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                <Send v-if="!isSubmitting" class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>

            <div v-else class="text-center py-12">
              <div class="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send class="w-10 h-10" />
              </div>
              <h3 class="text-2xl font-serif text-luxury-black mb-2">Message Sent!</h3>
              <p class="text-neutral-500 mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
              <button @click="submitted = false" class="text-luxury-gold font-bold">Send another message</button>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <div class="bg-luxury-black text-white rounded-[2.5rem] p-10">
              <h2 class="text-2xl font-serif mb-8">Contact Information</h2>
              <div class="space-y-8">
                <div class="flex gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail class="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Email Us</p>
                    <p class="font-medium">concierge@elysiumeats.com</p>
                    <p class="font-medium text-neutral-400">support@elysiumeats.com</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone class="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Call Us</p>
                    <p class="font-medium">+1 (888) ELYSIUM</p>
                    <p class="font-medium text-neutral-400">Mon-Fri: 9am - 10pm</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin class="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <p class="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Visit Us</p>
                    <p class="font-medium">123 Culinary Plaza, Suite 500</p>
                    <p class="font-medium text-neutral-400">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Hours -->
            <div class="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-sm">
              <h2 class="text-xl font-serif text-luxury-black mb-6 flex items-center gap-3">
                <Clock class="w-5 h-5 text-luxury-gold" /> Concierge Hours
              </h2>
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-500">Monday - Friday</span>
                  <span class="font-bold text-luxury-black">9:00 AM - 10:00 PM</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-500">Saturday</span>
                  <span class="font-bold text-luxury-black">10:00 AM - 11:00 PM</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-500">Sunday</span>
                  <span class="font-bold text-luxury-black">10:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
