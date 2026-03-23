import { axiosInstance } from './axios';

export const employeeAPI = {
  /**
   * Create a new employee
   * @param {Object} employeeData 
   * @returns expected response data object
   */
  createEmployee: async (employeeData) => {
    const response = await axiosInstance.post('/users/employee', employeeData);
    return response.data;
  },
};
