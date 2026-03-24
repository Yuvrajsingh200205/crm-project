import { 
    BookOpen, Search, Plus, ChevronRight, ChevronDown, 
    Landmark, Wallet, ArrowRightLeft, Download, Edit2, Trash2, ShieldCheck, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastUtils';

const INITIAL_ACCOUNTS = [
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

// Helper to flatten and search accounts
const getAllAccountsFlat = (acctList) => {
    let result = [];
    acctList.forEach(a => {
        result.push(a);
        if (a.subAccounts) {
            result = result.concat(getAllAccountsFlat(a.subAccounts));
        }
    });
    return result;
};

// Helper to update deeply nested item
const updateNestedAccount = (accounts, id, newData) => {
    return accounts.map(acc => {
        if (acc.id === id) {
            return { ...acc, ...newData };
        }
        if (acc.subAccounts) {
            return { ...acc, subAccounts: updateNestedAccount(acc.subAccounts, id, newData) };
        }
        return acc;
    });
};

const typeBadge = {
    'Asset': 'badge-blue',
    'Liability': 'badge-red',
    'Income': 'badge-green',
    'Expense': 'badge-yellow',
    'Equity': 'badge-purple',
};

const AccountRow = ({ account, depth = 0, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(depth === 0);
    const hasSubs = account.subAccounts && account.subAccounts.length > 0;

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
                    <div className="flex items-center gap-1 opacity-100 transition-all">
                        <button onClick={() => onEdit(account)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-500 hover:text-emerald-600 transition-all cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => {
                            confirmToast(`Delete account ${account.name} permanently?`, () => {
                                toast.error('Account deletion is locked during trial');
                            });
                        }} className="p-1.5 bg-slate-100 hover:bg-red-50 rounded text-slate-500 hover:text-red-600 transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </td>
            </tr>
            {isExpanded && hasSubs && account.subAccounts.map(sub => (
                <AccountRow key={sub.id} account={sub} depth={depth + 1} onEdit={onEdit} />
            ))}
        </>
    );
};

export default function ChartOfAccounts() {
    const [search, setSearch] = useState('');
    const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const flatAccounts = getAllAccountsFlat(accounts);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        type: 'Asset',
        category: 'Operating',
        parentId: 'root'
    });

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({ id: '', name: '', type: 'Asset', category: 'Operating', parentId: 'root' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (acc) => {
        setEditingId(acc.id);
        const p = flatAccounts.find(x => x.subAccounts && x.subAccounts.some(s => s.id === acc.id));
        setFormData({
            id: acc.id,
            name: acc.name,
            type: acc.type,
            category: acc.category || '',
            parentId: p ? p.id : 'root'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingId) {
            setAccounts(updateNestedAccount(accounts, editingId, {
                id: formData.id,
                name: formData.name,
                type: formData.type,
                category: formData.category
            }));
            toast.success('Chart of Accounts updated');
        } else {
            const newAcc = {
                id: formData.id,
                name: formData.name,
                type: formData.type,
                category: formData.category,
                balance: 0,
                subAccounts: []
            };

            if (formData.parentId === 'root') {
                setAccounts([...accounts, newAcc]);
            } else {
                setAccounts(accounts.map(acc => {
                    if (acc.id === formData.parentId) {
                        return { ...acc, subAccounts: [...(acc.subAccounts || []), newAcc] };
                    }
                    if (acc.subAccounts) {
                        return { ...acc, subAccounts: updateNestedAccount(acc.subAccounts, formData.parentId, { subAccounts: [...(acc.subAccounts.find(x => x.id === formData.parentId)?.subAccounts || []), newAcc] }) };
                    }
                    return acc;
                }));
            }
            toast.success('New ledger account created');
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Chart of Accounts</h1>
                    <p className="text-slate-500 text-sm mt-1">Financial ledger hierarchy & account structure</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                    <button onClick={handleOpenAdd} className="btn-primary whitespace-nowrap flex items-center gap-1.5">
                        <Plus className="w-5 h-5" /> New Account
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
                            {accounts.map(acc => (
                                <AccountRow key={acc.id} account={acc} onEdit={handleOpenEdit} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Account Generation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
                            <div>
                                <h2 className="text-base font-semibold">{editingId ? 'Edit Account' : 'New Chart of Account'}</h2>
                                <p className="text-xs text-white/60 mt-0.5">Ledger Creation</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Account Code</label>
                                    <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="input" placeholder="e.g. 5130" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Account Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input">
                                        <option value="Asset">Asset</option>
                                        <option value="Liability">Liability</option>
                                        <option value="Equity">Equity</option>
                                        <option value="Income">Income</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Account Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input" placeholder="e.g. Travel Expenses" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Sub-Category</label>
                                    <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input" placeholder="e.g. Operational" />
                                </div>
                            </div>

                            {!editingId && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Parent Account</label>
                                    <select value={formData.parentId} onChange={e => setFormData({...formData, parentId: e.target.value})} className="input">
                                        <option value="root">None (Root Level)</option>
                                        {flatAccounts.map(a => (
                                            <option key={a.id} value={a.id}>{a.id} - {a.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">{editingId ? 'Save Changes' : 'Create Account'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
