import { axiosInstance } from './axios';

export const procurementAPI = {
    // Get all procurements
    getAllProcurements: async () => {
        const response = await axiosInstance.get('/procurements');
        return response.data;
    },

    // Create a new procurement
    createProcurement: async (procurementData) => {
        const response = await axiosInstance.post('/procurements', procurementData);
        return response.data;
    },

    // Update procurement status/progress
    updateProcurementStatus: async (id, updateData) => {
        const response = await axiosInstance.patch(`/procurements/${id}`, updateData);
        return response.data;
    }
};
