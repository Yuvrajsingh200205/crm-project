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
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:rotate-6 transition-all">
                        <FileText className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Voucher Management</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Financial Journal Registry
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-64 hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search voucher history..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Plus className="w-5 h-5" /> Quick Voucher
                    </button>
                </div>
            </div>

            {/* Tally-Style Quick Entry Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/20 border border-slate-50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black text-slate-800 tracking-[0.1em] uppercase">Quick Entry Console</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Select voucher type to begin entry</p>
                        </div>
                        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                            <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        {VOUCHER_TYPES.map(vt => (
                            <button 
                                key={vt.key}
                                onClick={() => setIsModalOpen(true)}
                                className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-lg ${vt.bg} ${vt.border} group relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-8 h-8 bg-white/50 -mr-4 -mt-4 rotate-45" />
                                <span className={`text-[10px] font-black tracking-widest uppercase py-1 px-3 rounded-full bg-white/60 shadow-sm ${vt.color}`}>{vt.shortcut}</span>
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{vt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-8 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" /> Today's Flow
                    </h4>
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-black text-emerald-400/40 uppercase tracking-widest mb-1">Total Booked</p>
                            <h2 className="text-3xl font-black tracking-tighter tabular-nums">₹4.20 Cr</h2>
                        </div>
                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-white/40 uppercase tracking-widest">Payments</span>
                                <span className="text-rose-400">₹85.4 L</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-white/40 uppercase tracking-widest">Receipts</span>
                                <span className="text-emerald-400">₹1.25 Cr</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registry Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <BookOpenIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Voucher Logs</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Transactions</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {['All', 'Payment', 'Receipt', 'Journal'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                    filter === t ? 'bg-emerald-950 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/30">
                            <tr>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Voucher & Date</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Party / Particulars</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Source / Bank</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Flow Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredVouchers.map(v => (
                                <tr 
                                    key={v.id} 
                                    onClick={() => setActiveModule('voucher-detail')}
                                    className="group hover:bg-slate-50/40 transition-all cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${
                                                v.type === 'Payment' ? 'bg-rose-50 border-rose-100 text-rose-500' :
                                                v.type === 'Receipt' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' :
                                                'bg-blue-50 border-blue-100 text-blue-500'
                                            }`}>
                                                <ArrowRightLeft className={`w-5 h-5 ${v.type === 'Receipt' ? 'rotate-90' : (v.type === 'Payment' ? '-rotate-90' : '')}`} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{v.id}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-2.5 h-2.5" /> Booked: {v.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{v.party}</p>
                                            <p className="text-[10px] font-bold text-slate-400 line-clamp-1 max-w-xs">{v.narration}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{v.bank}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Authorized by: {v.createdBy}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <div className="flex flex-col items-end">
                                            <p className={`text-base font-black tracking-tighter tabular-nums mb-1 ${
                                                v.type === 'Receipt' ? 'text-emerald-600' : 'text-slate-800'
                                            }`}>
                                                {v.type === 'Receipt' ? '+' : '-'}₹{v.amount.toLocaleString()}
                                            </p>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                                v.status === 'Posted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {v.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Voucher Entry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4 animate-fade-in overflow-y-auto pt-20">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20">
                        <div className="px-10 py-8 bg-emerald-950 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl">
                                        <Plus className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Entry Terminal</p>
                                        <h2 className="text-2xl font-black tracking-tight leading-none">Journal Entry</h2>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-10 space-y-8 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</p>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <label className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">Voucher Type</label>
                                            <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs appearance-none group-focus-within:bg-white transition-all shadow-sm">
                                                {VOUCHER_TYPES.map(vt => <option key={vt.key}>{vt.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="relative group">
                                            <label className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">Entry Date</label>
                                            <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs group-focus-within:bg-white transition-all shadow-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Impact</p>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <label className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">Amount (₹)</label>
                                            <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-black text-xl tracking-tighter group-focus-within:bg-white transition-all shadow-sm" placeholder="0.00" />
                                        </div>
                                        <div className="relative group">
                                            <label className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">TDS / Deductions (₹)</label>
                                            <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm tracking-tighter group-focus-within:bg-white transition-all shadow-sm" placeholder="0.00" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Party & Narrative</p>
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <label className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">Secondary Party / Account</label>
                                            <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs group-focus-within:bg-white transition-all shadow-sm" placeholder="e.g. Janki Enterprises" />
                                        </div>
                                        <div className="relative group">
                                            <label className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest z-10">Narration / Remarks</label>
                                            <textarea rows="3" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs group-focus-within:bg-white transition-all shadow-sm resize-none" placeholder="Enter transaction narrative..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 px-6 border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">Discard Entry</button>
                                <button onClick={() => {
                                    setIsModalOpen(false);
                                    toast.success('Voucher record successfully posted');
                                }} className="flex-[2] py-4 px-6 bg-emerald-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all">Post to Ledger</button>
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
