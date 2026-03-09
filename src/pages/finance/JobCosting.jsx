import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const projects = [
    {
        name: 'SWPL-BRGF Phase 1', code: 'PRJ-001', category: 'Electrical',
        revenue: 4250000, variationOrders: 150000,
        materialCost: 800000, labourCost: 450000, subcontractorCost: 500000, equipmentCost: 120000,
        adminOverhead: 80000, officeExpenses: 40000, depreciation: 25000,
        progress: 78,
    },
    {
        name: 'Patna Metro Section B', code: 'PRJ-002', category: 'Civil',
        revenue: 12000000, variationOrders: 450000,
        materialCost: 3200000, labourCost: 1800000, subcontractorCost: 2100000, equipmentCost: 680000,
        adminOverhead: 240000, officeExpenses: 120000, depreciation: 85000,
        progress: 45,
    },
    {
        name: 'Solar Farm Muzaffarpur', code: 'PRJ-003', category: 'Solar',
        revenue: 8500000, variationOrders: 0,
        materialCost: 2100000, labourCost: 980000, subcontractorCost: 1200000, equipmentCost: 340000,
        adminOverhead: 170000, officeExpenses: 85000, depreciation: 60000,
        progress: 100,
    },
    {
        name: 'Interior TechCorp HQ', code: 'PRJ-005', category: 'Interior',
        revenue: 1550000, variationOrders: 75000,
        materialCost: 380000, labourCost: 220000, subcontractorCost: 180000, equipmentCost: 45000,
        adminOverhead: 31000, officeExpenses: 15500, depreciation: 10000,
        progress: 60,
    },
];

function calc(p) {
    const totalRevenue = p.revenue + p.variationOrders;
    const directCost = p.materialCost + p.labourCost + p.subcontractorCost + p.equipmentCost;
    const grossProfit = totalRevenue - directCost;
    const indirectCost = p.adminOverhead + p.officeExpenses + p.depreciation;
    const netProfit = grossProfit - indirectCost;
    return {
        totalRevenue, directCost, grossProfit, indirectCost, netProfit,
        grossMargin: ((grossProfit / totalRevenue) * 100).toFixed(1),
        netMargin: ((netProfit / totalRevenue) * 100).toFixed(1),
    };
}

