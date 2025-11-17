const API_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Restaurant API
export const restaurantAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/restaurants`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/restaurants/${id}`);
    return response.json();
  },

  getVendorRestaurant: async () => {
    const response = await fetch(`${API_URL}/restaurants/vendor/my-restaurant`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (restaurantData) => {
    const response = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(restaurantData)
    });
    return response.json();
  },

  update: async (id, restaurantData) => {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(restaurantData)
    });
    return response.json();
  }
};

// Menu API
export const menuAPI = {
  getByRestaurant: async (restaurantId) => {
    const response = await fetch(`${API_URL}/menu/restaurant/${restaurantId}`);
    return response.json();
  },

  create: async (menuItemData) => {
    const response = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuItemData)
    });
    return response.json();
  },

  update: async (id, menuItemData) => {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(menuItemData)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Order API
export const orderAPI = {
  create: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  getStudentOrders: async () => {
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getVendorOrders: async () => {
    const response = await fetch(`${API_URL}/orders/vendor/orders`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};
