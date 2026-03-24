import { useState } from 'react';
import toast from 'react-hot-toast';
import { Receipt, Wallet, CheckCircle2, XCircle, Clock, Plus, Search, X, ChevronDown } from 'lucide-react';

const initialClaims = [
  { id: 'CLM-001', empId: 'EMP-001', name: 'Rajesh Kumar', date: '2026-03-05', category: 'Travel & Lodging', amount: 1250, description: 'Client meeting at Site-A', status: 'Approved', department: 'Operations' },
  { id: 'CLM-002', empId: 'EMP-002', name: 'Suresh Verma', date: '2026-03-08', category: 'Food & Meals', amount: 450, description: 'Overtime dinner during project peak', status: 'Pending', department: 'Engineering' },
  { id: 'CLM-003', empId: 'EMP-003', name: 'Priya Devi', date: '2026-03-02', category: 'Supplies & Stationary', amount: 2800, description: 'Office stationery and printing paper', status: 'Rejected', department: 'Admin' },
  { id: 'CLM-004', empId: 'EMP-004', name: 'Amit Singh', date: '2026-03-10', category: 'Client Entertainment', amount: 4500, description: 'Dinner with VIP Client for North-End Project', status: 'Pending', department: 'Sales' },
];

const statusBadge = {
  'Approved': 'badge-green',
  'Pending': 'badge-yellow',
  'Rejected': 'badge-red',
};

export default function Reimbursements() {
  const [claims, setClaims] = useState(initialClaims);
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', category: 'Travel & Lodging', date: new Date().toISOString().split('T')[0], amount: '', description: '' });

  const handleAddClaim = (e) => {
    e.preventDefault();
    const newClaim = {
      id: `CLM-${String(claims.length + 1).padStart(3, '0')}`,
      empId: 'EMP-001',
      status: 'Pending',
      department: 'Operations',
      ...formData,
      amount: parseFloat(formData.amount) || 0
    };
    setClaims([newClaim, ...claims]);
    setShowAddModal(false);
    setFormData({ name: '', category: 'Travel & Lodging', date: new Date().toISOString().split('T')[0], amount: '', description: '' });
    toast.success('Claim submitted successfully!');
  };

  const updateStatus = (id, newStatus) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
    newStatus === 'Approved' ? toast.success(`Claim ${id} approved!`) : toast.error(`Claim ${id} rejected`);
  };

  const filtered = claims.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalClaimed = claims.reduce((a, c) => a + c.amount, 0);
  const totalApproved = claims.filter(c => c.status === 'Approved').reduce((a, c) => a + c.amount, 0);
  const totalPending = claims.filter(c => c.status === 'Pending').reduce((a, c) => a + c.amount, 0);

  return (
    <div className="space-y-5 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reimbursements</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track employee business expense claims</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> New Claim Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Claimed', value: `₹${totalClaimed.toLocaleString()}`, color: 'text-blue-500' },
          { label: 'Approved Claims', value: `₹${totalApproved.toLocaleString()}`, color: 'text-green-500' },
          { label: 'Pending Payout', value: `₹${totalPending.toLocaleString()}`, color: 'text-amber-500' },
          { label: 'Total Claims', value: claims.length, color: 'text-purple-500' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === t ? 'bg-[#2f6645] text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search claims..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Claim ID', 'Employee', 'Category', 'Date', 'Description', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-400">No claims found.</td></tr>
              ) : filtered.map((claim, i) => (
                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                  <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{claim.id}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {claim.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-slate-900 font-medium">{claim.name}</p>
                        <p className="text-slate-400 text-xs">{claim.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><span className="badge badge-blue">{claim.category}</span></td>
                  <td className="table-cell text-slate-500 text-xs">{claim.date}</td>
                  <td className="table-cell text-slate-500 text-xs max-w-[180px] truncate">{claim.description}</td>
                  <td className="table-cell text-emerald-600 font-semibold">₹{claim.amount.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={`badge ${statusBadge[claim.status] || 'badge-yellow'}`}>{claim.status}</span>
                  </td>
                  <td className="table-cell">
                    {claim.status === 'Pending' && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateStatus(claim.id, 'Approved')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-[#2f6645] hover:text-white transition-all" title="Approve">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => updateStatus(claim.id, 'Rejected')} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Reject">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
              <div>
                <h2 className="text-base font-semibold">New Claim Request</h2>
                <p className="text-xs text-white/60 mt-0.5">Submit an expense reimbursement</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddClaim} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Employee Name</label>
                  <input required placeholder="Your name" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Category</label>
                  <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Travel & Lodging</option>
                    <option>Food & Meals</option>
                    <option>Supplies & Stationary</option>
                    <option>Client Entertainment</option>
                    <option>Communication</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Expense Date</label>
                  <input required type="date" className="input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Amount (₹)</label>
                  <input required type="number" placeholder="0.00" className="input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Description</label>
                <textarea rows="3" required placeholder="Brief description of the expense..." className="input resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
