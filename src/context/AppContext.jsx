import { createContext, useContext, useState } from 'react';

const initialProjects = [
    {
        id: 'PRJ-2026-001', name: 'SWPL-BRGF Electrification Phase 1',
        client: 'Bihar Rural Development Authority', category: 'Electrical',
        site: 'Muzaffarpur, Bihar', manager: 'Rajesh Kumar', engineer: 'Amit Singh',
        contractValue: 4250000, advance: 850000,
        startDate: '2025-10-01', endDate: '2026-06-30',
        status: 'Active', progress: 78,
        tags: ['High Priority', 'Government']
    },
    {
        id: 'PRJ-2026-002', name: 'Patna Metro Civil Works Section B',
        client: 'PMRCL – Patna Metro Rail Corp', category: 'Civil',
        site: 'Patna, Bihar', manager: 'Suresh Verma', engineer: 'Priya Devi',
        contractValue: 12000000, advance: 3000000,
        startDate: '2025-08-15', endDate: '2026-12-31',
        status: 'Active', progress: 45,
        tags: ['Ongoing']
    },
    {
        id: 'PRJ-2026-003', name: 'Solar Farm Installation Muzaffarpur',
        client: 'Bihar State Energy Department', category: 'Solar',
        site: 'Muzaffarpur, Bihar', manager: 'Ankit Sharma', engineer: 'Ritu Singh',
        contractValue: 8500000, advance: 2125000,
        startDate: '2025-07-01', endDate: '2025-12-31',
        status: 'Completed', progress: 100,
        tags: ['Completed']
    },
    {
        id: 'PRJ-2026-004', name: 'HVAC System – Gaya Municipal Complex',
        client: 'Gaya Municipal Corporation', category: 'HVAC',
        site: 'Gaya, Bihar', manager: 'Vijay Tiwari', engineer: 'Neha Rai',
        contractValue: 2800000, advance: 700000,
        startDate: '2026-01-15', endDate: '2026-04-30',
        status: 'On Hold', progress: 30,
        tags: ['On Hold', 'Dispute']
    },
    {
        id: 'PRJ-2026-005', name: 'Interior Design – TechCorp HQ',
        client: 'TechCorp India Pvt Ltd', category: 'Interior',
        site: 'Patna, Bihar', manager: 'Deepak Kumar', engineer: 'Sanya Mishra',
        contractValue: 1550000, advance: 310000,
        startDate: '2026-02-01', endDate: '2026-04-15',
        status: 'Active', progress: 60,
        tags: ['Fast Track']
    },
    {
        id: 'PRJ-2026-006', name: 'Security System – Bank Complex Hajipur',
        client: 'Vaishali District Coop Bank', category: 'Security',
        site: 'Hajipur, Bihar', manager: 'Rakesh Prasad', engineer: 'Mohan Das',
        contractValue: 980000, advance: 196000,
        startDate: '2026-03-01', endDate: '2026-04-30',
        status: 'Active', progress: 15,
        tags: ['New']
    },
];

const initialWorkOrders = [
    {
        id: 'WO-2026-001',
        projectId: 'PRJ-2026-001',
        projectName: 'SWPL-BRGF Electrification Phase 1',
        vendorId: 'VEND-101',
        vendorName: 'Apex Electricals Pvt Ltd',
        workDescription: 'Internal Wiring & Fitting for Block A',
        value: 1250000,
        advance: 250000,
        retention: 5, // 5%
        startDate: '2025-11-01',
        endDate: '2026-03-31',
        status: 'Active',
        progress: 65,
        type: 'Rate Contract'
    },
    {
        id: 'WO-2026-002',
        projectId: 'PRJ-2026-002',
        projectName: 'Patna Metro Civil Works Section B',
        vendorId: 'VEND-205',
        vendorName: 'Bharat Construction Co.',
        workDescription: 'RCC Work for Pier P11 to P15',
        value: 4500000,
        advance: 900000,
        retention: 10,
        startDate: '2025-09-15',
        endDate: '2026-08-30',
        status: 'Active',
        progress: 40,
        type: 'Lumpsum'
    },
    {
        id: 'WO-2026-003',
        projectId: 'PRJ-2026-001',
        projectName: 'SWPL-BRGF Electrification Phase 1',
        vendorId: 'VEND-312',
        vendorName: 'Zenith Security Systems',
        workDescription: 'CCTV & Alarm Installation',
        value: 450000,
        advance: 0,
        retention: 5,
        startDate: '2026-02-15',
        endDate: '2026-04-30',
        status: 'Draft',
        progress: 0,
        type: 'Unit Rate'
    }
];

const initialBOQItems = [
    { id: '10', description: 'PSC Pole 8 Mtr 200 Kg including fixing in position', unit: 'No', contractRate: 6234, subRate: 5800, poQty: 2, billedQty: 0, status: 'Under Utilized' },
    { id: '20', description: 'PSC Pole 8 Mtr 300 Kg including fixing in position', unit: 'No', contractRate: 7450, subRate: 6900, poQty: 5, billedQty: 4, status: 'Under Utilized' },
    { id: '30', description: 'PSC Pole 9 Mtr 200 Kg including fixing in position', unit: 'No', contractRate: 8120, subRate: 7500, poQty: 8, billedQty: 8, status: 'Reconciled' },
    { id: '40', description: 'PSC Pole 9 Mtr 300 Kg including fixing in position', unit: 'No', contractRate: 9340, subRate: 8700, poQty: 12, billedQty: 10, status: 'Under Utilized' },
    { id: '50', description: 'PSC Pole 9 Mtr 400 Kg including fixing in position with cross arm', unit: 'No', contractRate: 11250, subRate: 10500, poQty: 10, billedQty: 16, status: 'Over Issued' },
    { id: '60', description: 'ABC Cable 3X95+1X70 Sq. mm [CKM]', unit: 'CKM', contractRate: 245000, subRate: 228000, poQty: 0.5, billedQty: 0.9766, status: 'Over Issued' },
    { id: '70', description: 'ABC Cable 3X50+1X25 Sq. mm [CKM]', unit: 'CKM', contractRate: 178000, subRate: 165000, poQty: 1.2, billedQty: 1.1, status: 'Under Utilized' },
    { id: '80', description: 'ABC Cable 3X185+1X95 Sq. mm [CKM]', unit: 'CKM', contractRate: 385000, subRate: 358000, poQty: 0.5, billedQty: 0.9766, status: 'Over Issued' },
    { id: '100', description: 'Stay Set Complete (Ground Anchor type)', unit: 'Set', contractRate: 1250, subRate: 1150, poQty: 10, billedQty: 5, status: 'Under Utilized' },
];

