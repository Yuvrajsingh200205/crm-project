import { axiosInstance } from './axios';

export const employeeAPI = {
  /**
   * Get all employees
   * @returns array of employee objects
   */
  getAllEmployees: async () => {
    const response = await axiosInstance.get('/users/employee');
    return response.data;
  },

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
