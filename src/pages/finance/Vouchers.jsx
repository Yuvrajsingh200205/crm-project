import { useState } from 'react';
import { Plus, Search, Eye, Edit2, Send, CheckCircle, X } from 'lucide-react';

const initialVouchers = [
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
    const [vouchers, setVouchers] = useState(initialVouchers);
    const [activeType, setActiveType] = useState('All');
    const [search, setSearch] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ type: 'Payment' });

    const filtered = vouchers.filter(v => {
        const matchType = activeType === 'All' || v.type === activeType;
        const matchSearch = v.party.toLowerCase().includes(search.toLowerCase()) ||
            v.id.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateVoucher = (e) => {
        e.preventDefault();
        const prefix = formData.type ? formData.type.substring(0, 1).toUpperCase() + 'V' : 'XV';
        
        const newVoucher = {
            id: `${prefix}-2026-00${vouchers.length + 4}`,
            type: formData.type || 'Payment',
            date: formData.date || new Date().toISOString().split('T')[0],
            party: formData.party || 'N/A',
            amount: parseFloat(formData.amount || 0),
            narration: formData.narration || '',
            tds: parseFloat(formData.tds || 0),
            bank: formData.bank || 'Cash A/C',
            status: 'Pending'
        };
        setVouchers([newVoucher, ...vouchers]);
        setIsModalOpen(false);
        setFormData({ type: 'Payment' });
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Tally-style Quick Entry Buttons */}
            <div className="card p-4">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Quick Voucher Entry (Tally-Style)</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {voucherTypes.map(vt => (
                        <button
                            key={vt.key}
                            onClick={() => {
                                setFormData({ type: vt.key });
                                setIsModalOpen(true);
                            }}
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
            <div className="flex gap-3 flex-col sm:flex-row">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-9 w-full" placeholder="Search vouchers..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveType('All')} className="btn-secondary">All</button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Voucher
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Voucher No', 'Type', 'Date', 'Party', 'Amount', 'TDS', 'Narration', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="9" className="p-6 text-center text-slate-500">No Vouchers found. Create a new one.</td></tr>
                            ) : filtered.map((v, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{v.id}</td>
                                    <td className="table-cell"><span className={`badge ${typeColors[v.type] || 'badge-blue'}`}>{v.type}</span></td>
                                    <td className="table-cell text-slate-500 text-xs">{v.date}</td>
                                    <td className="table-cell text-slate-900 font-medium whitespace-nowrap">{v.party}</td>
                                    <td className="table-cell">
                                        <span className={`font-semibold ${v.type === 'Payment' || v.type === 'Credit Note' || v.type === 'Purchase' ? 'text-red-500' : 'text-emerald-600'}`}>
                                            ₹{v.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="table-cell text-amber-500">{v.tds > 0 ? `₹${v.tds.toLocaleString()}` : '—'}</td>
                                    <td className="table-cell text-slate-500 text-xs max-w-xs">{v.narration}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${v.status === 'Posted' ? 'badge-green' : 'badge-yellow'}`}>{v.status}</span>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Eye className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                            {v.status === 'Pending' && <button className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><CheckCircle className="w-3.5 h-3.5" /></button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Voucher Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-brand" /> New Voucher Entry
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateVoucher} className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Voucher Type <span className="text-red-500">*</span></label>
                                    <select required name="type" value={formData.type || 'Payment'} onChange={handleInputChange} className="input w-full bg-white">
                                        {voucherTypes.map(vt => (
                                            <option key={vt.key} value={vt.key}>{vt.key}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Transaction Date <span className="text-red-500">*</span></label>
                                    <input required type="date" name="date" value={formData.date || ''} onChange={handleInputChange} className="input w-full" />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Party Account Name <span className="text-red-500">*</span></label>
                                    <input required name="party" value={formData.party || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. JANKI ENTERPRISES" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Amount (₹) <span className="text-red-500">*</span></label>
                                    <input required type="number" step="0.01" name="amount" value={formData.amount || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 50000" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">TDS Deduction (₹)</label>
                                    <input type="number" step="0.01" name="tds" value={formData.tds || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 1000" />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Bank / Ledger A/C <span className="text-red-500">*</span></label>
                                    <input required name="bank" value={formData.bank || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. SBI Main A/C or Cash" />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Narration <span className="text-red-500">*</span></label>
                                    <textarea required name="narration" value={formData.narration || ''} onChange={handleInputChange} rows="2" className="input w-full resize-none" placeholder="Description of the transaction..."></textarea>
                                </div>
                            </div>

                            <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 shadow-sm shadow-green-500/20 transition-all">
                                    Save Voucher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
