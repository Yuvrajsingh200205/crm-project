import { axiosInstance } from './axios';

export const invoiceAPI = {
    // Get all invoices
    getAllInvoices: async () => {
        const response = await axiosInstance.get('/invoices');
        return response.data;
    },

    // Create a new invoice
    createInvoice: async (invoiceData) => {
        const response = await axiosInstance.post('/invoices', invoiceData);
        return response.data;
    },

    // Get a single invoice by ID
    getInvoiceById: async (id) => {
        const response = await axiosInstance.get(`/invoices/${id}`);
        return response.data;
    },

    // Update an invoice
    updateInvoice: async (id, invoiceData) => {
        const response = await axiosInstance.put(`/invoices/${id}`, invoiceData);
        return response.data;
    },

    // Delete an invoice
    deleteInvoice: async (id) => {
        const response = await axiosInstance.delete(`/invoices/${id}`);
        return response.data;
    }
};
