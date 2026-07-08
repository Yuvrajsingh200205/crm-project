import { axiosInstance } from './axios';

export const inventoryAPI = {
    getAllMaterials: () => {
        return axiosInstance.get('/materials');
    },
    getMaterialById: (id) => {
        return axiosInstance.get(`/materials/${id}`);
    },
    createMaterial: (data) => {
        return axiosInstance.post('/materials', data);
    },
    updateMaterial: (id, data) => {
        return axiosInstance.put(`/materials/${id}`, data);
    },
    deleteMaterial: (id) => {
        return axiosInstance.delete(`/materials/${id}`);
    }
};
