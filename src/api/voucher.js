import { axiosInstance } from './axios';

export const voucherAPI = {
    getAllVouchers: () => {
        console.log("DEBUG: GET /vouchers");
        return axiosInstance.get('/vouchers');
    },
    getVoucherById: (id) => {
        console.log(`DEBUG: GET /vouchers/${id}`);
        return axiosInstance.get(`/vouchers/${id}`);
    },
    createVoucher: (data) => {
        console.log("DEBUG: POST /vouchers", data);
        return axiosInstance.post('/vouchers', data);
    },
    updateVoucher: (id, data) => {
        console.log(`DEBUG: PUT /vouchers/${id}`, data);
        return axiosInstance.put(`/vouchers/${id}`, data);
    },
    deleteVoucher: (id) => {
        console.log(`DEBUG: DELETE /vouchers/${id}`);
        return axiosInstance.delete(`/vouchers/${id}`);
    }
};
