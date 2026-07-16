import { ArrowUpRight, Edit2, Trash2, Briefcase } from 'lucide-react';

const statusBadge = {
    'active': 'badge-green',
    'Active': 'badge-green',
    'draft': 'badge-gray',
    'Draft': 'badge-gray',
    'pending approval': 'badge-yellow',
    'Pending Approval': 'badge-yellow',
    'completed': 'badge-blue',
    'Completed': 'badge-blue',
};

export default function WorkOrderTable({ workOrders, onEdit, onDelete, onViewDetails }) {
    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="table-header">WO ID</th>
                            <th className="table-header">Order Description</th>
                            <th className="table-header">Subcontractor</th>
                            <th className="table-header">Contract Value</th>
                            <th className="table-header">Progress</th>
                            <th className="table-header">Status</th>
                            <th className="table-header text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOrders.length > 0 ? workOrders.map((wo, idx) => {
                            const woId = wo.id || wo._id || idx;
                            const contractor = wo.contractor || wo.vendorName || '—';
                            const description = wo.description || wo.workDescription || '—';
                            const projectId = String(wo.projectId || wo.projectName || '—');
                            const status = wo.status || 'draft';
                            return (
                            <tr key={woId} onClick={() => onViewDetails(wo)} className="table-row hover:bg-slate-50 transition-colors cursor-pointer">
                                <td className="table-cell">
                                    <span className="font-mono text-xs font-semibold text-green-700 px-2 py-1 bg-green-50 rounded-lg whitespace-nowrap">{woId}</span>
                                </td>
                                <td className="table-cell max-w-[260px]">
                                    <p className="text-slate-900 font-semibold text-sm line-clamp-1">{description}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-slate-400 text-xs">#{projectId}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{wo.type || '—'}</span>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <Briefcase className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-slate-800 font-medium text-sm">{contractor}</p>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <p className="text-emerald-600 font-semibold">₹{(Number(wo.value || 0) / 100000).toFixed(1)}L</p>
                                    <p className="text-slate-400 text-xs">Contract Value</p>
                                </td>
                                <td className="table-cell w-40">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Execution</span>
                                            <span className="font-semibold text-slate-700">{wo.progress || 0}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-green-500 transition-all duration-700"
                                                style={{ width: `${wo.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <span className={`badge ${statusBadge[status] || 'badge-gray'}`}>{status}</span>
                                </td>
                                <td className="table-cell text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button onClick={(e) => onEdit(e, wo)} className="p-1.5 text-slate-400 hover:text-[#2f6645] hover:bg-emerald-50 rounded-lg transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={(e) => onDelete(e, wo)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="7" className="p-10 text-center text-slate-400 font-medium">No work orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
