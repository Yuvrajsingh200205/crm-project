import React, { useState } from 'react';
import { 
    CreditCard, Search, Plus, Download, 
    Truck, Calendar, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';

const MOCK_BILLS = [
    { id: 'BILL-001', vendor: 'UltraTech Cement', project: 'Patna Metro B', amount: 850000, date: '2025-03-12', dueDate: '2025-03-25', status: 'Pending', tds: 8500, type: 'Purchase' },
    { id: 'BILL-002', vendor: 'JSW Steel', project: 'Smart City Muz.', amount: 1560000, date: '2025-03-10', dueDate: '2025-03-20', status: 'Approved', tds: 15600, type: 'Purchase' },
    { id: 'BILL-003', vendor: 'Local Sand Supplier', project: 'Drainage P2', amount: 45000, date: '2025-02-28', dueDate: '2025-03-05', status: 'Overdue', tds: 450, type: 'Direct' },
    { id: 'BILL-004', vendor: 'Security Agency XYZ', project: 'Solar Farm', amount: 220000, date: '2025-03-01', dueDate: '2025-03-15', status: 'Paid', tds: 2200, type: 'Service' },
    { id: 'BILL-005', vendor: 'Machine Rental Corp', project: 'NH-22 Widening', amount: 380000, date: '2025-03-05', dueDate: '2025-03-18', status: 'Pending', tds: 3800, type: 'Service' },
];

const statusBadge = {
    'Paid': 'badge-green',
    'Approved': 'badge-blue',
    'Overdue': 'badge-red',
    'Pending': 'badge-yellow',
};

export default function AccountsPayable() {
    const [search, setSearch] = useState('');

    const filtered = MOCK_BILLS.filter(b =>
        b.vendor.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Accounts Payable</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage vendor bills & liabilities</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Aging Report
                    </button>
                    <button className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Record Vendor Bill
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Current (0-30 Days)', value: '₹42.5 L', color: 'text-green-500', icon: CheckCircle2 },
                    { label: '31-60 Days Late', value: '₹8.4 L', color: 'text-amber-500', icon: Clock },
                    { label: '61-90 Days Late', value: '₹2.1 L', color: 'text-red-500', icon: AlertCircle },
                    { label: 'Scheduled Payment', value: '₹12.0 L', color: 'text-blue-500', icon: Calendar },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-800">Vendor Obligations</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search vendor or bill..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Bill ID', 'Vendor', 'Project', 'Type', 'Bill Date', 'Due Date', 'TDS', 'Amount', 'Status'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="9" className="p-6 text-center text-slate-500">No bills found.</td></tr>
                            ) : filtered.map((bill, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{bill.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <Truck className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                            <span className="text-slate-900 font-medium whitespace-nowrap">{bill.vendor}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-500 text-xs">{bill.project}</td>
                                    <td className="table-cell"><span className="badge badge-blue">{bill.type}</span></td>
                                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{bill.date}</td>
                                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{bill.dueDate}</td>
                                    <td className="table-cell text-slate-700 font-medium">₹{(bill.tds / 1000).toFixed(1)}K</td>
                                    <td className="table-cell text-emerald-600 font-semibold">₹{(bill.amount / 100000).toFixed(2)}L</td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[bill.status] || 'badge-yellow'}`}>{bill.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
