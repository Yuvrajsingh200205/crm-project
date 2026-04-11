import { axiosInstance } from './axios';

export const quotationAPI = {
    getAllQuotations: () => {
        console.log("DEBUG: GET /quotations");
        return axiosInstance.get('/quotations');
    },
    getQuotationById: (id) => {
        console.log(`DEBUG: GET /quotations/${id}`);
        return axiosInstance.get(`/quotations/${id}`);
    },
    createQuotation: (data) => {
        console.log("DEBUG: POST /quotations", data);
        return axiosInstance.post('/quotations', data);
    },
    updateQuotation: (id, data) => {
        console.log(`DEBUG: PUT /quotations/${id}`, data);
        return axiosInstance.put(`/quotations/${id}`, data);
    },
    deleteQuotation: (id) => {
        console.log(`DEBUG: DELETE /quotations/${id}`);
        return axiosInstance.delete(`/quotations/${id}`);
    }
};
