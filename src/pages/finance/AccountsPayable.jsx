import React, { useState, useEffect } from 'react';
import { 
    CreditCard, Search, Plus, Download, 
    Truck, Calendar, AlertCircle, CheckCircle2, Clock, X, Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastUtils';
import Skeleton from '../../components/common/Skeleton';

const INITIAL_BILLS = [];

const statusBadge = {
    'Paid': 'badge-green',
    'Approved': 'badge-blue',
    'Overdue': 'badge-red',
    'Pending': 'badge-yellow',
};

export default function AccountsPayable() {
    const [search, setSearch] = useState('');
    const [bills, setBills] = useState(INITIAL_BILLS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const [formData, setFormData] = useState({
        vendor: '',
        project: '',
        type: 'Purchase',
        amount: '',
        date: '',
        dueDate: '',
        tds: '1',
        status: 'Pending'
    });

    const filtered = bills.filter(b =>
        b.vendor.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({
            vendor: '', project: '', type: 'Purchase', amount: '', date: '', dueDate: '', tds: '1', status: 'Pending'
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (bill) => {
        setEditingId(bill.id);
        setFormData({
            vendor: bill.vendor,
            project: bill.project,
            type: bill.type,
            amount: bill.amount,
            date: bill.date,
            dueDate: bill.dueDate,
            tds: '1',
            status: bill.status
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const baseAmount = Number(formData.amount);
        const tdsAmount = (baseAmount * Number(formData.tds)) / 100;

        if (editingId) {
            setBills(bills.map(b => b.id === editingId ? { ...b, ...formData, amount: baseAmount, tds: tdsAmount } : b));
            toast.success('Vendor bill updated successfully');
        } else {
            const newBill = {
                id: `BILL-00${bills.length + 1}`,
                ...formData,
                amount: baseAmount,
                tds: tdsAmount
            };
            setBills([newBill, ...bills]);
            toast.success('New vendor bill recorded');
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Accounts Payable</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage vendor bills & liabilities</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Aging Report
                    </button>
                    <button onClick={handleOpenAdd} className="btn-primary whitespace-nowrap flex items-center gap-1.5">
                        <Plus className="w-5 h-5" /> Record Vendor Bill
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Current (0-30 Days)', value: '₹42.5 L', color: 'text-green-500', icon: CheckCircle2 },
                    { label: '31-60 Days Late', value: '₹8.4 L', color: 'text-amber-500', icon: Clock },
                    { label: '61-90 Days Late', value: '₹2.1 L', color: 'text-red-500', icon: AlertCircle },
                    { label: 'Scheduled Payment', value: '₹12.0 L', color: 'text-blue-500', icon: Calendar },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        {isLoading ? (
                            <Skeleton variant="badge" className="h-8 w-20 mb-1" />
                        ) : (
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        )}
                        <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-800">Vendor Obligations</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search vendor or bill..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Bill ID', 'Vendor', 'Project', 'Type', 'Bill Date', 'Due Date', 'TDS', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="table-row">
                                        <td className="table-cell"><Skeleton variant="text" className="w-16" /></td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <Skeleton variant="circle" className="w-7 h-7" />
                                                <Skeleton variant="text" className="w-32" />
                                            </div>
                                        </td>
                                        <td className="table-cell"><Skeleton variant="text" /></td>
                                        <td className="table-cell"><Skeleton variant="badge" /></td>
                                        <td className="table-cell"><Skeleton variant="text" /></td>
                                        <td className="table-cell"><Skeleton variant="text" /></td>
                                        <td className="table-cell"><Skeleton variant="text" /></td>
                                        <td className="table-cell"><Skeleton variant="text" /></td>
                                        <td className="table-cell"><Skeleton variant="badge" /></td>
                                        <td className="table-cell"><Skeleton variant="button" className="w-8 h-8" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="10" className="p-6 text-center text-slate-500">No bills found.</td></tr>
                            ) : filtered.map((bill, i) => (
                                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{bill.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <Truck className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                            <span className="text-slate-900 font-medium whitespace-nowrap">{bill.vendor}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-500 text-xs">{bill.project}</td>
                                    <td className="table-cell"><span className="badge badge-blue">{bill.type}</span></td>
                                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{bill.date}</td>
                                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{bill.dueDate}</td>
                                    <td className="table-cell text-slate-700 font-medium">₹{(bill.tds / 1000).toFixed(1)}K</td>
                                    <td className="table-cell text-emerald-600 font-semibold">₹{(bill.amount / 100000).toFixed(2)}L</td>
                                    <td className="table-cell">
                                        <span className={`badge ${statusBadge[bill.status] || 'badge-yellow'}`}>{bill.status}</span>
                                    </td>
                                    <td className="table-cell">
                                        <button onClick={() => handleOpenEdit(bill)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Bill Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                            <div>
                                <h2 className="text-base font-semibold">{editingId ? 'Edit Vendor Bill' : 'Record Vendor Bill / Payable'}</h2>
                                <p className="text-xs text-white/60 mt-0.5">Bill registration</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">Vendor Organization</label>
                                <input required value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="input" placeholder="e.g. UltraTech Cement" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Associated Project</label>
                                    <input required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="input" placeholder="e.g. Metro Phase 2" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Expense Category</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input">
                                        <option value="Purchase">Purchase</option>
                                        <option value="Service">Service</option>
                                        <option value="Direct">Direct</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Bill Date</label>
                                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Due Date</label>
                                    <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="input" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Base Amount (₹)</label>
                                    <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="input" placeholder="0.00" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Applicable TDS</label>
                                    <select value={formData.tds} onChange={e => setFormData({...formData, tds: e.target.value})} className="input">
                                        <option value="1">1% (194C - Individual)</option>
                                        <option value="2">2% (194C - Company)</option>
                                        <option value="10">10% (194J - Professional)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">{editingId ? 'Update Bill' : 'Save Bill'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
