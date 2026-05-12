import { defineStore } from 'pinia'
import { apiService } from '../api'
import { slugify } from '../utils/helpers'

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    searchQuery: '',
    activeCategory: null,
    restaurants: [],
    loading: false,
    categories: [
      { id: 1, name: 'Italian', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=200', color: 'from-amber-400 to-yellow-600' },
      { id: 2, name: 'Japanese', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=200', color: 'from-rose-400 to-pink-600' },
      { id: 3, name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=200', color: 'from-green-400 to-emerald-600' },
      { id: 4, name: 'American', image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=200', color: 'from-red-400 to-rose-600' },
      { id: 5, name: 'Healthy', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200', color: 'from-orange-400 to-amber-600' },
      { id: 6, name: 'Steakhouse', image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&q=80&w=200', color: 'from-purple-400 to-violet-600' },
      { id: 7, name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200', color: 'from-pink-400 to-fuchsia-600' },
      { id: 8, name: 'Fine Dining', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=200', color: 'from-teal-400 to-cyan-600' }
    ],
    deals: [
      { id: 1, title: 'First Order Special', subtitle: '30% off your first delivery', code: 'WELCOME30', bg: 'from-luxury-gold to-amber-600' },
      { id: 2, title: 'Free Delivery', subtitle: 'On orders above $50', code: 'FREEDEL', bg: 'from-emerald-500 to-teal-600' }
    ]
  }),
  getters: {
    getRestaurantById: (state) => (id) => state.restaurants.find(r => r.id === parseInt(id)),
    getRestaurantBySlug: (state) => (slug) => state.restaurants.find(r => slugify(r.name) === slug),
    filteredRestaurants: (state) => {
      let results = state.restaurants
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase()
        results = results.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.tags.some(t => t.toLowerCase().includes(q))
        )
      }
      if (state.activeCategory) {
        const cat = state.categories.find(c => c.id === state.activeCategory)
        if (cat) {
          const catName = cat.name.toLowerCase()
          results = results.filter(r =>
            r.cuisine.toLowerCase().includes(catName) ||
            r.tags.some(t => t.toLowerCase().includes(catName)) ||
            (catName === 'fine dining' && r.featured) ||
            (catName === 'healthy' && r.tags.some(t => t.toLowerCase().includes('vegan') || t.toLowerCase().includes('organic')))
          )
        }
      }
      return results
    },
    featuredRestaurants: (state) => state.restaurants.filter(r => r.featured),
    allDishes: (state) => {
      const dishes = []
      state.restaurants.forEach(r => {
        if (r.menu) {
          r.menu.forEach(m => {
            dishes.push({ 
              ...m, 
              restaurantId: r.id, 
              restaurantName: r.name,
              cuisine: r.cuisine,
              tags: r.tags
            })
          })
        }
      })
      return dishes
    },
    popularItems: (state) => {
      const items = []
      state.restaurants.forEach(r => {
        if (r.menu) {
          r.menu.filter(m => m.popular).forEach(m => {
            items.push({ ...m, restaurantId: r.id, restaurantName: r.name })
          })
        }
      })
      return items.slice(0, 8)
    }
  },
  actions: {
    async fetchRestaurants() {
      this.loading = true;
      try {
        this.restaurants = await apiService.getRestaurants();
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        this.loading = false;
      }
    },
    setSearchQuery(query) {
      this.searchQuery = query
    },
    setActiveCategory(catId) {
      this.activeCategory = this.activeCategory === catId ? null : catId
    }
  }
})
