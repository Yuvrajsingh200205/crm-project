import React, { useState } from 'react';
import { Search, Plus, Download, CheckCircle2, AlertCircle, Clock, FileText, Briefcase } from 'lucide-react';

const MOCK_TDS = [
    { id: 'TDS-2025-001', vendor: 'UltraTech Cement', section: '194C', amount: 8500, date: '2025-03-12', status: 'Deposited', ref: 'CHQ-98212', period: 'Q4 2024-25' },
    { id: 'TDS-2025-002', vendor: 'Tata Projects', section: '194J', amount: 15600, date: '2025-03-10', status: 'Approved', ref: '-', period: 'Q4 2024-25' },
    { id: 'TDS-2025-003', vendor: 'Local Sand Supplier', section: '194C', amount: 450, date: '2025-02-28', status: 'Cert. Issued', ref: 'CERT-0042', period: 'Q3 2024-25' },
    { id: 'TDS-2025-004', vendor: 'Reliance Infra', section: '194I', amount: 2200, date: '2025-03-01', status: 'Deposited', ref: 'NEFT-8831', period: 'Q4 2024-25' },
    { id: 'TDS-2025-005', vendor: 'Security Agency XYZ', section: '194C', amount: 3800, date: '2025-03-05', status: 'Pending', ref: '-', period: 'Q4 2024-25' },
];

const statusBadge = {
    'Deposited': 'badge-green',
    'Cert. Issued': 'badge-blue',
    'Approved': 'badge-blue',
    'Pending': 'badge-yellow',
};

export default function TDSManagement() {
    const [search, setSearch] = useState('');

    const filtered = MOCK_TDS.filter(t =>
        t.vendor.toLowerCase().includes(search.toLowerCase()) ||
        t.section.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">TDS Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Direct tax deduction & statutory compliance</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Form 26AS
                    </button>
                    <button className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Bulk Deposit Filing
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Unfiled Liability', value: '₹42,500', color: 'text-amber-500' },
                    { label: 'Deposited (Q4)', value: '₹1.28 L', color: 'text-green-500' },
                    { label: 'Certificates Due', value: '18', color: 'text-red-500' },
                    { label: 'Filing Compliance', value: '100%', color: 'text-blue-500' },
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
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-800">Tax Deduction Registry</h3>
                        <button className="btn-secondary text-xs py-1 px-3 border border-slate-200 rounded">Issue Certificates</button>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search by vendor or section..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['TDS ID', 'Vendor', 'Section', 'Date', 'Period', 'Reference', 'Amount', 'Status'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="8" className="p-6 text-center text-slate-500">No TDS records found.</td></tr>
                            ) : filtered.map((tds, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{tds.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                            <span className="text-slate-900 font-medium">{tds.vendor}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell"><span className="badge badge-green">{tds.section}</span></td>
                                    <td className="table-cell text-slate-500 text-xs">{tds.date}</td>
                                    <td className="table-cell text-slate-600">{tds.period}</td>
                                    <td className="table-cell font-mono text-xs text-slate-500">{tds.ref}</td>
                                    <td className="table-cell text-slate-900 font-semibold">₹{tds.amount.toLocaleString()}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[tds.status] || 'badge-yellow'}`}>{tds.status}</span>
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
