import {
    Activity,
    BarChart3,
    Briefcase,
    Building2,
    ClipboardList,
    DollarSign,
    FileBarChart,
    FolderKanban,
    Landmark,
    LayoutDashboard,
    Package,
    Shield,
    TrendingUp,
    Users,
} from 'lucide-react';

import FinancialAnalytics from '../pages/analytics/FinancialAnalytics';
import CRM from '../pages/business/CRM';
import Contracts from '../pages/business/Contracts';
import Quotations from '../pages/business/Quotations';
import Tenders from '../pages/business/Tenders';
import VendorManagement from '../pages/business/VendorManagement';
import AccountsPayable from '../pages/finance/AccountsPayable';
import AccountsReceivable from '../pages/finance/AccountsReceivable';
import BankManagement from '../pages/finance/BankManagement';
import BankReconciliation from '../pages/finance/BankReconciliation';
import ChartOfAccounts from '../pages/finance/ChartOfAccounts';
import GSTManagement from '../pages/finance/GSTManagement';
import Invoicing from '../pages/finance/Invoicing';
import InvoiceDetail from '../pages/finance/InvoiceDetail';
import JobCosting from '../pages/finance/JobCosting';
import TDSManagement from '../pages/finance/TDSManagement';
import VoucherDetail from '../pages/finance/VoucherDetail';
import Vouchers from '../pages/finance/Vouchers';
import ApplyLeave from '../pages/hr/ApplyLeave';
import Attendance from '../pages/hr/Attendance';
import EmployeeDetails from '../pages/hr/EmployeeDetails';
import EmployeeMaster from '../pages/hr/EmployeeMaster';
import LeaveManagement from '../pages/hr/LeaveManagement';
import Payroll from '../pages/hr/Payroll';
import Reimbursements from '../pages/hr/Reimbursements';
import StatutoryCompliance from '../pages/hr/StatutoryCompliance';
import Dashboard from '../pages/Dashboard';
import EquipmentAssets from '../pages/operations/EquipmentAssets';
import InventoryStore from '../pages/operations/InventoryStore';
import MaterialReconciliation from '../pages/operations/MaterialReconciliation';
import Procurement from '../pages/operations/Procurement';
import Subcontractors from '../pages/operations/Subcontractors';
import PlaceholderPage from '../pages/PlaceholderPage';
import BOQ from '../pages/projects/BOQ';
import ProgressTracking from '../pages/projects/ProgressTracking';
import ProjectMaster from '../pages/projects/ProjectMaster';
import SiteManagement from '../pages/projects/SiteManagement';
import WorkOrders from '../pages/projects/WorkOrders';

export const MODULE_TITLES = {
    dashboard: 'Dashboard',
    'project-master': 'Project Master',
    'work-orders': 'Work Orders',
    boq: 'Bill of Quantities',
    'site-management': 'Site Management',
    'progress-tracking': 'Progress Tracking',
    'chart-of-accounts': 'Chart of Accounts',
    'bank-management': 'Bank Management',
    vouchers: 'Voucher Management',
    invoicing: 'Invoicing & Billing',
    'accounts-payable': 'Accounts Payable',
    'accounts-receivable': 'Accounts Receivable',
    'gst-management': 'GST Management',
    'tds-management': 'TDS Management',
    'bank-reconciliation': 'Bank Reconciliation',
    'job-costing': 'Job Costing (P&L)',
    procurement: 'Procurement Management',
    inventory: 'Inventory & Store',
    'material-reconciliation': 'Material Reconciliation',
    equipment: 'Equipment & Assets',
    subcontractors: 'Subcontractor Management',
    'employee-master': 'Employee Master',
    attendance: 'Attendance Management',
    'leave-management': 'Leave Management',
    'apply-leave': 'Apply Leave',
    payroll: 'Payroll Processing',
    'statutory-compliance': 'Statutory Compliance',
    reimbursements: 'Reimbursements',
    'employee-details': 'Employee Details',
    crm: 'CRM',
    quotations: 'Quotations',
    tenders: 'Tender Management',
    contracts: 'Contract Management',
    'vendor-management': 'Vendor Management',
    'legal-compliance': 'Legal Compliance',
    'board-resolutions': 'Board Resolutions',
    'safety-quality': 'Safety & Quality',
    'executive-dashboard': 'Executive Dashboard',
    'project-analytics': 'Project Analytics',
    'financial-analytics': 'Financial Analytics',
    'hr-analytics': 'HR Analytics',
    'custom-reports': 'Custom Reports',
};

