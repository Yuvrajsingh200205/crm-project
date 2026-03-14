import { createContext, useContext, useState } from 'react';

const initialEmployees = [
    { id: 'EMP-001', name: 'Rajesh Kumar', designation: 'Project Manager', department: 'Operations', doj: '2022-04-01', basic: 35000, gross: 58000, net: 52800, pf: 'Active', esi: false, pan: 'ABCPK1234Q', uan: '100567892345', type: 'Permanent', status: 'Active' },
    { id: 'EMP-002', name: 'Suresh Verma', designation: 'Senior Engineer', department: 'Civil', doj: '2021-07-15', basic: 28000, gross: 46000, net: 41500, pf: 'Active', esi: false, pan: 'DERPV5678R', uan: '100567892346', type: 'Permanent', status: 'Active' },
    { id: 'EMP-003', name: 'Priya Devi', designation: 'Site Engineer', department: 'Electrical', doj: '2023-01-10', basic: 22000, gross: 36000, net: 32400, pf: 'Active', esi: true, pan: 'GHIPD9012S', uan: '100567892347', type: 'Permanent', status: 'Active' },
    { id: 'EMP-004', name: 'Mohan Lal', designation: 'Store Keeper', department: 'Stores', doj: '2023-06-01', basic: 15000, gross: 21000, net: 18200, pf: 'Active', esi: true, pan: 'JKLML3456T', uan: '100567892348', type: 'Permanent', status: 'Active' },
    { id: 'EMP-005', name: 'Ankit Sharma', designation: 'Project Manager', department: 'Solar', doj: '2020-09-15', basic: 40000, gross: 68000, net: 61500, pf: 'Active', esi: false, pan: 'MNOAS7890U', uan: '100567892349', type: 'Permanent', status: 'Active' },
    { id: 'EMP-006', name: 'Ritu Singh', designation: 'HR Manager', department: 'HR', doj: '2022-02-01', basic: 30000, gross: 50000, net: 45200, pf: 'Active', esi: false, pan: 'PQRRS2345V', uan: '100567892350', type: 'Permanent', status: 'Active' },
    { id: 'EMP-007', name: 'Deepak Kumar', designation: 'Accountant', department: 'Finance', doj: '2021-11-20', basic: 25000, gross: 41000, net: 37100, pf: 'Active', esi: false, pan: 'STUVK6789W', uan: '100567892351', type: 'Permanent', status: 'Active' },
    { id: 'EMP-008', name: 'Sanya Mishra', designation: 'Site Supervisor', department: 'Interior', doj: '2024-01-15', basic: 18000, gross: 28000, net: 24800, pf: 'Active', esi: true, pan: 'WXYZM1234X', uan: '100567892352', type: 'Contract', status: 'Active' },
];

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
    const [activeModule, setActiveModule] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'warning', message: 'Material shortage on SWPL-BRGF project', time: '5m ago', read: false },
        { id: 2, type: 'info', message: 'RA-05 bill approved by Finance Manager', time: '1h ago', read: false },
        { id: 3, type: 'success', message: 'Payroll processed for February 2026', time: '2h ago', read: false },
        { id: 4, type: 'warning', message: 'GST return due in 3 days', time: '3h ago', read: true },
        { id: 5, type: 'error', message: 'TDS variance >5% on Bill Code 60', time: '1d ago', read: true },
    ]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // 'admin' or 'employee'

    const login = (role) => {
        setIsLoggedIn(true);
        setUserRole(role);
        setActiveModule('dashboard');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
    };

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employees, setEmployees] = useState(initialEmployees);

    const updateEmployee = (updatedEmp) => {
        setEmployees(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
        if (selectedEmployee?.id === updatedEmp.id) {
            setSelectedEmployee(updatedEmp);
        }
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <AppContext.Provider value={{
            activeModule, setActiveModule,
            sidebarOpen, setSidebarOpen,
            notifications, markAllRead,
            selectedEmployee, setSelectedEmployee,
            employees, setEmployees, updateEmployee,
            isLoggedIn, userRole, login, logout
        }}>
            {children}
        </AppContext.Provider>
    );
}
