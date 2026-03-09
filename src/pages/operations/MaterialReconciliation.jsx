import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, AlertCircle, RefreshCw, Download, Plus } from 'lucide-react';

// Master data based on SWPL-BRGF structure
const reconciliationData = [
    {
        code: '10', description: 'PSC Pole 8 Mtr 200 Kg including fixing', unit: 'No',
        contractorRate: 6234, subRate: 5800, poQty: 2.0,
        billedQty: 0,
        subcontractors: { 'JANKI ENTERPRISES': 0, 'GSAR': 0, 'JGD': 0, 'JYESTHI CONS.': 0, 'DARPAN POWER': 0, 'DILIP KUMAR': 0 },
        contractorTotal: 0, diff: 2.0,
    },
    {
        code: '50', description: 'PSC Pole 9 Mtr 400 Kg including fixing with cross arm', unit: 'No',
        contractorRate: 11250, subRate: 10500, poQty: 10.0,
        billedQty: 16,
        subcontractors: { 'JANKI ENTERPRISES': 0, 'GSAR': 16, 'JGD': 4, 'JYESTHI CONS.': 0, 'DARPAN POWER': 0, 'DILIP KUMAR': 0 },
        contractorTotal: 20, diff: -10.0,
    },
    {
        code: '60', description: 'ABC Cable 3X185+1X95 Sq. mm (CKM)', unit: 'CKM',
        contractorRate: 385000, subRate: 358000, poQty: 0.5,
        billedQty: 0.9766,
        subcontractors: { 'JANKI ENTERPRISES': 0.3, 'GSAR': 0.6766, 'JGD': 0, 'JYESTHI CONS.': 0, 'DARPAN POWER': 0, 'DILIP KUMAR': 0 },
        contractorTotal: 0.9766, diff: -0.4766,
    },
    {
        code: '80', description: 'PSC Pole 9 Mtr 300 Kg incl fixing', unit: 'No',
        contractorRate: 9340, subRate: 8700, poQty: 10.0,
        billedQty: 10,
        subcontractors: { 'JANKI ENTERPRISES': 0, 'GSAR': 0, 'JGD': 10, 'JYESTHI CONS.': 0, 'DARPAN POWER': 0, 'DILIP KUMAR': 0 },
        contractorTotal: 10, diff: 0.0,
    },
    {
        code: '100', description: 'Stay Set Complete (Ground Anchor type)', unit: 'Set',
        contractorRate: 1250, subRate: 1150, poQty: 10.0,
        billedQty: 5,
        subcontractors: { 'JANKI ENTERPRISES': 5, 'GSAR': 0, 'JGD': 0, 'JYESTHI CONS.': 0, 'DARPAN POWER': 2, 'DILIP KUMAR': 0 },
        contractorTotal: 5, diff: 5.0,
    },
    {
        code: '120', description: 'HG Fuse Set Complete with LA/SA', unit: 'Set',
        contractorRate: 4225, subRate: 3900, poQty: 10.0,
        billedQty: 7,
        subcontractors: { 'JANKI ENTERPRISES': 5, 'GSAR': 2, 'JGD': 0, 'JYESTHI CONS.': 0, 'DARPAN POWER': 0, 'DILIP KUMAR': 0 },
        contractorTotal: 7, diff: 3.0,
    },
];

const subcontractors = ['JANKI ENTERPRISES', 'GSAR', 'JGD', 'JYESTHI CONS.', 'DARPAN POWER', 'DILIP KUMAR'];

