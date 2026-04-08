import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { leaveAPI } from '../../api/leave';
import toast from 'react-hot-toast';
import { Loader2, Plus, Calendar as CalendarIcon, AlignLeft, Clock, ChevronDown } from 'lucide-react';

export default function ApplyLeave() {
    const { userProfile } = useApp();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        type: 'casual',
        title: '',
        reason: '',
        days: 1,
        from: '',
        to: ''
    });

    const handleApply = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Include userId just in case backend expects it, but the requested payload is just type, title, reason, days, from, to
            const payload = {
                userId: userProfile?.id || userProfile?.userId || 1, // Fallback userId
                type: formData.type,
                title: formData.title,
                reason: formData.reason,
                days: Number(formData.days),
                from: formData.from,
                to: formData.to
            };

            await leaveAPI.createLeave(payload);
            toast.success('Leave applied successfully!');

            // Reset form
            setFormData({
                type: 'casual',
                title: '',
                reason: '',
                days: 1,
                from: '',
                to: ''
            });
        } catch (error) {
            console.error('Failed to submit leave:', error);
            toast.error(error.response?.data?.message || 'Failed to submit leave request');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative pb-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                <span>HR Management</span>
                <ChevronDown className="w-3 h-3 -rotate-90" />
                <span className="text-[#2f6645] font-bold">Apply Leave</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Apply Leave</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium italic">
                    Submit a new leave request for approval.
                </p>
            </div>

            <form onSubmit={handleApply} className="card p-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#2f6645]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Leave Type */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Leave Type</label>
                        <div className="relative group/select">
                            <select
                                required
                                className="input h-14 bg-slate-50 border-slate-100 w-full appearance-none pr-10 cursor-pointer"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="casual">Casual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="annual">Annual Leave</option>
                                <option value="company">Company Leave</option>
                                <option value="other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Reason Title</label>
                        <input
                            required
                            type="text"
                            className="input h-14 bg-slate-50 border-slate-100 w-full"
                            placeholder="e.g. Fever, Personal Work..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Dates */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">From Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="date"
                                className="input pl-11 h-14 bg-slate-50 border-slate-100 w-full"
                                value={formData.from}
                                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">To Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="date"
                                className="input pl-11 h-14 bg-slate-50 border-slate-100 w-full"
                                value={formData.to}
                                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Number of Days */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Total Days</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                required
                                type="number"
                                min="0.5"
                                step="0.5"
                                className="input pl-11 h-14 bg-slate-50 border-slate-100 w-full md:w-1/2"
                                placeholder="e.g. 5"
                                value={formData.days}
                                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Detailed Reason */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Detailed Reason</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                            <textarea
                                required
                                className="input pl-11 py-4 bg-slate-50 border-slate-100 w-full min-h-[120px] resize-none"
                                placeholder="Explain the reason for your leave..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex border-t border-slate-100 pt-8">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="h-14 px-8 bg-[#2f6645] text-white rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl transition-all hover:bg-[#1e3a34] active:scale-95 ml-auto"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Submit Leave Request
                    </button>
                </div>
            </form>
        </div>
    );
}
