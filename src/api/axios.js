import axios from 'axios';

// Base URL for APIs
const BASE_URL = import.meta.env.VITE_API_URL;

// Create generic custom axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach access token to headers if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Assuming Bearer token prefix. Update if your backend differs.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle expired token & automatic refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized or 403 Forbidden and we haven't retried yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token present.');
        }

        console.log("Interceptor: Triggering refresh token API call...");
        const currentAccessToken = localStorage.getItem('accessToken');
        
        // Call refresh token API without an interceptor to avoid infinite loop
        const result = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken: refreshToken,
          token: refreshToken // Many backend schemas expect simply 'token'
        }, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentAccessToken}` 
          }
        });

        // Map the tokens checking multiple standard schemas (camelCase vs snake_case)
        const newAccessToken = result.data?.accessToken || result.data?.data?.accessToken || result.data?.access_token || result.data?.token || result.data?.data?.token;
        const newRefreshToken = result.data?.refreshToken || result.data?.data?.refreshToken || result.data?.refresh_token;

        if (newAccessToken) localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

        // Update the failed request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken || localStorage.getItem('accessToken')}`;

        // Retry the original request
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh token failed -> Force user to login again
        console.error('Session expired. Please log in again.', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
