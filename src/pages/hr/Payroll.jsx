import { useState } from 'react';
import { Play, Download, CheckCircle, Clock, AlertTriangle, Users, DollarSign, FileText } from 'lucide-react';

const salaryData = [
    { id: 'EMP-001', name: 'Rajesh Kumar', designation: 'Project Manager', basic: 35000, hra: 17500, conv: 1600, special: 3900, gross: 58000, epf: 4200, esi: 0, pt: 200, tds: 1800, net: 51800, status: 'Processed' },
    { id: 'EMP-002', name: 'Suresh Verma', designation: 'Senior Engineer', basic: 28000, hra: 14000, conv: 1600, special: 2400, gross: 46000, epf: 3360, esi: 0, pt: 200, tds: 680, net: 41760, status: 'Processed' },
    { id: 'EMP-003', name: 'Priya Devi', designation: 'Site Engineer', basic: 22000, hra: 11000, conv: 1600, special: 1400, gross: 36000, epf: 2640, esi: 270, pt: 200, tds: 0, net: 32890, status: 'Processed' },
    { id: 'EMP-004', name: 'Mohan Lal', designation: 'Store Keeper', basic: 15000, hra: 6000, conv: 1600, special: -1600, gross: 21000, epf: 1800, esi: 158, pt: 150, tds: 0, net: 18892, status: 'Pending' },
    { id: 'EMP-005', name: 'Ankit Sharma', designation: 'Project Manager', basic: 40000, hra: 20000, conv: 1600, special: 6400, gross: 68000, epf: 4800, esi: 0, pt: 200, tds: 3200, net: 59800, status: 'Processed' },
    { id: 'EMP-006', name: 'Ritu Singh', designation: 'HR Manager', basic: 30000, hra: 15000, conv: 1600, special: 3400, gross: 50000, epf: 3600, esi: 0, pt: 200, tds: 1000, net: 45200, status: 'Hold' },
    { id: 'EMP-007', name: 'Deepak Kumar', designation: 'Accountant', basic: 25000, hra: 12500, conv: 1600, special: 1900, gross: 41000, epf: 3000, esi: 0, pt: 200, tds: 420, net: 37380, status: 'Processed' },
];

