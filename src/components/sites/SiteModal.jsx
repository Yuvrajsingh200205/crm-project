import React from 'react';
import { X, Check, MapPin, User, BarChart3, Users, DollarSign, Activity } from 'lucide-react';

export default function SiteModal({ isOpen, isEditing, formData, projects, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    const complexities = ['Low', 'Medium', 'High'];
    const healthStatus = ['Safe', 'Caution', 'Critical'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden scale-in">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {isEditing ? 'Modify Site Data' : 'Establish New Site'}
                        </h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">EcoConstruct Site Registry</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={onSave} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-blue-500" /> Project Association
                            </label>
                            <select 
                                name="projectId" 
                                value={formData.projectId || ''} 
                                onChange={onInputChange} 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 appearance-none shadow-inner"
                            >
                                <option value="">Select a project...</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <BarChart3 className="w-3.5 h-3.5 text-purple-500" /> Site Identifier
                            </label>
                            <input 
                                name="name" 
                                value={formData.name || ''} 
                                onChange={onInputChange} 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 shadow-inner" 
                                placeholder="e.g. Block A Foundation" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-emerald-500" /> Site Supervisor
                            </label>
                            <input 
                                name="supervisor" 
                                value={formData.supervisor || ''} 
                                onChange={onInputChange} 
                                required
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 shadow-inner" 
                                placeholder="Supervisor Name" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-amber-500" /> Workforce Count
                            </label>
                            <input 
                                type="number"
                                name="manpower" 
                                value={formData.manpower || ''} 
                                onChange={onInputChange} 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-amber-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 shadow-inner" 
                                placeholder="0" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Site Budget (₹)
                            </label>
                            <input 
                                type="number"
                                name="budget" 
                                value={formData.budget || ''} 
                                onChange={onInputChange} 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-emerald-700 shadow-inner" 
                                placeholder="0.00" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-rose-500" /> Health Rating
                            </label>
                            <select 
                                name="health" 
                                value={formData.health || 'Safe'} 
                                onChange={onInputChange} 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 appearance-none shadow-inner"
                            >
                                {healthStatus.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <BarChart3 className="w-3.5 h-3.5 text-slate-400" /> Complexity
                            </label>
                            <select 
                                name="complexity" 
                                value={formData.complexity || 'Medium'} 
                                onChange={onInputChange} 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 appearance-none shadow-inner"
                            >
                                {complexities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end gap-4 border-t border-slate-50">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black hover:bg-slate-50 hover:text-slate-900 transition-all text-sm"
                        >
                            Discard
                        </button>
                        <button 
                            type="submit" 
                            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-black shadow-xl shadow-slate-900/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3 text-sm"
                        >
                            <Check className="w-5 h-5 text-emerald-400" /> 
                            {isEditing ? 'Sync Site Data' : 'Establish Site'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
