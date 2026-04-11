import { axiosInstance } from './axios';

export const inventoryAPI = {
    getAllMaterials: () => {
        console.log("DEBUG: GET /materials");
        return axiosInstance.get('/materials');
    },
    getMaterialById: (id) => {
        console.log(`DEBUG: GET /materials/${id}`);
        return axiosInstance.get(`/materials/${id}`);
    },
    createMaterial: (data) => {
        console.log("DEBUG: POST /materials", data);
        return axiosInstance.post('/materials', data);
    },
    updateMaterial: (id, data) => {
        console.log(`DEBUG: PUT /materials/${id}`, data);
        return axiosInstance.put(`/materials/${id}`, data);
    },
    deleteMaterial: (id) => {
        console.log(`DEBUG: DELETE /materials/${id}`);
        return axiosInstance.delete(`/materials/${id}`);
    }
};
