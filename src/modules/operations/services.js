import axiosInstance from '../../utils/axios';



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

export const materialReconciliationAPI = {
    // Get all material reconciliations
    getAllMaterialReconciliations: async () => {
        const response = await axiosInstance.get('/material-reconciliations');
        return response.data;
    },

    // Create a new material reconciliation entry
    createMaterialReconciliation: async (data) => {
        const response = await axiosInstance.post('/material-reconciliations', data);
        return response.data;
    },

    // Update reconciliation status if needed
    updateMaterialReconciliationStatus: async (id, status) => {
        const response = await axiosInstance.patch(`/material-reconciliations/${id}`, { status });
        return response.data;
    }
};

export const procurementAPI = {
    // Get all procurements
    getAllProcurements: async () => {
        const response = await axiosInstance.get('/procurements');
        return response.data;
    },

    // Create a new procurement
    createProcurement: async (procurementData) => {
        const response = await axiosInstance.post('/procurements', procurementData);
        return response.data;
    },

    // Update procurement status/progress
    updateProcurementStatus: async (id, updateData) => {
        const response = await axiosInstance.patch(`/procurements/${id}`, updateData);
        return response.data;
    }
};
