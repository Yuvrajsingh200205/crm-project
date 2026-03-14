import { MapPin, Edit2, Trash2, ArrowUpRight, Search } from 'lucide-react';

const categoryColors = {
    'Civil': 'badge-blue',
    'Electrical': 'badge-yellow',
    'HVAC': 'badge-purple',
    'Solar': 'badge-orange',
    'Interior': 'badge-green',
    'Security': 'badge-red',
};

const statusConfig = {
    'Active': { color: 'text-green-600', bg: 'bg-green-50', badge: 'badge-green' },
    'Completed': { color: 'text-blue-600', bg: 'bg-blue-50', badge: 'badge-blue' },
    'On Hold': { color: 'text-amber-600', bg: 'bg-amber-50', badge: 'badge-yellow' },
    'Delayed': { color: 'text-red-600', bg: 'bg-red-50', badge: 'badge-red' },
};

export default function ProjectTable({ projects, onEdit, onDelete, onViewDetails, onClearFilters }) {
    return (
        <div className="card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 font-bold">
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 w-32">ID</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Project Details</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Client</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Finance</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Progress</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {projects.length > 0 ? projects.map((p) => (
                            <tr key={p.id} onClick={() => onViewDetails(p)} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                                <td className="p-5">
                                    <span className="font-mono text-[10px] font-black text-blue-600 px-2 py-1 bg-blue-50 rounded-lg whitespace-nowrap border border-blue-100">{p.id}</span>
                                </td>
                                <td className="p-5 max-w-[280px]">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-bold text-sm tracking-tight line-clamp-1">{p.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`badge ${categoryColors[p.category] || 'badge-gray'} text-[10px] px-2 py-0.5`}>{p.category}</span>
                                            <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {p.site}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex flex-col">
                                        <span className="text-slate-800 font-bold text-sm">{p.client}</span>
                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Public/Private</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-black text-sm">₹{(p.contractValue/100000).toFixed(1)}L</span>
                                        <span className="text-slate-400 text-[10px] font-bold whitespace-nowrap uppercase tracking-tight">Contract Val</span>
                                    </div>
                                </td>
                                <td className="p-5 w-48">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[10px] font-black text-slate-600">
                                            <span>PROJECT PROGRESS</span>
                                            <span>{p.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ease-out rounded-full ${p.progress === 100 ? 'bg-blue-500' : 'bg-gradient-to-r from-green-500 to-green-400'}`}
                                                style={{ width: `${p.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={`badge ${statusConfig[p.status]?.badge} flex items-center gap-2 w-fit font-bold text-[10px]`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[p.status]?.color.replace('text', 'bg')}`} />
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-5 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={(e) => onEdit(e, p)}
                                            className="p-2.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100 shadow-sm"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => onDelete(e, p.id)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
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
                                <td colSpan="7" className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-500 font-bold">No projects found matching your criteria</p>
                                        <button onClick={onClearFilters} className="text-green-600 font-black text-xs uppercase underline">Clear all Filters</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
