import { defineStore } from 'pinia'
import { apiService } from '../api'
import { slugify } from '../utils/helpers'

const cuisineTemplates = {
  'Italian': {
    dishes: [
      { name: 'Margherita Pizza', basePrice: 15, image: 'https://images.unsplash.com/photo-1574071318508-1cdbcd80ad00' },
      { name: 'Pasta Carbonara', basePrice: 18, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3' },
      { name: 'Lasagna Bolognese', basePrice: 22, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3' },
      { name: 'Truffle Mushroom Risotto', basePrice: 26, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371' },
      { name: 'Tiramisu', basePrice: 12, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' }
    ],
    tags: ['Pasta', 'Pizza', 'Authentic', 'Comfort Food']
  },
  'Japanese': {
    dishes: [
      { name: 'Salmon Nigiri Set', basePrice: 24, image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a' },
      { name: 'Tonkotsu Ramen', basePrice: 19, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624' },
      { name: 'Dragon Roll', basePrice: 21, image: 'https://images.unsplash.com/photo-1559466273-d95e72debaf8' },
      { name: 'Chicken Teriyaki', basePrice: 18, image: 'https://images.unsplash.com/photo-1532139154602-2727c51c412f' },
      { name: 'Matcha Cheesecake', basePrice: 10, image: 'https://images.unsplash.com/photo-1536599424071-0b215a388ba7' }
    ],
    tags: ['Sushi', 'Ramen', 'Healthy', 'Fresh']
  },
  'Indian': {
    dishes: [
      { name: 'Butter Chicken', basePrice: 20, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
      { name: 'Paneer Tikka Masala', basePrice: 18, image: 'https://images.unsplash.com/photo-1567184109411-47a7a3928501' },
      { name: 'Lamb Biryani', basePrice: 22, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8' },
      { name: 'Garlic Naan', basePrice: 5, image: 'https://images.unsplash.com/photo-1601303584126-269425e6435c' },
      { name: 'Gulab Jamun', basePrice: 8, image: 'https://images.unsplash.com/photo-1589113744320-990425007113' }
    ],
    tags: ['Spicy', 'Curry', 'Vegetarian', 'Tandoori']
  },
  'American': {
    dishes: [
      { name: 'Signature Cheeseburger', basePrice: 16, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
      { name: 'BBQ Pork Ribs', basePrice: 28, image: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
      { name: 'Crispy Chicken Wings', basePrice: 14, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f' },
      { name: 'Mac & Cheese', basePrice: 12, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6' },
      { name: 'Chocolate Brownie', basePrice: 9, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c' }
    ],
    tags: ['Burger', 'BBQ', 'Fast Food', 'Wings']
  },
  'Healthy': {
    dishes: [
      { name: 'Quinoa Buddha Bowl', basePrice: 17, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
      { name: 'Grilled Salmon Salad', basePrice: 21, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288' },
      { name: 'Avocado Toast', basePrice: 14, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8' },
      { name: 'Açaí Berry Bowl', basePrice: 13, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733' },
      { name: 'Green Detox Smoothie', basePrice: 9, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec' }
    ],
    tags: ['Vegan', 'Gluten-Free', 'Organic', 'Salads']
  }
};

const restaurantNames = [
  'The Golden Truffle', 'Zen Garden', 'Spice Route', 'Burger Theory', 'Green Leaf',
  'Luigi\'s Kitchen', 'Tokyo Express', 'Mumbai Magic', 'Steak & Co', 'Purely Plant',
  'Ocean Breeze', 'Alpine Bistro', 'Saffron Sky', 'Urban Grill', 'The Healthy Hub',
  'Mama Mia', 'Sakura Sushi', 'Indi-Go', 'Crispy Corner', 'Vitality Veg'
];

function generateMockRestaurants() {
  const restaurants = [];
  let dishIdCounter = 1000;
  for (let i = 0; i < restaurantNames.length; i++) {
    const cuisineTypes = Object.keys(cuisineTemplates);
    const cuisine = cuisineTypes[i % cuisineTypes.length];
    const template = cuisineTemplates[cuisine];

    const restaurant = {
      id: i + 1,
      name: restaurantNames[i],
      cuisine: cuisine,
      rating: parseFloat((4 + (i % 10) * 0.1).toFixed(1)),
      reviewCount: 150 + i * 25,
      deliveryTime: `${20 + (i % 4) * 5}-${30 + (i % 4) * 5} min`,
      minOrder: 15,
      deliveryFee: parseFloat((2.99 + (i % 3)).toFixed(2)),
      image: template.dishes[0].image + '?auto=format&fit=crop&q=80&w=800',
      featured: i % 3 === 0,
      promo: i % 2 === 0 ? '20% OFF' : '',
      tags: template.tags,
      menu: []
    };

    for (let j = 0; j < 20; j++) {
      const baseDish = template.dishes[j % template.dishes.length];
      restaurant.menu.push({
        id: dishIdCounter++,
        name: `${baseDish.name}${j >= 5 ? ` Special ${j - 4}` : ''}`,
        description: `Signature ${baseDish.name.toLowerCase()} crafted with premium ingredients and chef special seasoning.`,
        price: parseFloat((baseDish.basePrice + (j % 5) * 1.5).toFixed(2)),
        image: baseDish.image + `?auto=format&fit=crop&q=80&w=400&sig=${dishIdCounter}`,
        popular: j % 3 === 0
      });
    }
    restaurants.push(restaurant);
  }
  return restaurants;
}

const fallbackRestaurants = generateMockRestaurants();

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    searchQuery: '',
    activeCategory: null,
    restaurants: fallbackRestaurants,
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
          (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
        )
      }
      if (state.activeCategory) {
        const cat = state.categories.find(c => c.id === state.activeCategory)
        if (cat) {
          const catName = cat.name.toLowerCase()
          results = results.filter(r =>
            r.cuisine.toLowerCase().includes(catName) ||
            (r.tags && r.tags.some(t => t.toLowerCase().includes(catName))) ||
            (catName === 'fine dining' && r.featured) ||
            (catName === 'healthy' && r.tags && r.tags.some(t => t.toLowerCase().includes('vegan') || t.toLowerCase().includes('organic')))
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
              price: typeof m.price === 'number' ? m.price : parseFloat(m.price) || 0,
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
            items.push({
              ...m,
              price: typeof m.price === 'number' ? m.price : parseFloat(m.price) || 0,
              restaurantId: r.id,
              restaurantName: r.name
            })
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
        const res = await apiService.getRestaurants();
        if (Array.isArray(res) && res.length > 0) {
          this.restaurants = res;
        }
      } catch (error) {
        console.warn('Error fetching restaurants from API, using fallback data:', error);
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