export default function Payroll() {
    const [month] = useState('February 2026');
    const [processingStep, setProcessingStep] = useState(0);

    const totalGross = salaryData.reduce((a, e) => a + e.gross, 0);
    const totalNet = salaryData.reduce((a, e) => a + e.net, 0);
    const totalPF = salaryData.reduce((a, e) => a + e.epf, 0);
    const totalESI = salaryData.reduce((a, e) => a + e.esi, 0);

    const steps = [
        'Attendance Sync', 'Gross Calculation', 'Deductions', 'Net Salary', 'Bank File', 'Payslips'
    ];

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Month Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/30 p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">Payroll Period</p>
                        <h2 className="text-slate-900 text-xl font-bold">{month}</h2>
                        <p className="text-slate-400 text-sm mt-1">7 employees · Total Payable: ₹{(totalNet / 100000).toFixed(2)}L</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-secondary">
                            <Download className="w-4 h-4" /> Bank File
                        </button>
                        <button className="btn-primary" onClick={() => setProcessingStep(steps.length)}>
                            <Play className="w-4 h-4" /> Process Payroll
                        </button>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mt-4 flex items-center gap-2">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${i < processingStep ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                    i === processingStep ? 'bg-blue-500/20 text-blue-400 border border-green-100 animate-pulse' :
                                        'bg-slate-50 text-slate-400 border border-slate-200'
                                }`}>
                                {i < processingStep ? <CheckCircle className="w-3 h-3" /> : <span className="w-3 h-3 flex items-center justify-center text-xs font-bold">{i + 1}</span>}
                                {step}
                            </div>
                            {i < steps.length - 1 && <div className={`w-4 h-0.5 ${i < processingStep ? 'bg-green-500' : 'bg-slate-100'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Gross', value: `₹${(totalGross / 100000).toFixed(2)}L`, sub: 'All employees', color: 'text-blue-400', icon: DollarSign },
                    { label: 'Net Payable', value: `₹${(totalNet / 100000).toFixed(2)}L`, sub: 'After deductions', color: 'text-green-400', icon: DollarSign },
                    { label: 'PF Liability', value: `₹${(totalPF / 1000).toFixed(1)}K`, sub: `Emp + Emp'er`, color: 'text-purple-400', icon: FileText },
                    { label: 'ESI Liability', value: `₹${(totalESI / 100).toFixed(0)} + Emp'er`, sub: '3.25% of gross', color: 'text-yellow-400', icon: FileText },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="card p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className={`w-4 h-4 ${s.color}`} />
                                <p className="text-slate-400 text-sm">{s.label}</p>
                            </div>
                            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{s.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Salary Table */}
            <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="section-title">Salary Sheet – {month}</h3>
                    <div className="flex gap-2">
                        <button className="btn-secondary text-xs">Preview Payslips</button>
                        <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> Export</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Emp. ID', 'Name', 'Basic', 'HRA', 'Conv', 'Special', 'Gross', 'PF (Emp)', 'ESI', 'PT', 'TDS', 'Net Salary', 'Status'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {salaryData.map((e, i) => (
                                <tr key={i} className="table-row">
                                    <td className="table-cell font-mono text-blue-400 font-semibold">{e.id}</td>
                                    <td className="table-cell">
                                        <p className="text-slate-900 font-medium">{e.name}</p>
                                        <p className="text-slate-400">{e.designation}</p>
                                    </td>
                                    <td className="table-cell text-slate-700">₹{e.basic.toLocaleString()}</td>
                                    <td className="table-cell text-slate-700">₹{e.hra.toLocaleString()}</td>
                                    <td className="table-cell text-slate-700">₹{e.conv.toLocaleString()}</td>
                                    <td className="table-cell text-slate-700">₹{e.special > 0 ? e.special.toLocaleString() : '—'}</td>
                                    <td className="table-cell text-slate-900 font-semibold">₹{e.gross.toLocaleString()}</td>
                                    <td className="table-cell text-orange-400">₹{e.epf.toLocaleString()}</td>
                                    <td className="table-cell text-yellow-400">{e.esi > 0 ? `₹${e.esi}` : '—'}</td>
                                    <td className="table-cell text-slate-400">₹{e.pt}</td>
                                    <td className="table-cell text-red-400">{e.tds > 0 ? `₹${e.tds.toLocaleString()}` : '—'}</td>
                                    <td className="table-cell text-green-400 font-bold">₹{e.net.toLocaleString()}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${e.status === 'Processed' ? 'badge-green' : e.status === 'Hold' ? 'badge-red' : 'badge-yellow'}`}>
                                            {e.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {/* Totals Row */}
                            <tr className="bg-slate-50 border-t-2 border-brand/30">
                                <td colSpan={6} className="table-cell text-slate-900 font-bold text-right text-sm">TOTALS</td>
                                <td className="table-cell text-slate-900 font-bold">₹{totalGross.toLocaleString()}</td>
                                <td className="table-cell text-orange-400 font-bold">₹{totalPF.toLocaleString()}</td>
                                <td className="table-cell text-yellow-400 font-bold">₹{totalESI}</td>
                                <td className="table-cell text-slate-700 font-bold">₹{salaryData.reduce((a, e) => a + e.pt, 0).toLocaleString()}</td>
                                <td className="table-cell text-red-400 font-bold">₹{salaryData.reduce((a, e) => a + e.tds, 0).toLocaleString()}</td>
                                <td className="table-cell text-green-400 font-bold">₹{totalNet.toLocaleString()}</td>
                                <td className="table-cell" />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Statutory Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        title: 'Provident Fund',
                        items: [
                            { label: 'Employee PF (12%)', value: `₹${totalPF.toLocaleString()}` },
                            { label: "Employer PF (12%)", value: `₹${totalPF.toLocaleString()}` },
                            { label: 'Total Challan', value: `₹${(totalPF * 2).toLocaleString()}`, bold: true },
                        ],
                        color: 'border-purple-500/30',
                        icon: '🏦',
                    },
                    {
                        title: 'ESI (Employee State Insurance)',
                        items: [
                            { label: 'Employee ESI (0.75%)', value: `₹${totalESI}` },
                            { label: 'Employer ESI (3.25%)', value: `₹${Math.round(totalGross * 0.0325 * 0.1)}` },
                            { label: 'Total Challan', value: `₹${totalESI + Math.round(totalGross * 0.0325 * 0.1)}`, bold: true },
                        ],
                        color: 'border-yellow-500/30',
                        icon: '🏥',
                    },
                    {
                        title: 'Income Tax (TDS)',
                        items: [
                            { label: 'Total TDS Deducted', value: `₹${salaryData.reduce((a, e) => a + e.tds, 0).toLocaleString()}` },
                            { label: 'Challan Due Date', value: '7th March 2026' },
                            { label: 'Section', value: '192 – Salary', bold: true },
                        ],
                        color: 'border-red-500/30',
                        icon: '📋',
                    },
                ].map((card, i) => (
                    <div key={i} className={`card p-4 border ${card.color}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">{card.icon}</span>
                            <h4 className="text-slate-900 font-semibold text-sm">{card.title}</h4>
                        </div>
                        <div className="space-y-2">
                            {card.items.map((it, j) => (
                                <div key={j} className={`flex justify-between ${it.bold ? 'border-t border-slate-200 pt-2' : ''}`}>
                                    <span className="text-slate-400 text-xs">{it.label}</span>
                                    <span className={`text-xs font-medium ${it.bold ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>{it.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
