import { axiosInstance } from './axios';

export const partyAPI = {
    getAllParties: () => {
        console.log("DEBUG: GET /parties");
        return axiosInstance.get('/parties');
    },
    getPartyById: (id) => {
        console.log(`DEBUG: GET /parties/${id}`);
        return axiosInstance.get(`/parties/${id}`);
    },
    createParty: (data) => {
        console.log("DEBUG: POST /parties", data);
        return axiosInstance.post('/parties', data);
    },
    updateParty: (id, data) => {
        console.log(`DEBUG: PUT /parties/${id}`, data);
        return axiosInstance.put(`/parties/${id}`, data);
    },
    deleteParty: (id) => {
        console.log(`DEBUG: DELETE /parties/${id}`);
        return axiosInstance.delete(`/parties/${id}`);
    }
};
