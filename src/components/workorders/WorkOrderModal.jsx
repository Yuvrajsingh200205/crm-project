import { X, Loader2 } from 'lucide-react';

const woTypes = ['Rate Contract', 'Lumpsum', 'Unit Rate', 'Cost Plus'];
const statusOptions = ['active', 'draft', 'pending approval', 'completed'];

export default function WorkOrderModal({ isOpen, isEditing, formData, projects, isSaving, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                    <div>
                        <h2 className="text-base font-semibold">{isEditing ? 'Update Work Order' : 'Create Work Order'}</h2>
                        <p className="text-xs text-white/60 mt-0.5">Work Order Master</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[75vh]">
                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2">1. Order Context</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* projectId as number */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Project ID <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="number"
                                name="projectId"
                                value={formData.projectId || ''}
                                onChange={onInputChange}
                                className="input"
                                placeholder="e.g. 1"
                            />
                        </div>
                        {/* contractor (API field) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Contractor <span className="text-red-500">*</span></label>
                            <input
                                required
                                name="contractor"
                                value={formData.contractor || formData.vendorName || ''}
                                onChange={onInputChange}
                                className="input"
                                placeholder="Enter contractor name..."
                            />
                        </div>
                        {/* description (API field) */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Work Description <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                name="description"
                                value={formData.description || formData.workDescription || ''}
                                onChange={onInputChange}
                                className="input"
                                rows="2"
                                placeholder="Describe the scope of work..."
                            />
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-6">2. Terms &amp; Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Order Value (₹) <span className="text-red-500">*</span></label>
                            <input required type="number" name="value" value={formData.value || ''} onChange={onInputChange} className="input" placeholder="e.g. 3" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Retention (%)</label>
                            <input type="number" name="retention" value={formData.retention || ''} onChange={onInputChange} className="input" placeholder="4" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Start Date</label>
                            <input required type="date" name="startDate" value={formData.startDate || ''} onChange={onInputChange} className="input" />
                        </div>
                        {/* target (API field for completion date) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Completion Target</label>
                            <input required type="date" name="target" value={formData.target || formData.endDate || ''} onChange={onInputChange} className="input" />
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-[#1e3a34] border-b pb-2 mt-6">3. Contract Specification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Contract Type</label>
                            <select name="type" value={formData.type || 'Rate Contract'} onChange={onInputChange} className="input">
                                {woTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Order Status</label>
                            <select name="status" value={(formData.status || 'active').toLowerCase()} onChange={onInputChange} className="input">
                                {statusOptions.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        {isEditing && (
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold text-slate-600">Execution Progress ({formData.progress || 0}%)</label>
                                <input type="range" min="0" max="100" name="progress" value={formData.progress || 0} onChange={onInputChange} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#2f6645]" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button type="button" onClick={onClose} disabled={isSaving} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isSaving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {isSaving
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                : (isEditing ? 'Update Work Order' : 'Create Work Order')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
