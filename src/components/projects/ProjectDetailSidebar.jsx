import { X, MapPin, Building2, User } from 'lucide-react';
import { useState } from 'react';

export default function ProjectDetailSidebar({ isOpen, project, onClose, onEdit, onOpenGantt }) {
    const [daysCardColor, setDaysCardColor] = useState('bg-white'); // Color toggle for Days Remaining

    if (!isOpen || !project) return null;

    return (
        <>
            <div className="fixed inset-0 z-[110] bg-slate-900/10 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-[120] animate-slide-in-right flex flex-col border-l border-slate-100">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-widest">{project.id}</span>
                        <h2 className="text-xl font-black text-slate-900 mt-2 tracking-tight leading-tight">{project.name}</h2>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                    {/* Detailed Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card p-5 bg-gradient-to-br from-green-600 to-[#2f6645] text-white border-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Progress Status</p>
                            <h3 className="text-3xl font-black mt-1 tracking-tighter">{project.progress}%</h3>
                            <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: `${project.progress}%` }} />
                            </div>
                        </div>
                        <div 
                            onClick={() => setDaysCardColor(prev => prev === 'bg-white' ? 'bg-green-50 border-green-200' : 'bg-white')}
                            className={`card p-5 border-2 transition-all cursor-pointer ${daysCardColor === 'bg-white' ? 'border-slate-50' : daysCardColor}`}
                        >
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Days Remaining</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">128</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">On Track for June 2026</p>
                        </div>
                    </div>

                    {/* Info Groups */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Details</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><MapPin className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">{project.site}</p>
                                    <p className="text-slate-400 text-xs font-medium">Secondary Operational Base</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><Building2 className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">{project.client}</p>
                                    <p className="text-slate-400 text-xs font-medium">Prime Stakeholder</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><User className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">{project.manager || 'No Manager Assigned'}</p>
                                    <p className="text-slate-400 text-xs font-medium">Lead Project Manager (Operations)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Commercial Assessment</h4>
                        <div className="card p-6 border-slate-100 bg-slate-50/20">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-500 font-bold text-xs uppercase">Contract Invoicing</span>
                                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-medium">Total Project Value</span>
                                    <span className="text-slate-900 font-black">₹{(project.contractValue).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-medium">Advance Received</span>
                                    <span className="text-green-600 font-black">₹{(project.advance).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-4 border-t border-dashed border-slate-200">
                                    <span className="text-slate-500 font-black uppercase text-xs">Unbilled Amount</span>
                                    <span className="text-slate-900 font-black">₹{(project.contractValue - project.advance).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-50 grid grid-cols-2 gap-4 bg-slate-50/20">
                    <button 
                        onClick={(e) => onEdit(e, project)}
                        className="px-6 py-4 bg-white border border-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Edit Project
                    </button>
                    <button onClick={onOpenGantt} className="px-6 py-4 bg-[#2f6645] text-white font-black rounded-2xl shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Open Gantt Chart
                    </button>
                </div>
            </div>
        </>
    );
}
