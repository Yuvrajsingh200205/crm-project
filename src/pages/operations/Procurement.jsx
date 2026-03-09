import { useState } from 'react';
import { Plus, Search, ClipboardCheck, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const purchaseOrders = [
    { id: 'PO-2026-047', vendor: 'Bihar Cable Industries', items: 'ABC Cable 3X185 – 1 CKM', amount: 385000, raised: '2026-03-01', expectedDelivery: '2026-03-15', status: 'Pending Approval', approver: 'GM – Ops', stage: 1 },
    { id: 'PO-2026-046', vendor: 'National Pole Manufacturers', items: 'PSC Pole 9M 400Kg – 20 Nos', amount: 225000, raised: '2026-02-28', expectedDelivery: '2026-03-10', status: 'Approved', approver: 'Approved', stage: 2 },
    { id: 'PO-2026-045', vendor: 'Himachal Steel Corp', items: 'GI Wire 7/8 SWG – 500 Mtr', amount: 42500, raised: '2026-02-25', expectedDelivery: '2026-03-05', status: 'GRN Pending', approver: 'Delivered', stage: 3 },
    { id: 'PO-2026-044', vendor: 'National Pole Manufacturers', items: 'Stay Set Complete – 10 Sets', amount: 12500, raised: '2026-02-20', expectedDelivery: '2026-02-28', status: 'Completed', approver: 'Done', stage: 4 },
    { id: 'PO-2026-043', vendor: 'HG Fuse Suppliers Pvt Ltd', items: 'HG Fuse Set – 10 Nos', amount: 42250, raised: '2026-02-18', expectedDelivery: '2026-02-25', status: 'Completed', approver: 'Done', stage: 4 },
];

const stages = ['Indent', 'Approval', 'PO Issued', 'Delivered', 'GRN Done'];
const statusToStage = { 'Pending Approval': 0, 'Approved': 1, 'GRN Pending': 3, 'Completed': 4 };

const statusBadge = {
    'Pending Approval': 'badge-yellow',
    'Approved': 'badge-blue',
    'GRN Pending': 'badge-orange',
    'Completed': 'badge-green',
};

export default function Procurement() {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);

    const filtered = purchaseOrders.filter(po =>
        po.vendor.toLowerCase().includes(search.toLowerCase()) ||
        po.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-9" placeholder="Search PO number or vendor..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button className="btn-primary"><Plus className="w-4 h-4" /> Create PO</button>
            </div>

            {/* Workflow Guide */}
            <div className="card p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Procurement Workflow</p>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {['Material Indent', 'Vendor Comparison', 'PO Creation', 'Approval', 'Vendor Confirmation', 'Delivery', 'GRN', 'Invoice Match', 'Payment'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 flex-shrink-0">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${i <= 3 ? 'bg-brand/20 border-brand/30 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                <span className="w-4 h-4 rounded-full bg-slate-100 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                {step}
                            </div>
                            {i < 8 && <span className="text-slate-600 text-lg">→</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Approval', value: purchaseOrders.filter(p => p.status === 'Pending Approval').length, color: 'text-yellow-400' },
                    { label: 'In-Progress', value: purchaseOrders.filter(p => p.status === 'Approved' || p.status === 'GRN Pending').length, color: 'text-blue-400' },
                    { label: 'Completed (Mar)', value: purchaseOrders.filter(p => p.status === 'Completed').length, color: 'text-green-400' },
                    { label: 'Total PO Value', value: `₹${(purchaseOrders.reduce((a, p) => a + p.amount, 0) / 100000).toFixed(1)}L`, color: 'text-purple-400' },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* PO Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['PO Number', 'Vendor', 'Items', 'Amount', 'Raised', 'Expected Delivery', 'Progress', 'Status', 'Action'].map(h => (
                                    <th key={h} className="table-header">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((po, i) => {
                                const stage = statusToStage[po.status] ?? 0;
                                return (
                                    <tr key={i} className="table-row cursor-pointer" onClick={() => setSelected(po)}>
                                        <td className="table-cell font-mono text-blue-400 text-xs font-semibold">{po.id}</td>
                                        <td className="table-cell text-slate-900 font-medium">{po.vendor}</td>
                                        <td className="table-cell text-slate-400 text-xs max-w-xs">{po.items}</td>
                                        <td className="table-cell text-slate-900 font-semibold">₹{po.amount.toLocaleString()}</td>
                                        <td className="table-cell text-slate-400 text-xs">{po.raised}</td>
                                        <td className="table-cell text-slate-400 text-xs">{po.expectedDelivery}</td>
                                        <td className="table-cell w-36">
                                            <div className="flex gap-0.5">
                                                {stages.map((s, si) => (
                                                    <div key={si} className={`flex-1 h-1.5 rounded-full transition-all ${si <= stage ? 'bg-brand' : 'bg-slate-100'}`} />
                                                ))}
                                            </div>
                                            <p className="text-slate-400 text-xs mt-1">{stages[Math.min(stage, stages.length - 1)]}</p>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`badge ${statusBadge[po.status]}`}>{po.status}</span>
                                        </td>
                                        <td className="table-cell" onClick={e => e.stopPropagation()}>
                                            <button className="btn-secondary text-xs py-1 px-2">
                                                {po.status === 'Pending Approval' ? 'Approve' : po.status === 'GRN Pending' ? 'GRN' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
