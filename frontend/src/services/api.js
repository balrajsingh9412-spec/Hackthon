import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor attaching JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lifequest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Task / Quest APIs
export const taskApi = {
  getTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  completeTask: (id) => api.post(`/tasks/${id}/complete`)
};

// Character APIs
export const characterApi = {
  getProfile: () => api.get('/character/me'),
  getTransactions: () => api.get('/character/transactions')
};

// Shop APIs
export const shopApi = {
  getShopItems: () => api.get('/shop'),
  buyItem: (itemId) => api.post(`/shop/${itemId}/buy`)
};

// Inventory APIs
export const inventoryApi = {
  getInventory: () => api.get('/inventory'),
  equipItem: (id) => api.put(`/inventory/${id}/equip`)
};

export default api;
