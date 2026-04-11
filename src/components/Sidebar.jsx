import {
    LayoutDashboard, FolderKanban, DollarSign, Package, Users,
    Briefcase, Shield, BarChart3, Wrench, FileText, TrendingUp,
    Building2, Calculator, Truck, ClipboardList, UserCheck,
    FileBarChart, Settings, ChevronDown, ChevronRight, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

const navItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
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
        ]
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
            { id: 'job-costing', label: 'Job Costing (P&L)' },
            { id: 'statutory-compliance', label: 'Statutory Compliance' },
        ]
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
        ]
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
        ]
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
        ]
    },
    {
        id: 'compliance',
        label: 'Compliance & Legal',
        icon: Shield,
        children: [
            { id: 'legal-compliance', label: 'Legal Compliance' },
            { id: 'board-resolutions', label: 'Board Resolutions' },
            { id: 'safety-quality', label: 'Safety & Quality' },
        ]
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
        ]
    },
];

function NavItem({ item, depth = 0, role, hasMultipleSections = false }) {
    const { activeModule, setActiveModule } = useApp();
    const [expanded, setExpanded] = useState(
        item.children?.some(c => c.id === activeModule || (c.id === 'employee-master' && activeModule === 'employee-details')) || item.id === activeModule
    );
    const Icon = item.icon;
    const isActive = activeModule === item.id || (item.id === 'employee-master' && activeModule === 'employee-details');
    const hasChildren = item.children?.length > 0;

    // Non-admin roles have categories always expanded and no chevrons ONLY if there is a single section
    const isAlwaysExpanded = role !== 'admin' && depth === 0 && hasChildren && !hasMultipleSections;
    const effectivelyExpanded = isAlwaysExpanded || expanded;

    const handleClick = () => {
        if (hasChildren) {
            if (!isAlwaysExpanded) setExpanded(!effectivelyExpanded);
        } else {
            setActiveModule(item.id);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className={isActive && !hasChildren ? 'sidebar-link-active' : 'sidebar-link group'}
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive && !hasChildren ? 'text-[#1e3a34]' : 'text-slate-400 group-hover:text-slate-800'}`} />
                    )}
                    <span className="font-semibold text-[13px]">{item.label}</span>
                </div>
                {hasChildren && !isAlwaysExpanded && (
                    <span className="text-slate-400 group-hover:text-slate-800 ml-auto">
                        {effectivelyExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                )}
            </div>

            {hasChildren && effectivelyExpanded && (
                <div className="ml-7 mt-1 mb-2 space-y-0.5 border-l-2 border-slate-100 pl-3">
                    {item.children.map(child => (
                        <NavItem key={child.id} item={child} depth={depth + 1} role={role} hasMultipleSections={hasMultipleSections} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Sidebar({ role }) {
    const { sidebarOpen, logout, userProfile, activeModule, setActiveModule } = useApp();

    const displayName = userProfile?.name || (role === 'admin' ? 'Admin' : 'Employee');
    const displayEmail = userProfile?.email || 'portal@ecoconstruct.com';


    const baseFiltered = navItems.map(item => {
        const newItem = { ...item, children: item.children ? [...item.children] : undefined };

        if (role === 'admin') return newItem;

        if (role === 'hr') {
            const hrModules = ['dashboard', 'hr'];
            if (!hrModules.includes(newItem.id)) return null;
            return newItem;
        }

        if (role === 'accounts') {
            const accountsModules = ['dashboard', 'finance'];
            if (!accountsModules.includes(newItem.id)) return null;
            return newItem;
        }

        if (role === 'marketing') {
            const marketingModules = ['dashboard', 'business-dev', 'operations'];
            if (!marketingModules.includes(newItem.id)) return null;
            return newItem;
        }

        const employeeModules = ['dashboard', 'hr', 'projects'];
        if (!employeeModules.includes(newItem.id)) return null;

        if (newItem.id === 'hr' && newItem.children) {
            newItem.children = newItem.children.filter(c =>
                ['attendance'].includes(c.id) // Only attendance left inside HR for simple employees
            );
        }
        if (newItem.id === 'projects' && newItem.children) {
            newItem.children = newItem.children.filter(c =>
                ['site-management', 'progress-tracking'].includes(c.id)
            );
        }
        return newItem;
    }).filter(Boolean);

    const filteredNavItems = [...baseFiltered];
    const hasMultipleSections = filteredNavItems.filter(item => item.children?.length > 0).length > 1;

    return (
        <aside className={`fixed left-0 top-0 h-full z-30 flex flex-col bg-white border-r border-[#e9ecef] transition-all duration-300
      ${sidebarOpen ? 'w-64' : 'w-16'}`}>
            {/* Logo */}
            <div className={`flex items-center justify-center h-20 border-b border-[#e9ecef] flex-shrink-0 bg-white ${sidebarOpen ? 'px-6 py-2' : 'px-2 py-4'}`}>
                <div className="flex items-center justify-center w-full h-full overflow-hidden">
                    <img src="/logo.jpg" alt="Morlatis Logo" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
            </div>

            {/* Nav */}
            {sidebarOpen && (
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                    {filteredNavItems.map(item => (
                        <NavItem key={item.id} item={item} role={role} hasMultipleSections={hasMultipleSections} />
                    ))}
                </nav>
            )}

            {/* Footer */}
            {sidebarOpen && (
                <div className="p-4 border-t border-[#e9ecef] flex-shrink-0 bg-white space-y-4">
                    {role !== 'admin' && (
                        <div className="space-y-1.5 pb-2 border-b border-slate-100">
                            <button
                                onClick={() => setActiveModule('apply-leave')}
                                className={activeModule === 'apply-leave' ? 'sidebar-link-active w-full justify-start' : 'sidebar-link group w-full justify-start'}
                            >
                                <div className="flex items-center gap-3">
                                    <ClipboardList className={`w-4 h-4 flex-shrink-0 ${activeModule === 'apply-leave' ? 'text-[#1e3a34]' : 'text-slate-400 group-hover:text-slate-800'}`} />
                                    <span className="font-semibold text-[13px]">Apply Leave</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveModule('reimbursements')}
                                className={activeModule === 'reimbursements' ? 'sidebar-link-active w-full justify-start' : 'sidebar-link group w-full justify-start'}
                            >
                                <div className="flex items-center gap-3">
                                    <DollarSign className={`w-4 h-4 flex-shrink-0 ${activeModule === 'reimbursements' ? 'text-[#1e3a34]' : 'text-slate-400 group-hover:text-slate-800'}`} />
                                    <span className="font-semibold text-[13px]">Apply Reimbursements</span>
                                </div>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-3 bg-[#f8f9fa] p-2.5 rounded-xl border border-slate-100">
                        <img src={`https://ui-avatars.com/api/?name=${displayName}&background=${role === 'admin' ? '1e3a34' : '2f6645'}&color=fff`} alt="Profile" className="w-9 h-9 rounded-lg" />
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-900 text-sm font-semibold truncate capitalize">{displayName}</p>
                            <p className="text-slate-500 text-xs truncate">{displayEmail}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                        <Zap className="w-4 h-4 rotate-45" />
                        Log Out
                    </button>
                </div>
            )}
        </aside>
    );
}