function getStatus(diff, poQty) {
    if (diff < 0) return { label: 'Over Issued', color: 'text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-500', badge: 'badge-red' };
    if (diff === 0) return { label: 'Reconciled', color: 'text-green-400 bg-green-500/10 border-green-500/20', dot: 'bg-green-500', badge: 'badge-green' };
    const pct = poQty > 0 ? (diff / poQty) * 100 : 0;
    if (pct <= 2) return { label: 'Reconciled', color: 'text-green-400 bg-green-500/10 border-green-500/20', dot: 'bg-green-500', badge: 'badge-green' };
    if (pct <= 5) return { label: 'Minor Variance', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500', badge: 'badge-yellow' };
    return { label: 'Under Utilized', color: 'text-blue-400 bg-blue-500/10 border-green-100', dot: 'bg-blue-500', badge: 'badge-blue' };
}

export default function MaterialReconciliation() {
    const [tab, setTab] = useState('summary');

    const criticalItems = reconciliationData.filter(r => r.diff < 0 || (r.poQty > 0 && Math.abs(r.diff / r.poQty) * 100 > 5));

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Critical Alerts Banner */}
            {criticalItems.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 font-semibold text-sm">{criticalItems.length} Critical Material Variance{criticalItems.length > 1 ? 's' : ''} Detected</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                            {criticalItems.map(r => `Bill Code ${r.code}`).join(', ')} — immediate reconciliation required
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl w-fit">
                {[
                    { id: 'summary', label: 'Sterling vs Contractor' },
                    { id: 'subcontractor', label: 'Subcontractor-Wise' },
                    { id: 'balance', label: 'Material Balance' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <button className="btn-secondary"><RefreshCw className="w-4 h-4" /> Sync RA Bills</button>
                <button className="btn-secondary"><Download className="w-4 h-4" /> Export Excel</button>
                <button className="btn-primary"><Plus className="w-4 h-4" /> Record Issuance</button>
            </div>

            {/* SUMMARY TAB */}
            {tab === 'summary' && (
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="section-title">Sterling vs Contractor Summary – SWPL-BRGF</h3>
                        <span className="text-slate-400 text-xs">RA Bill No: RA-05 (Latest)</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['Bill Code', 'Description', 'Unit', 'Cont. Rate', 'Sub Rate', 'PO Qty (Sterling)', 'Billed Qty', 'Contractor Total', 'Diff Qty', 'Diff Value', 'Status'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reconciliationData.map((row, i) => {
                                    const status = getStatus(row.diff, row.poQty);
                                    return (
                                        <tr key={i} className={`table-row ${row.diff < 0 ? 'bg-red-500/5' : ''}`}>
                                            <td className="table-cell font-mono font-bold text-blue-400">{row.code}</td>
                                            <td className="table-cell max-w-xs">
                                                <p className="text-slate-900 leading-snug">{row.description}</p>
                                            </td>
                                            <td className="table-cell text-slate-400">{row.unit}</td>
                                            <td className="table-cell text-green-400 font-semibold">₹{row.contractorRate.toLocaleString()}</td>
                                            <td className="table-cell text-slate-400">₹{row.subRate.toLocaleString()}</td>
                                            <td className="table-cell text-slate-900 font-bold">{row.poQty}</td>
                                            <td className="table-cell text-slate-700">{row.billedQty}</td>
                                            <td className="table-cell text-slate-700">{row.contractorTotal}</td>
                                            <td className={`table-cell font-bold text-sm ${row.diff < 0 ? 'text-red-400' : row.diff === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {row.diff > 0 ? '+' : ''}{row.diff}
                                            </td>
                                            <td className={`table-cell font-semibold ${row.diff < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                                {row.diff !== 0 ? `₹${Math.abs(Math.round(row.diff * row.contractorRate)).toLocaleString()}` : '₹0'}
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                                                    <span className={`badge ${status.badge}`}>{status.label}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SUBCONTRACTOR TAB */}
            {tab === 'subcontractor' && (
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h3 className="section-title">Subcontractor-Wise Material Distribution</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="table-header">Bill Code</th>
                                    <th className="table-header">Description</th>
                                    <th className="table-header">Unit</th>
                                    {subcontractors.map(s => (
                                        <th key={s} className="table-header text-center whitespace-nowrap">{s.split(' ')[0]}</th>
                                    ))}
                                    <th className="table-header">Total</th>
                                    <th className="table-header">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reconciliationData.map((row, i) => {
                                    const status = getStatus(row.diff, row.poQty);
                                    return (
                                        <tr key={i} className="table-row">
                                            <td className="table-cell font-mono font-bold text-blue-400">{row.code}</td>
                                            <td className="table-cell text-slate-900 max-w-xs">{row.description.substring(0, 40)}...</td>
                                            <td className="table-cell text-slate-400">{row.unit}</td>
                                            {subcontractors.map(s => (
                                                <td key={s} className={`table-cell text-center font-semibold ${row.subcontractors[s] > 0 ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {row.subcontractors[s] || '—'}
                                                </td>
                                            ))}
                                            <td className="table-cell text-slate-900 font-bold">{row.contractorTotal}</td>
                                            <td className="table-cell">
                                                <span className={`badge ${status.badge}`}>{status.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* BALANCE TAB */}
            {tab === 'balance' && (
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h3 className="section-title">Material Balance Statement</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['Item', 'Unit', 'PO Qty', 'Issued to Site', 'Consumed (RA)', 'Balance – Store', 'Balance – Site', 'Variance', 'Status'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {reconciliationData.map((row, i) => {
                                    const issued = row.poQty;
                                    const consumed = row.contractorTotal;
                                    const balance = issued - consumed;
                                    const storeBalance = Math.max(0, balance * 0.4);
                                    const siteBalance = Math.max(0, balance * 0.6);
                                    const status = getStatus(row.diff, row.poQty);
                                    return (
                                        <tr key={i} className="table-row">
                                            <td className="table-cell text-slate-900">{row.description.substring(0, 35)}...</td>
                                            <td className="table-cell text-slate-400">{row.unit}</td>
                                            <td className="table-cell text-slate-900 font-bold">{row.poQty}</td>
                                            <td className="table-cell text-blue-400">{issued}</td>
                                            <td className="table-cell text-orange-400">{consumed}</td>
                                            <td className="table-cell text-green-400">{storeBalance.toFixed(2)}</td>
                                            <td className="table-cell text-cyan-400">{siteBalance.toFixed(2)}</td>
                                            <td className={`table-cell font-bold ${row.diff < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                {row.diff > 0 ? '+' : ''}{row.diff}
                                            </td>
                                            <td className="table-cell">
                                                <span className={`badge ${status.badge}`}>{status.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
