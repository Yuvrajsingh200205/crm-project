import React, { useState } from 'react';
import { 
    Percent, Search, Plus, Filter, Download, 
    MoreVertical, FileText, CheckCircle2, AlertCircle, 
    Clock, Calendar, ShieldCheck, Briefcase, Info
} from 'lucide-react';

const MOCK_TDS = [
    { id: 'TDS-2025-001', vendor: 'UltraTech Cement', section: '194C', amount: 8500, date: '2025-03-12', status: 'Deposited', ref: 'CHQ-98212', period: 'Q4 2024-25' },
    { id: 'TDS-2025-002', vendor: 'Tata Projects', section: '194J', amount: 15600, date: '2025-03-10', status: 'Approved', ref: '-', period: 'Q4 2024-25' },
    { id: 'TDS-2025-003', vendor: 'Local Sand Supplier', section: '194C', amount: 450, date: '2025-02-28', status: 'Cert. Issued', ref: 'CERT-0042', period: 'Q3 2024-25' },
    { id: 'TDS-2025-004', vendor: 'Reliance Infra', section: '194I', amount: 2200, date: '2025-03-01', status: 'Deposited', ref: 'NEFT-8831', period: 'Q4 2024-25' },
    { id: 'TDS-2025-005', vendor: 'Security Agency XYZ', section: '194C', amount: 3800, date: '2025-03-05', status: 'Pending', ref: '-', period: 'Q4 2024-25' },
];

export default function TDSManagement() {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:rotate-3 transition-all">
                        <Percent className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">TDS Management</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Direct Tax & Statutory Compliance
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-64 hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by vendor or section..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Plus className="w-5 h-5" /> Bulk Deposit Filing
                    </button>
                </div>
            </div>

            {/* TDS Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Unfiled Liability', value: '₹42,500', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
                    { label: 'Deposited (Q4)', value: '₹1.28 L', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ShieldCheck },
                    { label: 'Certificates Due', value: '18', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle },
                    { label: 'Filing Compliance', value: '100%', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <Info className="w-4 h-4 text-slate-200 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* TDS Registry */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Statutory Log</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Tax Deduction Registry</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">
                            <Download className="w-4 h-4" /> Form 26AS
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            Issue Certificates
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/30">
                            <tr>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Vendor & Section</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Compliance Status</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Filing Period</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Deducted Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_TDS.map(tds => (
                                <tr key={tds.id} className="group hover:bg-slate-50/40 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                                <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{tds.vendor}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">{tds.section}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-2.5 h-2.5" /> {tds.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                tds.status === 'Cert. Issued' ? 'bg-emerald-50 text-emerald-600' :
                                                tds.status === 'Pending' ? 'bg-rose-50 text-rose-600' :
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                                {tds.status === 'Cert. Issued' ? <CheckCircle2 className="w-5 h-5" /> : (tds.status === 'Pending' ? <AlertCircle className="w-5 h-5 animate-pulse" /> : <FileText className="w-5 h-5" />)}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-800 tracking-widest uppercase">{tds.status}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Ref: {tds.ref}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl w-32">
                                            <p className="text-[10px] font-black text-slate-700 tracking-tighter">{tds.period}</p>
                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Quarterly Return</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <p className="text-base font-black text-slate-800 tracking-tighter tabular-nums mb-1">₹{tds.amount.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-1.5 hover:bg-white rounded-md transition-all text-slate-400 hover:text-emerald-600"><Download className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white rounded-md transition-all text-slate-400 hover:text-emerald-600"><MoreVertical className="w-4 h-4" /></button>
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
