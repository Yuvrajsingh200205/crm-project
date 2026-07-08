import { axiosInstance } from './axios';

export const partyAPI = {
    getAllParties: () => {
        return axiosInstance.get('/parties');
    },
    getPartyById: (id) => {
        return axiosInstance.get(`/parties/${id}`);
    },
    createParty: (data) => {
        return axiosInstance.post('/parties', data);
    },
    updateParty: (id, data) => {
        return axiosInstance.put(`/parties/${id}`, data);
    },
    deleteParty: (id) => {
        return axiosInstance.delete(`/parties/${id}`);
    }
};
