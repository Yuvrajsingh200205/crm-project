import { X, ChevronDown, CheckCircle2 } from 'lucide-react';

const woTypes = ['Rate Contract', 'Lumpsum', 'Unit Rate', 'Cost Plus'];
const statusOptions = ['Active', 'Draft', 'Pending Approval', 'Completed'];

export default function WorkOrderModal({ isOpen, isEditing, formData, projects, onClose, onSave, onInputChange }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#1e3a34] tracking-tight">
                            {isEditing ? 'Update Work Order' : 'Create Work Order'}
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Execute task allocation to subcontractors</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={onSave} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Level 1: Context */}
                        <div className="space-y-5 lg:col-span-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-black text-xs">01</div>
                                <h3 className="text-sm font-black text-[#1e3a34] uppercase tracking-widest">Order Context</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Project <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select required name="projectId" value={formData.projectId || ''} onChange={onInputChange} className="w-full pl-5 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 appearance-none">
                                            <option value="">Select Project...</option>
                                            {projects.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contractor/Vendor <span className="text-red-500">*</span></label>
                                    <input required name="vendorName" value={formData.vendorName || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" placeholder="Search or Enter Vendor Name..." />
                                </div>
                                <div className="lg:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Description <span className="text-red-500">*</span></label>
                                    <textarea required name="workDescription" value={formData.workDescription || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" rows="2" placeholder="Describe the scope of work..." />
                                </div>
                            </div>
                        </div>

                        {/* Level 2: Financials & Dates */}
                        <div className="space-y-5 lg:col-span-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">02</div>
                                <h3 className="text-sm font-black text-[#1e3a34] uppercase tracking-widest">Terms & Timeline</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Value (₹) <span className="text-red-500">*</span></label>
                                    <input required type="number" name="value" value={formData.value || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" placeholder="1250000" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Retention (%)</label>
                                    <input type="number" name="retention" value={formData.retention || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" placeholder="5" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                    <input required type="date" name="startDate" value={formData.startDate || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Completion Target</label>
                                    <input required type="date" name="endDate" value={formData.endDate || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" />
                                </div>
                            </div>
                        </div>

                        {/* Level 3: Advanced */}
                        <div className="space-y-5 lg:col-span-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs">03</div>
                                <h3 className="text-sm font-black text-[#1e3a34] uppercase tracking-widest">Contract Specification</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contract Type</label>
                                    <div className="relative">
                                        <select name="type" value={formData.type || 'Rate Contract'} onChange={onInputChange} className="w-full pl-5 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 appearance-none">
                                            {woTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Order Status</label>
                                    <div className="relative">
                                        <select name="status" value={formData.status || 'Draft'} onChange={onInputChange} className="w-full pl-5 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 appearance-none">
                                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Execution Progress ({formData.progress || 0}%)</label>
                                        <input type="range" min="0" max="100" name="progress" value={formData.progress || 0} onChange={onInputChange} className="w-full h-11 accent-green-600 cursor-pointer" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-50 flex justify-end gap-4 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl border border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all">
                            Discard
                        </button>
                        <button type="submit" className="px-10 py-4 rounded-2xl bg-[#1e3a34] text-white font-black shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5" /> 
                            {isEditing ? 'Authorize Changes' : 'Draft Work Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
