import { axiosInstance } from './axios';

export const vendorAPI = {
    // Get all vendors
    getAllVendors: async () => {
        try {
            const response = await axiosInstance.get('/vendors');
            return response.data;
        } catch (error) {
            console.error('Error fetching vendors:', error);
            throw error;
        }
    },

    // Get specific vendor by ID
    getVendorById: async (id) => {
        try {
            const response = await axiosInstance.get(`/vendors/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching vendor ${id}:`, error);
            throw error;
        }
    },

    // Create a new vendor
    createVendor: async (vendorData) => {
        try {
            // Mapping to both potential names to ensure compatibility
            const payload = {
                ...vendorData,
                panOrgstin: vendorData.panOrgstin || vendorData.gstinOrPan // Handle both variations
            };
            const response = await axiosInstance.post('/vendors', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating vendor:', error);
            throw error;
        }
    },

    // Update an existing vendor
    updateVendor: async (id, vendorData) => {
        try {
            const response = await axiosInstance.put(`/vendors/${id}`, vendorData);
            return response.data;
        } catch (error) {
            console.error('Error updating vendor:', error);
            throw error;
        }
    },

    // Delete a vendor
    deleteVendor: async (id) => {
        try {
            const response = await axiosInstance.delete(`/vendors/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting vendor:', error);
            throw error;
        }
    }
};
