import React, { useState } from 'react';
import { 
    Landmark, Search, Plus, Filter, Download, 
    MoreVertical, Building2, Calendar, ArrowUpRight,
    CheckCircle2, AlertCircle, Clock, UserCheck
} from 'lucide-react';

const MOCK_RECEIVABLES = [
    { id: 'INV-A-101', customer: 'Larsen & Toubro', project: 'Patna Metro B', amount: 4500000, date: '2025-02-15', dueDate: '2025-03-15', status: 'Pending', aging: 29 },
    { id: 'INV-A-102', customer: 'Tata Projects', project: 'Smart City Muz.', amount: 1250000, date: '2025-01-10', dueDate: '2025-02-10', status: 'Overdue', aging: 64 },
    { id: 'INV-A-103', customer: 'NHAI', project: 'NH-22 Widening', amount: 8500000, date: '2025-03-01', dueDate: '2025-03-31', status: 'Current', aging: 14 },
    { id: 'INV-A-104', customer: 'Reliance Infra', project: 'Solar Farm Gaya', amount: 2800000, date: '2025-02-28', dueDate: '2025-03-30', status: 'Current', aging: 15 },
    { id: 'INV-A-105', customer: 'Bihar Urban Dev', project: 'Drainage Phase 2', amount: 1800000, date: '2024-12-25', dueDate: '2025-01-25', status: 'Critical', aging: 80 },
];

export default function AccountsReceivable() {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:rotate-6 transition-all">
                        <Landmark className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Accounts Receivable</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Asset Tracking & Collections
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-64 hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find invoice or customer..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Plus className="w-5 h-5" /> New Collection Entry
                    </button>
                </div>
            </div>

            {/* Receivable Aging Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Current Receivables', value: '₹1.13 Cr', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: '31-60 Days', value: '₹45.0 L', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: '61-90 Days', value: '₹12.5 L', color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: '90+ Days (Critical)', value: '₹18.0 L', icon: AlertCircle, color: 'text-rose-700', bg: 'bg-rose-100/50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                {stat.icon ? <stat.icon className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Receivables Registry */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Asset Management</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Customer Aging Ledger</h2>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">
                        <Download className="w-4 h-4" /> Collection Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/30">
                            <tr>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Customer & Project</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Aging Profile</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Payment Status</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Outstanding Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_RECEIVABLES.map(rec => (
                                <tr key={rec.id} className="group hover:bg-slate-50/40 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{rec.customer}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{rec.id}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-2.5 h-2.5" /> Due: {rec.dueDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-32">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[8px] font-black text-slate-400 uppercase">{rec.aging} Days Aging</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${rec.aging > 60 ? 'bg-rose-500' : (rec.aging > 30 ? 'bg-amber-500' : 'bg-emerald-500')}`} style={{ width: `${Math.min(rec.aging * 1.2, 100)}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                rec.status === 'Current' ? 'bg-emerald-50 text-emerald-600' :
                                                rec.status === 'Critical' ? 'bg-rose-50 text-rose-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                {rec.status === 'Current' ? <CheckCircle2 className="w-5 h-5" /> : (rec.status === 'Critical' ? <AlertCircle className="w-5 h-5 animate-pulse" /> : <Clock className="w-5 h-5" />)}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-800 tracking-widest uppercase">{rec.status}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{rec.project}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <p className="text-base font-black text-slate-800 tracking-tighter tabular-nums mb-1">₹{(rec.amount / 100000).toFixed(2)} L</p>
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="px-4 py-1.5 bg-emerald-950 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Send Prompt</button>
                                            <button className="p-1.5 hover:bg-white rounded-md transition-all"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
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
