import { X, Check, ChevronDown, Hash, Package, Type, DollarSign, Layers, ListFilter } from 'lucide-react';

const statuses = ['Reconciled', 'Minor Variance', 'Under Utilized', 'Over Issued'];

export default function BOQItemModal({ isOpen, isEditing, formData, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col scale-in">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                    <div>
                        <h2 className="text-xl font-black text-[#1e3a34] tracking-tight">
                            {isEditing ? 'Modify BOQ Item' : 'New BOQ Entry'}
                        </h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Line Item Specification</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={onSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600"><Hash className="w-3.5 h-3.5" /></div> Bill Code
                            </label>
                            <input required name="id" disabled={isEditing} value={formData.id || ''} onChange={onInputChange} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-2xl outline-none transition-all font-black text-slate-800 disabled:opacity-50" placeholder="e.g. 110" />
                        </div>
                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600"><Package className="w-3.5 h-3.5" /></div> Unit of Measurement
                            </label>
                            <input required name="unit" value={formData.unit || ''} onChange={onInputChange} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/5 rounded-2xl outline-none transition-all font-black text-slate-800" placeholder="No, CKM, Set..." />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-500"><Type className="w-3.5 h-3.5" /></div> Description of Works
                            </label>
                            <textarea required name="description" value={formData.description || ''} onChange={onInputChange} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/5 rounded-2xl outline-none transition-all font-bold text-slate-800" rows="3" placeholder="Item details..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600"><DollarSign className="w-3.5 h-3.5" /></div> Contract Rate (₹)
                            </label>
                            <input required type="number" name="contractRate" value={formData.contractRate || ''} onChange={onInputChange} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl outline-none transition-all font-black text-emerald-700" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-500"><DollarSign className="w-3.5 h-3.5" /></div> Subcontract Rate (₹)
                            </label>
                            <input required type="number" name="subRate" value={formData.subRate || ''} onChange={onInputChange} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/5 rounded-2xl outline-none transition-all font-black text-slate-800" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600"><Layers className="w-3.5 h-3.5" /></div> PO Quantity
                            </label>
                            <input required type="number" step="any" name="poQty" value={formData.poQty || ''} onChange={onInputChange} className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/5 rounded-2xl outline-none transition-all font-black text-slate-800" placeholder="0.00" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-500"><ListFilter className="w-3.5 h-3.5" /></div> Current Status
                            </label>
                            <div className="relative group">
                                <select name="status" value={formData.status || 'Reconciled'} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl outline-none transition-all font-black text-slate-800 appearance-none cursor-pointer">
                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black hover:bg-slate-50 hover:text-slate-900 transition-all text-sm">
                            Discard
                        </button>
                        <button type="submit" className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black shadow-xl shadow-emerald-900/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3 text-sm">
                            <Check className="w-5 h-5" /> 
                            {isEditing ? 'Sync Changes' : 'Confirm Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
