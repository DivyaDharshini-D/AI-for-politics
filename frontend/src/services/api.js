import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 90000,
});

// Response interceptor
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pv_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
