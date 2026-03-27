import { axiosInstance } from './axios';

export const materialReconciliationAPI = {
    // Get all material reconciliations
    getAllMaterialReconciliations: async () => {
        const response = await axiosInstance.get('/material-reconciliations');
        return response.data;
    },

    // Create a new material reconciliation entry
    createMaterialReconciliation: async (data) => {
        const response = await axiosInstance.post('/material-reconciliations', data);
        return response.data;
    },

    // Update reconciliation status if needed
    updateMaterialReconciliationStatus: async (id, status) => {
        const response = await axiosInstance.patch(`/material-reconciliations/${id}`, { status });
        return response.data;
    }
};
