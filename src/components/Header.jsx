import { Bell, Search, Menu, X, Sun, ChevronDown, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

const moduleTitles = {
    'dashboard': 'Dashboard',
    'project-master': 'Project Master',
    'work-orders': 'Work Orders',
    'boq': 'Bill of Quantities',
    'site-management': 'Site Management',
    'progress-tracking': 'Progress Tracking',
    'chart-of-accounts': 'Chart of Accounts',
    'vouchers': 'Voucher Management',
    'invoicing': 'Invoicing & Billing',
    'accounts-payable': 'Accounts Payable',
    'accounts-receivable': 'Accounts Receivable',
    'gst-management': 'GST Management',
    'tds-management': 'TDS Management',
    'bank-reconciliation': 'Bank Reconciliation',
    'job-costing': 'Job Costing (P&L)',
    'procurement': 'Procurement Management',
    'inventory': 'Inventory & Store',
    'material-reconciliation': 'Material Reconciliation',
    'equipment': 'Equipment & Assets',
    'subcontractors': 'Subcontractor Management',
    'employee-master': 'Employee Master',
    'attendance': 'Attendance Management',
    'leave-management': 'Leave Management',
    'payroll': 'Payroll Processing',
    'statutory-compliance': 'Statutory Compliance',
    'reimbursements': 'Reimbursements',
    'crm': 'CRM',
    'quotations': 'Quotations',
    'tenders': 'Tender Management',
    'contracts': 'Contract Management',
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

export default function Header() {
    const { activeModule, sidebarOpen, setSidebarOpen, notifications, markAllRead } = useApp();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const typeColors = {
        warning: 'text-yellow-600',
        info: 'text-blue-600',
        success: 'text-green-600',
        error: 'text-red-600',
    };

    return (
        <header className={`fixed top-0 right-0 h-20 z-20 flex items-center justify-between px-4 md:px-8 bg-[#f4f7f6]/80 backdrop-blur-lg border-b border-[#e9ecef] transition-all duration-300 ${sidebarOpen ? 'left-0 md:left-64' : 'left-0 md:left-16'}`}>
            {/* Left */}
            <div className="flex items-center gap-3 md:gap-5">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-100"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-slate-900 font-bold text-base md:text-lg truncate max-w-[150px] md:max-w-none">{moduleTitles[activeModule] || 'Dashboard'}</h1>
                    <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                        <span className="font-medium">Morlatis ERP</span>
                        <span>•</span>
                        <span className="text-[#2f6645] flex items-center gap-1 font-semibold"><Zap className="w-3 h-3 fill-current" /> Live System</span>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Search */}
                <div className="relative hidden sm:block">
                    {showSearch ? (
                        <div className="flex items-center gap-2 animate-fade-in bg-slate-50 rounded-full px-4 py-1.5 border border-slate-200">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search modules..."
                                className="bg-transparent text-sm w-32 md:w-48 focus:outline-none text-slate-800 placeholder-slate-400"
                            />
                            <button onClick={() => setShowSearch(false)} className="text-slate-400 hover:text-slate-700 ml-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowSearch(true)}
                            className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                    >
                        <Bell className="w-4 h-4 md:w-5 md:h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-14 w-72 md:w-80 card border border-slate-200 shadow-2xl shadow-slate-200/50 animate-fade-in z-50 bg-white">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && <span className="badge badge-blue">{unreadCount} new</span>}
                                    <button onClick={markAllRead} className="text-xs text-[#2f6645] hover:underline font-medium">Mark read</button>
                                </div>
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                {notifications.map(n => (
                                    <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-green-50/50' : ''}`}>
                                        <p className={`text-sm ${typeColors[n.type]} font-medium leading-snug`}>{n.message}</p>
                                        <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl text-center">
                                <button className="text-xs text-slate-600 hover:text-slate-900 font-semibold transition-colors">View all</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <button className="flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-50 border border-slate-100 rounded-full hover:bg-slate-100 transition-all shadow-sm md:ml-2">
                    <img src={`https://ui-avatars.com/api/?name=SA&background=9ae66e&color=1e3a34`} alt="Avatar" className="w-7 h-7 md:w-8 md:h-8 rounded-full" />
                    <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
                </button>
            </div>
        </header>
    );
}
