import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Search, Plus, Calendar, Flag, CheckCircle2, MoreVertical, Edit2, Trash2, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import ProgressStats from '../../components/progress/ProgressStats';
import ProgressUpdateModal from '../../components/progress/ProgressUpdateModal';
import ProgressCharts from '../../components/progress/ProgressCharts';

export default function ProgressTracking() {
    const { progressTasks, setProgressTasks, sites, projects, updateProgressTask } = useApp();
    
    // UI State
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const categories = ['All', 'Civil', 'Electrical', 'Solar', 'HVAC', 'Interior'];

    // Filter Logic
    const filteredTasks = useMemo(() => {
        return progressTasks.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                                 t.id.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [progressTasks, search, selectedCategory]);

    // Stats
    const stats = useMemo(() => {
        if (!progressTasks.length) return { avg: 0, achieved: 0, delays: 0, upcoming: 0 };
        
        const avgCompletion = Math.round(progressTasks.reduce((sum, t) => sum + (Number(t.progress) || 0), 0) / progressTasks.length);
        const achieved = progressTasks.filter(t => t.status === 'Completed').length;
        const delays = progressTasks.filter(t => t.status === 'Delayed').length;
        
        const today = new Date();
        const in15Days = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000));
        const upcoming = progressTasks.filter(t => {
            const end = new Date(t.endDate);
            return end > today && end <= in15Days && t.status !== 'Completed';
        }).length;

        return { avg: avgCompletion, achieved, delays, upcoming };
    }, [progressTasks]);

    const handleAddTask = () => {
        setIsEditing(false);
        setFormData({ status: 'Active', priority: 'Medium', progress: 0, category: 'Civil', startDate: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setIsEditing(true);
        setFormData({ ...task });
        setIsModalOpen(true);
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Remove this milestone from tracking?')) {
            setProgressTasks(prev => prev.filter(t => t.id !== id));
            toast.success("Milestone removed from tracking");
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            id: isEditing ? formData.id : `TASK-${String(progressTasks.length + 101).padStart(3, '0')}`,
            progress: Number(formData.progress),
            projectId: sites.find(s => s.id === formData.siteId)?.projectId || 'PRJ-GENERAL',
        };

        if (isEditing) {
            updateProgressTask(taskData);
            toast.success("Milestone progress synchronized");
        } else {
            setProgressTasks([taskData, ...progressTasks]);
            toast.success("Activity enrolled in tracking");
        }
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            {/* Subtle Aesthetic Background with technical dots */}
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-[120px]" />
            <div className="absolute top-1/4 left-0 -z-10 w-72 h-72 bg-blue-500/[0.03] rounded-full blur-[100px]" />

            {/* Compact Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center group hover:-rotate-1 transition-all ring-4 ring-white">
                        <Flag className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md">Operational Intelligence</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1.5">Execution Tracker</h1>
                        <p className="text-slate-400 text-[10px] font-bold flex items-center gap-2 uppercase tracking-tighter">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Sites: {sites.length}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Workforce: 485 Active</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden xl:flex p-1.5 bg-white shadow-lg shadow-slate-200/30 rounded-2xl border border-slate-50 gap-0.5">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                    selectedCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleAddTask}
                        className="px-8 py-3.5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3 text-xs"
                    >
                        <Plus className="w-5 h-5 bg-white/10 rounded-lg p-0.5" /> Commit Progress
                    </button>
                </div>
            </div>

            <ProgressStats 
                overallCompletion={stats.avg}
                milstonesCount={stats.achieved}
                delayTasks={stats.delays}
                upcomingDue={stats.upcoming}
            />

            <ProgressCharts tasks={progressTasks} />

            {/* Refined Activity Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Compact Activity Log */}
                <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-slate-50/10">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800 tracking-tight">Milestone Registry</h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Cross-Functional Ledger</p>
                            </div>
                        </div>
                        <div className="relative group w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search registry..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold text-xs transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30">
                                <tr>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Context</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Activity</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Progress</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Flags</th>
                                    <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right pr-10">Sync</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTasks.map(task => (
                                    <tr key={task.id} className="group hover:bg-slate-50/40 transition-all">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px]">
                                                    {task.id.split('-')[1]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800 mb-0.5">{sites.find(s => s.id === task.siteId)?.name || 'Central'}</p>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{task.projectId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {task.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-xs leading-none mb-1">{task.title}</p>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">{task.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="w-32">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase">{task.progress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                                task.priority === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}>{task.priority || 'Normal'}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => handleEditTask(task)} className="p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteTask(task.id)} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Compact Context Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 rounded-[2rem] p-7 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                        <h3 className="text-sm font-black mb-6 uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Critical Nodes</h3>
                        <div className="space-y-6">
                            {sites.slice(0, 3).map((site, i) => (
                                <div key={site.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-emerald-400 text-sm">
                                            {site.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black truncate max-w-[80px]">{site.name}</p>
                                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{site.location}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black ${i === 1 ? 'text-rose-400' : 'text-emerald-400'}`}>{i === 1 ? '82%' : '100%'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-7 shadow-lg shadow-slate-200/20 border border-slate-50 relative overflow-hidden">
                        <h3 className="text-sm font-black text-slate-800 tracking-tight mb-6">Timeline Hub</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Ducting Done', status: 'Soon', color: 'bg-amber-400' },
                                { title: 'Concrete P11', status: 'Slow', color: 'bg-rose-400' },
                                { title: 'Solar Grid', status: 'Plan', color: 'bg-blue-400' }
                            ].map((alert, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-all">
                                    <div className={`w-1 h-8 rounded-full ${alert.color}`} />
                                    <div>
                                        <p className="text-xs font-black text-slate-800">{alert.title}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">{alert.status}</p>
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
