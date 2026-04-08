import { axiosInstance } from './axios';

export const payrollAPI = {
    // Create new payroll record
    createPayroll: async (payrollData) => {
        const response = await axiosInstance.post('/payrolls/', payrollData);
        return response.data;
    },

    // Get all payroll records
    getAllPayrolls: async () => {
        const response = await axiosInstance.get('/payrolls/');
        return response.data;
    },

    // Get payroll by user ID
    getPayrollByUserId: async (userId) => {
        const response = await axiosInstance.get(`/payrolls/user/${userId}`);
        return response.data;
    }
};
