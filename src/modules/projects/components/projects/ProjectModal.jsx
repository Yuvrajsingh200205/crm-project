import { X } from 'lucide-react';

export default function ProjectModal({ isOpen, isEditing, formData, onClose, onSave, onInputChange, isLoading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                    <div>
                        <h2 className="text-base font-semibold">{isEditing ? 'Edit Project Details' : 'Enroll New Project'}</h2>
                        <p className="text-xs text-white/60 mt-0.5">Project Master / DB API Tracker</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[75vh]">
                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2">1. Project Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600">Project Code <span className="text-red-500">*</span></label>
                            <input required disabled={isEditing} name="code" value={formData.code || ''} onChange={onInputChange} className="input disabled:opacity-50" placeholder="e.g. PT-001" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="text-xs font-semibold text-slate-600">Project Full Name <span className="text-red-500">*</span></label>
                            <input required name="name" value={formData.name || ''} onChange={onInputChange} className="input" placeholder="e.g. PROJECT 01" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Client Authority <span className="text-red-500">*</span></label>
                            <input required name="client" value={formData.client || ''} onChange={onInputChange} className="input" placeholder="e.g. CLIENT-01" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Category</label>
                            <input required name="category" value={formData.category || ''} onChange={onInputChange} className="input" placeholder="e.g. CAT-01" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-600">Site Location <span className="text-red-500">*</span></label>
                            <input required name="location" value={formData.location || ''} onChange={onInputChange} className="input" placeholder="e.g. NEW DELHI" />
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-6">2. Planning & Financials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Total Value (₹) <span className="text-red-500">*</span></label>
                            <input required type="number" step="any" name="value" value={formData.value || ''} onChange={onInputChange} className="input" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Advancement (Progress/Advance%)</label>
                            <input required type="number" name="advancement" value={formData.advancement || ''} onChange={onInputChange} className="input" placeholder="e.g. 12" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Start Date</label>
                            <input required type="date" name="startDate" value={formData.startDate || ''} onChange={onInputChange} className="input" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">End Date</label>
                            <input required type="date" name="endDate" value={formData.endDate || ''} onChange={onInputChange} className="input" />
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-6">3. Operational Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Process Action</label>
                            <select name="process" value={formData.process || 'RUNNING'} onChange={onInputChange} className="input">
                                <option value="RUNNING">RUNNING</option>
                                <option value="HALTED">HALTED</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Current Status</label>
                            <select name="status" value={formData.status || 'pending'} onChange={onInputChange} className="input">
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isLoading} className="btn-primary flex-1 disabled:opacity-50">
                            {isLoading ? 'Processing...' : (isEditing ? 'Update Project' : 'Create Project')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
