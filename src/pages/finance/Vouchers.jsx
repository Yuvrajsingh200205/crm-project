import { useState } from 'react';
import { Plus, Search, Eye, Edit2, Send, CheckCircle } from 'lucide-react';

const vouchers = [
    { id: 'PV-2026-001', type: 'Payment', date: '2026-03-05', party: 'JANKI ENTERPRISES', amount: 184500, narration: 'RA-05 Payment for PSC Pole works', tds: 3690, bank: 'SBI – Main A/C', status: 'Posted' },
    { id: 'RV-2026-042', type: 'Receipt', date: '2026-03-04', party: 'Bihar Rural Dev. Authority', amount: 850000, narration: 'Advance received for SWPL-BRGF Phase 1', tds: 0, bank: 'SBI – Main A/C', status: 'Posted' },
    { id: 'JV-2026-018', type: 'Journal', date: '2026-03-03', party: 'N/A', amount: 45000, narration: 'Depreciation provision for March 2026', tds: 0, bank: 'Journal', status: 'Posted' },
    { id: 'SV-2026-011', type: 'Sales', date: '2026-03-02', party: 'PMRCL – Patna Metro', amount: 2340000, narration: 'RA-03 Invoice for Civil Works Section B', tds: 0, bank: 'Invoice', status: 'Pending' },
    { id: 'PV-2026-002', type: 'Payment', date: '2026-03-01', party: 'GSAR Contractors', amount: 92000, narration: 'Payment for ABC Cable installation', tds: 1840, bank: 'HDFC – Payroll A/C', status: 'Pending' },
    { id: 'CN-2026-003', type: 'Credit Note', date: '2026-02-28', party: 'TechCorp India', amount: 15000, narration: 'Credit note for returned materials', tds: 0, bank: 'Adjustment', status: 'Posted' },
    { id: 'PV-2026-003', type: 'Payment', date: '2026-02-27', party: 'Bihar Energy Supply', amount: 67800, narration: 'Electricity charges – Site office', tds: 0, bank: 'ICICI – Ops A/C', status: 'Posted' },
];

const typeColors = {
    'Payment': 'badge-orange',
    'Receipt': 'badge-green',
    'Journal': 'badge-purple',
    'Sales': 'badge-blue',
    'Purchase': 'badge-yellow',
    'Credit Note': 'badge-red',
    'Debit Note': 'badge-red',
};

const voucherTypes = [
    { key: 'Payment', label: 'F5 Payment', shortcut: 'F5', color: 'text-orange-400 border-orange-500/20 bg-orange-500/10' },
    { key: 'Receipt', label: 'F6 Receipt', shortcut: 'F6', color: 'text-green-400 border-green-500/20 bg-green-500/10' },
    { key: 'Journal', label: 'F7 Journal', shortcut: 'F7', color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' },
    { key: 'Sales', label: 'F8 Sales', shortcut: 'F8', color: 'text-blue-400 border-green-100 bg-blue-500/10' },
    { key: 'Purchase', label: 'F9 Purchase', shortcut: 'F9', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' },
    { key: 'Contra', label: 'F4 Contra', shortcut: 'F4', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
];

export default function Vouchers() {
    const [activeType, setActiveType] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = vouchers.filter(v => {
        const matchType = activeType === 'All' || v.type === activeType;
        const matchSearch = v.party.toLowerCase().includes(search.toLowerCase()) ||
            v.id.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Tally-style Quick Entry Buttons */}
            <div className="card p-4">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Quick Voucher Entry (Tally-Style)</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {voucherTypes.map(vt => (
                        <button
                            key={vt.key}
                            onClick={() => setActiveType(vt.key === activeType ? 'All' : vt.key)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${activeType === vt.key ? vt.color : 'border-slate-200 bg-slate-50 hover:bg-slate-50 text-slate-400'
                                }`}
                        >
                            <kbd className="text-xs font-bold">{vt.shortcut}</kbd>
                            <span className="text-xs font-medium">{vt.label.split(' ')[1]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-9" placeholder="Search vouchers..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button onClick={() => setActiveType('All')} className="btn-secondary">All</button>
                <button className="btn-primary"><Plus className="w-4 h-4" /> New Voucher</button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Voucher No', 'Type', 'Date', 'Party', 'Amount', 'TDS', 'Narration', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="table-header">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v, i) => (
                                <tr key={i} className="table-row">
                                    <td className="table-cell font-mono text-blue-400 text-xs font-semibold">{v.id}</td>
                                    <td className="table-cell"><span className={`badge ${typeColors[v.type] || 'badge-blue'}`}>{v.type}</span></td>
                                    <td className="table-cell text-slate-400 text-xs">{v.date}</td>
                                    <td className="table-cell text-slate-900 font-medium">{v.party}</td>
                                    <td className="table-cell">
                                        <span className={`font-semibold ${v.type === 'Payment' || v.type === 'Credit Note' ? 'text-red-400' : 'text-green-400'}`}>
                                            ₹{v.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="table-cell text-orange-400">{v.tds > 0 ? `₹${v.tds.toLocaleString()}` : '—'}</td>
                                    <td className="table-cell text-slate-400 text-xs max-w-xs truncate">{v.narration}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${v.status === 'Posted' ? 'badge-green' : 'badge-yellow'}`}>{v.status}</span>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"><Eye className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                            {v.status === 'Pending' && <button className="p-1.5 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"><CheckCircle className="w-3.5 h-3.5" /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
