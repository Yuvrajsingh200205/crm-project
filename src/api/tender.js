import { axiosInstance } from './axios';

export const tenderAPI = {
    getAllTenders: async () => {
        const response = await axiosInstance.get('/tenders');
        return response;
    },
    getTenderById: async (id) => {
        const response = await axiosInstance.get(`/tenders/${id}`);
        return response;
    },
    createTender: async (data) => {
        const response = await axiosInstance.post('/tenders', data);
        return response;
    },
    updateTender: async (id, data) => {
        const response = await axiosInstance.put(`/tenders/${id}`, data);
        return response;
    },
    deleteTender: async (id) => {
        const response = await axiosInstance.delete(`/tenders/${id}`);
        return response;
    }
};