export default function JobCosting() {
    const [selected, setSelected] = useState(projects[0]);
    const c = calc(selected);

    const chartData = [
        { name: 'Material', value: selected.materialCost, fill: '#3b82f6' },
        { name: 'Labour', value: selected.labourCost, fill: '#a855f7' },
        { name: 'Sub-Cont.', value: selected.subcontractorCost, fill: '#f97316' },
        { name: 'Equipment', value: selected.equipmentCost, fill: '#06b6d4' },
        { name: 'Admin', value: selected.adminOverhead, fill: '#eab308' },
        { name: 'Other', value: selected.officeExpenses + selected.depreciation, fill: '#22c55e' },
    ];

    const fmt = (v) => `₹${(v / 100000).toFixed(2)}L`;

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Project selector */}
            <div className="flex flex-wrap gap-2">
                {projects.map(p => (
                    <button key={p.code}
                        onClick={() => setSelected(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selected.code === p.code ? 'bg-brand border-brand/50 text-slate-900' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900'
                            }`}>
                        {p.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* P&L Statement */}
                <div className="xl:col-span-2 card overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div>
                            <h3 className="section-title">{selected.name}</h3>
                            <p className="text-slate-400 text-sm mt-0.5">{selected.code} · {selected.category} · Progress: {selected.progress}%</p>
                        </div>
                        <button className="btn-secondary text-xs">Export PDF</button>
                    </div>
                    <div className="p-5">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left text-slate-400 text-xs uppercase tracking-wider pb-3">Particulars</th>
                                    <th className="text-right text-slate-400 text-xs uppercase tracking-wider pb-3">Amount</th>
                                    <th className="text-right text-slate-400 text-xs uppercase tracking-wider pb-3">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border/50">
                                <tr className="py-2">
                                    <td colSpan={3} className="pt-4 pb-1 text-xs font-bold text-blue-400 uppercase tracking-wider">Revenue</td>
                                </tr>
                                <tr><td className="py-2 text-slate-700 pl-4">Contract Revenue</td><td className="py-2 text-right text-slate-900 font-medium">{fmt(selected.revenue)}</td><td className="py-2 text-right text-slate-400 text-xs">{((selected.revenue / c.totalRevenue) * 100).toFixed(1)}%</td></tr>
                                <tr><td className="py-2 text-slate-700 pl-4">Variation Orders</td><td className="py-2 text-right text-slate-900 font-medium">{fmt(selected.variationOrders)}</td><td className="py-2 text-right text-slate-400 text-xs">{selected.variationOrders > 0 ? ((selected.variationOrders / c.totalRevenue) * 100).toFixed(1) : '—'}%</td></tr>
                                <tr className="bg-blue-500/5">
                                    <td className="py-2.5 text-slate-900 font-bold pl-2">Total Revenue</td>
                                    <td className="py-2.5 text-right text-blue-400 font-bold">{fmt(c.totalRevenue)}</td>
                                    <td className="py-2.5 text-right text-blue-400 font-bold text-xs">100%</td>
                                </tr>

                                <tr><td colSpan={3} className="pt-4 pb-1 text-xs font-bold text-red-400 uppercase tracking-wider">Direct Costs</td></tr>
                                {[
                                    ['Material Cost', selected.materialCost],
                                    ['Labour Cost', selected.labourCost],
                                    ['Subcontractor Cost', selected.subcontractorCost],
                                    ['Equipment Hire', selected.equipmentCost],
                                ].map(([label, val], i) => (
                                    <tr key={i}><td className="py-2 text-slate-700 pl-4">{label}</td><td className="py-2 text-right text-red-400">{fmt(val)}</td><td className="py-2 text-right text-slate-400 text-xs">{((val / c.totalRevenue) * 100).toFixed(1)}%</td></tr>
                                ))}
                                <tr className="bg-red-500/5">
                                    <td className="py-2.5 text-slate-900 font-bold pl-2">Total Direct Cost</td>
                                    <td className="py-2.5 text-right text-red-400 font-bold">{fmt(c.directCost)}</td>
                                    <td className="py-2.5 text-right text-red-400 font-bold text-xs">{((c.directCost / c.totalRevenue) * 100).toFixed(1)}%</td>
                                </tr>
                                <tr className="bg-green-500/5 border border-green-500/10">
                                    <td className="py-3 text-slate-900 font-bold pl-2">Gross Profit</td>
                                    <td className="py-3 text-right text-green-400 font-bold text-base">{fmt(c.grossProfit)}</td>
                                    <td className="py-3 text-right text-green-400 font-bold">{c.grossMargin}%</td>
                                </tr>

                                <tr><td colSpan={3} className="pt-4 pb-1 text-xs font-bold text-yellow-400 uppercase tracking-wider">Indirect Costs</td></tr>
                                {[
                                    ['Admin Overhead', selected.adminOverhead],
                                    ['Office Expenses', selected.officeExpenses],
                                    ['Depreciation', selected.depreciation],
                                ].map(([label, val], i) => (
                                    <tr key={i}><td className="py-2 text-slate-700 pl-4">{label}</td><td className="py-2 text-right text-yellow-400">{fmt(val)}</td><td className="py-2 text-right text-slate-400 text-xs">{((val / c.totalRevenue) * 100).toFixed(1)}%</td></tr>
                                ))}
                                <tr className="bg-emerald-500/10 border border-emerald-500/10">
                                    <td className="py-3 text-slate-900 font-bold text-base pl-2">Net Profit</td>
                                    <td className="py-3 text-right text-emerald-400 font-bold text-xl">{fmt(c.netProfit)}</td>
                                    <td className="py-3 text-right text-emerald-400 font-bold text-base">{c.netMargin}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right — cost distribution + KPIs */}
                <div className="space-y-5">
                    <div className="card p-5">
                        <h4 className="text-slate-900 font-semibold text-sm mb-4">Cost Distribution</h4>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={chartData} margin={{ left: -15 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip formatter={(v) => [`₹${(v / 1000).toFixed(0)}K`, 'Cost']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Gross Margin', value: `${c.grossMargin}%`, color: 'text-green-400', positive: parseFloat(c.grossMargin) > 20 },
                            { label: 'Net Margin', value: `${c.netMargin}%`, color: 'text-emerald-400', positive: parseFloat(c.netMargin) > 15 },
                            { label: 'Progress', value: `${selected.progress}%`, color: 'text-blue-400', positive: true },
                            { label: 'Revenue Earned', value: fmt(c.totalRevenue * selected.progress / 100), color: 'text-cyan-400', positive: true },
                        ].map((kpi, i) => (
                            <div key={i} className="card p-3">
                                <p className="text-slate-400 text-xs mb-1">{kpi.label}</p>
                                <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
