import React, { useState, useMemo } from 'react';
import { 
    FileText, Search, Plus, Filter, Download, MoreVertical, 
    ArrowRightLeft, CheckCircle2, AlertCircle, Clock, 
    Calendar, Building2, Wallet, CreditCard, ChevronRight,
    TrendingUp, ArrowUpRight, X, LayoutGrid, List
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

const MOCK_VOUCHERS = [
    { id: 'PV-1001', type: 'Payment', date: '2025-03-15', party: 'Janki Enterprises', amount: 184500, narration: 'RA-05 Payment for PSC Pole works', status: 'Posted', bank: 'SBI Main A/C', createdBy: 'Admin' },
    { id: 'RV-2042', type: 'Receipt', date: '2025-03-14', party: 'Bihar Rural Dev. Authority', amount: 850000, narration: 'Advance received for SWPL-BRGF Phase 1', status: 'Posted', bank: 'HDFC Bank', createdBy: 'Admin' },
    { id: 'JV-3018', type: 'Journal', date: '2025-03-14', party: 'N/A', amount: 45000, narration: 'Depreciation provision for March 2025', status: 'Posted', bank: 'Journal', createdBy: 'System' },
    { id: 'SV-4011', type: 'Sales', date: '2025-03-12', party: 'PMRCL – Patna Metro', amount: 2340000, narration: 'RA-03 Invoice for Civil Works Section B', status: 'Pending', bank: 'Invoice', createdBy: 'Admin' },
    { id: 'PV-1002', type: 'Payment', date: '2025-03-10', party: 'GSAR Contractors', amount: 92000, narration: 'Payment for ABC Cable installation', status: 'Pending', bank: 'HDFC Bank', createdBy: 'Admin' },
    { id: 'CV-5003', type: 'Contra', date: '2025-03-08', party: 'Cash Transfer', amount: 50000, narration: 'Cash withdrawn from SBI Main', status: 'Posted', bank: 'SBI Main A/C', createdBy: 'Admin' },
];

const VOUCHER_TYPES = [
    { key: 'Payment', shortcut: 'F5', label: 'Payment', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    { key: 'Receipt', shortcut: 'F6', label: 'Receipt', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { key: 'Journal', shortcut: 'F7', label: 'Journal', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { key: 'Sales', shortcut: 'F8', label: 'Sales', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { key: 'Purchase', shortcut: 'F9', label: 'Purchase', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { key: 'Contra', shortcut: 'F4', label: 'Contra', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
];

export default function Vouchers() {
    const { setActiveModule } = useApp();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const filteredVouchers = MOCK_VOUCHERS.filter(v => 
        (v.party.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase())) &&
        (filter === 'All' || v.type === filter)
    );

    return (
        <div className="space-y-5 animate-fade-in pb-12 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Voucher Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Financial journal registry & transaction posting</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative hidden sm:block w-56">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search vouchers..."
                            className="input pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Quick Voucher
                    </button>
                </div>
            </div>

            {/* Quick Entry Type Buttons */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-800 text-sm">Quick Entry Console</h3>
                    <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                        <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-[#2f6645] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#2f6645] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {VOUCHER_TYPES.map(vt => (
                        <button
                            key={vt.key}
                            onClick={() => setIsModalOpen(true)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${vt.bg} ${vt.border}`}
                        >
                            <span className={`text-xs font-bold ${vt.color} bg-white/80 rounded px-1.5 py-0.5 shadow-sm`}>{vt.shortcut}</span>
                            <span className={`text-xs font-semibold text-slate-700`}>{vt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Registry Table */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Voucher Registry</h3>
                        <div className="flex gap-1">
                            {['All', 'Payment', 'Receipt', 'Journal'].map(t => (
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
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="table-header">Voucher & Date</th>
                                <th className="table-header">Party / Particulars</th>
                                <th className="table-header">Source / Bank</th>
                                <th className="table-header text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVouchers.map(v => (
                                <tr
                                    key={v.id}
                                    onClick={() => setActiveModule('voucher-detail')}
                                    className="table-row hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                v.type === 'Payment' ? 'bg-rose-50 text-rose-500' :
                                                v.type === 'Receipt' ? 'bg-emerald-50 text-emerald-500' :
                                                'bg-blue-50 text-blue-500'
                                            }`}>
                                                <ArrowRightLeft className={`w-4 h-4 ${v.type === 'Receipt' ? 'rotate-90' : (v.type === 'Payment' ? '-rotate-90' : '')}`} />
                                            </div>
                                            <div>
                                                <p className="text-slate-800 font-semibold text-sm">{v.id}</p>
                                                <p className="text-slate-400 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{v.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <p className="text-slate-800 font-medium">{v.party}</p>
                                        <p className="text-slate-400 text-xs line-clamp-1 max-w-[220px]">{v.narration}</p>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-slate-700 font-medium text-sm">{v.bank}</p>
                                                <p className="text-slate-400 text-xs">By: {v.createdBy}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell text-right">
                                        <p className={`font-semibold text-sm tabular-nums ${
                                            v.type === 'Receipt' ? 'text-emerald-600' : 'text-slate-800'
                                        }`}>
                                            {v.type === 'Receipt' ? '+' : '-'}₹{v.amount.toLocaleString()}
                                        </p>
                                        <span className={`badge mt-0.5 inline-block ${
                                            v.status === 'Posted' ? 'badge-green' : 'badge-yellow'
                                        }`}>{v.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Voucher Entry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                            <div>
                                <h2 className="text-base font-semibold">Journal Entry</h2>
                                <p className="text-xs text-white/60 mt-0.5">Entry Terminal</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2">1. Transaction Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Voucher Type</label>
                                    <select className="input">
                                        {VOUCHER_TYPES.map(vt => <option key={vt.key}>{vt.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Entry Date</label>
                                    <input type="date" className="input" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>

                            <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-4">2. Financial Impact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Amount (₹)</label>
                                    <input type="number" className="input" placeholder="0.00" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">TDS / Deductions (₹)</label>
                                    <input type="number" className="input" placeholder="0.00" />
                                </div>
                            </div>

                            <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-4">3. Party & Narrative</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Secondary Party / Account</label>
                                    <input className="input" placeholder="e.g. Janki Enterprises" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Narration / Remarks</label>
                                    <textarea rows="3" className="input" placeholder="Enter transaction narrative..."></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Discard Entry</button>
                                <button onClick={() => {
                                    setIsModalOpen(false);
                                    toast.success('Voucher record successfully posted');
                                }} className="btn-primary flex-1">Post to Ledger</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BookOpenIcon({ className }) {
    return <FileText className={className} />;
}
