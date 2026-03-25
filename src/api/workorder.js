import { axiosInstance } from './axios';

export const workOrderAPI = {
    /**
     * Fetch all work orders
     * GET /works
     */
    getAllWorkOrders: async () => {
        const response = await axiosInstance.get('/works');
        return response.data;
    },

    /**
     * Create a new work order
     * POST /works
     * Body: { projectId, contractor, description, value, retention, startDate, target, type, status }
     */
    createWorkOrder: async (data) => {
        const response = await axiosInstance.post('/works', data);
        return response.data;
    },

    /**
     * Update a work order
     * PUT /works/:id
     */
    updateWorkOrder: async (id, data) => {
        const response = await axiosInstance.put(`/works/${id}`, data);
        return response.data;
    },

    /**
     * Delete a work order
     * DELETE /works/:id
     */
    deleteWorkOrder: async (id) => {
        const response = await axiosInstance.delete(`/works/${id}`);
        return response.data;
    },
};
