import { ArrowUpRight, Edit2, Trash2, Building, Briefcase } from 'lucide-react';

const statusConfig = {
    'Active': { color: 'text-green-600', bg: 'bg-green-50', badge: 'badge-green' },
    'Draft': { color: 'text-slate-600', bg: 'bg-slate-100', badge: 'badge-gray' },
    'Pending Approval': { color: 'text-amber-600', bg: 'bg-amber-50', badge: 'badge-yellow' },
    'Completed': { color: 'text-blue-600', bg: 'bg-blue-50', badge: 'badge-blue' },
};

export default function WorkOrderTable({ workOrders, onEdit, onDelete, onViewDetails }) {
    return (
        <div className="card overflow-hidden shadow-sm border-slate-50">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 font-bold">
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 w-32">WO ID</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Order Context</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Subcontractor</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Financials</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Progress</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {workOrders.length > 0 ? workOrders.map((wo) => (
                            <tr key={wo.id} onClick={() => onViewDetails(wo)} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                                <td className="p-5">
                                    <span className="font-mono text-[10px] font-black text-green-700 px-2 py-1 bg-green-50 rounded-lg whitespace-nowrap border border-green-100">{wo.id}</span>
                                </td>
                                <td className="p-5 max-w-[280px]">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-bold text-sm tracking-tight line-clamp-1">{wo.workDescription}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1 uppercase tracking-tight">
                                                <Building className="w-3 h-3" /> {wo.projectId}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[10px] font-black bg-slate-50 px-2 py-0.5 rounded text-slate-500">{wo.type}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 font-bold text-sm">{wo.vendorName}</span>
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">{wo.vendorId}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-black text-sm">₹{(wo.value/100000).toFixed(1)}L</span>
                                        <span className="text-slate-400 text-[10px] font-bold whitespace-nowrap uppercase tracking-tight">Contract Value</span>
                                    </div>
                                </td>
                                <td className="p-5 w-44">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px] font-black text-slate-600">
                                            <span>EXECUTION</span>
                                            <span>{wo.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ease-out rounded-full bg-green-500`}
                                                style={{ width: `${wo.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={`badge ${statusConfig[wo.status]?.badge} flex items-center gap-2 w-fit font-bold text-[10px]`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[wo.status]?.color.replace('text', 'bg')}`} />
                                        {wo.status}
                                    </span>
                                </td>
                                <td className="p-5 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={(e) => onEdit(e, wo)}
                                            className="p-2.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => onDelete(e, wo.id)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="p-12 text-center text-slate-500 font-bold">No work orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
