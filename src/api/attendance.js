import { axiosInstance } from './axios';

export const attendanceAPI = {
    // Get all attendance logs
    getAllLogs: async () => {
        const response = await axiosInstance.get('/attendance-logs');
        return response.data;
    },
    
    // Get attendance logs for a specific user
    getUserLogs: async (userId) => {
        const response = await axiosInstance.get(`/attendance-logs/user/${userId}`);
        return response.data;
    }
};
