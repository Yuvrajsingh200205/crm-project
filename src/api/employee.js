import { axiosInstance } from './axios';

export const employeeAPI = {
  /**
   * Get all employees
   * @returns array of employee objects
   */
  getAllEmployees: async () => {
    try {
      // First try singular (user's provided path)
      const response = await axiosInstance.get('/users/employee');
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      // If singular is forbidden (403) or not found (404), plural /users/employees might be the list endpoint
      if (status === 403 || status === 404) {
        try {
          console.warn(`Singular /users/employee failed (${status}), trying plural /users/employees...`);
          const pluralRes = await axiosInstance.get('/users/employees');
          return pluralRes.data;
        } catch (pluralError) {
          // If both fail, let it throw the original error
          console.error('Both singular and plural employee endpoints failed.');
        }
      }
      console.error('Employee List Fetch Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user by id
  getEmployeeById: async (id) => {
      // user provided specific path: {{URL}}/leaves//user/:userId
      const response = await axiosInstance.get(`/leaves//user/${id}`);
      return response.data.employee;
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

  deleteEmployee: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};
