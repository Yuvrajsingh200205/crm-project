import React, { useState } from 'react';
import { 
    Building, Search, Plus, Filter, Download, 
    MoreVertical, Landmark, Calendar, ArrowRightLeft,
    CheckCircle2, AlertCircle, Clock, Link as LinkIcon,
    ArrowRight, Split
} from 'lucide-react';

const MOCK_TRANSACTIONS = [
    { id: 'TXN-001', bank: 'HDFC Bank - 8821', amount: 450000, date: '2025-03-12', status: 'Matched', type: 'Credit', ref: 'RTGS-P772', bookEntry: 'L&T RA Bill #04' },
    { id: 'TXN-002', bank: 'HDFC Bank - 8821', amount: -156000, date: '2025-03-11', status: 'Unmatched', type: 'Debit', ref: 'CHQ-00122', bookEntry: '-' },
    { id: 'TXN-003', bank: 'SBI - 1102', amount: -45000, date: '2025-03-08', status: 'Matched', type: 'Debit', ref: 'UPI-9921', bookEntry: 'Petty Cash Replenish' },
    { id: 'TXN-004', bank: 'SBI - 1102', amount: 280000, date: '2025-03-05', status: 'Auto-Matched', type: 'Credit', ref: 'NEFT-Reliance', bookEntry: 'Reliance Solar Adv.' },
    { id: 'TXN-005', bank: 'HDFC Bank - 8821', amount: -22500, date: '2025-03-01', status: 'Pending', type: 'Debit', ref: 'POS-001', bookEntry: '-' },
];

export default function BankReconciliation() {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:rotate-6 transition-all">
                        <Building className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Bank Reconciliation</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Statement Matching & Book Verification
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-64 hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search transactions or refs..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Plus className="w-5 h-5" /> Import Statement
                    </button>
                </div>
            </div>

            {/* Reconciliation Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Uncleared Items', value: '12', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
                    { label: 'Bank Balance', value: '₹1.20 Cr', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Landmark },
                    { label: 'Book Balance', value: '₹1.18 Cr', color: 'text-blue-600', bg: 'bg-blue-50', icon: ArrowRightLeft },
                    { label: 'Discrepancy', value: '₹2.1 L', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Live</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Transaction Matching Interface */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Split className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Matching Queue</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Statement vs Ledger</h2>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 transition-all">
                            Auto Matching
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/30">
                            <tr>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Statement Entry</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Match Status</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Corresponding Book Entry</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Transaction Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_TRANSACTIONS.map(txn => (
                                <tr key={txn.id} className="group hover:bg-slate-50/40 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                txn.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                            }`}>
                                                <ArrowRightLeft className={`w-5 h-5 ${txn.type === 'Credit' ? 'rotate-90' : '-rotate-90'}`} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{txn.bank}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ref: {txn.ref}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-2.5 h-2.5" /> {txn.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                txn.status === 'Matched' || txn.status === 'Auto-Matched' ? 'bg-emerald-50 text-emerald-600' :
                                                txn.status === 'Unmatched' ? 'bg-rose-50 text-rose-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                {txn.status === 'Matched' || txn.status === 'Auto-Matched' ? <CheckCircle2 className="w-4 h-4" /> : (txn.status === 'Unmatched' ? <AlertCircle className="w-4 h-4 animate-pulse" /> : <Clock className="w-4 h-4" />)}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-800 tracking-widest uppercase">{txn.status}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 group/entry cursor-pointer">
                                            {txn.bookEntry !== '-' ? (
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <LinkIcon className="w-3 h-3" />
                                                    <p className="text-xs font-black tracking-tight">{txn.bookEntry}</p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-slate-300 group-hover/entry:text-emerald-500 transition-colors">
                                                    <Plus className="w-3 h-3" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Link Entry</p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <p className={`text-base font-black tracking-tighter tabular-nums mb-1 ${
                                            txn.type === 'Credit' ? 'text-emerald-600' : 'text-slate-800'
                                        }`}>
                                            {txn.type === 'Credit' ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString()}
                                        </p>
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-1.5 hover:bg-white rounded-md transition-all text-slate-400 hover:text-emerald-600"><ArrowRight className="w-4 h-4" /></button>
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
