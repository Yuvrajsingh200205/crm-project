import React from 'react';
import { Layers, ShieldCheck, AlertTriangle, IndianRupee } from 'lucide-react';

export default function BOQStats({ totalItems, reconciled, overIssued, totalValue }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 border-0 bg-white shadow-xl shadow-blue-900/5 group hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                        <Layers className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-4xl font-black text-slate-800 mt-4 tracking-tighter">{totalItems}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Total BOQ Items</p>
            </div>

            <div className="card p-6 border-0 bg-white shadow-xl shadow-emerald-900/5 group hover:scale-[1.02] transition-all border-b-4 border-emerald-500">
                <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-4xl font-black text-emerald-600 mt-4 tracking-tighter">{reconciled}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Reconciled Items</p>
            </div>

            <div className="card p-6 border-0 bg-white shadow-xl shadow-rose-900/5 group hover:scale-[1.02] transition-all border-b-4 border-rose-500">
                <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors shadow-inner">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-4xl font-black text-rose-600 mt-4 tracking-tighter">{overIssued}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Over Issued High</p>
            </div>

            <div className="card p-6 border-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl shadow-slate-900/20 group hover:scale-[1.02] transition-all text-white">
                <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                        <IndianRupee className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-amber-400/50 uppercase tracking-widest border border-amber-400/20 px-2 py-0.5 rounded">Financial</span>
                </div>
                <h3 className="text-3xl font-black text-white mt-4 tracking-tighter">₹{totalValue}L</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Certified PO Value</p>
            </div>
        </div>
    );
}
