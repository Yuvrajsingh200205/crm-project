import React, { useState } from 'react';
import { Search, Download, RefreshCw, ArrowRight, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';

const MOCK_GST_RETURNS = [
    { period: 'Feb 2025', gstr1: 'Filed', gstr3b: 'Pending', liability: 284500, itc: 198400, net: 86100, dueDate: '2025-03-20' },
    { period: 'Jan 2025', gstr1: 'Filed', gstr3b: 'Filed', liability: 312000, itc: 224600, net: 87400, dueDate: '2025-02-20' },
    { period: 'Dec 2024', gstr1: 'Filed', gstr3b: 'Filed', liability: 291800, itc: 208200, net: 83600, dueDate: '2025-01-20' },
];

export default function GSTManagement() {
    const [tab, setTab] = useState('returns');

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">GST Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Indirect tax & GST return compliance</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Returns
                    </button>
                    <button className="btn-primary flex items-center gap-1.5">
                        <RefreshCw className="w-4 h-4" /> Sync GSTN Portal
                    </button>
                </div>
            </div>

            {/* Alert Banner */}
            <div className="card p-4 border-l-4 border-amber-400 bg-amber-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 animate-pulse" />
                    <div>
                        <p className="text-sm font-semibold text-slate-800">GSTR-3B Pending Filing</p>
                        <p className="text-xs text-slate-500">The return for <span className="font-semibold">February 2025</span> is due in 4 days. Net Tax: ₹86,100</p>
                    </div>
                </div>
                <button className="btn-primary whitespace-nowrap flex items-center gap-1.5 text-xs">
                    Proceed to Filing <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Outward Liability', value: '₹2.84 L', color: 'text-amber-500' },
                    { label: 'ITC Available', value: '₹1.98 L', color: 'text-green-500' },
                    { label: 'Net GST Due', value: '₹86.1 K', color: 'text-red-500' },
                    { label: 'Portal Credit', value: '₹12.5 K', color: 'text-blue-500' },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex gap-1">
                        {['returns', 'invoices', 'itcreco'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                                    tab === t ? 'bg-[#2f6645] text-white' : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {t === 'itcreco' ? 'ITC Reco' : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {tab === 'returns' ? (
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['Tax Period', 'Due Date', 'GSTR-1', 'GSTR-3B', 'Liability', 'ITC', 'Net GST', 'Actions'].map(h => (
                                        <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_GST_RETURNS.map((row, i) => (
                                    <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                        <td className="table-cell font-semibold text-slate-900">{row.period}</td>
                                        <td className="table-cell text-slate-500 text-xs">{row.dueDate}</td>
                                        <td className="table-cell">
                                            <span className={`badge ${row.gstr1 === 'Filed' ? 'badge-green' : 'badge-yellow'}`}>{row.gstr1}</span>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`badge ${row.gstr3b === 'Filed' ? 'badge-green' : 'badge-yellow'}`}>{row.gstr3b}</span>
                                        </td>
                                        <td className="table-cell text-red-600 font-medium">₹{(row.liability / 1000).toFixed(1)}K</td>
                                        <td className="table-cell text-emerald-600 font-medium">₹{(row.itc / 1000).toFixed(1)}K</td>
                                        <td className="table-cell text-slate-900 font-semibold">₹{(row.net / 1000).toFixed(1)}K</td>
                                        <td className="table-cell" onClick={e => e.stopPropagation()}>
                                            {row.gstr3b !== 'Filed' ? (
                                                <button className="btn-primary text-xs py-1 px-3">File 3B</button>
                                            ) : (
                                                <button className="btn-secondary text-xs py-1 px-3 border border-slate-200 rounded">
                                                    <Download className="w-3 h-3" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-16 text-center">
                            <FileText className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Syncing with GSTN Portal...</p>
                            <p className="text-xs text-slate-400 mt-1">Connecting via GSP for real-time invoice & ITC data.</p>
                            <button className="btn-secondary mt-6 mx-auto">Refresh Connection</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
