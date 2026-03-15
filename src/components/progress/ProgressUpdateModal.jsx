import React from 'react';
import { X, Check, Target, Calendar, AlertCircle, FileText } from 'lucide-react';

export default function ProgressUpdateModal({ isOpen, isEditing, formData, sites, projects, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    const statuses = ['Active', 'In Progress', 'Completed', 'On Hold', 'Delayed'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col scale-in border-[12px] border-slate-50/50">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                            <Target className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                {isEditing ? 'Sync Work Progress' : 'Initialize New Milestone'}
                            </h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Project Milestone Ledger</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={onSave} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" /> Milestone/Activity Title
                                </label>
                                <input 
                                    name="title" 
                                    value={formData.title || ''} 
                                    onChange={onInputChange} 
                                    required
                                    className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 shadow-inner" 
                                    placeholder="e.g. Phase 2 Wiring" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5" /> Associated Site
                                </label>
                                <select 
                                    name="siteId" 
                                    value={formData.siteId || ''} 
                                    onChange={onInputChange} 
                                    required
                                    className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 appearance-none shadow-inner"
                                >
                                    <option value="">Select Target Site...</option>
                                    {sites.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> Start Date
                            </label>
                            <input 
                                type="date"
                                name="startDate" 
                                value={formData.startDate || ''} 
                                onChange={onInputChange} 
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 shadow-inner" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> Expected Completion
                            </label>
                            <input 
                                type="date"
                                name="endDate" 
                                value={formData.endDate || ''} 
                                onChange={onInputChange} 
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 shadow-inner" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Priority Level
                            </label>
                            <select 
                                name="priority" 
                                value={formData.priority || 'Medium'} 
                                onChange={onInputChange} 
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 appearance-none shadow-inner"
                            >
                                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Target className="w-3.5 h-3.5 text-emerald-600" /> Completion Progress
                                    </label>
                                    <span className="text-lg font-black text-emerald-600">{formData.progress || 0}%</span>
                                </div>
                                <div className="space-y-2">
                                    <input 
                                        type="range"
                                        min="0"
                                        max="100"
                                        name="progress"
                                        value={formData.progress || 0}
                                        onChange={onInputChange}
                                        className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                                    />
                                    <div className="flex justify-between text-[8px] font-black text-slate-300 tracking-widest uppercase">
                                        <span>Not Started</span>
                                        <span>50% Completed</span>
                                        <span>Fully Resolved</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status || 'Active'} 
                                    onChange={onInputChange} 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-slate-800 appearance-none shadow-inner"
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex justify-end gap-5 border-t border-slate-50">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-10 py-5 rounded-3xl border-2 border-slate-100 text-slate-500 font-black hover:bg-slate-50 hover:text-slate-900 transition-all text-sm"
                        >
                            Cancel Update
                        </button>
                        <button 
                            type="submit" 
                            className="px-12 py-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black shadow-2xl shadow-emerald-900/30 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-4 text-sm"
                        >
                            <Check className="w-6 h-6" /> 
                            {isEditing ? 'Sync Progress' : 'Commit Milestone'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
