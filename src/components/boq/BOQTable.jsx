import React from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const statusStyles = {
    'Reconciled': 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-600/5',
    'Minor Variance': 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm shadow-orange-600/5',
    'Under Utilized': 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm shadow-sky-600/5 whitespace-nowrap px-4',
    'Over Issued': 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-600/5 whitespace-nowrap px-4',
};

export default function BOQTable({ items, onEdit, onDelete }) {
    return (
        <div className="card overflow-hidden shadow-xl shadow-slate-200/50 border-0 bg-white/80 backdrop-blur-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 font-bold">
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Bill Code</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Description</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Unit</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-green-700">Contract Rate</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Sub Rate</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">PO Qty</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Billed Qty</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Total Val</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Trend</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Diff Value</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Status</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => {
                            const contTotal = item.billedQty * item.contractRate;
                            const diffRaw = item.poQty - item.billedQty;
                            const difference = parseFloat(diffRaw.toFixed(3));
                            const diffValue = difference * item.contractRate;
                            
                            return (
                                <tr key={item.id} className="group hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all border-b border-slate-50">
                                    <td className="p-5">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xs shadow-sm ring-1 ring-blue-100">
                                            {item.id}
                                        </div>
                                    </td>
                                    <td className="p-5 text-slate-700 font-bold text-xs max-w-xs leading-relaxed">{item.description}</td>
                                    <td className="p-5">
                                        <span className="text-slate-500 font-black text-[10px] tracking-widest px-2 py-1 bg-slate-100/50 rounded-lg">{item.unit}</span>
                                    </td>
                                    <td className="p-5 text-emerald-600 font-black text-sm tabular-nums">₹{item.contractRate.toLocaleString()}</td>
                                    <td className="p-5 text-slate-500 font-bold text-xs tabular-nums">₹{item.subRate.toLocaleString()}</td>
                                    <td className="p-5 text-slate-700 font-black text-sm tabular-nums">{item.poQty}</td>
                                    <td className="p-5 text-slate-500 font-bold text-xs tabular-nums">{item.billedQty}</td>
                                    <td className="p-5 text-slate-700 font-black text-sm tabular-nums">₹{contTotal.toLocaleString()}</td>
                                    <td className="p-5">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit font-black text-[10px] shadow-sm ring-1 ${
                                            difference > 0 ? 'bg-orange-50 text-orange-600 ring-orange-100' : 
                                            (difference < 0 ? 'bg-rose-50 text-rose-600 ring-rose-100' : 'bg-slate-50 text-slate-400 ring-slate-100')
                                        }`}>
                                            {difference > 0 && <TrendingUp className="w-3.5 h-3.5" />}
                                            {difference < 0 && <TrendingDown className="w-3.5 h-3.5" />}
                                            {difference === 0 ? 'FIXED' : (difference > 0 ? `+${difference}` : difference)}
                                        </div>
                                    </td>
                                    <td className="p-5 text-slate-700 font-black text-sm tabular-nums">₹{Math.abs(diffValue).toLocaleString()}</td>
                                    <td className="p-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border flex items-center justify-center min-w-[110px] tracking-tight ${statusStyles[item.status]}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onEdit(item)} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 hover:border-emerald-200 shadow-sm">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(item.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-100 hover:border-rose-200 shadow-sm">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
