import { useState, useEffect } from 'react';
import { Plus, Search, ClipboardCheck, Truck, CheckCircle, Clock, AlertTriangle, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { procurementAPI } from '../../api/procurement';
import Skeleton from '../../components/common/Skeleton';

const initialPurchaseOrders = [
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
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        poNumber: '', 
        vendor: '', 
        items: '', 
        amount: '', 
        expectedDelivery: '',
        progress: 'Indent',
        status: 'pending'
    });

    useEffect(() => {
        fetchProcurements();
    }, []);

    const fetchProcurements = async () => {
        setIsLoading(true);
        try {
            const res = await procurementAPI.getAllProcurements();
            // User example: { "procurements": [...] } or array
            const data = res?.procurements || (Array.isArray(res) ? res : (res?.data || []));
            setPurchaseOrders(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load procurements');
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = purchaseOrders.filter(po =>
        (po.vendor || '').toLowerCase().includes(search.toLowerCase()) ||
        (po.poNumber || po.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (po.items || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateStatus = async (id, newStatus, newProgress) => {
        try {
            await procurementAPI.updateProcurementStatus(id, { status: newStatus, progress: newProgress });
            toast.success(`Order moved to ${newProgress}`);
            fetchProcurements();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const handleCreatePO = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                poNumber: formData.poNumber || `PO-${Date.now().toString().slice(-5)}`,
                vendor: formData.vendor,
                items: formData.items,
                amount: Number(formData.amount),
                raised: new Date().toISOString().split('T')[0],
                expectedDelivery: formData.expectedDelivery,
                progress: formData.progress || "Indent",
                status: "pending"
            };
            
            await procurementAPI.createProcurement(payload);
            toast.success('Purchase Order raised successfully');
            setIsModalOpen(false);
            setFormData({
                poNumber: '', vendor: '', items: '', amount: '', expectedDelivery: '', progress: 'Indent', status: 'pending'
            });
            fetchProcurements();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create PO');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-9 w-full" placeholder="Search PO number or vendor..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Create PO
                </button>
            </div>

            {/* Workflow Guide */}
            <div className="card p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Procurement Workflow</p>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
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
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        <td className="px-6 py-4"><Skeleton className="w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="w-48" /></td>
                                        <td className="px-6 py-4"><Skeleton className="w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton variant="badge" /></td>
                                        <td className="px-6 py-4"><Skeleton variant="button" className="w-16 h-8" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="9" className="p-12 text-center text-slate-500 font-medium">No Purchase Orders found. Create a new one.</td></tr>
                            ) : filtered.map((po, i) => {
                                const stageName = po.progress || 'Indent';
                                const stageIndex = stages.includes(stageName) ? stages.indexOf(stageName) : 0;
                                const displayStatus = po.status ? po.status.charAt(0).toUpperCase() + po.status.slice(1).toLowerCase() : 'Pending';

                                return (
                                    <tr key={po.id || i} className="table-row hover:bg-emerald-50/20 transition-colors group">
                                        <td className="table-cell font-mono text-blue-500 text-xs font-bold">{po.poNumber || po.id}</td>
                                        <td className="table-cell text-slate-900 font-black">{po.vendor}</td>
                                        <td className="table-cell text-slate-500 text-xs max-w-xs truncate font-medium" title={po.items}>"{po.items}"</td>
                                        <td className="table-cell text-emerald-600 font-black">₹{Number(po.amount).toLocaleString()}</td>
                                        <td className="table-cell text-slate-400 text-[10px] font-bold uppercase">{po.raised}</td>
                                        <td className="table-cell text-slate-400 text-[10px] font-bold uppercase">{po.expectedDelivery}</td>
                                        <td className="table-cell w-36">
                                            <div className="flex gap-0.5">
                                                {stages.map((_, si) => (
                                                    <div key={si} className={`flex-1 h-1 rounded-full transition-all ${si <= stageIndex ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-100'}`} />
                                                ))}
                                            </div>
                                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-tighter mt-1.5">{stageName}</p>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusBadge[displayStatus] || statusBadge[po.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {displayStatus}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-1.5">
                                                {po.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(po.id, 'approved', 'Approval')}
                                                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="w-3 h-3" /> Approve
                                                    </button>
                                                )}
                                                {po.status === 'approved' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(po.id, 'issued', 'PO Issued')}
                                                        className="px-2.5 py-1.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm flex items-center gap-1"
                                                    >
                                                        <Truck className="w-3 h-3" /> Issue PO
                                                    </button>
                                                )}
                                                {po.status === 'issued' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(po.id, 'delivered', 'Delivered')}
                                                        className="px-2.5 py-1.5 bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center gap-1"
                                                    >
                                                        <ClipboardCheck className="w-3 h-3" /> GRN
                                                    </button>
                                                )}
                                                {po.status === 'delivered' && (
                                                    <button 
                                                        className="p-1 text-slate-300 cursor-not-allowed"
                                                        title="Process Complete"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create PO Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-brand" /> Create Purchase Order
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreatePO} className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">PO Number <span className="text-slate-400 text-[10px]">(Optional)</span></label>
                                    <input name="poNumber" value={formData.poNumber || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. PO-00002" />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Select Vendor <span className="text-red-500">*</span></label>
                                    <input required name="vendor" value={formData.vendor || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. National Pole Manufacturers" />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Procurement Items Summary <span className="text-red-500">*</span></label>
                                    <textarea required name="items" value={formData.items || ''} onChange={handleInputChange} rows="2" className="input w-full resize-none" placeholder="e.g. PSC Pole 9M 400Kg – 20 Nos"></textarea>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Total PO Amount (₹) <span className="text-red-500">*</span></label>
                                    <input required type="number" step="0.01" name="amount" value={formData.amount || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 225000" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Expected Delivery <span className="text-red-500">*</span></label>
                                    <input required type="date" name="expectedDelivery" value={formData.expectedDelivery || ''} onChange={handleInputChange} className="input w-full" />
                                </div>
                            </div>

                            <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" disabled={isSaving} onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSaving ? 'Generating...' : 'Generate PO'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
