import React from 'react';
import { X } from 'lucide-react';

export default function ProgressUpdateModal({ isOpen, isEditing, formData, sites, projects, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    const statuses = ['Active', 'In Progress', 'Completed', 'On Hold', 'Delayed'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                    <div>
                        <h2 className="text-base font-semibold">{isEditing ? 'Edit Milestone' : 'Add New Milestone'}</h2>
                        <p className="text-xs text-white/60 mt-0.5">Project Planner</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Milestone Title</label>
                            <input name="title" value={formData.title || ''} onChange={onInputChange} required className="input" placeholder="e.g. Phase 2 Wiring" />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Associated Site</label>
                            <select name="siteId" value={formData.siteId || ''} onChange={onInputChange} required className="input">
                                <option value="">Select Target Site...</option>
                                {sites.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate || ''} onChange={onInputChange} required className="input" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Expected End Date</label>
                            <input type="date" name="endDate" value={formData.endDate || ''} onChange={onInputChange} required className="input" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Priority Level</label>
                            <select name="priority" value={formData.priority || 'Medium'} onChange={onInputChange} className="input">
                                {priorities.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Lifecycle Status</label>
                            <select name="status" value={formData.status || 'Active'} onChange={onInputChange} className="input">
                                {statuses.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-semibold text-slate-600">Completion Progress</label>
                            <span className="text-sm font-semibold text-emerald-600">{formData.progress || 0}%</span>
                        </div>
                        <div className="space-y-1.5">
                            <input 
                                type="range" min="0" max="100" name="progress" 
                                value={formData.progress || 0} onChange={onInputChange} 
                                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" className="btn-primary flex-1">{isEditing ? 'Update Milestone' : 'Save Milestone'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
