import axiosInstance from '../../utils/axios';



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

export const employeeAPI = {
  /**
   * Get all employees
   * @returns array of employee objects
   */
  getAllEmployees: async () => {
    try {
      // First try singular (user's provided path)
      const response = await axiosInstance.get('/users/employee');
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      // If singular is forbidden (403) or not found (404), plural /users/employees might be the list endpoint
      if (status === 403 || status === 404) {
        try {
          console.warn(`Singular /users/employee failed (${status}), trying plural /users/employees...`);
          const pluralRes = await axiosInstance.get('/users/employees');
          return pluralRes.data;
        } catch {
          // If both fail, let it throw the original error
        }
      }
      console.error('Employee List Fetch Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user by id
  getEmployeeById: async (id) => {
      const response = await axiosInstance.get(`/users/employee/${id}`);
      return response.data;
  },

  /**
   * Create a new employee
   */
  createEmployee: async (employeeData) => {
    const response = await axiosInstance.post('/users/employee', employeeData);
    return response.data;
  },

  /**
   * Update an employee
   */
  updateEmployee: async (id, employeeData) => {
    const response = await axiosInstance.put(`/users/employee/${id}`, employeeData);
    return response.data;
  },

  /**
   * Delete an employee
   */
  deleteEmployee: async (id) => {
    const response = await axiosInstance.delete(`/users/employee/${id}`);
    return response.data;
  },
};

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
    },

    // Delete a leave allocation
    deleteLeaveAllocation: async (id) => {
        const response = await axiosInstance.delete(`/leave-allocations/${id}`);
        return response.data;
    },

    // Delete a leave request
    deleteLeave: async (id) => {
        const response = await axiosInstance.delete(`/leaves/${id}`);
        return response.data;
    }
};

export const payrollAPI = {
    // Create new payroll record
    createPayroll: async (payrollData) => {
        const response = await axiosInstance.post('/payrolls/', payrollData);
        return response.data;
    },

    // Get all payroll records
    getAllPayrolls: async () => {
        const response = await axiosInstance.get('/payrolls/');
        return response.data;
    },

    // Get payroll by user ID
    getPayrollByUserId: async (userId) => {
        const response = await axiosInstance.get(`/payrolls/user/${userId}`);
        return response.data;
    }
};

export const reimbursementAPI = {
    // Create new reimbursement claim
    createReimbursement: async (data) => {
        const response = await axiosInstance.post('/reimbursements', data);
        return response.data;
    },

    // Get all claims
    getAllReimbursements: async () => {
        const response = await axiosInstance.get('/reimbursements');
        return response.data;
    },

    // Get claim by ID
    getReimbursementById: async (id) => {
        const response = await axiosInstance.get(`/reimbursements/${id}`);
        return response.data;
    },

    // Update claim
    updateReimbursement: async (id, data) => {
        const response = await axiosInstance.put(`/reimbursements/${id}`, data);
        return response.data;
    },

    // Approve claim
    approveReimbursement: async (id) => {
        const response = await axiosInstance.patch(`/reimbursements/${id}/approve`, {});
        return response.data;
    },

    // Reject claim
    rejectReimbursement: async (id) => {
        const response = await axiosInstance.patch(`/reimbursements/${id}/reject`, {});
        return response.data;
    }
};
