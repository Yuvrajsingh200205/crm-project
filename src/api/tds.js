import { axiosInstance } from './axios';

export const tdsAPI = {
    // Get all TDS records
    getAllTDS: async () => {
        const response = await axiosInstance.get('/tds');
        return response.data;
    },

    // Create a new TDS record
    createTDS: async (tdsData) => {
        const response = await axiosInstance.post('/tds', tdsData);
        return response.data;
    },

    // Get a single TDS record by ID
    getTDSById: async (id) => {
        const response = await axiosInstance.get(`/tds/${id}`);
        return response.data;
    },

    // Update an existing TDS record
    updateTDS: async (id, tdsData) => {
        const response = await axiosInstance.put(`/tds/${id}`, tdsData);
        return response.data;
    },

    // Delete a TDS record
    deleteTDS: async (id) => {
        const response = await axiosInstance.delete(`/tds/${id}`);
        return response.data;
    }
};
