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
    },

    // Get specific user's leave allocations
    getUserLeaveAllocations: async (userId) => {
        const response = await axiosInstance.get(`/leave-allocations/user/${userId}`);
        return response.data;
    },

    // Get employee leave details
    getEmployeeLeave: async (userId) => {
        const response = await axiosInstance.get(`/leaves/user/${userId}`);
        return response.data;
    },

    // Approve leave request
    approveLeave: async (id) => {
        const response = await axiosInstance.patch(`/leaves/${id}/approve`, {});
        return response.data;
    },

    // Reject leave request
    rejectLeave: async (id, reason) => {
        // payload: { rejectionReason: string }
        const response = await axiosInstance.patch(`/leaves/${id}/reject`, { rejectionReason: reason || "No reason provided" });
        return response.data;
    }
};
