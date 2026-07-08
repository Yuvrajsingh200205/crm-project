import { axiosInstance } from './axios';

export const voucherAPI = {
    getAllVouchers: () => {
        return axiosInstance.get('/vouchers');
    },
    getVoucherById: (id) => {
        return axiosInstance.get(`/vouchers/${id}`);
    },
    createVoucher: (data) => {
        return axiosInstance.post('/vouchers', data);
    },
    updateVoucher: (id, data) => {
        return axiosInstance.put(`/vouchers/${id}`, data);
    },
    deleteVoucher: (id) => {
        return axiosInstance.delete(`/vouchers/${id}`);
    }
};
