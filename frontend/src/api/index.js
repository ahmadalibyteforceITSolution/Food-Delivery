const BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://food-delivery-weld-eta.vercel.app/api' : 'http://localhost:5000/api');

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const apiService = {
  // Restaurants
  async getRestaurants() {
    const response = await fetch(`${BASE_URL}/restaurants`);
    return handleResponse(response);
  },

  async getRestaurantById(id) {
    const response = await fetch(`${BASE_URL}/restaurants/${id}`);
    return handleResponse(response);
  },

  // Orders
  async createOrder(orderData) {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },

  async getOrders(userId) {
    const response = await fetch(`${BASE_URL}/orders?userId=${userId}`);
    return handleResponse(response);
  },

  // Auth
  async register(userData) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async login(credentials) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  }
};
