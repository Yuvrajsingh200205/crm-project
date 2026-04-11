import { axiosInstance } from './axios';

export const equipmentAPI = {
    getAllEquipments: () => {
        console.log("DEBUG: GET /equipments");
        return axiosInstance.get('/equipments');
    },
    getEquipmentById: (id) => {
        console.log(`DEBUG: GET /equipments/${id}`);
        return axiosInstance.get(`/equipments/${id}`);
    },
    createEquipment: (data) => {
        console.log("DEBUG: POST /equipments", data);
        return axiosInstance.post('/equipments', data);
    },
    updateEquipment: (id, data) => {
        console.log(`DEBUG: PUT /equipments/${id}`, data);
        return axiosInstance.put(`/equipments/${id}`, data);
    },
    deleteEquipment: (id) => {
        console.log(`DEBUG: DELETE /equipments/${id}`);
        return axiosInstance.delete(`/equipments/${id}`);
    }
};
