import { axiosInstance } from './axios';

export const milestoneAPI = {
    /**
     * Fetch all milestones
     * GET /milestones
     */
    getAllMilestones: async () => {
        const response = await axiosInstance.get('/milestones');
        return response.data;
    },

    /**
     * Create a new milestone
     * POST /milestones
     * Body: { siteId, title, startDate, endDate, priority, status, completion }
     */
    createMilestone: async (data) => {
        const response = await axiosInstance.post('/milestones', data);
        return response.data;
    },

    /**
     * Update a milestone
     * PUT /milestones/:id
     */
    updateMilestone: async (id, data) => {
        const response = await axiosInstance.put(`/milestones/${id}`, data);
        return response.data;
    },

    /**
     * Delete a milestone
     * DELETE /milestones/:id
     */
    deleteMilestone: async (id) => {
        const response = await axiosInstance.delete(`/milestones/${id}`);
        return response.data;
    },
};
