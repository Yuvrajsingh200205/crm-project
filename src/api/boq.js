import { axiosInstance } from './axios';

export const boqAPI = {
    // Get all Bill of Quantities
    getAllBills: async () => {
        const response = await axiosInstance.get('/bills');
        return response;
    },

    // Create a new Bill of Quantity
    createBill: async (data) => {
        const response = await axiosInstance.post('/bills', data);
        return response;
    },

    // Update an existing Bill of Quantity
    updateBill: async (id, data) => {
        const response = await axiosInstance.put(`/bills/${id}`, data);
        return response;
    },

    // Delete a Bill of Quantity
    deleteBill: async (id) => {
        const response = await axiosInstance.delete(`/bills/${id}`);
        return response;
    }
};
