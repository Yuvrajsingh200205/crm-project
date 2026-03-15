import React, { useState } from 'react';
import { 
    Fingerprint, Search, Download, RefreshCw, Filter, 
    MoreVertical, FileText, CheckCircle2, AlertCircle, 
    Clock, Calendar, ShieldCheck, TrendingUp, 
    ArrowUpRight, ArrowRight, Zap, Building2, Calculator
} from 'lucide-react';

const MOCK_GST_RETURNS = [
    { period: 'Feb 2025', gstr1: 'Filed', gstr3b: 'Pending', liability: 284500, itc: 198400, net: 86100, dueDate: '2025-03-20' },
    { period: 'Jan 2025', gstr1: 'Filed', gstr3b: 'Filed', liability: 312000, itc: 224600, net: 87400, dueDate: '2025-02-20' },
    { period: 'Dec 2024', gstr1: 'Filed', gstr3b: 'Filed', liability: 291800, itc: 208200, net: 83600, dueDate: '2025-01-20' },
];

export default function GSTManagement() {
    const [tab, setTab] = useState('returns');

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:rotate-3 transition-all">
                        <Calculator className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">GST Management</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Indirect Tax & Goods Services Compliance
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <RefreshCw className="w-5 h-5" /> Sync GSTN Portal
                    </button>
                </div>
            </div>

            {/* Critical Alert */}
            <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100/50 shadow-xl shadow-amber-500/5 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl -mr-8 -mt-8" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                            <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">GSTR-3B Pending Filing</h3>
                            <p className="text-xs font-bold text-slate-500">The return for <span className="text-slate-800 font-black">February 2025</span> is due in 4 days. Net Tax: ₹86,100</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.05] transition-all text-xs flex items-center gap-3">
                        Proceed to Filing <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* GST Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Outward Liability', value: '₹2.84 L', trend: '+12%', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'ITC Available', value: '₹1.98 L', trend: 'Verified', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Net GST Due', value: '₹86.1 K', trend: 'Immediate', color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Portal Credit', value: '₹12.5 K', trend: 'Cash Ledger', color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <Fingerprint className="w-5 h-5" />
                            </div>
                            <Zap className="w-4 h-4 text-slate-100 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        <div className="mt-4 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-bold text-slate-400 tracking-tight">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Tabs Console */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-brand/10 text-brand rounded-xl">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Compliance Hub</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Return Filing & Reconciliation</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
                        {['Returns', 'Invoices', 'ITC Reco'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setTab(t.toLowerCase().replace(' ', ''))}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    tab === t.toLowerCase().replace(' ', '') ? 'bg-white text-emerald-600 shadow-lg' : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {tab === 'returns' && (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30">
                                <tr>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Tax Period</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">GSTR-1 Status</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">GSTR-3B Status</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Liability vs ITC</th>
                                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Net GST</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_GST_RETURNS.map(row => (
                                    <tr key={row.period} className="group hover:bg-slate-50/40 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{row.period}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Due: {row.dueDate}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.gstr1 === 'Filed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {row.gstr1 === 'Filed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{row.gstr1}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.gstr3b === 'Filed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {row.gstr3b === 'Filed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{row.gstr3b}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-rose-500 uppercase flex items-center justify-between w-32 tracking-tight">
                                                    <span>Liability</span>
                                                    <span>₹{(row.liability / 1000).toFixed(1)}K</span>
                                                </p>
                                                <p className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-between w-32 tracking-tight">
                                                    <span>ITC Claim</span>
                                                    <span>₹{(row.itc / 1000).toFixed(1)}K</span>
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-12">
                                            <p className="text-base font-black text-slate-800 tracking-tighter tabular-nums mb-1">₹{(row.net / 1000).toFixed(1)}K</p>
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="px-3 py-1 bg-emerald-950 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">File 3B</button>
                                                <button className="p-1.5 hover:bg-white rounded-md transition-all text-slate-400 hover:text-emerald-600"><Download className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {tab !== 'returns' && (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Syncing with Portal...</h3>
                            <p className="text-sm font-bold text-slate-400 mt-2">Connecting to GSTN via GSP to fetch real-time invoice & ITC data.</p>
                            <button className="mt-8 px-8 py-4 bg-slate-100 text-slate-800 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Refresh Connection</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
