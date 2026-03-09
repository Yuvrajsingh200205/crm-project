import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit2, MoreVertical, MapPin, Calendar, User, TrendingUp } from 'lucide-react';

const projects = [
    {
        id: 'PRJ-2026-001', name: 'SWPL-BRGF Electrification Phase 1',
        client: 'Bihar Rural Development Authority', category: 'Electrical',
        site: 'Muzaffarpur, Bihar', manager: 'Rajesh Kumar', engineer: 'Amit Singh',
        contractValue: '4250000', advance: '850000',
        startDate: '2025-10-01', endDate: '2026-06-30',
        status: 'Active', progress: 78,
        tags: ['High Priority', 'Government']
    },
    {
        id: 'PRJ-2026-002', name: 'Patna Metro Civil Works Section B',
        client: 'PMRCL – Patna Metro Rail Corp', category: 'Civil',
        site: 'Patna, Bihar', manager: 'Suresh Verma', engineer: 'Priya Devi',
        contractValue: '12000000', advance: '3000000',
        startDate: '2025-08-15', endDate: '2026-12-31',
        status: 'Active', progress: 45,
        tags: ['Ongoing']
    },
    {
        id: 'PRJ-2026-003', name: 'Solar Farm Installation Muzaffarpur',
        client: 'Bihar State Energy Department', category: 'Solar',
        site: 'Muzaffarpur, Bihar', manager: 'Ankit Sharma', engineer: 'Ritu Singh',
        contractValue: '8500000', advance: '2125000',
        startDate: '2025-07-01', endDate: '2025-12-31',
        status: 'Completed', progress: 100,
        tags: ['Completed']
    },
    {
        id: 'PRJ-2026-004', name: 'HVAC System – Gaya Municipal Complex',
        client: 'Gaya Municipal Corporation', category: 'HVAC',
        site: 'Gaya, Bihar', manager: 'Vijay Tiwari', engineer: 'Neha Rai',
        contractValue: '2800000', advance: '700000',
        startDate: '2026-01-15', endDate: '2026-04-30',
        status: 'On Hold', progress: 30,
        tags: ['On Hold', 'Dispute']
    },
    {
        id: 'PRJ-2026-005', name: 'Interior Design – TechCorp HQ',
        client: 'TechCorp India Pvt Ltd', category: 'Interior',
        site: 'Patna, Bihar', manager: 'Deepak Kumar', engineer: 'Sanya Mishra',
        contractValue: '1550000', advance: '310000',
        startDate: '2026-02-01', endDate: '2026-04-15',
        status: 'Active', progress: 60,
        tags: ['Fast Track']
    },
    {
        id: 'PRJ-2026-006', name: 'Security System – Bank Complex Hajipur',
        client: 'Vaishali District Coop Bank', category: 'Security',
        site: 'Hajipur, Bihar', manager: 'Rakesh Prasad', engineer: 'Mohan Das',
        contractValue: '980000', advance: '196000',
        startDate: '2026-03-01', endDate: '2026-04-30',
        status: 'Active', progress: 15,
        tags: ['New']
    },
];

const categoryColors = {
    'Civil': 'badge-blue',
    'Electrical': 'badge-yellow',
    'HVAC': 'badge-purple',
    'Solar': 'badge-orange',
    'Interior': 'badge-green',
    'Security': 'badge-red',
};

const statusConfig = {
    'Active': { className: 'badge-green', dot: 'bg-green-400' },
    'Completed': { className: 'badge-blue', dot: 'bg-blue-400' },
    'On Hold': { className: 'badge-yellow', dot: 'bg-yellow-400' },
};

export default function ProjectMaster() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [viewMode, setViewMode] = useState('table'); // table | grid

    const filtered = projects.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.client.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || p.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        className="input pl-9"
                        placeholder="Search projects by name or client..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {['All', 'Active', 'On Hold', 'Completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${filter === f ? 'bg-brand text-slate-900' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900'}`}
                        >
                            {f}
                        </button>
                    ))}
                    <button className="btn-primary ml-2">
                        <Plus className="w-4 h-4" /> New Project
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Projects', value: projects.length, color: 'text-blue-400' },
                    { label: 'Active', value: projects.filter(p => p.status === 'Active').length, color: 'text-green-400' },
                    { label: 'Contract Value', value: `₹${(projects.reduce((a, p) => a + parseInt(p.contractValue), 0) / 100000).toFixed(1)}L`, color: 'text-yellow-400' },
                    { label: 'Avg Progress', value: `${Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length)}%`, color: 'text-purple-400' },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Project Code', 'Project Name', 'Client', 'Category', 'Contract Value', 'Progress', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="table-header">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={i} className="table-row">
                                    <td className="table-cell">
                                        <span className="font-mono text-blue-400 text-xs">{p.id}</span>
                                    </td>
                                    <td className="table-cell">
                                        <div>
                                            <p className="text-slate-900 font-medium text-sm">{p.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5 text-slate-400 text-xs">
                                                <MapPin className="w-3 h-3" /> {p.site}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-700">{p.client}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${categoryColors[p.category]}`}>{p.category}</span>
                                    </td>
                                    <td className="table-cell">
                                        <p className="text-slate-900 font-semibold">₹{(parseInt(p.contractValue) / 100000).toFixed(1)}L</p>
                                        <p className="text-slate-400 text-xs">Adv: ₹{(parseInt(p.advance) / 100000).toFixed(1)}L</p>
                                    </td>
                                    <td className="table-cell w-40">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-50 rounded-full h-1.5">
                                                <div
                                                    className="h-1.5 rounded-full transition-all"
                                                    style={{
                                                        width: `${p.progress}%`,
                                                        background: p.progress === 100 ? '#22c55e' : 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                                                    }}
                                                />
                                            </div>
                                            <span className="text-slate-700 text-xs font-medium w-8">{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[p.status].dot}`} />
                                            <span className={`badge ${statusConfig[p.status].className}`}>{p.status}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-400">
                    <span>Showing {filtered.length} of {projects.length} projects</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors">Prev</button>
                        <button className="px-3 py-1 rounded bg-brand text-slate-900">1</button>
                        <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
