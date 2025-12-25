import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ecommerce.orangedesert-3e8e63bd.eastasia.azurecontainerapps.io';
const DEFAULT_DEV_BASE_URL = 'http://localhost:8080';
const DEFAULT_PROD_BASE_URL = 'https://ecommerce.orangedesert-3e8e63bd.eastasia.azurecontainerapps.io';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? DEFAULT_DEV_BASE_URL : DEFAULT_PROD_BASE_URL);

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ENDPOINTS = [
  '/users/trainers',
  '/products',
];

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');

  const requestUrl = config.url || '';

  const isPublic = PUBLIC_ENDPOINTS.some((endpoint) =>
    requestUrl.includes(endpoint)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
