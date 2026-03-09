import { useState } from 'react';
import { Plus, Search, AlertTriangle, CheckCircle, XCircle, ChevronDown, X } from 'lucide-react';

const initialBoqData = [
    { code: '10', description: 'PSC Pole 8 Mtr 200 Kg including fixing in position', unit: 'No', contractorRate: 6234, subRate: 5800, poQty: 2.0, billedQty: 0, contractorTotal: 0, diff: 2.0 },
    { code: '20', description: 'PSC Pole 8 Mtr 300 Kg including fixing in position', unit: 'No', contractorRate: 7450, subRate: 6900, poQty: 5.0, billedQty: 4, contractorTotal: 4, diff: 1.0 },
    { code: '30', description: 'PSC Pole 9 Mtr 200 Kg including fixing in position', unit: 'No', contractorRate: 8120, subRate: 7500, poQty: 8.0, billedQty: 8, contractorTotal: 8, diff: 0.0 },
    { code: '40', description: 'PSC Pole 9 Mtr 300 Kg including fixing in position', unit: 'No', contractorRate: 9340, subRate: 8700, poQty: 12.0, billedQty: 10, contractorTotal: 10, diff: 2.0 },
    { code: '50', description: 'PSC Pole 9 Mtr 400 Kg including fixing in position with cross arm', unit: 'No', contractorRate: 11250, subRate: 10500, poQty: 10.0, billedQty: 16, contractorTotal: 20, diff: -10.0 },
    { code: '60', description: 'ABC Cable 3X95+1X70 Sq. mm (CKM)', unit: 'CKM', contractorRate: 245000, subRate: 228000, poQty: 0.5, billedQty: 0.9766, contractorTotal: 0.9766, diff: -0.4766 },
    { code: '70', description: 'ABC Cable 3X50+1X25 Sq. mm (CKM)', unit: 'CKM', contractorRate: 178000, subRate: 165000, poQty: 1.2, billedQty: 1.1, contractorTotal: 1.1, diff: 0.1 },
    { code: '80', description: 'ABC Cable 3X185+1X95 Sq. mm (CKM)', unit: 'CKM', contractorRate: 385000, subRate: 358000, poQty: 0.5, billedQty: 0.9766, contractorTotal: 0.9766, diff: -0.4766 },
    { code: '100', description: 'Stay Set Complete (Ground Anchor type)', unit: 'Set', contractorRate: 1250, subRate: 1150, poQty: 10.0, billedQty: 5, contractorTotal: 5, diff: 5.0 },
    { code: '110', description: 'GI Wire 7/8 SWG for Stay Wire', unit: 'Meter', contractorRate: 85, subRate: 78, poQty: 500, billedQty: 490, contractorTotal: 490, diff: 10.0 },
    { code: '120', description: 'HG Fuse Set (Complete) with LA/SA', unit: 'Set', contractorRate: 4225, subRate: 3900, poQty: 10.0, billedQty: 5, contractorTotal: 5, diff: 5.0 },
    { code: '130', description: 'Distribution Transformer 25 KVA 11/0.4 KV', unit: 'No', contractorRate: 89500, subRate: 83000, poQty: 3.0, billedQty: 3, contractorTotal: 3, diff: 0.0 },
];

function getStatus(diff, poQty) {
    const pct = poQty > 0 ? Math.abs(diff / poQty) * 100 : 0;
    if (diff < 0) return { label: 'Over Issued', className: 'badge-red', icon: 'red' };
    if (diff === 0) return { label: 'Reconciled', className: 'badge-green', icon: 'green' };
    if (pct <= 2) return { label: 'Reconciled', className: 'badge-green', icon: 'green' };
    if (pct <= 5) return { label: 'Minor Variance', className: 'badge-yellow', icon: 'yellow' };
    return { label: 'Under Utilized', className: 'badge-blue', icon: 'blue' };
}

