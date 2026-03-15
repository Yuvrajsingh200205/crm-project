import React, { useState } from 'react';
import { 
    CreditCard, Search, Plus, Filter, Download, 
    MoreVertical, Truck, Calendar, ArrowDownLeft,
    AlertCircle, CheckCircle2, Clock, User
} from 'lucide-react';

const MOCK_BILLS = [
    { id: 'BILL-001', vendor: 'UltraTech Cement', project: 'Patna Metro B', amount: 850000, date: '2025-03-12', dueDate: '2025-03-25', status: 'Pending', tds: 8500, type: 'Purchase' },
    { id: 'BILL-002', vendor: 'JSW Steel', project: 'Smart City Muz.', amount: 1560000, date: '2025-03-10', dueDate: '2025-03-20', status: 'Approved', tds: 15600, type: 'Purchase' },
    { id: 'BILL-003', vendor: 'Local Sand Supplier', project: 'Drainage P2', amount: 45000, date: '2025-02-28', dueDate: '2025-03-05', status: 'Overdue', tds: 450, type: 'Direct' },
    { id: 'BILL-004', vendor: 'Security Agency XYZ', project: 'Solar Farm', amount: 220000, date: '2025-03-01', dueDate: '2025-03-15', status: 'Paid', tds: 2200, type: 'Service' },
    { id: 'BILL-005', vendor: 'Machine Rental Corp', project: 'NH-22 Widening', amount: 380000, date: '2025-03-05', dueDate: '2025-03-18', status: 'Pending', tds: 3800, type: 'Service' },
];

export default function AccountsPayable() {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:rotate-6 transition-all">
                        <CreditCard className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Accounts Payable</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Liabilities & Vendor Obligations
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-64 hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find vendor or bill..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Plus className="w-5 h-5" /> Record Vendor Bill
                    </button>
                </div>
            </div>

            {/* Payable Aging Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Current (0-30 Days)', value: '₹42.5 L', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: '31-60 Days Late', value: '₹8.4 L', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: '61-90 Days Late', value: '₹2.1 L', color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Scheduled Payment', value: '₹12.0 L', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                {stat.icon ? <stat.icon className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <ArrowDownLeft className="w-4 h-4 text-rose-400 group-hover:rotate-45 transition-transform" />
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Bills Registry */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Payables</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Vendor Obligations</h2>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">
                        <Download className="w-4 h-4" /> Aging Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/30">
                            <tr>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Vendor & Category</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Aging Profile</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">TDS Deduction</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-12">Bill Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_BILLS.map(bill => (
                                <tr key={bill.id} className="group hover:bg-slate-50/40 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                                <Truck className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{bill.vendor}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{bill.id}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-2.5 h-2.5" /> Due: {bill.dueDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                bill.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                                                bill.status === 'Overdue' ? 'bg-rose-50 text-rose-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                {bill.status === 'Paid' ? <CheckCircle2 className="w-5 h-5" /> : (bill.status === 'Overdue' ? <AlertCircle className="w-5 h-5 animate-pulse" /> : <Clock className="w-5 h-5" />)}
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-800 tracking-widest uppercase">{bill.status}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{bill.type} Bill</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl w-32">
                                            <p className="text-[10px] font-black text-slate-600 tracking-tighter">₹{(bill.tds / 1000).toFixed(1)}K</p>
                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Section 194C</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right pr-12">
                                        <p className="text-base font-black text-slate-800 tracking-tighter tabular-nums mb-1">₹{(bill.amount / 1000).toFixed(1)}K</p>
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="px-3 py-1 bg-emerald-950 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Pay Now</button>
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