export const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
        id: 'projects',
        label: 'Project Management',
        icon: FolderKanban,
        children: [
            { id: 'project-master', label: 'Project Master' },
            { id: 'work-orders', label: 'Work Orders' },
            { id: 'boq', label: 'Bill of Quantities' },
            { id: 'site-management', label: 'Site Management' },
            { id: 'progress-tracking', label: 'Progress Tracking' },
        ],
    },
    {
        id: 'finance',
        label: 'Finance & Accounting',
        icon: DollarSign,
        children: [
            { id: 'chart-of-accounts', label: 'Chart of Accounts' },
            { id: 'vouchers', label: 'Vouchers' },
            { id: 'invoicing', label: 'Invoicing & Billing' },
            { id: 'accounts-payable', label: 'Accounts Payable' },
            { id: 'accounts-receivable', label: 'Accounts Receivable' },
            { id: 'gst-management', label: 'GST Management' },
            { id: 'tds-management', label: 'TDS Management' },
            { id: 'bank-reconciliation', label: 'Bank Reconciliation' },
            { id: 'bank-management', label: 'Bank Management' },
        ],
    },
    {
        id: 'operations',
        label: 'Operations',
        icon: Package,
        children: [
            { id: 'procurement', label: 'Procurement' },
            { id: 'inventory', label: 'Inventory & Store' },
            { id: 'material-reconciliation', label: 'Material Reconciliation' },
            { id: 'equipment', label: 'Equipment & Assets' },
            { id: 'subcontractors', label: 'Subcontractors' },
        ],
    },
    {
        id: 'hr',
        label: 'Human Resources',
        icon: Users,
        children: [
            { id: 'employee-master', label: 'Employee Master' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'leave-management', label: 'Leave Management' },
            { id: 'payroll', label: 'Payroll Processing' },
            { id: 'reimbursements', label: 'Reimbursements' },
        ],
    },
    {
        id: 'business-dev',
        label: 'Business Development',
        icon: Briefcase,
        children: [
            { id: 'crm', label: 'CRM' },
            { id: 'quotations', label: 'Quotations' },
            { id: 'tenders', label: 'Tender Management' },
            { id: 'contracts', label: 'Contract Management' },
            { id: 'vendor-management', label: 'Vendor Management' },
        ],
    },
    {
        id: 'compliance',
        label: 'Compliance & Legal',
        icon: Shield,
        children: [
            { id: 'legal-compliance', label: 'Legal Compliance' },
            { id: 'board-resolutions', label: 'Board Resolutions' },
            { id: 'safety-quality', label: 'Safety & Quality' },
        ],
    },
    {
        id: 'analytics',
        label: 'Analytics & Reports',
        icon: BarChart3,
        children: [
            { id: 'executive-dashboard', label: 'Executive Dashboard' },
            { id: 'project-analytics', label: 'Project Analytics' },
            { id: 'financial-analytics', label: 'Financial Analytics' },
            { id: 'hr-analytics', label: 'HR Analytics' },
            { id: 'custom-reports', label: 'Custom Reports' },
        ],
    },
];

export const PAGE_COMPONENTS = {
    dashboard: Dashboard,
    'project-master': ProjectMaster,
    'work-orders': WorkOrders,
    boq: BOQ,
    'site-management': SiteManagement,
    'progress-tracking': ProgressTracking,
    'chart-of-accounts': ChartOfAccounts,
    'bank-management': BankManagement,
    vouchers: Vouchers,
    invoicing: Invoicing,
    'accounts-payable': AccountsPayable,
    'accounts-receivable': AccountsReceivable,
    'gst-management': GSTManagement,
    'tds-management': TDSManagement,
    'bank-reconciliation': BankReconciliation,
    'job-costing': JobCosting,
    'invoice-detail': InvoiceDetail,
    'voucher-detail': VoucherDetail,
    procurement: Procurement,
    inventory: InventoryStore,
    'material-reconciliation': MaterialReconciliation,
    equipment: EquipmentAssets,
    subcontractors: Subcontractors,
    'employee-master': EmployeeMaster,
    attendance: Attendance,
    'leave-management': LeaveManagement,
    'apply-leave': ApplyLeave,
    payroll: Payroll,
    'statutory-compliance': StatutoryCompliance,
    reimbursements: Reimbursements,
    'employee-details': EmployeeDetails,
    crm: CRM,
    quotations: Quotations,
    tenders: Tenders,
    contracts: Contracts,
    'vendor-management': VendorManagement,
    'financial-analytics': FinancialAnalytics,
};

export const PLACEHOLDER_PAGES = {
    'legal-compliance': {
        title: 'Legal & Regulatory Compliance',
        description: 'Compliance calendar, license renewal reminders, and document repository for all statutory requirements.',
        icon: Shield,
    },
    'board-resolutions': {
        title: 'Board Resolutions & MCA Filings',
        description: 'AGM/EGM minutes, director management, MCA form filing (AOC-4, MGT-7), and statutory registers.',
        icon: Landmark,
    },
    'safety-quality': {
        title: 'Safety & Quality Compliance',
        description: 'Safety inspections, incident reporting, PPE tracking, and NCR management.',
        icon: Activity,
    },
    'executive-dashboard': {
        title: 'Executive Dashboard',
        description: 'Real-time KPIs - revenue vs target, outstanding receivables, project profitability heatmap, and alerts.',
        icon: BarChart3,
    },
    'project-analytics': {
        title: 'Project Analytics',
        description: 'Progress vs timeline, cost overrun analysis, material trends, and change order impact.',
        icon: TrendingUp,
    },
    'hr-analytics': {
        title: 'HR Analytics',
        description: 'Headcount trends, attrition rates, payroll cost analysis, and compliance status dashboard.',
        icon: Users,
    },
    'custom-reports': {
        title: 'Custom Report Builder',
        description: 'Drag-and-drop report designer with filters, chart types, scheduled generation, and email distribution.',
        icon: FileBarChart,
    },
};

export function getPageComponent(activeModule) {
    const Page = PAGE_COMPONENTS[activeModule];

    if (Page) {
        return <Page />;
    }

    const placeholder = PLACEHOLDER_PAGES[activeModule];

    if (placeholder) {
        return <PlaceholderPage {...placeholder} />;
    }

    return <Dashboard />;
}
