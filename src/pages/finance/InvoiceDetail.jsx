import React from 'react';
import { 
    ArrowLeft, Printer, Download, Share2, 
    CheckCircle2, Building2, User, Calendar,
    FileText, Calculator, Landmark, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InvoiceDetail() {
    const { setActiveModule } = useApp();

    const invoice = {
        id: 'INV-2025-001',
        date: '2025-03-10',
        dueDate: '2025-03-25',
        status: 'Pending',
        client: {
            name: 'Larsen & Toubro Ltd.',
            address: 'Construction Division, Mount Poonamallee Road, Manapakkam, Chennai - 600089',
            gstin: '33AAACL0123A1Z2',
            email: 'billing@lntecc.com'
        },
        company: {
            name: 'EcoConstruct Infrastructure',
            address: '12th Floor, Maurya Tower, Gandhi Maidan, Patna - 800001',
            gstin: '10AAAFE3321R1Z5',
            bank: 'SBI Main Branch, Patna',
            ifsc: 'SBIN0000001',
            account: '33445566778'
        },
        items: [
            { desc: 'PSC Pole Erection - 9Mtr', qty: 450, rate: 2450, total: 1102500 },
            { desc: 'ABC Cable Installation - 50Sqmm', qty: 12, rate: 85000, total: 1020000 },
            { desc: 'Earthing Set Supply', qty: 85, rate: 4200, total: 357000 },
            { desc: 'Transformer Foundation Work', qty: 2, rate: 450000, total: 900000 },
        ],
        subTotal: 3379500,
        gstRate: 18,
        gstAmount: 608310,
        retentionRate: 5,
        retentionAmount: 168975,
        totalAmount: 3818835
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Top Bar Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveModule('invoicing')}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1.5">{invoice.id}</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Finalized View · {invoice.status}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Download className="w-5 h-5" /> Download PDF
                    </button>
                </div>
            </div>

            {/* The Actual Invoice "Paper" */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    {/* Watermark/Accent */}
                    <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                        <FileText className="w-64 h-64" />
                    </div>

                    {/* Header Section */}
                    <div className="p-12 border-b border-slate-50 bg-slate-50/10">
                        <div className="flex flex-col md:flex-row justify-between gap-12">
                            <div className="space-y-6 max-w-sm">
                                <div className="w-16 h-16 bg-emerald-950 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                                    <Building2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{invoice.company.name}</h2>
                                    <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">{invoice.company.address}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GSTIN</p>
                                            <p className="text-xs font-black text-slate-700">{invoice.company.gstin}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PAN</p>
                                            <p className="text-xs font-black text-slate-700">AAAFE3321R</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right space-y-6">
                                <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Tax Invoice</h1>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RA Bill Number</p>
                                        <p className="text-xl font-black text-emerald-600 tracking-tight">{invoice.id}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 text-right">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Invoice Date</p>
                                            <p className="text-xs font-black text-slate-800">{invoice.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                                            <p className="text-xs font-black text-slate-800">{invoice.dueDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill To Section */}
                    <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bill To
                            </p>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">{invoice.client.name}</h3>
                            <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-xs">{invoice.client.address}</p>
                            <div className="flex items-center gap-8 pt-2">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">VAT/GSTIN</p>
                                    <p className="text-[11px] font-black text-slate-700">{invoice.client.gstin}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Client Email</p>
                                    <p className="text-[11px] font-black text-slate-700">{invoice.client.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="px-12">
                        <table className="w-full text-left">
                            <thead className="border-y border-slate-100">
                                <tr>
                                    <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4">Description of Service</th>
                                    <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">Qty</th>
                                    <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">Unit Rate</th>
                                    <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40 text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoice.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-6 pr-4">
                                            <p className="text-xs font-black text-slate-800 mb-1">{item.desc}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">SAC Code: 99542</p>
                                        </td>
                                        <td className="py-6 text-center text-xs font-black text-slate-700">{item.qty}</td>
                                        <td className="py-6 text-right text-xs font-black text-slate-700">₹{item.rate.toLocaleString()}</td>
                                        <td className="py-6 text-right text-sm font-black text-slate-900 tabular-nums">₹{item.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="p-12 mt-4 bg-slate-50/30">
                        <div className="flex flex-col md:flex-row justify-between gap-12">
                            <div className="flex-1 space-y-6">
                                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Landmark className="w-3 h-3 text-emerald-500" /> Bank Settlement Details
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Account Holder</p>
                                            <p className="text-[11px] font-black text-slate-800">{invoice.company.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Account Number</p>
                                            <p className="text-[11px] font-black text-slate-800 font-mono tracking-tighter">{invoice.company.account}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">IFSC Code</p>
                                            <p className="text-[11px] font-black text-slate-800">{invoice.company.ifsc}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Bank Name</p>
                                            <p className="text-[11px] font-black text-slate-800">{invoice.company.bank}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-800 uppercase italic">Amount in Words:</p>
                                    <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase">Thirty Eight Lakh Eighteen Thousand Eight Hundred and Thirty Five Rupees Only</p>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="tabular-nums font-black text-slate-700">₹{invoice.subTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                                        <span>GST (18%)</span>
                                        <span className="tabular-nums font-black text-slate-700">₹{invoice.gstAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold text-rose-500 bg-rose-50 px-3 py-2 rounded-xl border border-rose-100/50">
                                        <span>Retention (5%) <br/><span className="text-[8px] opacity-60">Locked Amount</span></span>
                                        <span className="tabular-nums font-black">-₹{invoice.retentionAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Total Payable</span>
                                        <span className="text-3xl font-black text-emerald-600 tracking-tighter tabular-nums">₹{invoice.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-right text-[8px] font-black text-slate-300 mt-1 uppercase tracking-widest">Taxes Included</p>
                                </div>
                                <div className="pt-8">
                                    <div className="h-20 w-fit ml-auto border-b border-slate-200 flex flex-col justify-end items-center px-8">
                                        <div className="w-16 h-8 bg-slate-50 rounded-lg border border-dashed border-slate-200" />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 text-center">Authorized Signatory</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Warning */}
                    <div className="p-8 bg-emerald-950 text-emerald-400/60 text-[8px] font-black uppercase tracking-[0.2em] text-center">
                        Computer Generated Invoice · Not Required Manual Signature · Subject to Patna Jurisdiction
                    </div>
                </div>
            </div>
        </div>
    );
}
