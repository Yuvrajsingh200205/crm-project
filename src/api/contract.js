import { axiosInstance } from './axios';

export const contractAPI = {
    // Get all contracts
    getAllContracts: async () => {
        const response = await axiosInstance.get('/contracts');
        return response;
    },

    // Get contract by ID
    getContractById: async (id) => {
        const response = await axiosInstance.get(`/contracts/${id}`);
        return response;
    },

    // Create a new contract
    createContract: async (data) => {
        const response = await axiosInstance.post('/contracts', data);
        return response;
    },

    // Update an existing contract
    updateContract: async (id, data) => {
        const response = await axiosInstance.put(`/contracts/${id}`, data);
        return response;
    },

    // Delete a contract
    deleteContract: async (id) => {
        const response = await axiosInstance.delete(`/contracts/${id}`);
        return response;
    }
};
