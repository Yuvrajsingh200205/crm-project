import { axiosInstance } from './axios';

export const accountAPI = {
    // Get all accounts
    getAllAccounts: async () => {
        const response = await axiosInstance.get('/accounts');
        return response.data;
    },

    // Create a new account
    createAccount: async (accountData) => {
        const response = await axiosInstance.post('/accounts', accountData);
        return response.data;
    },

    // Get a single account by ID
    getAccountById: async (id) => {
        const response = await axiosInstance.get(`/accounts/${id}`);
        return response.data;
    },

    // Update an account
    updateAccount: async (id, accountData) => {
        const response = await axiosInstance.put(`/accounts/${id}`, accountData);
        return response.data;
    },

    // Delete an account
    deleteAccount: async (id) => {
        const response = await axiosInstance.delete(`/accounts/${id}`);
        return response.data;
    }
};
