import { axiosInstance } from './axios';

export const equipmentAPI = {
    getAllEquipments: () => {
        return axiosInstance.get('/equipments');
    },
    getEquipmentById: (id) => {
        return axiosInstance.get(`/equipments/${id}`);
    },
    createEquipment: (data) => {
        return axiosInstance.post('/equipments', data);
    },
    updateEquipment: (id, data) => {
        return axiosInstance.put(`/equipments/${id}`, data);
    },
    deleteEquipment: (id) => {
        return axiosInstance.delete(`/equipments/${id}`);
    }
};
