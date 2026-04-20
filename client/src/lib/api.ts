import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, try to refresh
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`);
        const { accessToken } = refreshResponse.data;
        
        // Update token in localStorage
        localStorage.setItem('accessToken', accessToken);
        
        // Update the original request header
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return axios(error.config);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```