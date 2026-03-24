import React, { useState } from 'react';
import { Search, Plus, Download, CheckCircle2, AlertCircle, Clock, FileText, Briefcase, X, Edit2 } from 'lucide-react';

const INITIAL_TDS = [
    { id: 'TDS-2025-001', vendor: 'UltraTech Cement', section: '194C', amount: 8500, date: '2025-03-12', status: 'Deposited', ref: 'CHQ-98212', period: 'Q4 2024-25' },
    { id: 'TDS-2025-002', vendor: 'Tata Projects', section: '194J', amount: 15600, date: '2025-03-10', status: 'Approved', ref: '-', period: 'Q4 2024-25' },
    { id: 'TDS-2025-003', vendor: 'Local Sand Supplier', section: '194C', amount: 450, date: '2025-02-28', status: 'Cert. Issued', ref: 'CERT-0042', period: 'Q3 2024-25' },
    { id: 'TDS-2025-004', vendor: 'Reliance Infra', section: '194I', amount: 2200, date: '2025-03-01', status: 'Deposited', ref: 'NEFT-8831', period: 'Q4 2024-25' },
    { id: 'TDS-2025-005', vendor: 'Security Agency XYZ', section: '194C', amount: 3800, date: '2025-03-05', status: 'Pending', ref: '-', period: 'Q4 2024-25' },
];

const statusBadge = {
    'Deposited': 'badge-green',
    'Cert. Issued': 'badge-blue',
    'Approved': 'badge-blue',
    'Pending': 'badge-yellow',
};

export default function TDSManagement() {
    const [search, setSearch] = useState('');
    const [tdsList, setTdsList] = useState(INITIAL_TDS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        vendor: '',
        section: '194C',
        amount: '',
        date: '',
        ref: '',
        period: 'Q4 2024-25',
        status: 'Pending'
    });

    const filtered = tdsList.filter(t =>
        t.vendor.toLowerCase().includes(search.toLowerCase()) ||
        t.section.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({
            vendor: '', section: '194C', amount: '', date: '', ref: '', period: 'Q4 2024-25', status: 'Pending'
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (rec) => {
        setEditingId(rec.id);
        setFormData({
            vendor: rec.vendor,
            section: rec.section,
            amount: rec.amount,
            date: rec.date,
            ref: rec.ref,
            period: rec.period,
            status: rec.status
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const numAmount = Number(formData.amount);
        
        if (editingId) {
            setTdsList(tdsList.map(t => t.id === editingId ? { ...t, ...formData, amount: numAmount } : t));
        } else {
            const newTds = {
                id: `TDS-2025-00${tdsList.length + 1}`,
                ...formData,
                amount: numAmount
            };
            setTdsList([newTds, ...tdsList]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">TDS Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Direct tax deduction & statutory compliance</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Form 26AS
                    </button>
                    <button onClick={handleOpenAdd} className="btn-primary whitespace-nowrap flex items-center gap-1.5">
                        <Plus className="w-5 h-5" /> Bulk Deposit Filing
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Unfiled Liability', value: '₹42,500', color: 'text-amber-500' },
                    { label: 'Deposited (Q4)', value: '₹1.28 L', color: 'text-green-500' },
                    { label: 'Certificates Due', value: '18', color: 'text-red-500' },
                    { label: 'Filing Compliance', value: '100%', color: 'text-blue-500' },
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
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-800">Tax Deduction Registry</h3>
                        <button className="btn-secondary text-xs py-1 px-3 border border-slate-200 rounded">Issue Certificates</button>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search by vendor or section..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['TDS ID', 'Vendor', 'Section', 'Date', 'Period', 'Reference', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="9" className="p-6 text-center text-slate-500">No TDS records found.</td></tr>
                            ) : filtered.map((tds, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{tds.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                            <span className="text-slate-900 font-medium">{tds.vendor}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell"><span className="badge badge-green">{tds.section}</span></td>
                                    <td className="table-cell text-slate-500 text-xs">{tds.date}</td>
                                    <td className="table-cell text-slate-600">{tds.period}</td>
                                    <td className="table-cell font-mono text-xs text-slate-500">{tds.ref || '-'}</td>
                                    <td className="table-cell text-slate-900 font-semibold">₹{tds.amount.toLocaleString()}</td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[tds.status] || 'badge-yellow'}`}>{tds.status}</span>
                                    </td>
                                    <td className="table-cell">
                                        <button onClick={() => handleOpenEdit(tds)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Deposit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                            <div>
                                <h2 className="text-base font-semibold">{editingId ? 'Edit TDS Record' : 'Record TDS Deposit'}</h2>
                                <p className="text-xs text-white/60 mt-0.5">Bulk Filing Confirmation</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">Vendor / Deductee</label>
                                <input required value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="input" placeholder="e.g. UltraTech Cement" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Financial Quarter</label>
                                    <select value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="input">
                                        <option value="Q4 2024-25">Q4 (Jan-Mar)</option>
                                        <option value="Q3 2024-25">Q3 (Oct-Dec)</option>
                                        <option value="Q2 2024-25">Q2 (Jul-Sep)</option>
                                        <option value="Q1 2024-25">Q1 (Apr-Jun)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Section Code</label>
                                    <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="input">
                                        <option value="194C">194C (Contractor)</option>
                                        <option value="194J">194J (Professional)</option>
                                        <option value="194I">194I (Rent)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Deposit Date</label>
                                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input">
                                        <option value="Pending">Pending</option>
                                        <option value="Deposited">Deposited</option>
                                        <option value="Approved">Approved</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Challan No / Ref</label>
                                    <input value={formData.ref} onChange={e => setFormData({...formData, ref: e.target.value})} className="input" placeholder="e.g. BSR-012392" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Total Deposit Amount (₹)</label>
                                    <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="input" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">{editingId ? 'Update Record' : 'Save Deposit'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
