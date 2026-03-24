import React from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const statusBadge = {
    'Reconciled': 'badge-green',
    'Minor Variance': 'badge-yellow',
    'Under Utilized': 'badge-blue',
    'Over Issued': 'badge-red',
};

export default function BOQTable({ items, onEdit, onDelete }) {
    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="table-header">Bill Code</th>
                            <th className="table-header">Description</th>
                            <th className="table-header">Unit</th>
                            <th className="table-header">Contract Rate</th>
                            <th className="table-header">Sub Rate</th>
                            <th className="table-header">PO Qty</th>
                            <th className="table-header">Billed Qty</th>
                            <th className="table-header">Total Value</th>
                            <th className="table-header">Trend</th>
                            <th className="table-header">Diff Value</th>
                            <th className="table-header">Status</th>
                            <th className="table-header text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const contTotal = item.billedQty * item.contractRate;
                            const diffRaw = item.poQty - item.billedQty;
                            const difference = parseFloat(diffRaw.toFixed(3));
                            const diffValue = difference * item.contractRate;

                            return (
                                <tr key={item.id} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell">
                                        <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{item.id}</span>
                                    </td>
                                    <td className="table-cell text-slate-700 font-medium max-w-[200px]">{item.description}</td>
                                    <td className="table-cell">
                                        <span className="text-slate-500 text-xs font-medium px-2 py-1 bg-slate-100 rounded-lg">{item.unit}</span>
                                    </td>
                                    <td className="table-cell text-emerald-600 font-semibold tabular-nums">₹{item.contractRate.toLocaleString()}</td>
                                    <td className="table-cell text-slate-500 tabular-nums">₹{item.subRate.toLocaleString()}</td>
                                    <td className="table-cell text-slate-700 font-semibold tabular-nums">{item.poQty}</td>
                                    <td className="table-cell text-slate-500 tabular-nums">{item.billedQty}</td>
                                    <td className="table-cell text-slate-800 font-semibold tabular-nums">₹{contTotal.toLocaleString()}</td>
                                    <td className="table-cell">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit text-xs font-semibold ${
                                            difference > 0 ? 'bg-amber-50 text-amber-600' :
                                            difference < 0 ? 'bg-red-50 text-red-600' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                            {difference > 0 && <TrendingUp className="w-3 h-3" />}
                                            {difference < 0 && <TrendingDown className="w-3 h-3" />}
                                            {difference === 0 ? 'Fixed' : (difference > 0 ? `+${difference}` : difference)}
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-700 font-medium tabular-nums">₹{Math.abs(diffValue).toLocaleString()}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[item.status] || 'badge-gray'} whitespace-nowrap`}>{item.status}</span>
                                    </td>
                                    <td className="table-cell text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => onEdit(item)} className="p-1.5 text-slate-400 hover:text-[#2f6645] hover:bg-emerald-50 rounded-lg transition-all">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 className="w-3.5 h-3.5" />
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
