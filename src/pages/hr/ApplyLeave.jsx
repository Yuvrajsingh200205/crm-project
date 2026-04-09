import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { leaveAPI } from '../../api/leave';
import toast from 'react-hot-toast';
import { Loader2, Plus, Calendar as CalendarIcon, AlignLeft, Clock, ChevronDown, CheckCircle2, XCircle, Timer, Search, X, Filter, FileText } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

export default function ApplyLeave() {
    const { userProfile } = useApp();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [allocations, setAllocations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const [formData, setFormData] = useState({
        type: 'casual',
        title: '',
        reason: '',
        days: 1,
        from: '',
        to: ''
    });

    useEffect(() => {
        fetchData();
    }, [userProfile?.id, userProfile?.userId]);

    useEffect(() => {
        if (formData.from && formData.to) {
            const start = new Date(formData.from);
            const end = new Date(formData.to);
            if (!isNaN(start) && !isNaN(end) && end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setFormData(prev => ({ ...prev, days: diffDays }));
            }
        }
    }, [formData.from, formData.to]);

    const fetchData = async () => {
        const id = userProfile?.id || userProfile?.userId || userProfile?._id;
        if (!id) return;

        setIsLoading(true);
        try {
            const allocRes = await leaveAPI.getUserLeaveAllocations(id);
            let backendAllocations = allocRes?.leaveAllocation || allocRes?.leaveAllocations || allocRes?.allocations || allocRes?.data || allocRes?.items || allocRes;
            if (!Array.isArray(backendAllocations)) {
                if (backendAllocations && (backendAllocations.casual !== undefined || backendAllocations.sick !== undefined)) {
                    backendAllocations = [backendAllocations];
                } else {
                    backendAllocations = Object.values(allocRes || {}).find(Array.isArray) || [];
                }
            }
            setAllocations(backendAllocations);

            const reqRes = await leaveAPI.getEmployeeLeave(id);
            const backendRequests = reqRes?.leaves || reqRes?.data?.leaves || (Array.isArray(reqRes) ? reqRes : (reqRes?.data || []));
            setRequests(Array.isArray(backendRequests) ? backendRequests : []);
        } catch (error) {
            console.error('Error fetching leave details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                userId: userProfile?.id || userProfile?.userId || 1,
                type: formData.type,
                title: formData.title,
                reason: formData.reason,
                days: Number(formData.days),
                from: formData.from,
                to: formData.to
            };

            await leaveAPI.createLeave(payload);
            toast.success('Leave applied successfully!');
            fetchData();
            setShowApplyModal(false);
            setFormData({ type: 'casual', title: '', reason: '', days: 1, from: '', to: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit leave request');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredRequests = (Array.isArray(requests) ? requests : []).filter(req => {
        const matchesSearch = (req.title || '').toLowerCase().includes(search.toLowerCase()) || 
                             (req.type || '').toLowerCase().includes(search.toLowerCase());
        const status = (req.status || 'pending').toLowerCase();
        if (activeTab === 'All') return matchesSearch;
        return matchesSearch && status === activeTab.toLowerCase();
    });

    const totalAlloc = (Array.isArray(allocations) ? allocations : []).reduce((acc, a) => {
        acc.casual = (acc.casual || 0) + Number(a.casual || 0);
        acc.sick = (acc.sick || 0) + Number(a.sick || 0);
        acc.annual = (acc.annual || 0) + Number(a.annual || 0);
        acc.company = (acc.company || 0) + Number(a.company || 0);
        acc.other = (acc.other || 0) + Number(a.other || 0);
        return acc;
    }, { casual: 0, sick: 0, annual: 0, company: 0, other: 0 });

    const usedCount = requests
        .filter(r => r.status?.toLowerCase() === 'approved')
        .reduce((acc, r) => {
            const t = r.type?.toLowerCase() || 'casual';
            acc[t] = (acc[t] || 0) + Number(r.days || 0);
            acc.total = (acc.total || 0) + Number(r.days || 0);
            return acc;
        }, { total: 0 });

    const stats = [
        { label: 'Casual Balance', value: `${(totalAlloc.casual || 0) - (usedCount.casual || 0)}`, sub: `/ ${totalAlloc.casual || 0} Total`, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Sick Balance', value: `${(totalAlloc.sick || 0) - (usedCount.sick || 0)}`, sub: `/ ${totalAlloc.sick || 0} Total`, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Annual Balance', value: `${(totalAlloc.annual || 0) - (usedCount.annual || 0)}`, sub: `/ ${totalAlloc.annual || 0} Total`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Leaves Used', value: `${usedCount.total || 0}`, sub: 'Days total', color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const statusBadge = {
        'approved': 'bg-emerald-100 text-emerald-700',
        'pending': 'bg-amber-100 text-amber-700',
        'rejected': 'bg-red-100 text-red-700',
    };

    return (
        <div className="space-y-5 animate-fade-in relative pb-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                <span>HR Management</span>
                <ChevronDown className="w-3 h-3 -rotate-90" />
                <span className="text-[#2f6645] font-bold">Apply Leave</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Apply Leave</h1>
                    <p className="text-slate-600 text-[13px] mt-1 font-medium italic opacity-80">
                        View your leave status and submit new requests
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-[#2f6645] text-white shadow-lg">
                            <FileText className="w-4 h-4" /> Reports
                        </button>
                        <button 
                            onClick={() => setShowApplyModal(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white/50 transition-all font-bold"
                        >
                            <Plus className="w-4 h-4" /> Request Leave
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" className="h-24 rounded-3xl" />)
                ) : (
                    stats.map((s, i) => (
                        <div key={i} className={`card p-5 hover:shadow-xl transition-all border-none ${s.bg} rounded-3xl relative overflow-hidden group`}>
                            <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/20 rounded-full blur-2xl group-hover:blur-xl transition-all" />
                            <div className="flex items-baseline gap-1">
                                <p className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.value}</p>
                                {s.sub && <span className={`text-[10px] font-bold ${s.color} opacity-60 uppercase tracking-wider`}>{s.sub}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <p className={`text-[10px] font-black uppercase tracking-widest opacity-70 ${s.color}`}>{s.label}</p>
                                {Number(s.value) < 0 && <span className="text-[7px] bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-black animate-pulse">OVERDRAWN</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Table Container */}
            <div className="card overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-white rounded-2xl">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`px-4 py-2 rounded-xl text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-[#2f6645] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Search records..." className="input pl-9 h-11 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Leave Type', 'Duration', 'Reason', 'Applied On', 'Status'].map(h => (                                    
                                    <th key={h} className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4 text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i}><td colSpan="5" className="p-6"><Skeleton variant="text" /></td></tr>
                                ))
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan="5" className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No leave records found.</td></tr>
                            ) : filteredRequests.map(req => {
                                const appliedDate = req.createdAt
                                    ? new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                    : 'N/A';
                                const statusStr = req.status ? req.status.toLowerCase() : 'pending';

                                return (
                                    <tr key={req.id || Math.random()} className="hover:bg-emerald-50/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">{req.type || 'Casual'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600">
                                            {req.days || 1} {Number(req.days) === 1 ? 'Day' : 'Days'}
                                            {req.from && (
                                                <span className="ml-1 opacity-60 text-[9px] font-medium block mt-0.5">
                                                    {new Date(req.from).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
                                                    {req.to && ` - ${new Date(req.to).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-700 font-bold truncate max-w-[200px]">{req.title || 'Leave Request'}</p>
                                            <p className="text-slate-500 text-[10px] font-medium italic opacity-70 truncate max-w-[200px]">"{req.reason || 'No reason'}"</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase">{appliedDate}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusBadge[statusStr] || 'bg-amber-100 text-amber-700'}`}>
                                                {statusStr}
                                            </span>
                                            {req.rejectionReason && (
                                                <div className="group relative">
                                                    <XCircle className="w-4 h-4 text-red-400 cursor-help" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                        <p className="font-bold underline mb-1">Rejection Reason:</p>
                                                        {req.rejectionReason}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowApplyModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Request Time-Off</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Fill in your application details</p>
                            </div>
                            <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleApply} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Leave Category</label>
                                    <div className="relative group/select">
                                        <select
                                            required
                                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none focus:border-[#2f6645] transition-all appearance-none pr-10"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="casual">Casual Leave</option>
                                            <option value="sick">Sick Leave</option>
                                            <option value="annual">Annual Leave</option>
                                            <option value="company">Company Holiday</option>
                                            <option value="other">Other Reason</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:rotate-180 transition-transform" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Reason Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none focus:border-[#2f6645] transition-all"
                                        placeholder="e.g. Health Checkup"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">From Date</label>                                    
                                    <input
                                        required
                                        type="date"
                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none focus:border-[#2f6645] transition-all"
                                        value={formData.from}
                                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">To Date</label>                                    
                                    <input
                                        required
                                        type="date"
                                        min={formData.from}
                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none focus:border-[#2f6645] transition-all"
                                        value={formData.to}
                                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Total Days</label>                                    
                                    <input
                                        required
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none focus:border-[#2f6645] transition-all"
                                        value={formData.days}
                                        onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    <div className="p-2 bg-blue-50/50 rounded-xl w-full border border-blue-100 flex items-center gap-2">
                                        <Timer className="w-4 h-4 text-blue-500" />
                                        <p className="text-[9px] font-bold text-blue-700 leading-tight uppercase tracking-tight">Deducted from balance</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Detailed Reason</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#2f6645] transition-all resize-none"
                                    placeholder="Briefly explain the urgency..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full h-12 bg-[#2f6645] text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-[#1e3a34] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
