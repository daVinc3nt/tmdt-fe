// const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "https://ecommerce.orangedesert-3e8e63bd.eastasia.azurecontainerapps.io"}/api`;
const DEFAULT_DEV_BASE_URL = 'http://localhost:8080';
const DEFAULT_PROD_BASE_URL = 'https://ecommerce.orangedesert-3e8e63bd.eastasia.azurecontainerapps.io';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? DEFAULT_DEV_BASE_URL : DEFAULT_PROD_BASE_URL);
const API_BASE_URL = `${BASE_URL}/api`;

export const apiCall = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: Record<string, any>
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Request failed: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};

export default {
  post: (endpoint: string, data: Record<string, any>) =>
    apiCall('POST', endpoint, data),
  get: (endpoint: string) =>
    apiCall('GET', endpoint),
  put: (endpoint: string, data: Record<string, any>) =>
    apiCall('PUT', endpoint, data),
  delete: (endpoint: string) =>
    apiCall('DELETE', endpoint),
};
