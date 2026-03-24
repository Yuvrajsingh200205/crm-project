import React from 'react';
import { X } from 'lucide-react';

export default function SiteModal({ isOpen, isEditing, formData, projects, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                    <div>
                        <h2 className="text-base font-semibold">{isEditing ? 'Edit Site' : 'Add New Site'}</h2>
                        <p className="text-xs text-white/60 mt-0.5">Site Registry</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Project Association</label>
                        <select name="projectId" value={formData.projectId || ''} onChange={onInputChange} required className="input">
                            <option value="">Select a project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Site Name</label>
                            <input name="name" value={formData.name || ''} onChange={onInputChange} required className="input" placeholder="e.g. Block A Foundation" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Location</label>
                            <input name="location" value={formData.location || ''} onChange={onInputChange} className="input" placeholder="e.g. Patna, Bihar" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Site Supervisor</label>
                            <input name="supervisor" value={formData.supervisor || ''} onChange={onInputChange} required className="input" placeholder="Supervisor name" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Workforce Count</label>
                            <input type="number" name="manpower" value={formData.manpower || ''} onChange={onInputChange} className="input" placeholder="0" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Site Budget (₹)</label>
                            <input type="number" name="budget" value={formData.budget || ''} onChange={onInputChange} className="input" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Complexity</label>
                            <select name="complexity" value={formData.complexity || 'Medium'} onChange={onInputChange} className="input">
                                {['Low', 'Medium', 'High'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Status</label>
                            <select name="status" value={formData.status || 'Active'} onChange={onInputChange} className="input">
                                {['Active', 'On Hold', 'Closed'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Health Rating</label>
                            <select name="health" value={formData.health || 'Safe'} onChange={onInputChange} className="input">
                                {['Safe', 'Caution', 'Critical'].map(h => <option key={h}>{h}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" className="btn-primary flex-1">{isEditing ? 'Update Site' : 'Add Site'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
