import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Search, Plus, MapPin, Settings2, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastUtils';

import SiteStats from '../../components/sites/SiteStats';
import SiteModal from '../../components/sites/SiteModal';

export default function SiteManagement() {
    const { sites, setSites, projects, updateSite } = useApp();

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const filteredSites = useMemo(() =>
        sites.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.supervisor.toLowerCase().includes(search.toLowerCase()) ||
            s.location.toLowerCase().includes(search.toLowerCase())
        ), [sites, search]);

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

    const handleEditSite = (site) => { setIsEditing(true); setFormData({ ...site }); setIsModalOpen(true); };
    const handleDeleteSite = (id) => {
        confirmToast('Are you sure you want to remove this site?', () => {
            setSites(prev => prev.filter(s => s.id !== id));
            toast.success('Site removed');
        });
    };
    const handleSave = (e) => {
        e.preventDefault();
        const siteData = { ...formData, id: isEditing ? formData.id : `SITE-${String(sites.length + 1).padStart(3, '0')}`, manpower: Number(formData.manpower), budget: Number(formData.budget) };
        if (isEditing) { updateSite(siteData); toast.success('Site updated'); }
        else { setSites([siteData, ...sites]); toast.success('Site added successfully'); }
        setIsModalOpen(false);
    };
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="space-y-5 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Site Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor and manage active construction sites</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search sites..."
                            className="input pl-9 w-56"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={handleAddSite} className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> New Site
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSites.map(site => (
                    <div key={site.id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-all relative overflow-hidden group">
                        {/* Top color bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl transition-colors ${site.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />

                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className={`badge ${site.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>
                                {site.status}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-slate-900 font-semibold text-base">{site.name}</h3>
                            <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> {site.projectId}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400 mb-0.5">Supervisor</p>
                                <p className="text-sm text-slate-700 font-medium truncate">{site.supervisor}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-400 mb-0.5">Workforce</p>
                                <p className="text-sm text-slate-700 font-medium">{site.manpower} Men</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${site.health === 'Safe' ? 'bg-emerald-500' : site.health === 'Caution' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                <span className="text-xs text-slate-500">Health: <span className="font-medium text-slate-700">{site.health}</span></span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleEditSite(site)} className="p-1.5 bg-slate-100 text-slate-500 hover:bg-[#2f6645] hover:text-white rounded-lg transition-all">
                                    <Settings2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDeleteSite(site.id)} className="p-1.5 bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {site.alerts > 0 && (
                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-lg border border-red-100">
                                <ShieldAlert className="w-3 h-3" />
                                <span className="text-xs font-semibold">{site.alerts} Alert{site.alerts > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                ))}

                {filteredSites.length === 0 && (
                    <div className="col-span-3 card p-10 text-center text-slate-400">
                        <p className="font-medium">No sites found</p>
                    </div>
                )}
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
