import { axiosInstance } from './axios';

export const quotationAPI = {
    getAllQuotations: () => {
        return axiosInstance.get('/quotations');
    },
    getQuotationById: (id) => {
        return axiosInstance.get(`/quotations/${id}`);
    },
    createQuotation: (data) => {
        return axiosInstance.post('/quotations', data);
    },
    updateQuotation: (id, data) => {
        return axiosInstance.put(`/quotations/${id}`, data);
    },
    deleteQuotation: (id) => {
        return axiosInstance.delete(`/quotations/${id}`);
    }
};
