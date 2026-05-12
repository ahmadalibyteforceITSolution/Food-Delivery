import { defineStore } from 'pinia'
import { apiService } from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isLoginModalOpen: false,
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.name || 'Guest',
    userInitials: (state) => {
      if (!state.user?.name) return 'G'
      return state.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  },
  actions: {
    async login(credentials) {
      this.loading = true;
      try {
        // For now, we simulate success with the backend register/login pattern
        // In a real app, this would use apiService.login
        const userData = {
          name: credentials.name || credentials.email.split('@')[0],
          email: credentials.email
        };
        
        // Persist locally
        this.user = {
          id: Date.now(),
          ...userData,
          joinedAt: new Date().toISOString()
        }
        localStorage.setItem('user', JSON.stringify(this.user))
        this.isLoginModalOpen = false
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    },
    async register(userData) {
      this.loading = true;
      try {
        const result = await apiService.register(userData);
        this.user = result.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.isLoginModalOpen = false;
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    updateProfile(data) {
      this.user = { ...this.user, ...data }
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    openLoginModal() {
      this.isLoginModalOpen = true
    },
    closeLoginModal() {
      this.isLoginModalOpen = false
    }
  }
})
