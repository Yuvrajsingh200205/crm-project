import { axiosInstance } from './axios';

const getLocalBanks = () => {
    const local = localStorage.getItem('mock_banks');
    if (local) return JSON.parse(local);
    const initialBanks = [
        { id: 1, bankName: 'HDFC Bank', accountNo: '50200012345678', ifsc: 'HDFC0000001', branch: 'Main Branch, Delhi', accountType: 'Current', status: 'Active', balance: 4500000, accountHolder: 'EcoConstruct Pvt Ltd' },
        { id: 2, bankName: 'State Bank of India', accountNo: '31234567890', ifsc: 'SBIN0001234', branch: 'Corporate Branch, Mumbai', accountType: 'OD', status: 'Active', balance: 12000000, accountHolder: 'EcoConstruct Pvt Ltd' },
        { id: 3, bankName: 'ICICI Bank', accountNo: '000123456789', ifsc: 'ICIC0000002', branch: 'Sector 18, Noida', accountType: 'Current', status: 'Inactive', balance: 0, accountHolder: 'EcoConstruct Pvt Ltd' },
    ];
    localStorage.setItem('mock_banks', JSON.stringify(initialBanks));
    return initialBanks;
};

const saveLocalBanks = (banks) => {
    localStorage.setItem('mock_banks', JSON.stringify(banks));
};

export const bankAPI = {
    // Get all banks
    getAllBanks: async () => {
        try {
            const response = await axiosInstance.get('/banks');
            return response.data;
        } catch {
            return { success: true, banks: getLocalBanks() };
        }
    },

    // Create a new bank
    createBank: async (bankData) => {
        try {
            const response = await axiosInstance.post('/banks', bankData);
            return response.data;
        } catch {
            const banks = getLocalBanks();
            const newBank = { ...bankData, id: Date.now() };
            banks.push(newBank);
            saveLocalBanks(banks);
            return { success: true, data: newBank };
        }
    },

    // Update a bank
    updateBank: async (id, bankData) => {
        try {
            const response = await axiosInstance.put(`/banks/${id}`, bankData);
            return response.data;
        } catch {
            let banks = getLocalBanks();
            banks = banks.map(b => b.id === id ? { ...b, ...bankData } : b);
            saveLocalBanks(banks);
            return { success: true, data: bankData };
        }
    },

    // Delete a bank
    deleteBank: async (id) => {
        try {
            const response = await axiosInstance.delete(`/banks/${id}`);
            return response.data;
        } catch {
            let banks = getLocalBanks();
            banks = banks.filter(b => b.id !== id);
            saveLocalBanks(banks);
            return { success: true };
        }
    }
};
