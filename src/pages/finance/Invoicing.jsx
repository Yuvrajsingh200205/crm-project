import React, { useState, useMemo } from 'react';
import { 
    Receipt, Search, Plus, Filter, Download, MoreVertical, 
    FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, 
    ArrowUpRight, Building2, Calendar, User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const MOCK_INVOICES = [
    { id: 'INV-2025-001', client: 'Larsen & Toubro', project: 'Patna Metro B', amount: 4500000, date: '2025-03-10', status: 'Pending', type: 'RA Bill #04', tax: 810000, retention: 225000 },
    { id: 'INV-2025-002', client: 'Tata Projects', project: 'Smart City Muzaffarpur', amount: 1250000, date: '2025-03-08', status: 'Paid', type: 'Tax Invoice', tax: 225000, retention: 0 },
    { id: 'INV-2025-003', client: 'NHAI', project: 'NH-22 Widening', amount: 8500000, date: '2025-03-05', status: 'Overdue', type: 'RA Bill #12', tax: 1530000, retention: 425000 },
    { id: 'INV-2025-004', client: 'Reliance Infra', project: 'Solar Farm Gaya', amount: 2800000, date: '2025-03-01', status: 'Paid', type: 'Tax Invoice', tax: 504000, retention: 0 },
    { id: 'INV-2025-005', client: 'Bihar Urban Dev', project: 'Drainage Phase 2', amount: 1800000, date: '2025-02-25', status: 'Approved', type: 'RA Bill #01', tax: 324000, retention: 90000 },
];

export default function Invoicing() {
    const { setActiveModule } = useApp();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredInvoices = MOCK_INVOICES.filter(inv => 
        (inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase())) &&
        (filter === 'All' || inv.status === filter)
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:scale-105 transition-all">
                        <Receipt className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Invoicing & Billing</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Revenue Management Console
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-64 hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find invoices..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Plus className="w-5 h-5" /> Generate RA Bill
                    </button>
                </div>
            </div>

            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Unpaid Receivables', value: '₹1.42 Cr', desc: '+12% from last month', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Paid This Month', value: '₹40.5 L', desc: '8 invoices processed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Retention Amount', value: '₹18.2 L', desc: 'Locked in projects', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'GST Liability', value: '₹7.8 L', desc: 'Current quarter', icon: TrendingUp, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300">Live</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5">
                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-bold text-slate-500 tracking-tight">{stat.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Receipt className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Billing Queue</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Invoice Registry</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
                            <button 
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                    filter === s ? 'bg-emerald-950 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/30">
                            <tr>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Context</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Transaction</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Tax & Retention</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInvoices.map(inv => (
                                <tr 
                                    key={inv.id} 
                                    onClick={() => setActiveModule('invoice-detail')}
                                    className="group hover:bg-slate-50/40 transition-all cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{inv.client}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-2.5 h-2.5" /> {inv.date}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{inv.project}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${
                                                inv.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                                inv.status === 'Overdue' ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                                                'bg-amber-500'
                                            }`} />
                                            <div>
                                                <p className="text-xs font-black text-slate-800 leading-none mb-1">{inv.id}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{inv.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-600 flex items-center justify-between w-32 tracking-tight">
                                                <span>GST (18%)</span>
                                                <span>₹{(inv.tax / 1000).toFixed(0)}K</span>
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 flex items-center justify-between w-32 tracking-tight">
                                                <span>Retention</span>
                                                <span>₹{(inv.retention / 1000).toFixed(0)}K</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <p className="text-base font-black text-slate-800 tracking-tighter tabular-nums mb-1">₹{(inv.amount / 100000).toFixed(2)} L</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                                inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                inv.status === 'Overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {inv.status}
                                            </span>
                                            <button className="p-1 hover:bg-slate-100 rounded-md transition-all"><Download className="w-3.5 h-3.5 text-slate-400" /></button>
                                        </div>
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
