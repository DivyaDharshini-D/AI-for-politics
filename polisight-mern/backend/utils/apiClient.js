const axios = require('axios');

const apiClient = axios.create({
  timeout: 8000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message;
    const error   = new Error(message);
    error.statusCode = err.response?.status || 500;
    return Promise.reject(error);
  }
);

module.exports = apiClient;
