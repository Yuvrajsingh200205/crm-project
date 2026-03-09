import { useState } from 'react';
import { FileText, Download, AlertTriangle, CheckCircle, RefreshCw, Search } from 'lucide-react';

const gstData = [
    { period: 'Feb 2026', gstr1: 'Filed', gstr3b: 'Pending', taxLiability: 284500, itcClaimed: 198400, netPayable: 86100 },
    { period: 'Jan 2026', gstr1: 'Filed', gstr3b: 'Filed', taxLiability: 312000, itcClaimed: 224600, netPayable: 87400 },
    { period: 'Dec 2025', gstr1: 'Filed', gstr3b: 'Filed', taxLiability: 291800, itcClaimed: 208200, netPayable: 83600 },
    { period: 'Nov 2025', gstr1: 'Filed', gstr3b: 'Filed', taxLiability: 268400, itcClaimed: 189300, netPayable: 79100 },
];

const invoiceData = [
    { invoice: 'INV-2026-011', client: 'Bihar Rural Dev.', base: 2034350, gst18: 366183, total: 2400533, eway: true, einvoice: true },
    { invoice: 'INV-2026-012', client: 'PMRCL Patna', base: 1982500, gst18: 356850, total: 2339350, eway: true, einvoice: false },
    { invoice: 'INV-2026-013', client: 'TechCorp India', base: 895000, gst18: 161100, total: 1056100, eway: false, einvoice: true },
    { invoice: 'INV-2026-014', client: 'Gaya Municipal', base: 456000, gst12: 54720, total: 510720, eway: true, einvoice: true },
];

export default function GSTManagement() {
    const [tab, setTab] = useState('returns');

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Alert */}
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-yellow-400 font-semibold text-sm">GSTR-3B for February 2026 is pending</p>
                        <p className="text-slate-400 text-xs mt-0.5">Due Date: 20 March 2026 · Tax Payable: ₹86,100</p>
                    </div>
                    <button className="btn-primary text-xs whitespace-nowrap">File Now</button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Tax Liability (Feb)', value: '₹2,84,500', color: 'text-red-400' },
                    { label: 'ITC Available', value: '₹1,98,400', color: 'text-green-400' },
                    { label: 'Net GST Payable', value: '₹86,100', color: 'text-orange-400' },
                    { label: 'E-Invoices Generated', value: '14', color: 'text-blue-400' },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl w-fit">
                {[{ id: 'returns', label: 'GSTR Returns' }, { id: 'invoices', label: 'Tax Invoices' }, { id: 'itc', label: 'ITC Reconciliation' }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-slate-900'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'returns' && (
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="section-title">GST Return Filing Status</h3>
                        <div className="flex gap-2">
                            <button className="btn-secondary text-xs"><RefreshCw className="w-3.5 h-3.5" /> Sync GSTN</button>
                            <button className="btn-secondary text-xs"><Download className="w-3.5 h-3.5" /> Export</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['Period', 'GSTR-1', 'GSTR-3B', 'Tax Liability', 'ITC Claimed', 'Net Payable', 'Action'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {gstData.map((row, i) => (
                                    <tr key={i} className="table-row">
                                        <td className="table-cell text-slate-900 font-medium">{row.period}</td>
                                        <td className="table-cell">
                                            <span className={`badge ${row.gstr1 === 'Filed' ? 'badge-green' : 'badge-yellow'}`}>{row.gstr1}</span>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`badge ${row.gstr3b === 'Filed' ? 'badge-green' : 'badge-yellow'}`}>{row.gstr3b}</span>
                                        </td>
                                        <td className="table-cell text-red-400 font-medium">₹{row.taxLiability.toLocaleString()}</td>
                                        <td className="table-cell text-green-400 font-medium">₹{row.itcClaimed.toLocaleString()}</td>
                                        <td className="table-cell text-orange-400 font-bold">₹{row.netPayable.toLocaleString()}</td>
                                        <td className="table-cell">
                                            <button className="btn-secondary text-xs py-1 px-2">
                                                {row.gstr3b === 'Pending' ? 'File GSTR-3B' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'invoices' && (
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h3 className="section-title">Tax Invoices (February 2026)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    {['Invoice No.', 'Client', 'Base Amount', 'GST (18%/12%)', 'Invoice Total', 'E-Way Bill', 'E-Invoice', 'Actions'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData.map((row, i) => (
                                    <tr key={i} className="table-row">
                                        <td className="table-cell font-mono text-blue-400 font-semibold text-xs">{row.invoice}</td>
                                        <td className="table-cell text-slate-900">{row.client}</td>
                                        <td className="table-cell text-slate-700">₹{row.base.toLocaleString()}</td>
                                        <td className="table-cell text-orange-400 font-medium">₹{(row.gst18 || row.gst12 || 0).toLocaleString()}</td>
                                        <td className="table-cell text-slate-900 font-bold">₹{row.total.toLocaleString()}</td>
                                        <td className="table-cell">
                                            <span className={`badge ${row.eway ? 'badge-green' : 'badge-red'}`}>{row.eway ? '✓ Generated' : '✕ Pending'}</span>
                                        </td>
                                        <td className="table-cell">
                                            <span className={`badge ${row.einvoice ? 'badge-green' : 'badge-yellow'}`}>{row.einvoice ? '✓ Done' : 'Pending'}</span>
                                        </td>
                                        <td className="table-cell">
                                            <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all">
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'itc' && (
                <div className="card p-5">
                    <h3 className="section-title mb-4">ITC Reconciliation – GSTR-2A vs Books</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'ITC as per GSTR-2A', value: '₹2,14,680', desc: 'As reflected in GSTN portal', color: 'text-blue-400' },
                            { label: 'ITC as per Books', value: '₹1,98,400', desc: 'Recorded in purchase register', color: 'text-green-400' },
                            { label: 'Unmatched ITC', value: '₹16,280', desc: 'Pending vendor reconciliation', color: 'text-red-400' },
                        ].map((card, i) => (
                            <div key={i} className="card p-4 text-center">
                                <p className="text-slate-400 text-sm mb-2">{card.label}</p>
                                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                                <p className="text-slate-400 text-xs mt-1">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
