import { axiosInstance } from './axios';

export const leaveAPI = {
    // Get all leave records
    getAllLeaves: async () => {
        const response = await axiosInstance.get('/leaves');
        return response.data;
    },

    // Create a new leave entry
    createLeave: async (leaveData) => {
        // payload: { type: string, total: number }
        const response = await axiosInstance.post('/leaves', leaveData);
        return response.data;
    },

    // Get all leave allocations
    getAllLeaveAllocations: async () => {
        const response = await axiosInstance.get('/leave-allocations');
        return response.data;
    },

    // Create a new leave allocation
    createLeaveAllocation: async (allocationData) => {
        const response = await axiosInstance.post('/leave-allocations', allocationData);
        return response.data;
    }
};
