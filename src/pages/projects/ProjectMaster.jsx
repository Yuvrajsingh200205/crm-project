import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit2, MoreVertical, MapPin, Calendar, User, TrendingUp, X } from 'lucide-react';

const initialProjects = [
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
    const [projects, setProjects] = useState(initialProjects);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const filtered = projects.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.client.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || p.status === filter;
        return matchSearch && matchFilter;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        const newProject = {
            id: `PRJ-2026-00${projects.length + 1}`,
            name: formData.name || '',
            client: formData.client || '',
            category: formData.category || 'Civil',
            site: formData.site || '',
            manager: formData.manager || '',
            engineer: formData.engineer || '',
            contractValue: formData.contractValue || '0',
            advance: formData.advance || '0',
            startDate: formData.startDate || '',
            endDate: formData.endDate || '',
            status: formData.status || 'Active',
            progress: 0,
            tags: ['New']
        };
        setProjects([newProject, ...projects]);
        setIsModalOpen(false);
        setFormData({});
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        className="input pl-9 w-full"
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
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary ml-2 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Project
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Projects', value: projects.length, color: 'text-blue-400' },
                    { label: 'Active', value: projects.filter(p => p.status === 'Active').length, color: 'text-green-400' },
                    { label: 'Contract Value', value: `₹${(projects.reduce((a, p) => a + parseInt(p.contractValue || 0), 0) / 100000).toFixed(1)}L`, color: 'text-yellow-400' },
                    { label: 'Avg Progress', value: `${projects.length ? Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length) : 0}%`, color: 'text-purple-400' },
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
                            {filtered.length === 0 ? (
                                <tr><td colSpan="8" className="p-6 text-center text-slate-500">No projects found. Add a new one.</td></tr>
                            ) : filtered.map((p, i) => (
                                <tr key={i} className="table-row">
                                    <td className="table-cell">
                                        <span className="font-mono text-blue-400 text-xs">{p.id}</span>
                                    </td>
                                    <td className="table-cell">
                                        <div>
                                            <p className="text-slate-900 font-medium text-sm w-48 truncate" title={p.name}>{p.name}</p>
                                            <div className="flex items-center gap-1 mt-0.5 text-slate-400 text-xs">
                                                <MapPin className="w-3 h-3" /> <span className="truncate w-40" title={p.site}>{p.site}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-700 w-48 truncate" title={p.client}>{p.client}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${categoryColors[p.category] || 'badge-blue'}`}>{p.category}</span>
                                    </td>
                                    <td className="table-cell">
                                        <p className="text-slate-900 font-semibold">₹{(parseInt(p.contractValue || 0) / 100000).toFixed(1)}L</p>
                                        <p className="text-slate-400 text-xs">Adv: ₹{(parseInt(p.advance || 0) / 100000).toFixed(1)}L</p>
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
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[p.status]?.dot || 'bg-slate-400'}`} />
                                            <span className={`badge ${statusConfig[p.status]?.className || 'badge-gray'}`}>{p.status}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all" title="View details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all" title="More options">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-400 bg-white">
                    <span>Showing {filtered.length} of {projects.length} projects</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors">Prev</button>
                        <button className="px-3 py-1 bg-brand text-slate-900 font-medium rounded">1</button>
                        <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-brand" /> Add New Project
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddProject} className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-sm font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
                                </div>
                                
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Project Name <span className="text-red-500">*</span></label>
                                    <input required name="name" value={formData.name || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. Phase 2 Residential Tower" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Client / Organization <span className="text-red-500">*</span></label>
                                    <input required name="client" value={formData.client || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. Ministry of Works" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
                                    <select required name="category" value={formData.category || 'Civil'} onChange={handleInputChange} className="input w-full bg-white">
                                        {Object.keys(categoryColors).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Site Location (City, State) <span className="text-red-500">*</span></label>
                                    <input required name="site" value={formData.site || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. Patna, Bihar" />
                                </div>

                                {/* Financial Info */}
                                <div className="space-y-4 md:col-span-2 mt-2">
                                    <h3 className="text-sm font-semibold text-slate-800 border-b pb-2">Financials & Schedule</h3>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Contract Value (Total in ₹) <span className="text-red-500">*</span></label>
                                    <input required type="number" name="contractValue" value={formData.contractValue || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 5000000" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Advance Amount (in ₹)</label>
                                    <input type="number" name="advance" value={formData.advance || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 1000000" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Start Date <span className="text-red-500">*</span></label>
                                    <input required type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="input w-full text-slate-600" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Expected End Date <span className="text-red-500">*</span></label>
                                    <input required type="date" name="endDate" value={formData.endDate || ''} onChange={handleInputChange} className="input w-full text-slate-600" />
                                </div>

                                {/* Personnel Info */}
                                <div className="space-y-4 md:col-span-2 mt-2">
                                    <h3 className="text-sm font-semibold text-slate-800 border-b pb-2">Team Assignment</h3>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Project Manager</label>
                                    <input name="manager" value={formData.manager || ''} onChange={handleInputChange} className="input w-full" placeholder="Full name" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Site Engineer</label>
                                    <input name="engineer" value={formData.engineer || ''} onChange={handleInputChange} className="input w-full" placeholder="Full name" />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Initial Status</label>
                                    <select name="status" value={formData.status || 'Active'} onChange={handleInputChange} className="input w-full bg-white">
                                        {Object.keys(statusConfig).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 shadow-sm shadow-green-500/20 transition-all">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