const initialSites = [
    { id: 'SITE-001', name: 'Muzaffarpur Block A', projectId: 'PRJ-2026-001', location: 'Muzaffarpur', supervisor: 'Amit Singh', manpower: 45, status: 'Active', health: 'Safe', alerts: 0, budget: 1500000, complexity: 'Medium' },
    { id: 'SITE-002', name: 'Patna Metro Pier P11', projectId: 'PRJ-2026-002', location: 'Patna', supervisor: 'Priya Devi', manpower: 120, status: 'Active', health: 'Caution', alerts: 2, budget: 5500000, complexity: 'High' },
    { id: 'SITE-003', name: 'Gaya Municipal Complex', projectId: 'PRJ-2026-004', location: 'Gaya', supervisor: 'Neha Rai', manpower: 25, status: 'On Hold', health: 'Safe', alerts: 0, budget: 850000, complexity: 'Low' },
    { id: 'SITE-004', name: 'TechCorp HQ Interior', projectId: 'PRJ-2026-005', location: 'Patna', supervisor: 'Sanya Mishra', manpower: 15, status: 'Active', health: 'Safe', alerts: 0, budget: 1200000, complexity: 'Medium' }
];

const initialProgressTasks = [
    { id: 'TASK-101', title: 'Foundation Leveling', projectId: 'PRJ-2026-001', category: 'Civil', progress: 100, startDate: '2025-10-01', endDate: '2025-10-15', status: 'Completed', priority: 'High', siteId: 'SITE-001' },
    { id: 'TASK-102', title: 'Internal Wiring', projectId: 'PRJ-2026-001', category: 'Electrical', progress: 65, startDate: '2025-11-01', endDate: '2026-03-31', status: 'In Progress', priority: 'Medium', siteId: 'SITE-001' },
    { id: 'TASK-201', title: 'Excavation & Piling', projectId: 'PRJ-2026-002', category: 'Civil', progress: 45, startDate: '2025-08-15', endDate: '2026-01-30', status: 'In Progress', priority: 'Critical', siteId: 'SITE-002' },
    { id: 'TASK-202', title: 'Casting of Peirs', projectId: 'PRJ-2026-002', category: 'Civil', progress: 15, startDate: '2026-02-01', endDate: '2026-10-31', status: 'Active', priority: 'High', siteId: 'SITE-002' },
    { id: 'TASK-501', title: 'Drywall Installation', projectId: 'PRJ-2026-005', category: 'Interior', progress: 85, startDate: '2026-02-01', endDate: '2026-03-15', status: 'In Progress', priority: 'Medium', siteId: 'SITE-004' },
    { id: 'TASK-502', title: 'HVAC Ducting', projectId: 'PRJ-2026-005', category: 'HVAC', progress: 30, startDate: '2026-03-01', endDate: '2026-04-10', status: 'Active', priority: 'High', siteId: 'SITE-004' }
];

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
    const [projects, setProjects] = useState(initialProjects);
    const [selectedProject, setSelectedProject] = useState(null);
    const [workOrders, setWorkOrders] = useState(initialWorkOrders);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
    const [boqItems, setBoqItems] = useState(initialBOQItems);
    const [selectedBOQItem, setSelectedBOQItem] = useState(null);
    const [sites, setSites] = useState(initialSites);
    const [progressTasks, setProgressTasks] = useState(initialProgressTasks);

    const updateEmployee = (updatedEmp) => {
        setEmployees(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
        if (selectedEmployee?.id === updatedEmp.id) {
            setSelectedEmployee(updatedEmp);
        }
    };

    const updateProject = (updatedProj) => {
        setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
        if (selectedProject?.id === updatedProj.id) {
            setSelectedProject(updatedProj);
        }
    };

    const updateWorkOrder = (updatedWO) => {
        setWorkOrders(prev => prev.map(wo => wo.id === updatedWO.id ? updatedWO : wo));
        if (selectedWorkOrder?.id === updatedWO.id) {
            setSelectedWorkOrder(updatedWO);
        }
    };

    const updateBOQItem = (updatedItem) => {
        setBoqItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const updateSite = (updatedSite) => {
        setSites(prev => prev.map(s => s.id === updatedSite.id ? updatedSite : s));
    };

    const updateProgressTask = (updatedTask) => {
        setProgressTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
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
            projects, setProjects, selectedProject, setSelectedProject, updateProject,
            workOrders, setWorkOrders, selectedWorkOrder, setSelectedWorkOrder, updateWorkOrder,
            boqItems, setBoqItems, updateBOQItem,
            sites, setSites, updateSite,
            progressTasks, setProgressTasks, updateProgressTask,
            isLoggedIn, userRole, login, logout
        }}>
            {children}
        </AppContext.Provider>
    );
}
