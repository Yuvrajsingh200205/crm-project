import { 
    ArrowLeft, Printer, Download, Share2, 
    CheckCircle2, Building2, User, Calendar,
    FileText, Calculator, Landmark, ShieldCheck,
    ArrowRightLeft, ArrowRight, Save, Receipt, CreditCard
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
        <div className="space-y-6 animate-fade-in pb-20 relative">
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Top Bar Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveModule('vouchers')}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-800 transition-all shadow-sm group hover:border-[#2f6645]"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-slate-900 leading-none">{voucher.id}</h1>
                            <span className="badge badge-green text-[9px] px-2 py-0.5">{voucher.status}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             System Audit Registry · Detailed Entry
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                        <Printer className="w-4 h-4" />
                    </button>
                    <button className="btn-primary h-11 px-6 text-xs flex items-center gap-2">
                        <Download className="w-4 h-4" /> Print Voucher
                    </button>
                </div>
            </div>

            {/* Voucher Paper */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    {/* Header Strip */}
                    <div className="h-2 bg-[#2f6645] w-full" />
                    
                    {/* Voucher Header Header */}
                    <div className="p-10 border-b border-slate-100 bg-slate-50/20 flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <Receipt className="w-7 h-7 text-white/90" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Payment Voucher</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Financial Record</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Voucher Number</p>
                            <p className="text-xl font-bold text-slate-900 tabular-nums tracking-tighter">{voucher.id}</p>
                            <div className="mt-3 flex items-center justify-end gap-3 font-mono text-[10px] font-bold text-[#2f6645]">
                                {voucher.date}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Party / Account Details</p>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-dotted border-slate-200">
                                        <p className="font-bold text-slate-800 flex items-center gap-2"><User className="w-4 h-4 text-[#2f6645]"/> {voucher.party}</p>
                                        <div className="mt-2 text-[10px] font-semibold text-slate-500 bg-white inline-block px-2 py-1 rounded-md border border-slate-100 shadow-sm">UID: VND-2021-004</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2">Transaction Mode</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                            <Landmark className="w-4 h-4 text-slate-400" />
                                            {voucher.bank}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2">Reference No</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                            <CreditCard className="w-4 h-4 text-slate-400" />
                                            {voucher.refNo}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 text-right">Settlement Amount</p>
                                <div className="p-8 bg-[#2f6645] rounded-3xl text-white shadow-xl shadow-emerald-900/10 text-right">
                                    <p className="text-4xl font-bold tracking-tighter tabular-nums mb-2">₹{voucher.amount.toLocaleString()}</p>
                                    <div className="h-px bg-white/20 my-3" />
                                    <p className="text-[10px] font-bold text-white/60 leading-relaxed italic">{voucher.amountInWords}</p>
                                </div>
                            </div>
                        </div>

                        {/* Accounting Entries */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Double Entry Ledger</p>
                                <p className="text-[10px] font-bold text-[#2f6645] uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Reconciled</p>
                            </div>
                            <div className="overflow-hidden border border-slate-100 rounded-2xl">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Description</th>
                                            <th className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-widest text-center">Code</th>
                                            <th className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-widest text-right">Debit (₹)</th>
                                            <th className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-widest text-right">Credit (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {voucher.ledgerEntries.map((entry, idx) => (
                                            <tr key={idx}>
                                                <td className="px-5 py-3 text-xs font-bold text-slate-700">{entry.account}</td>
                                                <td className="px-5 py-3 text-center text-[10px] font-mono font-bold text-slate-400">{entry.code}</td>
                                                <td className="px-5 py-3 text-right text-xs font-bold text-slate-900">{entry.dr > 0 ? entry.dr.toLocaleString() : '—'}</td>
                                                <td className="px-5 py-3 text-right text-xs font-bold text-slate-900">{entry.cr > 0 ? entry.cr.toLocaleString() : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-50/50 border-t border-slate-100">
                                        <tr>
                                            <td colSpan={2} className="px-5 py-3 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Running Totals</td>
                                            <td className="px-5 py-3 text-right text-xs font-bold text-slate-900">{voucher.amount.toLocaleString()}</td>
                                            <td className="px-5 py-3 text-right text-xs font-bold text-slate-900">{voucher.amount.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Narration */}
                        <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-[#2f6645]">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Official Narrative</p>
                             <p className="text-xs font-medium text-slate-600 leading-relaxed">{voucher.narration}</p>
                        </div>

                        {/* Signatures */}
                        <div className="pt-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="h-10 border-b border-slate-200 mb-2" />
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Prepared By</p>
                                <p className="text-[10px] font-bold text-slate-800 mt-1 truncate px-2">{voucher.createdBy}</p>
                            </div>
                            <div className="text-center">
                                <div className="h-10 border-b border-slate-200 mb-2 flex items-center justify-center">
                                     <span className="text-[9px] font-black text-emerald-500 uppercase border border-emerald-500 px-2 py-0.5 rounded rotate-[-10deg]">Verified</span>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Audited By</p>
                                <p className="text-[10px] font-bold text-slate-800 mt-1 truncate px-2">Finance Team</p>
                            </div>
                            <div className="text-center">
                                <div className="h-10 border-b border-slate-200 mb-2" />
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Receiver Sign</p>
                                <p className="text-[10px] font-bold text-slate-800 mt-1 truncate px-2">Authorized Sign</p>
                            </div>
                            <div className="text-center">
                                <div className="h-10 border-b border-slate-200 mb-2" />
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Approved By</p>
                                <p className="text-[10px] font-bold text-slate-800 mt-1 truncate px-2">{voucher.approvedBy}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-slate-400 text-[8px] font-bold uppercase tracking-[0.2em] text-center">
                        Secure Transaction Identifier: TXN-88291-0029-VCH · System Timestamp: {new Date().toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
