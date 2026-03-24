import React, { useState } from 'react';
import { 
    Building, Search, Plus, Download, 
    ArrowRightLeft, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

const MOCK_TRANSACTIONS = [
    { id: 'TXN-001', bank: 'HDFC Bank - 8821', amount: 450000, date: '2025-03-12', status: 'Matched', type: 'Credit', ref: 'RTGS-P772', bookEntry: 'L&T RA Bill #04' },
    { id: 'TXN-002', bank: 'HDFC Bank - 8821', amount: 156000, date: '2025-03-11', status: 'Unmatched', type: 'Debit', ref: 'CHQ-00122', bookEntry: '-' },
    { id: 'TXN-003', bank: 'SBI - 1102', amount: 45000, date: '2025-03-08', status: 'Matched', type: 'Debit', ref: 'UPI-9921', bookEntry: 'Petty Cash Replenish' },
    { id: 'TXN-004', bank: 'SBI - 1102', amount: 280000, date: '2025-03-05', status: 'Auto-Matched', type: 'Credit', ref: 'NEFT-Reliance', bookEntry: 'Reliance Solar Adv.' },
    { id: 'TXN-005', bank: 'HDFC Bank - 8821', amount: 22500, date: '2025-03-01', status: 'Pending', type: 'Debit', ref: 'POS-001', bookEntry: '-' },
];

const statusBadge = {
    'Matched': 'badge-green',
    'Auto-Matched': 'badge-blue',
    'Unmatched': 'badge-red',
    'Pending': 'badge-yellow',
};

export default function BankReconciliation() {
    const [search, setSearch] = useState('');

    const filtered = MOCK_TRANSACTIONS.filter(t =>
        t.bank.toLowerCase().includes(search.toLowerCase()) ||
        t.ref.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bank Reconciliation</h1>
                    <p className="text-slate-500 text-sm mt-1">Match bank statements with book entries</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Import Statement
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Uncleared Items', value: '12', color: 'text-amber-500' },
                    { label: 'Bank Balance', value: '₹1.20 Cr', color: 'text-green-500' },
                    { label: 'Book Balance', value: '₹1.18 Cr', color: 'text-blue-500' },
                    { label: 'Discrepancy', value: '₹2.1 L', color: 'text-red-500' },
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
                        <h3 className="font-semibold text-slate-800">Statement vs Ledger</h3>
                        <button className="btn-secondary text-xs py-1 px-3 border border-slate-200 bg-white rounded hover:bg-slate-50">Auto Match</button>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search transactions or refs..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Txn ID', 'Bank Account', 'Type', 'Reference', 'Date', 'Book Entry', 'Amount', 'Status'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="8" className="p-6 text-center text-slate-500">No transactions found.</td></tr>
                            ) : filtered.map((txn, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{txn.id}</td>
                                    <td className="table-cell text-slate-900 font-medium">{txn.bank}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${txn.type === 'Credit' ? 'badge-green' : 'badge-red'}`}>{txn.type}</span>
                                    </td>
                                    <td className="table-cell font-mono text-xs text-slate-500">{txn.ref}</td>
                                    <td className="table-cell text-slate-500 text-xs">{txn.date}</td>
                                    <td className="table-cell text-slate-600">
                                        {txn.bookEntry !== '-' ? (
                                            <span className="text-emerald-600 font-medium">{txn.bookEntry}</span>
                                        ) : (
                                            <button className="text-xs text-slate-400 hover:text-[#2f6645] flex items-center gap-1 transition-colors">
                                                <Plus className="w-3 h-3" /> Link Entry
                                            </button>
                                        )}
                                    </td>
                                    <td className={`table-cell font-semibold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                        {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[txn.status] || 'badge-yellow'}`}>{txn.status}</span>
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
