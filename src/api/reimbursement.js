import { axiosInstance } from './axios';

export const reimbursementAPI = {
    // Create new reimbursement claim
    createReimbursement: async (data) => {
        const response = await axiosInstance.post('/reimbursements', data);
        return response.data;
    },

    // Get all claims
    getAllReimbursements: async () => {
        const response = await axiosInstance.get('/reimbursements');
        return response.data;
    },

    // Get claim by ID
    getReimbursementById: async (id) => {
        const response = await axiosInstance.get(`/reimbursements/${id}`);
        return response.data;
    },

    // Update claim
    updateReimbursement: async (id, data) => {
        const response = await axiosInstance.put(`/reimbursements/${id}`, data);
        return response.data;
    },

    // Approve claim
    approveReimbursement: async (id) => {
        const response = await axiosInstance.patch(`/reimbursements/${id}/approve`, {});
        return response.data;
    },

    // Reject claim
    rejectReimbursement: async (id) => {
        const response = await axiosInstance.patch(`/reimbursements/${id}/reject`, {});
        return response.data;
    }
};
