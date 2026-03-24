import { axiosInstance } from './axios';

export const projectAPI = {
    // Get all Projects
    getAllProjects: async () => {
        const response = await axiosInstance.get('/projects');
        return response;
    },

    // Create a new Project
    createProject: async (data) => {
        const response = await axiosInstance.post('/projects', data);
        return response;
    },

    // Update an existing Project
    updateProject: async (id, data) => {
        const response = await axiosInstance.put(`/projects/${id}`, data);
        return response;
    },

    // Delete a Project
    deleteProject: async (id) => {
        const response = await axiosInstance.delete(`/projects/${id}`);
        return response;
    }
};
