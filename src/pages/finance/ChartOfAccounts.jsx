import React, { useState, useMemo } from 'react';
import { 
    BookOpen, Search, Plus, ChevronRight, ChevronDown, 
    Landmark, Wallet, ArrowRightLeft, Download, Edit2, Trash2, MoreVertical, ShieldCheck
} from 'lucide-react';

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

    const typeBadge = {
        'Asset': 'badge-blue',
        'Liability': 'badge-red',
        'Income': 'badge-green',
        'Expense': 'badge-yellow',
        'Equity': 'badge-purple',
    };

    return (
        <>
            <tr className={`table-row hover:bg-slate-50 transition-colors ${depth === 0 ? 'bg-slate-50/50' : ''}`}>
                <td className="table-cell w-12 text-center font-medium text-slate-500">{account.id}</td>
                <td className="table-cell">
                    <div style={{ paddingLeft: `${depth * 20}px` }} className="flex items-center gap-2">
                        {hasSubs ? (
                            <button onClick={() => setIsExpanded(!isExpanded)} className="p-0.5 hover:bg-slate-200 rounded text-slate-400 flex-shrink-0">
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </button>
                        ) : (
                            <div className="w-5" />
                        )}
                        <span className={`text-slate-800 ${depth === 0 ? 'font-semibold' : 'font-medium'} text-sm`}>{account.name}</span>
                        <span className="text-xs text-slate-400">{account.category}</span>
                    </div>
                </td>
                <td className="table-cell">
                    <span className={`badge ${typeBadge[account.type] || 'badge-blue'}`}>{account.type}</span>
                </td>
                <td className="table-cell text-emerald-600 font-semibold">₹{(account.balance / 100000).toFixed(2)}L</td>
                <td className="table-cell" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600 transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                </td>
            </tr>
            {isExpanded && hasSubs && account.subAccounts.map(sub => (
                <AccountRow key={sub.id} account={sub} depth={depth + 1} />
            ))}
        </>
    );
};

export default function ChartOfAccounts() {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Chart of Accounts</h1>
                    <p className="text-slate-500 text-sm mt-1">Financial ledger hierarchy & account structure</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                    <button className="btn-primary flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> New Account
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Total Assets', value: '4.50 Cr', color: 'text-blue-500', icon: Landmark },
                    { label: 'Total Liabilities', value: '1.80 Cr', color: 'text-red-500', icon: Wallet },
                    { label: 'Net Equity', value: '2.70 Cr', color: 'text-green-500', icon: ShieldCheck },
                    { label: 'Fiscal Revenue', value: '3.20 Cr', color: 'text-purple-500', icon: ArrowRightLeft },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Account Tree */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-800">Account Structure</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search accounts..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Code', 'Account Name', 'Type', 'Balance', 'Actions'].map(h => (
                                    <th key={h} className="table-header">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ACCOUNTS.map(acc => (
                                <AccountRow key={acc.id} account={acc} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
