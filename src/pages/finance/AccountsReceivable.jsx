import React, { useState } from 'react';
import { Search, Plus, Download, Building2, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const MOCK_RECEIVABLES = [
    { id: 'AR-001', client: 'Larsen & Toubro', project: 'Patna Metro B', amount: 4500000, invoiceDate: '2025-03-10', dueDate: '2025-04-10', status: 'Pending', type: 'RA Bill #04' },
    { id: 'AR-002', client: 'Tata Projects', project: 'Smart City Muz.', amount: 1250000, invoiceDate: '2025-03-08', dueDate: '2025-04-08', status: 'Received', type: 'Tax Invoice' },
    { id: 'AR-003', client: 'NHAI', project: 'NH-22 Widening', amount: 8500000, invoiceDate: '2025-03-05', dueDate: '2025-03-20', status: 'Overdue', type: 'RA Bill #12' },
    { id: 'AR-004', client: 'Reliance Infra', project: 'Solar Farm Gaya', amount: 2800000, invoiceDate: '2025-03-01', dueDate: '2025-04-01', status: 'Received', type: 'Tax Invoice' },
    { id: 'AR-005', client: 'Bihar Urban Dev', project: 'Drainage Phase 2', amount: 1800000, invoiceDate: '2025-02-25', dueDate: '2025-03-25', status: 'Pending', type: 'RA Bill #01' },
];

const statusBadge = {
    'Received': 'badge-green',
    'Pending': 'badge-yellow',
    'Overdue': 'badge-red',
};

export default function AccountsReceivable() {
    const [search, setSearch] = useState('');

    const filtered = MOCK_RECEIVABLES.filter(r =>
        r.client.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
    );

    const totalReceivable = MOCK_RECEIVABLES.filter(r => r.status !== 'Received').reduce((a, r) => a + r.amount, 0);
    const overdue = MOCK_RECEIVABLES.filter(r => r.status === 'Overdue').reduce((a, r) => a + r.amount, 0);

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Accounts Receivable</h1>
                    <p className="text-slate-500 text-sm mt-1">Track outstanding invoices & client payments</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Raise Invoice
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Total Outstanding', value: `₹${(totalReceivable / 100000).toFixed(1)}L`, color: 'text-blue-500' },
                    { label: 'Overdue Amount', value: `₹${(overdue / 100000).toFixed(1)}L`, color: 'text-red-500' },
                    { label: 'Received this Month', value: '₹40.5 L', color: 'text-green-500' },
                    { label: 'Total Invoices', value: MOCK_RECEIVABLES.length, color: 'text-purple-500' },
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
                    <h3 className="font-semibold text-slate-800">Invoice Registry</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search client or invoice..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Invoice ID', 'Client', 'Project', 'Type', 'Invoice Date', 'Due Date', 'Amount', 'Status'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="8" className="p-6 text-center text-slate-500">No receivables found.</td></tr>
                            ) : filtered.map((r, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{r.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0">
                                                {r.client.split(' ').map(n => n?.[0]).join('').slice(0, 2)}
                                            </div>
                                            <span className="text-slate-900 font-medium whitespace-nowrap">{r.client}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-500 text-xs">{r.project}</td>
                                    <td className="table-cell"><span className="badge badge-blue">{r.type}</span></td>
                                    <td className="table-cell text-slate-500 text-xs">{r.invoiceDate}</td>
                                    <td className="table-cell text-slate-500 text-xs">{r.dueDate}</td>
                                    <td className="table-cell text-emerald-600 font-semibold">₹{(r.amount / 100000).toFixed(2)}L</td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[r.status] || 'badge-yellow'}`}>{r.status}</span>
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
