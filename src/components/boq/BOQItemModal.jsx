import { X } from 'lucide-react';

const statuses = ['Reconciled', 'Minor Variance', 'Under Utilized', 'Over Issued'];

export default function BOQItemModal({ isOpen, isEditing, formData, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                    <div>
                        <h2 className="text-base font-semibold">{isEditing ? 'Modify BOQ Item' : 'New BOQ Entry'}</h2>
                        <p className="text-xs text-white/60 mt-0.5">Line Item Specification</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={onSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Bill Code</label>
                            <input required name="id" disabled={isEditing} value={formData.id || ''} onChange={onInputChange} className="input disabled:opacity-50" placeholder="e.g. 110" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Unit of Measurement</label>
                            <input required name="unit" value={formData.unit || ''} onChange={onInputChange} className="input" placeholder="No, CKM, Set..." />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Description of Works</label>
                            <textarea required name="description" value={formData.description || ''} onChange={onInputChange} className="input" rows="3" placeholder="Item details..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Contract Rate (₹)</label>
                            <input required type="number" name="contractRate" value={formData.contractRate || ''} onChange={onInputChange} className="input" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Subcontract Rate (₹)</label>
                            <input required type="number" name="subRate" value={formData.subRate || ''} onChange={onInputChange} className="input" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">PO Quantity</label>
                            <input required type="number" step="any" name="poQty" value={formData.poQty || ''} onChange={onInputChange} className="input" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Current Status</label>
                            <select name="status" value={formData.status || 'Reconciled'} onChange={onInputChange} className="input">
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" className="btn-primary flex-1">{isEditing ? 'Update Item' : 'Add Item'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
