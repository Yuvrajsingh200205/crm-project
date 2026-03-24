import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Search, Plus, Flag, Calendar, CheckCircle2, Edit2, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastUtils';

import ProgressStats from '../../components/progress/ProgressStats';
import ProgressUpdateModal from '../../components/progress/ProgressUpdateModal';
import ProgressCharts from '../../components/progress/ProgressCharts';

export default function ProgressTracking() {
    const { progressTasks, setProgressTasks, sites, projects, updateProgressTask } = useApp();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const categories = ['All', 'Civil', 'Electrical', 'Solar', 'HVAC', 'Interior'];

    const filteredTasks = useMemo(() => progressTasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }), [progressTasks, search, selectedCategory]);

    const stats = useMemo(() => {
        if (!progressTasks.length) return { avg: 0, achieved: 0, delays: 0, upcoming: 0 };
        const avgCompletion = Math.round(progressTasks.reduce((sum, t) => sum + (Number(t.progress) || 0), 0) / progressTasks.length);
        const achieved = progressTasks.filter(t => t.status === 'Completed').length;
        const delays = progressTasks.filter(t => t.status === 'Delayed').length;
        const today = new Date();
        const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
        const upcoming = progressTasks.filter(t => { const end = new Date(t.endDate); return end > today && end <= in15Days && t.status !== 'Completed'; }).length;
        return { avg: avgCompletion, achieved, delays, upcoming };
    }, [progressTasks]);

    const handleAddTask = () => { setIsEditing(false); setFormData({ status: 'Active', priority: 'Medium', progress: 0, category: 'Civil', startDate: new Date().toISOString().split('T')[0] }); setIsModalOpen(true); };
    const handleEditTask = (task) => { setIsEditing(true); setFormData({ ...task }); setIsModalOpen(true); };
    const handleDeleteTask = (id) => {
        confirmToast('Remove this milestone?', () => {
            setProgressTasks(prev => prev.filter(t => t.id !== id));
            toast.success('Milestone removed');
        });
    };
    const handleSave = (e) => {
        e.preventDefault();
        const taskData = { ...formData, id: isEditing ? formData.id : `TASK-${String(progressTasks.length + 101).padStart(3, '0')}`, progress: Number(formData.progress), projectId: sites.find(s => s.id === formData.siteId)?.projectId || 'PRJ-GENERAL' };
        if (isEditing) { updateProgressTask(taskData); toast.success('Milestone updated'); }
        else { setProgressTasks([taskData, ...progressTasks]); toast.success('Milestone added'); }
        setIsModalOpen(false);
    };
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const priorityBadge = { Critical: 'badge-red', High: 'badge-yellow', Medium: 'badge-blue', Low: 'badge-gray' };
    const statusBadge = { Completed: 'badge-green', Active: 'badge-blue', 'In Progress': 'badge-blue', Delayed: 'badge-red', 'On Hold': 'badge-yellow' };

    return (
        <div className="space-y-5 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Progress Tracking</h1>
                    <p className="text-slate-500 text-sm mt-1">Track milestones, activity completion and site progress</p>
                </div>
                <button onClick={handleAddTask} className="btn-primary flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Milestone
                </button>
            </div>

            <ProgressStats
                overallCompletion={stats.avg}
                milstonesCount={stats.achieved}
                delayTasks={stats.delays}
                upcomingDue={stats.upcoming}
            />

            <ProgressCharts tasks={progressTasks} />

            {/* Main Table + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Table */}
                <div className="lg:col-span-3 card overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800 text-sm">Milestone Registry</h3>
                            <div className="flex gap-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat ? 'bg-[#2f6645] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="relative w-full sm:w-56">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search milestones..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['Site / Project', 'Activity', 'Progress', 'Priority', 'Actions'].map(h => (
                                        <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map(task => (
                                    <tr key={task.id} className="table-row hover:bg-slate-50 transition-colors">
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-semibold text-slate-500 text-xs flex-shrink-0">
                                                    {task.id.split('-')[1]}
                                                </div>
                                                <div>
                                                    <p className="text-slate-800 font-medium text-sm">{sites.find(s => s.id === task.siteId)?.name || 'Central'}</p>
                                                    <p className="text-slate-400 text-xs">{task.projectId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg flex-shrink-0 ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {task.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                </div>
                                                <div>
                                                    <p className="text-slate-800 font-medium text-sm">{task.title}</p>
                                                    <p className="text-slate-400 text-xs">{task.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell w-36">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500">Progress</span>
                                                    <span className="text-xs font-semibold text-slate-700">{task.progress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`badge ${priorityBadge[task.priority] || 'badge-gray'}`}>{task.priority || 'Normal'}</span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => handleEditTask(task)} className="p-1.5 bg-slate-100 text-slate-500 hover:bg-[#2f6645] hover:text-white rounded-lg transition-all">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTasks.length === 0 && (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-400">No milestones found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="card p-5 bg-[#1e3a34] text-white">
                        <h3 className="font-semibold text-sm mb-4 border-l-2 border-emerald-400 pl-3">Critical Sites</h3>
                        <div className="space-y-4">
                            {sites.slice(0, 3).map((site, i) => (
                                <div key={site.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                                            {site.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-white truncate max-w-[80px]">{site.name}</p>
                                            <p className="text-[10px] text-white/50">{site.location}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold ${i === 1 ? 'text-red-400' : 'text-emerald-400'}`}>{i === 1 ? '82%' : '100%'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-5">
                        <h3 className="font-semibold text-sm text-slate-800 mb-4">Timeline Alerts</h3>
                        <div className="space-y-3">
                            {[
                                { title: 'Ducting Done', status: 'Due Soon', color: 'bg-amber-400' },
                                { title: 'Concrete P11', status: 'Delayed', color: 'bg-red-400' },
                                { title: 'Solar Grid', status: 'Planned', color: 'bg-blue-400' }
                            ].map((alert, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
                                    <div className={`w-1 h-8 rounded-full flex-shrink-0 ${alert.color}`} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                                        <p className="text-xs text-slate-400">{alert.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ProgressUpdateModal
                isOpen={isModalOpen}
                isEditing={isEditing}
                formData={formData}
                sites={sites}
                projects={projects}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onInputChange={handleInputChange}
            />
        </div>
    );
}
