import { axiosInstance } from './axios';

export const authAPI = {
  /**
   * Login user to backend
   * @param {string} email 
   * @param {string} password 
   * @returns expected response data object containing tokens
   */
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Manually call refresh token api if needed,
   * Note: The axios interceptor handles this automatically for expired requests!
   * @param {string} token - The refresh token
   */
  refreshToken: async (token) => {
    const response = await axiosInstance.post('/auth/refresh-token', {
      refreshToken: token,
    });
    return response.data;
  }
};
