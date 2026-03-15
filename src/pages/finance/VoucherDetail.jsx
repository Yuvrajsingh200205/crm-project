import React from 'react';
import { 
    ArrowLeft, Printer, Download, Share2, 
    CheckCircle2, Building2, User, Calendar,
    FileText, Calculator, Landmark, ShieldCheck,
    ArrowRightLeft, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function VoucherDetail() {
    const { setActiveModule } = useApp();

    const voucher = {
        id: 'PV-1001',
        type: 'Payment',
        date: '2025-03-15',
        party: 'Janki Enterprises',
        amount: 184500,
        amountInWords: 'One Lakh Eighty Four Thousand Five Hundred Rupees Only',
        narration: 'RA-05 Payment for PSC Pole works for SWPL-BRGF Phase 1 Project. Amount adjusted against pending retention.',
        status: 'Posted',
        bank: 'SBI Main A/C',
        refNo: 'CHQ-982122 / NEFT',
        createdBy: 'Admin (Yuvraj Singh)',
        approvedBy: 'Finance Head (Rajesh Kumar)',
        ledgerEntries: [
            { account: 'Janki Enterprises (Vendor)', dr: 184500, cr: 0, code: '2110' },
            { account: 'SBI Main Operation A/C', dr: 0, cr: 184500, code: '1211' },
        ]
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Top Bar Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveModule('vouchers')}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1.5">{voucher.id}</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Verified Record · {voucher.status}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Download className="w-5 h-5" /> Print Voucher
                    </button>
                </div>
            </div>

            {/* Voucher Paper */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    {/* Voucher Header Header */}
                    <div className="p-12 border-b-4 border-emerald-950 bg-slate-50/10 flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-emerald-950 rounded-2xl flex items-center justify-center shadow-xl">
                                <FileText className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Payment Voucher</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">EcoConstruct Infrastructure Internal Document</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Voucher No.</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tighter">{voucher.id}</p>
                            <div className="mt-4 flex items-center justify-end gap-3">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date: {voucher.date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-12 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Paid to / Account</p>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-lg font-black text-slate-800">{voucher.party}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1">Sub-Ledger: VND-2021-004</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Through Bank / Cash</p>
                                    <div className="flex items-center gap-3">
                                        <Landmark className="w-5 h-5 text-slate-400" />
                                        <p className="text-sm font-black text-slate-700">{voucher.bank} <span className="text-slate-400 font-bold ml-2">({voucher.refNo})</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Amount Paid</p>
                                    <div className="p-6 bg-emerald-950 rounded-[2rem] text-white">
                                        <p className="text-5xl font-black tracking-tighter tabular-nums mb-2">₹{voucher.amount.toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest italic">{voucher.amountInWords}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Accounting Entries */}
                        <div className="space-y-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Double Entry Ledger Breakdown</p>
                            <div className="bg-slate-50/50 rounded-3xl overflow-hidden shadow-inner border border-slate-100">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Account Particulars</th>
                                            <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest w-24 text-center">Code</th>
                                            <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest w-32 text-right">Debit (Dr)</th>
                                            <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest w-32 text-right">Credit (Cr)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {voucher.ledgerEntries.map((entry, idx) => (
                                            <tr key={idx} className="bg-white/50">
                                                <td className="px-6 py-4 text-xs font-black text-slate-800">{entry.account}</td>
                                                <td className="px-6 py-4 text-center text-[10px] font-mono font-black text-slate-400">{entry.code}</td>
                                                <td className="px-6 py-4 text-right text-xs font-black text-emerald-600">{entry.dr > 0 ? `₹${entry.dr.toLocaleString()}` : '—'}</td>
                                                <td className="px-6 py-4 text-right text-xs font-black text-rose-600">{entry.cr > 0 ? `₹${entry.cr.toLocaleString()}` : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-100/50">
                                        <tr>
                                            <td colSpan={2} className="px-6 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Journal Total</td>
                                            <td className="px-6 py-4 text-right text-xs font-black text-slate-800">₹{voucher.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right text-xs font-black text-slate-800">₹{voucher.amount.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Narration */}
                        <div className="space-y-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Business Narrative</p>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic border-l-4 border-emerald-950 pl-6 py-2">{voucher.narration}</p>
                        </div>

                        {/* Signatures */}
                        <div className="pt-12 grid grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <div className="h-16 border-b border-slate-200 flex items-center justify-center">
                                    <p className="text-[10px] font-black text-slate-300 italic">Electronic Stamp</p>
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Prepared By: <br/><span className="text-slate-800 mt-1 block">{voucher.createdBy}</span></p>
                            </div>
                            <div className="space-y-4">
                                <div className="h-16 border-b border-slate-200 flex items-center justify-center relative overflow-hidden">
                                     <div className="absolute -rotate-12 px-4 py-1 border-2 border-emerald-500 rounded text-emerald-500 font-black text-xs uppercase shadow-sm">Verified</div>
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Verified By: <br/><span className="text-slate-800 mt-1 block">Accountant</span></p>
                            </div>
                            <div className="space-y-4">
                                <div className="h-16 border-b border-slate-200 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-100" />
                                </div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Approved By: <br/><span className="text-slate-800 mt-1 block">{voucher.approvedBy}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-emerald-950 text-emerald-400/60 text-[8px] font-black uppercase tracking-[0.2em] text-center">
                        Digital Ledger Record ID: TXN_88291_0029_VCH · Valid Internal Proof
                    </div>
                </div>
            </div>
        </div>
    );
}
