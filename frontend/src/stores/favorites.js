import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteRestaurants: JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]'),
    favoriteItems: JSON.parse(localStorage.getItem('favoriteItems') || '[]')
  }),
  getters: {
    isRestaurantFavorite: (state) => (id) => state.favoriteRestaurants.includes(id),
    isItemFavorite: (state) => (id) => state.favoriteItems.includes(id),
    favoriteCount: (state) => state.favoriteRestaurants.length + state.favoriteItems.length
  },
  actions: {
    toggleRestaurantFavorite(id) {
      const idx = this.favoriteRestaurants.indexOf(id)
      if (idx === -1) {
        this.favoriteRestaurants.push(id)
      } else {
        this.favoriteRestaurants.splice(idx, 1)
      }
      localStorage.setItem('favoriteRestaurants', JSON.stringify(this.favoriteRestaurants))
    },
    toggleItemFavorite(id) {
      const idx = this.favoriteItems.indexOf(id)
      if (idx === -1) {
        this.favoriteItems.push(id)
      } else {
        this.favoriteItems.splice(idx, 1)
      }
      localStorage.setItem('favoriteItems', JSON.stringify(this.favoriteItems))
    }
  }
})
