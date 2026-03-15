import React, { useState, useMemo } from 'react';
import { 
    Activity, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, 
    AlertTriangle, PieChart as PieChartIcon, BarChart3, Briefcase,
    Calendar, Download, Filter, Target, Search, ChevronRight
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';

const PROJECTS = [
    { id: 'PRJ-001', name: 'Patna Metro Section B', category: 'Civil', revenue: 12000000, material: 3200000, labour: 1800000, equipment: 680000, subcont: 2100000, overhead: 850000, progress: 45, status: 'Active' },
    { id: 'PRJ-002', name: 'Solar Farm Muzaffarpur', category: 'Solar', revenue: 8500000, material: 2100000, labour: 980000, equipment: 340000, subcont: 1200000, overhead: 520000, progress: 100, status: 'Completed' },
    { id: 'PRJ-003', name: 'SWPL-BRGF Phase 1', category: 'Electrical', revenue: 4250000, material: 1200000, labour: 650000, equipment: 220000, subcont: 450000, overhead: 310000, progress: 78, status: 'Active' },
];

export default function JobCosting() {
    const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
    const selected = PROJECTS.find(p => p.id === selectedId);

    const metrics = useMemo(() => {
        const directCost = selected.material + selected.labour + selected.equipment + selected.subcont;
        const totalCost = directCost + selected.overhead;
        const grossProfit = selected.revenue - directCost;
        const netProfit = selected.revenue - totalCost;
        return {
            directCost, totalCost, grossProfit, netProfit,
            grossMargin: ((grossProfit / selected.revenue) * 100).toFixed(1),
            netMargin: ((netProfit / selected.revenue) * 100).toFixed(1)
        };
    }, [selected]);

    const chartData = [
        { name: 'Material', value: selected.material },
        { name: 'Labour', value: selected.labour },
        { name: 'Equipment', value: selected.equipment },
        { name: 'Sub-Cont.', value: selected.subcont },
        { name: 'Overhead', value: selected.overhead },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header with Project Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:scale-105 transition-all">
                        <Activity className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {PROJECTS.map(p => (
                                <button 
                                    key={p.id}
                                    onClick={() => setSelectedId(p.id)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                        selectedId === p.id ? 'bg-emerald-950 text-white shadow-lg' : 'bg-white text-slate-400 hover:text-slate-800 border border-slate-100'
                                    }`}
                                >
                                    {p.id}
                                </button>
                            ))}
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{selected.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Download className="w-5 h-5" /> Export P&L Statement
                    </button>
                </div>
            </div>

            {/* Financial Status Bento */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-emerald-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-white/10 rounded-2xl border border-white/5">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60">Profitability Index</span>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-5xl font-black tracking-tighter tabular-nums mb-1">₹{(metrics.netProfit / 100000).toFixed(2)}L</h4>
                                <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest">Net Project Margin ({metrics.netMargin}%)</p>
                            </div>
                            <div className="pt-2">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                        <span>Budget Utilization</span>
                                        <span>{selected.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${selected.progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {[
                    { label: 'Revenue Earned', value: `₹${(selected.revenue / 100000).toFixed(1)} L`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5.2%' },
                    { label: 'Total Direct Cost', value: `₹${(metrics.directCost / 100000).toFixed(1)} L`, icon: DollarSign, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Within Budget' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300">Live</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter tabular-nums mb-1">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="mt-4 flex items-center gap-1.5">
                            <ArrowUpRight className="w-3.4 h-3.4 text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-600 tracking-tight">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cost Distribution Chart */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/20 border border-slate-50 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Financial Anatomy</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Categorized Cost Loading</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} tickFormatter={(v) => `₹${v/100000}L`} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc', radius: 8}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#0f172a', padding: '12px' }}
                                    itemStyle={{ color: '#10b981', fontSize: '11px', fontWeight: '900' }}
                                    formatter={(v) => [`₹${v.toLocaleString()}`, 'Cost']}
                                />
                                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={index % 2 === 0 ? '#1e3a34' : '#10b981'} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPI Breakdown */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-900/20 text-white group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                        <h3 className="text-sm font-black mb-8 uppercase tracking-[0.2em] border-l-2 border-emerald-500 pl-4">Operating Margins</h3>
                        <div className="space-y-8">
                            {[
                                { label: 'Gross Profit', value: metrics.grossMargin + '%', sub: `₹${(metrics.grossProfit/100000).toFixed(1)}L`, color: 'text-emerald-400' },
                                { label: 'Direct Cost Index', value: ((metrics.directCost/selected.revenue)*100).toFixed(1) + '%', sub: 'Target < 75%', color: 'text-blue-400' },
                                { label: 'Indirect Overhead', value: ((selected.overhead/selected.revenue)*100).toFixed(1) + '%', sub: 'Calculated Monthly', color: 'text-amber-400' },
                            ].map((kpi, i) => (
                                <div key={i} className="flex items-center justify-between group/kpi">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{kpi.label}</p>
                                        <p className="text-xs font-black text-slate-300 group-hover/kpi:text-white transition-colors">{kpi.sub}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-2xl font-black tracking-tighter ${kpi.color}`}>{kpi.value}</p>
                                        <ArrowUpRight className="w-4 h-4 ml-auto text-slate-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/20 border border-slate-100">
                        <h3 className="text-sm font-black text-slate-800 tracking-[0.1em] mb-6 uppercase">Risk Assessment</h3>
                        <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <AlertTriangle className="w-6 h-6 text-rose-500" />
                            <div>
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Variation Orders</p>
                                <p className="text-xs font-bold text-rose-900">Unapproved work costing ₹2.4L detected.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
