import React from 'react';
import { X, Loader2 } from 'lucide-react';

export default function SiteModal({ isOpen, isEditing, formData, projects, isSaving, onClose, onSave, onInputChange }) {
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

                    {/* Project Association — send numeric projectId */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Project ID</label>
                        <input
                            type="number"
                            name="projectId"
                            value={formData.projectId || ''}
                            onChange={onInputChange}
                            required
                            className="input"
                            placeholder="e.g. 1"
                        />
                        <p className="text-xs text-slate-400">Enter the numeric project ID from the backend</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Site Name</label>
                            <input name="name" value={formData.name || ''} onChange={onInputChange} required className="input" placeholder="e.g. site-01" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Location</label>
                            <input name="location" value={formData.location || ''} onChange={onInputChange} className="input" placeholder="e.g. Delhi" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Site Supervisor</label>
                            <input name="supervisor" value={formData.supervisor || ''} onChange={onInputChange} required className="input" placeholder="Supervisor name" />
                        </div>
                        {/* API field: count (workforce headcount) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Workforce Count</label>
                            <input type="number" name="count" value={formData.count ?? formData.manpower ?? ''} onChange={onInputChange} className="input" placeholder="0" min="0" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Site Budget (₹)</label>
                            <input type="number" name="budget" value={formData.budget || ''} onChange={onInputChange} className="input" placeholder="20000" min="0" />
                        </div>
                        {/* API field: rating (1–5) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Rating (1–5)</label>
                            <input type="number" name="rating" value={formData.rating ?? 3} onChange={onInputChange} className="input" placeholder="4" min="1" max="5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Complexity</label>
                            <select name="complexity" value={formData.complexity || 'Medium'} onChange={onInputChange} className="input">
                                {['low', 'medium', 'high'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Status</label>
                            <select name="status" value={formData.status || 'active'} onChange={onInputChange} className="input">
                                {['active', 'on hold', 'closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={isSaving}>Cancel</button>
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={isSaving}>
                            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : (isEditing ? 'Update Site' : 'Add Site')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