export default function BOQ() {
    const [boqData, setBoqData] = useState(initialBoqData);
    const [search, setSearch] = useState('');
    const [project, setProject] = useState('SWPL-BRGF');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const filtered = boqData.filter(r =>
        r.description.toLowerCase().includes(search.toLowerCase()) || r.code.includes(search)
    );

    const totals = {
        contractValue: boqData.reduce((a, r) => a + r.contractorRate * r.poQty, 0),
        billedValue: boqData.reduce((a, r) => a + r.contractorRate * r.billedQty, 0),
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        const poQty = parseFloat(formData.poQty || 0);
        
        const newItem = {
            code: formData.code || `${boqData.length * 10 + 10}`,
            description: formData.description || '',
            unit: formData.unit || 'No',
            contractorRate: parseFloat(formData.contractorRate || 0),
            subRate: parseFloat(formData.subRate || 0),
            poQty: poQty,
            billedQty: 0,
            contractorTotal: 0,
            diff: poQty // initially diff is poQty because none is billed
        };
        
        setBoqData([newItem, ...boqData]);
        setIsModalOpen(false);
        setFormData({});
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                <select className="select w-48 bg-white" value={project} onChange={e => setProject(e.target.value)}>
                    <option>SWPL-BRGF</option>
                    <option>Patna Metro B</option>
                    <option>Solar Muzaffarpur</option>
                </select>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-9 w-full" placeholder="Search BOQ item..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total BOQ Items', value: boqData.length, color: 'text-blue-400' },
                    { label: 'Reconciled', value: boqData.filter(r => getStatus(r.diff, r.poQty).icon === 'green').length, color: 'text-green-400' },
                    { label: 'Over Issued', value: boqData.filter(r => r.diff < 0).length, color: 'text-red-400' },
                    { label: 'Total PO Value', value: `₹${(totals.contractValue / 100000).toFixed(1)}L`, color: 'text-yellow-400' },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 px-1">
                {[
                    { color: 'bg-green-500', label: 'Reconciled (≤2% variance)' },
                    { color: 'bg-yellow-500', label: 'Minor Variance (2–5%)' },
                    { color: 'bg-blue-500', label: 'Under Utilized (>5%)' },
                    { color: 'bg-red-500', label: 'Over Issued' },
                ].map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                        {l.label}
                    </div>
                ))}
            </div>

            {/* BOQ Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Bill Code', 'Description', 'Unit', 'Cont. Rate', 'Sub Rate', 'PO Qty', 'Billed Qty', 'Contractor Total', 'Difference', 'Diff Value', 'Status'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="11" className="p-6 text-center text-slate-500">No BOQ items found. Add a new one.</td></tr>
                            ) : filtered.map((row, i) => {
                                const status = getStatus(row.diff, row.poQty);
                                return (
                                    <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                                        <td className="table-cell font-mono text-blue-500 font-semibold">{row.code}</td>
                                        <td className="table-cell max-w-xs">
                                            <p className="text-slate-900 text-xs leading-relaxed">{row.description}</p>
                                        </td>
                                        <td className="table-cell text-slate-500">{row.unit}</td>
                                        <td className="table-cell text-emerald-600 font-medium">₹{row.contractorRate.toLocaleString()}</td>
                                        <td className="table-cell text-slate-500">₹{row.subRate.toLocaleString()}</td>
                                        <td className="table-cell text-slate-900 font-semibold">{row.poQty}</td>
                                        <td className="table-cell text-slate-600">{row.billedQty}</td>
                                        <td className="table-cell text-slate-600">{row.contractorTotal}</td>
                                        <td className={`table-cell font-semibold ${row.diff < 0 ? 'text-red-500' : row.diff === 0 ? 'text-green-500' : 'text-amber-500'}`}>
                                            {row.diff > 0 ? '+' : ''}{row.diff}
                                        </td>
                                        <td className={`table-cell font-semibold text-xs ${row.diff < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                            {row.diff !== 0 ? `₹${Math.abs(row.diff * row.contractorRate).toLocaleString()}` : '—'}
                                        </td>
                                        <td className="table-cell">
                                            <span className={`badge ${status.className}`}>{status.label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add BOQ Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-brand" /> Add BOQ Item
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddItem} className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Description <span className="text-red-500">*</span></label>
                                    <textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="2" className="input w-full resize-none" placeholder="e.g. PSC Pole 8 Mtr 200 Kg"></textarea>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Bill Code <span className="text-red-500">*</span></label>
                                    <input required name="code" value={formData.code || ''} onChange={handleInputChange} className="input w-full font-mono" placeholder="e.g. 140" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Unit <span className="text-red-500">*</span></label>
                                    <input required name="unit" value={formData.unit || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. No, Set, CKM" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Contractor Rate (₹) <span className="text-red-500">*</span></label>
                                    <input required type="number" step="0.01" name="contractorRate" value={formData.contractorRate || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 6200" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Sub Rate (₹)</label>
                                    <input type="number" step="0.01" name="subRate" value={formData.subRate || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 5800" />
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">PO Quantity <span className="text-red-500">*</span></label>
                                    <input required type="number" step="0.01" name="poQty" value={formData.poQty || ''} onChange={handleInputChange} className="input w-full" placeholder="e.g. 10.5" />
                                </div>
                            </div>

                            <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 shadow-sm shadow-green-500/20 transition-all">
                                    Add BOQ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
