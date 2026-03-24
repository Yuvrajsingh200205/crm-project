import { X } from 'lucide-react';

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

export default function ProjectModal({ isOpen, isEditing, formData, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                    <div>
                        <h2 className="text-base font-semibold">{isEditing ? 'Edit Project Details' : 'Enroll New Project'}</h2>
                        <p className="text-xs text-white/60 mt-0.5">Project Master</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[75vh]">
                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2">1. Project Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-600">Project Full Title <span className="text-red-500">*</span></label>
                            <input required name="name" value={formData.name || ''} onChange={onInputChange} className="input" placeholder="Enter formal project name..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Category <span className="text-red-500">*</span></label>
                            <select required name="category" value={formData.category || 'Civil'} onChange={onInputChange} className="input">
                                {Object.keys(categoryColors).map(cat => <option key={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Client Authority <span className="text-red-500">*</span></label>
                            <input required name="client" value={formData.client || ''} onChange={onInputChange} className="input" placeholder="Organisation or Client Name" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-600">Site Address / Location <span className="text-red-500">*</span></label>
                            <input required name="site" value={formData.site || ''} onChange={onInputChange} className="input" placeholder="City, State" />
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-6">2. Planning & Financials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Total Contract (₹) <span className="text-red-500">*</span></label>
                            <input required type="number" name="contractValue" value={formData.contractValue || ''} onChange={onInputChange} className="input" placeholder="4250000" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Advance Rec. (₹)</label>
                            <input type="number" name="advance" value={formData.advance || ''} onChange={onInputChange} className="input" placeholder="850000" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Start Date</label>
                            <input required type="date" name="startDate" value={formData.startDate || ''} onChange={onInputChange} className="input" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Timeline Deadline</label>
                            <input required type="date" name="endDate" value={formData.endDate || ''} onChange={onInputChange} className="input" />
                        </div>
                    </div>

                    {isEditing && (
                        <>
                            <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-6">3. Operational Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Project Status</label>
                                    <select name="status" value={formData.status || 'Active'} onChange={onInputChange} className="input">
                                        {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-600">Execution Progress ({formData.progress || 0}%)</label>
                                    <input type="range" min="0" max="100" name="progress" value={formData.progress || 0} onChange={onInputChange} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#2f6645]" />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" className="btn-primary flex-1">{isEditing ? 'Update Project' : 'Create Project'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
