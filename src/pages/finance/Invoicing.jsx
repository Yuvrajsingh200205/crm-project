import React, { useState } from 'react';
import { Search, Plus, Download, CheckCircle2, Clock, FileText, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const MOCK_INVOICES = [
    { id: 'INV-2025-001', client: 'Larsen & Toubro', project: 'Patna Metro B', amount: 4500000, date: '2025-03-10', status: 'Pending', type: 'RA Bill #04', tax: 810000, retention: 225000 },
    { id: 'INV-2025-002', client: 'Tata Projects', project: 'Smart City Muzaffarpur', amount: 1250000, date: '2025-03-08', status: 'Paid', type: 'Tax Invoice', tax: 225000, retention: 0 },
    { id: 'INV-2025-003', client: 'NHAI', project: 'NH-22 Widening', amount: 8500000, date: '2025-03-05', status: 'Overdue', type: 'RA Bill #12', tax: 1530000, retention: 425000 },
    { id: 'INV-2025-004', client: 'Reliance Infra', project: 'Solar Farm Gaya', amount: 2800000, date: '2025-03-01', status: 'Paid', type: 'Tax Invoice', tax: 504000, retention: 0 },
    { id: 'INV-2025-005', client: 'Bihar Urban Dev', project: 'Drainage Phase 2', amount: 1800000, date: '2025-02-25', status: 'Approved', type: 'RA Bill #01', tax: 324000, retention: 90000 },
];

const statusBadge = {
    'Paid': 'badge-green',
    'Pending': 'badge-yellow',
    'Overdue': 'badge-red',
    'Approved': 'badge-blue',
};

export default function Invoicing() {
    const { setActiveModule } = useApp();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredInvoices = MOCK_INVOICES.filter(inv =>
        (inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase())) &&
        (filter === 'All' || inv.status === filter)
    );

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Invoicing & Billing</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage RA bills, tax invoices and receivables</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Generate RA Bill
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Unpaid Receivables', value: '₹1.42 Cr', color: 'text-amber-500', icon: Clock },
                    { label: 'Paid This Month', value: '₹40.5 L', color: 'text-green-500', icon: CheckCircle2 },
                    { label: 'Retention Amount', value: '₹18.2 L', color: 'text-blue-500', icon: FileText },
                    { label: 'GST Liability', value: '₹7.8 L', color: 'text-purple-500', icon: TrendingUp },
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
                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                        {['All', 'Paid', 'Pending', 'Overdue', 'Approved'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    filter === t ? 'bg-[#2f6645] text-white' : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Find invoices..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Invoice ID', 'Client / Project', 'Type', 'Date', 'GST (18%)', 'Retention', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.length === 0 ? (
                                <tr><td colSpan="9" className="p-6 text-center text-slate-500">No invoices found.</td></tr>
                            ) : filteredInvoices.map((inv, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setActiveModule('invoice-detail')}>
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{inv.id}</td>
                                    <td className="table-cell">
                                        <p className="text-slate-900 font-medium">{inv.client}</p>
                                        <p className="text-slate-400 text-xs">{inv.project}</p>
                                    </td>
                                    <td className="table-cell"><span className="badge badge-blue">{inv.type}</span></td>
                                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{inv.date}</td>
                                    <td className="table-cell text-slate-600">₹{(inv.tax / 1000).toFixed(0)}K</td>
                                    <td className="table-cell text-slate-600">₹{(inv.retention / 1000).toFixed(0)}K</td>
                                    <td className="table-cell text-emerald-600 font-semibold">₹{(inv.amount / 100000).toFixed(2)}L</td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[inv.status] || 'badge-yellow'}`}>{inv.status}</span>
                                    </td>
                                    <td className="table-cell" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => setActiveModule('invoice-detail')} className="btn-secondary text-xs py-1 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded">
                                            View
                                        </button>
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
