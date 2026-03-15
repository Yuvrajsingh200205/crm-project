import React, { useState, useMemo } from 'react';
import { 
    BookOpen, Search, Plus, ChevronRight, ChevronDown, 
    Landmark, DollarSign, Wallet, FileText, ArrowRightLeft,
    Filter, Download, MoreVertical, Edit2, Trash2, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_ACCOUNTS = [
    { id: '1000', name: 'Assets', type: 'Asset', balance: 45000000, category: 'Root', subAccounts: [
        { id: '1100', name: 'Fixed Assets', type: 'Asset', balance: 25000000, category: 'Non-Current', subAccounts: [
            { id: '1110', name: 'Machinery & Equipment', type: 'Asset', balance: 15000000, category: 'Fixed' },
            { id: '1120', name: 'Office Premises', type: 'Asset', balance: 10000000, category: 'Fixed' },
        ]},
        { id: '1200', name: 'Current Assets', type: 'Asset', balance: 20000000, category: 'Current', subAccounts: [
            { id: '1210', name: 'Bank Accounts', type: 'Asset', balance: 12000000, category: 'Cash', subAccounts: [
                { id: '1211', name: 'HDFC Bank - Operation', type: 'Asset', balance: 8500000, category: 'Bank' },
                { id: '1212', name: 'SBI - Petty Cash', type: 'Asset', balance: 3500000, category: 'Bank' },
            ]},
            { id: '1220', name: 'Accounts Receivable', type: 'Asset', balance: 8000000, category: 'Receivable' },
        ]},
    ]},
    { id: '2000', name: 'Liabilities', type: 'Liability', balance: 18000000, category: 'Root', subAccounts: [
        { id: '2100', name: 'Current Liabilities', type: 'Liability', balance: 12000000, category: 'Current', subAccounts: [
            { id: '2110', name: 'Accounts Payable', type: 'Liability', balance: 8500000, category: 'Payable' },
            { id: '2120', name: 'GST Payable', type: 'Liability', balance: 2500000, category: 'Tax' },
            { id: '2130', name: 'TDS Payable', type: 'Liability', balance: 1000000, category: 'Tax' },
        ]},
        { id: '2200', name: 'Long Term Loans', type: 'Liability', balance: 6000000, category: 'Non-Current' },
    ]},
    { id: '3000', name: 'Equity', type: 'Equity', balance: 27000000, category: 'Root' },
    { id: '4000', name: 'Income', type: 'Income', balance: 32000000, category: 'Root', subAccounts: [
        { id: '4100', name: 'Project Revenue', type: 'Income', balance: 30000000, category: 'Operating' },
        { id: '4200', name: 'Interest Income', type: 'Income', balance: 2000000, category: 'Non-Operating' },
    ]},
    { id: '5000', name: 'Expenses', type: 'Expense', balance: 21500000, category: 'Root', subAccounts: [
        { id: '5100', name: 'Direct Project Costs', type: 'Expense', balance: 15000000, category: 'Direct', subAccounts: [
            { id: '5110', name: 'Material Cost', type: 'Expense', balance: 9000000, category: 'Cost of Goods' },
            { id: '5120', name: 'Labour Wages', type: 'Expense', balance: 6000000, category: 'Cost of Goods' },
        ]},
        { id: '5200', name: 'Administrative Expenses', type: 'Expense', balance: 6500000, category: 'Indirect' },
    ]},
];

const AccountRow = ({ account, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(depth === 0);
    const hasSubs = account.subAccounts && account.subAccounts.length > 0;

    return (
        <>
            <div className={`group transition-all hover:bg-slate-50 border-b border-slate-100 flex items-center py-4 px-6 ${depth === 0 ? 'bg-slate-50/50' : ''}`}>
                <div className="flex items-center gap-4 flex-1">
                    <div style={{ paddingLeft: `${depth * 24}px` }} className="flex items-center gap-3">
                        {hasSubs ? (
                            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-slate-200 rounded text-slate-400">
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                        ) : (
                            <div className="w-6" />
                        )}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                            account.type === 'Asset' ? 'bg-blue-50 text-blue-600' :
                            account.type === 'Liability' ? 'bg-rose-50 text-rose-600' :
                            account.type === 'Income' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-slate-50 text-slate-600'
                        }`}>
                            {account.id}
                        </div>
                        <div>
                            <p className={`text-sm tracking-tight ${depth === 0 ? 'font-black text-slate-800' : 'font-bold text-slate-700'}`}>
                                {account.name}
                            </p>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{account.category}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right w-32">
                        <p className={`text-sm font-black tabular-nums ${
                            account.type === 'Income' || account.type === 'Asset' ? 'text-slate-800' : 'text-slate-800'
                        }`}>
                            ₹{(account.balance / 100000).toFixed(2)}L
                        </p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Base Value</p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-emerald-600 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-slate-900 transition-all"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                </div>
            </div>
            {isExpanded && hasSubs && (
                <div>
                    {account.subAccounts.map(sub => (
                        <AccountRow key={sub.id} account={sub} depth={depth + 1} />
                    ))}
                </div>
            )}
        </>
    );
};

export default function ChartOfAccounts() {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-8 animate-fade-in pb-20 relative">
            {/* Background elements */}
            <div className="absolute inset-x-0 top-0 -z-20 h-full w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-950 rounded-[2rem] shadow-xl shadow-emerald-900/20 flex items-center justify-center border border-white/5 group hover:rotate-3 transition-all">
                        <BookOpen className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Chart of Accounts</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Financial Ledger Structure
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-64 hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search accounts..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-xs transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3.5 bg-emerald-950 text-white font-black rounded-2xl shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-xs">
                        <Plus className="w-5 h-5" /> New Account
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Assets', value: '4.50 Cr', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Liabilities', value: '1.80 Cr', icon: Wallet, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Net Equity', value: '2.70 Cr', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Fiscal Revenue', value: '3.20 Cr', icon: ArrowRightLeft, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300">01.04.2025</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Account Tree */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Hierarchy</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Account Structure</h2>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                </div>

                <div className="bg-slate-50/30 flex items-center py-3 px-6 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <div className="flex-1 pl-12">Account Name & Code</div>
                    <div className="w-32 text-right mr-20">Balance</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {MOCK_ACCOUNTS.map(acc => (
                        <AccountRow key={acc.id} account={acc} />
                    ))}
                </div>
            </div>
        </div>
    );
}
