import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Search, Plus, MapPin, Users, Settings2, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import SiteStats from '../../components/sites/SiteStats';
import SiteModal from '../../components/sites/SiteModal';

export default function SiteManagement() {
    const { sites, setSites, projects, updateSite } = useApp();
    
    // UI State
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Filter Logic
    const filteredSites = useMemo(() => {
        return sites.filter(s => 
            s.name.toLowerCase().includes(search.toLowerCase()) || 
            s.supervisor.toLowerCase().includes(search.toLowerCase()) ||
            s.location.toLowerCase().includes(search.toLowerCase())
        );
    }, [sites, search]);

    // Stats
    const stats = useMemo(() => {
        const active = sites.filter(s => s.status === 'Active').length;
        const totalManpower = sites.reduce((sum, s) => sum + (Number(s.manpower) || 0), 0);
        const safeSites = sites.filter(s => s.health === 'Safe').length;
        const healthIndex = sites.length ? Math.round((safeSites / sites.length) * 100) : 0;
        const totalAlerts = sites.reduce((sum, s) => sum + (s.alerts || 0), 0);

        return { active, totalManpower, healthIndex, totalAlerts };
    }, [sites]);

    const handleAddSite = () => {
        setIsEditing(false);
        setFormData({ status: 'Active', health: 'Safe', alerts: 0, complexity: 'Medium', manpower: 0, budget: 0 });
        setIsModalOpen(true);
    };

    const handleEditSite = (site) => {
        setIsEditing(true);
        setFormData({ ...site });
        setIsModalOpen(true);
    };

    const handleDeleteSite = (id) => {
        if (window.confirm('Are you sure you want to terminate this site record?')) {
            setSites(prev => prev.filter(s => s.id !== id));
            toast.success("Site record terminated successfully");
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const siteData = {
            ...formData,
            id: isEditing ? formData.id : `SITE-${String(sites.length + 1).padStart(3, '0')}`,
            manpower: Number(formData.manpower),
            budget: Number(formData.budget),
        };

        if (isEditing) {
            updateSite(siteData);
            toast.success("Site configuration synchronized");
        } else {
            setSites([siteData, ...sites]);
            toast.success("New site established officially");
        }
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center justify-center group hover:rotate-6 transition-all">
                        <Building2 className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Site Management</h1>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Regional Operations
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find site or supervisor..."
                            className="pl-11 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 w-64 font-bold text-sm shadow-sm transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleAddSite}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3 text-sm"
                    >
                        <Plus className="w-5 h-5" /> New Site
                    </button>
                </div>
            </div>

            <SiteStats 
                activeSites={stats.active}
                manpower={stats.totalManpower}
                healthySites={stats.healthIndex}
                alerts={stats.totalAlerts}
            />

            {/* Sites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map(site => (
                    <div key={site.id} className="group bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 hover:border-emerald-100 transition-all relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-2 bg-slate-50 group-hover:bg-emerald-500 transition-colors" />
                        
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    site.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {site.status}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6 flex-1">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">{site.name}</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" /> {site.projectId}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-slate-100 transition-all">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Supervisor</p>
                                <p className="text-xs font-black text-slate-700">{site.supervisor}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-slate-100 transition-all">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Workforce</p>
                                <p className="text-xs font-black text-slate-700">{site.manpower} Men</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                    site.health === 'Safe' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 
                                    (site.health === 'Caution' ? 'bg-amber-500' : 'bg-rose-500 animate-pulse')
                                }`} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health: {site.health}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => handleEditSite(site)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm">
                                    <Settings2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteSite(site.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {site.alerts > 0 && (
                            <div className="absolute top-8 right-8 flex items-center gap-1 bg-rose-500 text-white px-2 py-1 rounded-lg animate-bounce shadow-lg shadow-rose-900/20">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black">{site.alerts} Alerts</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <SiteModal 
                isOpen={isModalOpen}
                isEditing={isEditing}
                formData={formData}
                projects={projects}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onInputChange={handleInputChange}
            />
        </div>
    );
}
