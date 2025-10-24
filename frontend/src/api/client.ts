import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Optional: keep an interceptor to ensure header exists even if defaults change
api.interceptors.request.use((config) => {
  // If header already set by defaults or manually, leave it.
  return config;
});

export default api;
