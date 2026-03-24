import { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, FolderKanban, Users,
    Package, AlertTriangle, CheckCircle, Clock, Activity,
    ArrowUpRight, ArrowDownRight, Building2, BarChart3, RefreshCw
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Skeleton from '../components/common/Skeleton';

const revenueData = [
    { month: 'Sep', revenue: 18.2, expense: 12.1, profit: 6.1 },
    { month: 'Oct', revenue: 22.5, expense: 15.3, profit: 7.2 },
    { month: 'Nov', revenue: 19.8, expense: 13.7, profit: 6.1 },
    { month: 'Dec', revenue: 28.4, expense: 18.9, profit: 9.5 },
    { month: 'Jan', revenue: 24.1, expense: 16.2, profit: 7.9 },
    { month: 'Feb', revenue: 31.6, expense: 20.4, profit: 11.2 },
    { month: 'Mar', revenue: 35.2, expense: 22.8, profit: 12.4 },
];

const projectData = [
    { name: 'Civil', value: 35, fill: '#16a34a' },
    { name: 'Electrical', value: 28, fill: '#22c55e' },
    { name: 'HVAC', value: 15, fill: '#4ade80' },
    { name: 'Solar', value: 12, fill: '#86efac' },
    { name: 'Interior', value: 6, fill: '#bbf7d0' },
    { name: 'Security', value: 4, fill: '#14532d' },
];

const projectStatus = [
    { name: 'SWPL-BRGF Phase 1', client: 'Bihar Rural Dev', value: '₹42.5L', progress: 78, status: 'active', type: 'Electrical' },
    { name: 'Patna Metro Section B', client: 'PMRCL', value: '₹1.2Cr', progress: 45, status: 'active', type: 'Civil' },
    { name: 'Solar Farm Muzaffarpur', client: 'Bihar Energy', value: '₹85.0L', progress: 92, status: 'completed', type: 'Solar' },
    { name: 'HVAC Gaya Complex', client: 'Gaya Municipal', value: '₹28.0L', progress: 30, status: 'onhold', type: 'HVAC' },
    { name: 'Interior Corp Office', client: 'TechCorp India', value: '₹15.5L', progress: 60, status: 'active', type: 'Interior' },
];

const alerts = [
    { type: 'error', message: 'Material critical variance >5% on Bill Code 60 (PSC Cable 3X185)', time: '15m ago' },
    { type: 'warning', message: 'PO #PO-2026-047 pending approval for ₹2.3L (exceeds threshold)', time: '1h ago' },
    { type: 'warning', message: 'GST GSTR-3B filing due in 3 days', time: '2h ago' },
    { type: 'info', message: 'RA-05 bill ₹18.4L submitted by JANKI ENTERPRISES', time: '3h ago' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xl text-xs">
                <p className="text-slate-600 mb-2 font-medium">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-700">{p.name}: <span className="text-slate-900 font-bold">₹{p.value}L</span></span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const statusConfig = {
    active: { label: 'Active', className: 'badge-green' },
    completed: { label: 'Completed', className: 'badge-blue' },
    onhold: { label: 'On Hold', className: 'badge-yellow' },
};

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    const stats = [
        {
            label: 'Total Revenue (FY)',
            value: '₹4.82 Cr',
            change: '+18.4%',
            positive: true,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100',
            border: 'border-green-200',
        },
        {
            label: 'Active Projects',
            value: '12',
            change: '+3 this month',
            positive: true,
            icon: FolderKanban,
            color: 'text-[#1e3a34]',
            bg: 'bg-[#9ae66e]/30',
            border: 'border-[#9ae66e]',
        },
        {
            label: 'Total Employees',
            value: '148',
            change: '+7 this month',
            positive: true,
            icon: Users,
            color: 'text-green-700',
            bg: 'bg-green-50',
            border: 'border-green-100',
        },
        {
            label: 'Outstanding Receivable',
            value: '₹68.4L',
            change: '-5.2% vs last month',
            positive: false,
            icon: TrendingDown,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in relative z-10">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-emerald-400 border border-green-300 p-8 shadow-lg shadow-green-900/10 group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:bg-white/30 transition-all duration-500" />
                <div className="relative flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Good Morning, Admin 👋</h2>
                        <p className="text-green-50 text-sm font-medium">Here's what's happening at Morlatis today — Friday, 6 March 2026</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-green-100 text-xs font-semibold uppercase tracking-wider">FY 2025-26</p>
                            <p className="text-white font-bold text-xl">Q4 Active</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-105 transition-transform duration-300">
                            <Activity className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className={`card p-6 border ${stat.border} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group bg-white`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                {isLoading ? (
                                    <Skeleton variant="badge" className="h-5 w-16" />
                                ) : (
                                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.positive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                        {stat.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            {isLoading ? (
                                <Skeleton variant="text" className="h-10 w-24 mb-1" />
                            ) : (
                                <p className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</p>
                            )}
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 card p-6 bg-white shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="section-title text-xl text-slate-900 font-bold">Revenue & Profitability</h3>
                            <p className="text-slate-500 text-sm mt-1">Last 7 months trend</p>
                        </div>
                        <button className="btn-secondary text-xs py-2 px-4 bg-slate-50 hover:bg-slate-100 border-slate-200">
                            <RefreshCw className="w-4 h-4" /> <span className="font-semibold">Refresh</span>
                        </button>
                    </div>
                    <div className="h-[260px] w-full">
                        {isLoading ? (
                            <Skeleton className="w-full h-full rounded-xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={3} dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#16a34a" fill="url(#profGrad)" strokeWidth={3} dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Project Distribution */}
                <div className="card p-6 bg-white shadow-sm border border-slate-100 flex flex-col items-center">
                    <h3 className="section-title text-xl text-slate-900 font-bold mb-1 w-full text-left">Projects by Type</h3>
                    <p className="text-slate-500 text-sm mb-6 w-full text-left">Category distribution</p>
                    <div className="flex-1 w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={projectData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                    dataKey="value" paddingAngle={5} stroke="none">
                                    {projectData.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} cornerRadius={4} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                    ))}
                                </Pie>
                                <Tooltip content={({ active, payload }) => {
                                    if (active && payload?.length) {
                                        return (
                                            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
                                                <p className="text-slate-900 font-bold text-sm mb-1">{payload[0].name}</p>
                                                <p className="text-green-600 font-semibold">{payload[0].value}% of total</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text manually */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-slate-900">100%</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full mt-4">
                        {projectData.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 group cursor-pointer">
                                <span className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" style={{ background: d.fill }} />
                                <span className="text-slate-600 text-xs font-medium group-hover:text-slate-900 transition-colors">{d.name}</span>
                                <span className="text-slate-900 text-xs font-bold ml-auto">{d.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Active Projects */}
                <div className="card overflow-hidden bg-white shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="section-title text-xl text-slate-900 font-bold">Active Projects</h3>
                        <button className="btn-secondary text-xs py-1.5 px-4 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold shadow-sm">View All</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {projectStatus.map((p, i) => (
                            <div key={i} className="px-6 py-4 hover:bg-green-50/30 transition-colors group">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-slate-900 text-[15px] font-bold group-hover:text-green-700 transition-colors">{p.name}</p>
                                        <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wide">{p.client} <span className="px-1.5">•</span> {p.type}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`badge ${statusConfig[p.status].className}`}>{statusConfig[p.status].label}</span>
                                        <span className="text-slate-900 font-bold text-sm">{p.value}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-green-500 relative"
                                            style={{ width: `${p.progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
                                        </div>
                                    </div>
                                    <span className="text-slate-600 text-xs font-bold w-9 text-right">{p.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="card overflow-hidden bg-white shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="section-title text-xl text-slate-900 font-bold">System Alerts</h3>
                        <span className="badge bg-red-100 text-red-700 border border-red-200 font-bold px-3 py-1">{alerts.filter(a => a.type === 'error').length} Critical</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {alerts.map((alert, i) => {
                            const colors = {
                                error: { bg: 'bg-red-50 hover:bg-red-100/50', border: 'border-l-red-500', icon: 'text-red-500', dot: 'bg-red-500 ring-red-200' },
                                warning: { bg: 'bg-yellow-50 hover:bg-yellow-100/50', border: 'border-l-yellow-400', icon: 'text-yellow-600', dot: 'bg-yellow-400 ring-yellow-200' },
                                info: { bg: 'bg-blue-50 hover:bg-blue-100/50', border: 'border-l-blue-500', icon: 'text-blue-500', dot: 'bg-blue-500 ring-blue-200' },
                            };
                            const c = colors[alert.type];
                            return (
                                <div key={i} className={`px-6 py-4 border-l-4 ${c.border} ${c.bg} flex items-start gap-4 transition-colors cursor-pointer`}>
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot} ring-4`} />
                                    <div className="flex-1">
                                        <p className="text-slate-800 text-sm font-semibold leading-snug">{alert.message}</p>
                                        <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
                                            <Clock className="w-3.5 h-3.5" /> {alert.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-center">
                        <button className="text-green-600 text-sm font-bold hover:text-green-700 hover:underline transition-all">View all alerts →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
