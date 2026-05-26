import { useState, useMemo, useEffect } from 'react';
import { 
    FileText, Search, Plus, Filter, Download, MoreVertical, 
    ArrowRightLeft, CheckCircle2, AlertCircle, Clock, 
    Calendar, Building2, Wallet, CreditCard, ChevronRight,
    TrendingUp, ArrowUpRight, X, LayoutGrid, List,
    Trash2, Edit3, Eye, ChevronDown, Save, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import Skeleton from '../../components/common/Skeleton';
import SearchableSelect from '../../components/common/SearchableSelect';
import { voucherAPI } from '../../api/voucher';
import { inventoryAPI } from '../../api/inventory';
import { equipmentAPI } from '../../api/equipment';
import { vendorAPI } from '../../api/vendor';
import { tenderAPI } from '../../api/tender';

const EMPTY_REF_DATA = { materials: [], equipments: [], vendors: [], tenders: [] };
const EMPTY_REF_LOADING = { materials: false, equipments: false, vendors: false, tenders: false };

const INITIAL_FORM = {
    type: 'Journal Voucher',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    tdsDeductions: 0,
    secondaryPartyAccount: '',
    narrationRemarks: '',
    materialId: '',
    materialName: '',
    equipmentId: '',
    equipmentName: '',
    vendorId: '',
    vendorName: '',
    tenderId: '',
    tenderName: '',
};

const parseList = (res, key) => {
    const raw = res?.data ?? res;
    const nested = raw?.[key];
    if (Array.isArray(nested)) return nested;
    if (Array.isArray(raw)) return raw;
    return [];
};

const VOUCHER_TYPES = [
    { key: 'Payment Voucher', label: 'Payment', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    { key: 'Receipt Voucher', label: 'Receipt', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { key: 'Journal Voucher', label: 'Journal', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { key: 'Sales Voucher', label: 'Sales', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { key: 'Purchase Voucher', label: 'Purchase', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { key: 'Contra Voucher', label: 'Contra', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
];

export default function Vouchers() {
    const { setActiveModule } = useApp();
    const [vouchers, setVouchers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [viewMode, setViewMode] = useState('table');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTypeLocked, setIsTypeLocked] = useState(false);

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [refData, setRefData] = useState(EMPTY_REF_DATA);
    const [refLoading, setRefLoading] = useState(EMPTY_REF_LOADING);

    const [secondaryPartyKind, setSecondaryPartyKind] = useState('');

    const secondaryPartyMeta = useMemo(
        () => ({
            material: {
                label: 'Material',
                dataKey: 'materials',
                idField: 'materialId',
                nameField: 'materialName',
                getOptionLabel: (o) => o.materialName || o.name || `Material #${o.id}`,
            },
            equipment: {
                label: 'Equipment',
                dataKey: 'equipments',
                idField: 'equipmentId',
                nameField: 'equipmentName',
                getOptionLabel: (o) => o.equipmentName || o.name || `Equipment #${o.id}`,
            },
            vendor: {
                label: 'Vendor',
                dataKey: 'vendors',
                idField: 'vendorId',
                nameField: 'vendorName',
                getOptionLabel: (o) => o.name || o.vendorName || `Vendor #${o.id}`,
            },
            tender: {
                label: 'Tender',
                dataKey: 'tenders',
                idField: 'tenderId',
                nameField: 'tenderName',
                getOptionLabel: (o) => o.name || o.nameOfWork || o.Name || `Tender #${o.id}`,
            },
        }),
        []
    );

    const deriveSecondaryPartyKind = (voucherLike) => {
        if (voucherLike?.materialId != null && String(voucherLike.materialId) !== '') return 'material';
        if (voucherLike?.equipmentId != null && String(voucherLike.equipmentId) !== '') return 'equipment';
        if (voucherLike?.vendorId != null && String(voucherLike.vendorId) !== '') return 'vendor';
        if (voucherLike?.tenderId != null && String(voucherLike.tenderId) !== '') return 'tender';
        return '';
    };

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const res = await voucherAPI.getAllVouchers();
            const data = res?.vouchers || res?.data?.vouchers || res?.data || res || [];
            setVouchers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load voucher registry.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchRefData = async () => {
        setRefLoading({ materials: true, equipments: true, vendors: true, tenders: true });
        const setKey = (key, items) => setRefData((prev) => ({ ...prev, [key]: items }));
        const setLoaded = (key) => setRefLoading((prev) => ({ ...prev, [key]: false }));

        try {
            const res = await inventoryAPI.getAllMaterials();
            setKey('materials', parseList(res, 'materials'));
        } catch {
            setKey('materials', []);
        } finally {
            setLoaded('materials');
        }

        try {
            const res = await equipmentAPI.getAllEquipments();
            setKey('equipments', parseList(res, 'equipments'));
        } catch {
            setKey('equipments', []);
        } finally {
            setLoaded('equipments');
        }

        try {
            const res = await vendorAPI.getAllVendors();
            setKey('vendors', parseList(res, 'vendors'));
        } catch {
            setKey('vendors', []);
        } finally {
            setLoaded('vendors');
        }

        try {
            const res = await tenderAPI.getAllTenders();
            setKey('tenders', parseList(res, 'tenders'));
        } catch {
            setKey('tenders', []);
        } finally {
            setLoaded('tenders');
        }
    };

    useEffect(() => {
        if (isModalOpen) fetchRefData();
    }, [isModalOpen]);

    const handleRefSelect = (fieldPrefix) => ({ id, label }) => {
        setFormData((prev) => ({
            ...prev,
            [`${fieldPrefix}Id`]: id !== '' && id != null ? id : '',
            [`${fieldPrefix}Name`]: label || '',
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenEdit = (voucher) => {
        setCurrentId(voucher.id);
        setSecondaryPartyKind(deriveSecondaryPartyKind(voucher));
        setFormData({
            ...INITIAL_FORM,
            type: voucher.type || 'Journal Voucher',
            date: voucher.date || new Date().toISOString().split('T')[0],
            amount: voucher.amount || '',
            tdsDeductions: voucher.tdsDeductions || 0,
            secondaryPartyAccount: voucher.secondaryPartyAccount || '',
            narrationRemarks: voucher.narrationRemarks || '',
            materialId: voucher.materialId ?? '',
            materialName: voucher.materialName || '',
            equipmentId: voucher.equipmentId ?? '',
            equipmentName: voucher.equipmentName || '',
            vendorId: voucher.vendorId ?? '',
            vendorName: voucher.vendorName || '',
            tenderId: voucher.tenderId ?? '',
            tenderName: voucher.tenderName || '',
        });
        setIsEditing(true);
        setIsTypeLocked(true);
        setIsModalOpen(true);
    };

    const handleDelete = (voucher) => {
        setDeleteConfirm({ show: true, id: voucher.id, name: `Voucher #${voucher.id}` });
    };

    const confirmDelete = async () => {
        setIsSaving(true);
        try {
            await voucherAPI.deleteVoucher(deleteConfirm.id);
            toast.success('Voucher record deleted');
            fetchVouchers();
            setDeleteConfirm({ show: false, id: null, name: '' });
        } catch (error) {
            console.error("Delete error:", error);
            toast.error('Failed to remove voucher');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault ? e.preventDefault() : null;
        setIsSaving(true);
        const payload = {
            ...formData,
            amount: Number(formData.amount),
            tdsDeductions: Number(formData.tdsDeductions),
            materialId: formData.materialId !== '' ? formData.materialId : null,
            equipmentId: formData.equipmentId !== '' ? formData.equipmentId : null,
            vendorId: formData.vendorId !== '' ? formData.vendorId : null,
            tenderId: formData.tenderId !== '' ? formData.tenderId : null,
        };
        try {
            if (isEditing) {
                await voucherAPI.updateVoucher(currentId, payload);
                toast.success('Voucher updated successfully');
            } else {
                await voucherAPI.createVoucher(payload);
                toast.success('Voucher posted to ledger');
            }
            fetchVouchers();
            setIsModalOpen(false);
            setIsEditing(false);
            setFormData(freshForm());
        } catch (error) {
            console.error("Save error:", error);
            toast.error('Failed to post voucher');
        } finally {
            setIsSaving(false);
        }
    };

    const freshForm = (overrides = {}) => ({
        ...INITIAL_FORM,
        date: new Date().toISOString().split('T')[0],
        ...overrides,
    });

    const handleQuickEntry = (type = 'Journal Voucher', lock = false) => {
        setIsEditing(false);
        setIsTypeLocked(lock);
        setSecondaryPartyKind('');
        setFormData(freshForm({ type }));
        setIsModalOpen(true);
    };

    const clearSecondaryPartyRefs = (next = {}) => ({
        ...next,
        materialId: '',
        materialName: '',
        equipmentId: '',
        equipmentName: '',
        vendorId: '',
        vendorName: '',
        tenderId: '',
        tenderName: '',
    });

    const handleSecondaryPartyKindChange = (e) => {
        const nextKind = e.target.value;
        setSecondaryPartyKind(nextKind);
        setFormData((prev) => clearSecondaryPartyRefs({
            ...prev,
            secondaryPartyAccount: '',
        }));
    };

    const handleSecondaryPartySelect = ({ id, label }) => {
        if (!secondaryPartyKind) return;
        const meta = secondaryPartyMeta[secondaryPartyKind];
        if (!meta) return;

        setFormData((prev) => {
            const cleared = clearSecondaryPartyRefs(prev);
            if (id === '' || id == null) {
                return {
                    ...cleared,
                    secondaryPartyAccount: '',
                };
            }
            return {
                ...cleared,
                secondaryPartyAccount: label || '',
                [meta.idField]: id,
                [meta.nameField]: label || '',
            };
        });
    };

    const filteredVouchers = vouchers.filter(v => 
        ( (v.secondaryPartyAccount || '').toLowerCase().includes(search.toLowerCase()) || 
          (v.id || '').toString().includes(search.toLowerCase()) || 
          (v.narrationRemarks || '').toLowerCase().includes(search.toLowerCase()) ) &&
        (filter === 'All' || (v.type || '').includes(filter))
    );

    return (
        <div className="space-y-5 animate-fade-in pb-12 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Voucher Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Financial journal registry & transaction posting</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative hidden sm:block w-56">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search vouchers..."
                            className="input pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleQuickEntry('Journal Voucher', false)} className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Quick Voucher
                    </button>
                </div>
            </div>

            {/* Quick Entry Type Buttons */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-800 text-sm">Quick Entry Console</h3>
                    <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                        <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-[#2f6645] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#2f6645] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {VOUCHER_TYPES.map(vt => (
                        <button
                            key={vt.key}
                            onClick={() => handleQuickEntry(vt.key, true)}
                            className={`flex flex-col items-center justify-center gap-2 p-3 min-h-[80px] rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${vt.bg} ${vt.border}`}
                        >
                            <span className={`text-xs font-bold text-slate-700`}>{vt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Registry Table */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-800 text-sm">Voucher Registry</h3>
                        <div className="flex gap-1">
                            {['All', 'Payment', 'Receipt', 'Journal'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        filter === t ? 'bg-[#2f6645] text-white' : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="table-header">Voucher & Date</th>
                                <th className="table-header">Party / Particulars</th>
                                <th className="table-header">Source / Bank</th>
                                <th className="table-header text-right">Amount</th>
                                <th className="table-header text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="table-row">
                                        <td className="table-cell"><div className="flex gap-2"><Skeleton variant="circle" className="w-9 h-9" /><Skeleton variant="text" className="w-24" /></div></td>
                                        <td className="table-cell"><Skeleton variant="text" className="w-40" /><Skeleton variant="text" className="w-32 mt-1" /></td>
                                        <td className="table-cell"><div className="flex gap-2"><Skeleton variant="circle" className="w-7 h-7" /><Skeleton variant="text" className="w-20" /></div></td>
                                        <td className="table-cell text-right"><Skeleton variant="text" className="ml-auto w-20" /></td>
                                        <td className="table-cell text-center"><Skeleton variant="badge" className="mx-auto mt-1 w-24" /></td>
                                    </tr>
                                ))
                            ) : filteredVouchers.map(v => (
                                <tr
                                    key={v.id}
                                    className="table-row hover:bg-slate-50 transition-colors group"
                                >
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                v.type?.includes('Payment') ? 'bg-rose-50 text-rose-500' :
                                                v.type?.includes('Receipt') ? 'bg-emerald-50 text-emerald-500' :
                                                'bg-blue-50 text-blue-500'
                                            }`}>
                                                <ArrowRightLeft className={`w-4 h-4 ${v.type?.includes('Receipt') ? 'rotate-90' : (v.type?.includes('Payment') ? '-rotate-90' : '')}`} />
                                            </div>
                                            <div>
                                                <p className="text-slate-800 font-semibold text-sm">#{v.id}</p>
                                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{v.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <p className="text-slate-800 font-bold">{v.secondaryPartyAccount || 'Internal Account'}</p>
                                        <p className="text-slate-400 text-xs line-clamp-1 max-w-[220px] font-medium">{v.narrationRemarks || 'No narrative provided'}</p>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-slate-700 font-black text-[10px] uppercase tracking-widest">{v.type?.split(' ')[0]}</p>
                                                <p className="text-slate-400 text-[9px] font-bold mt-0.5 uppercase tracking-tighter">Debit/Credit Entry</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell text-right">
                                        <p className={`font-black text-sm tabular-nums ${
                                            v.type?.includes('Receipt') ? 'text-emerald-600' : 'text-slate-800'
                                        }`}>
                                            {v.type?.includes('Receipt') ? '+' : '-'}₹{(Number(v.amount) || 0).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => { setActiveModule('voucher-detail'); }} className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-all hover:scale-110 active:scale-90" title="View Details"><Eye className="w-4 h-4" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(v); }} className="p-2 hover:bg-amber-50 text-amber-500 rounded-xl transition-all hover:scale-110 active:scale-90" title="Edit Voucher"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(v); }} className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all hover:scale-110 active:scale-90" title="Void Voucher"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Voucher Entry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                            <div>
                                <h2 className="text-base font-semibold">Journal Entry</h2>
                                <p className="text-xs text-white/60 mt-0.5">Entry Terminal</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
                            <div>
                                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#1e3a34] mb-6 uppercase">1. Basic Parameters</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 leading-none">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Voucher Type <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select 
                                                name="type" 
                                                className={`input w-full h-12 appearance-none bg-white pr-10 font-bold ${isTypeLocked ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`} 
                                                value={formData.type} 
                                                onChange={handleInputChange}
                                                disabled={isTypeLocked}
                                            >
                                                {VOUCHER_TYPES.map(vt => <option key={vt.key} value={vt.key}>{vt.label}</option>)}
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Entry Date <span className="text-red-500">*</span></label>
                                        <input name="date" type="date" className="input h-12 font-bold" value={formData.date} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#1e3a34] mb-6 uppercase">2. Financial Matrix</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹) <span className="text-red-500">*</span></label>
                                        <input name="amount" type="number" className="input h-12 font-black text-slate-800" placeholder="0.00" value={formData.amount} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">TDS / Deductions (₹)</label>
                                        <input name="tdsDeductions" type="number" className="input h-12 font-black text-rose-500 bg-rose-50/30 border-rose-100" placeholder="0.00" value={formData.tdsDeductions} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#1e3a34] mb-6 uppercase">3. Party & Intent</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Secondary Party / Ledger Account <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Type <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <select
                                                        className="input w-full h-12 appearance-none bg-white pr-10 font-bold"
                                                        value={secondaryPartyKind}
                                                        onChange={handleSecondaryPartyKindChange}
                                                    >
                                                        <option value="">Select type...</option>
                                                        <option value="material">Material</option>
                                                        <option value="equipment">Equipment</option>
                                                        <option value="vendor">Vendor</option>
                                                        <option value="tender">Tender</option>
                                                    </select>
                                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>
                                            <SearchableSelect
                                                label={secondaryPartyKind ? secondaryPartyMeta[secondaryPartyKind]?.label : 'Select'}
                                                required
                                                placeholder={secondaryPartyKind ? `Search ${secondaryPartyMeta[secondaryPartyKind]?.label?.toLowerCase()}...` : 'Select type first...'}
                                                options={secondaryPartyKind ? (refData[secondaryPartyMeta[secondaryPartyKind]?.dataKey] || []) : []}
                                                value={secondaryPartyKind ? formData[secondaryPartyMeta[secondaryPartyKind]?.idField] : ''}
                                                displayLabel={secondaryPartyKind ? formData[secondaryPartyMeta[secondaryPartyKind]?.nameField] : ''}
                                                isLoading={secondaryPartyKind ? refLoading[secondaryPartyMeta[secondaryPartyKind]?.dataKey] : false}
                                                disabled={!secondaryPartyKind}
                                                getOptionValue={(o) => o.id}
                                                getOptionLabel={(o) => secondaryPartyKind ? secondaryPartyMeta[secondaryPartyKind]?.getOptionLabel(o) : ''}
                                                onChange={handleSecondaryPartySelect}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Narration / Detailed Remarks</label>
                                        <textarea name="narrationRemarks" rows="3" className="input py-3 font-medium h-auto" placeholder="Enter transaction narrative..." value={formData.narrationRemarks} onChange={handleInputChange}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Discard</button>
                                <button type="submit" disabled={isSaving} className="btn-primary flex-1 h-14 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 bg-[#1e3a34] hover:bg-[#152a26]">
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isEditing ? 'Update Journal' : 'Post to Ledger'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Void Voucher?</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Permanent Audit Trail Change</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-8">
                            Are you sure you want to void <span className="font-black text-slate-900 underline decoration-red-200">{deleteConfirm.name}</span>? This action cannot be undone once reconciled.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                                className="flex-1 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isSaving}
                                className="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Void Voucher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BookOpenIcon({ className }) {
    return <FileText className={className} />;
}
