import { X, ChevronDown } from 'lucide-react';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#1e3a34] tracking-tight">
                            {isEditing ? 'Edit Project Details' : 'Enroll New Project'}
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Prime Solutions ERP Project Master</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={onSave} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Core Info */}
                        <div className="space-y-5 lg:col-span-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-black text-xs">01</div>
                                <h3 className="text-sm font-black text-[#1e3a34] uppercase tracking-widest">Project Identity</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Full Title <span className="text-red-500">*</span></label>
                                    <input required name="name" value={formData.name || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300" placeholder="Enter formal project name..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select required name="category" value={formData.category || 'Civil'} onChange={onInputChange} className="w-full pl-5 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 appearance-none">
                                            {Object.keys(categoryColors).map(cat => <option key={cat}>{cat}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stakeholders */}
                        <div className="space-y-5 lg:col-span-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">02</div>
                                <h3 className="text-sm font-black text-[#1e3a34] uppercase tracking-widest">Stakeholders & Locations</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Authority <span className="text-red-500">*</span></label>
                                    <input required name="client" value={formData.client || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" placeholder="Organisation or Client Name" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Address / Location <span className="text-red-500">*</span></label>
                                    <input required name="site" value={formData.site || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" placeholder="City, State" />
                                </div>
                            </div>
                        </div>

                        {/* Financials & Dates */}
                        <div className="space-y-5 lg:col-span-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs">03</div>
                                <h3 className="text-sm font-black text-[#1e3a34] uppercase tracking-widest">Planning & Financials</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Contract (₹) <span className="text-red-500">*</span></label>
                                    <input required type="number" name="contractValue" value={formData.contractValue || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" placeholder="4250000" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Advance Rec. (₹)</label>
                                    <input type="number" name="advance" value={formData.advance || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" placeholder="850000" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                    <input required type="date" name="startDate" value={formData.startDate || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Timeline Deadline</label>
                                    <input required type="date" name="endDate" value={formData.endDate || ''} onChange={onInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800" />
                                </div>
                            </div>
                        </div>

                        {/* Status Toggle (Edit only) */}
                        {isEditing && (
                            <div className="space-y-5 lg:col-span-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs">04</div>
                                    <h3 className="text-sm font-black text-[#1e3a34] uppercase tracking-widest">Operational Status</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Status</label>
                                        <div className="relative">
                                            <select name="status" value={formData.status || 'Active'} onChange={onInputChange} className="w-full pl-5 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 appearance-none">
                                                {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Execution Progress ({formData.progress || 0}%)</label>
                                        <input type="range" min="0" max="100" name="progress" value={formData.progress || 0} onChange={onInputChange} className="w-full h-11 accent-green-600 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-10 border-t border-slate-50 flex justify-end gap-4 sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl border border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all">
                            Discard
                        </button>
                        <button type="submit" className="px-10 py-4 rounded-2xl bg-[#2f6645] text-white font-black shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                            {isEditing ? 'Sync Project Data' : 'Submit for Approval'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
