import { axiosInstance } from './axios';

export const siteAPI = {
    /**
     * Fetch all sites
     * GET /sites
     */
    getAllSites: async () => {
        const response = await axiosInstance.get('/sites');
        return response.data;
    },

    /**
     * Create a new site
     * POST /sites
     * Body: { projectId, name, location, supervisor, count, budget, complexity, status, rating }
     */
    createSite: async (data) => {
        const response = await axiosInstance.post('/sites', data);
        return response.data;
    },

    /**
     * Update an existing site
     * PUT /sites/:id
     */
    updateSite: async (id, data) => {
        const response = await axiosInstance.put(`/sites/${id}`, data);
        return response.data;
    },

    /**
     * Delete a site
     * DELETE /sites/:id
     */
    deleteSite: async (id) => {
        const response = await axiosInstance.delete(`/sites/${id}`);
        return response.data;
    },
};
