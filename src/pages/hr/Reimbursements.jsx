import { useState } from 'react';
import { 
  Receipt, Wallet, History, CheckCircle2, XCircle, 
  Clock, Plus, Search, Filter, Camera, 
  FileText, ArrowUpRight, DollarSign, Image as ImageIcon, X
} from 'lucide-react';

const initialClaims = [
  { id: 'CLM-001', empId: 'EMP-001', name: 'Rajesh Kumar', date: '2024-03-05', category: 'Travel', amount: 1250, description: 'Client meeting at Site-A', status: 'Approved', receipt: 'Y' },
  { id: 'CLM-002', empId: 'EMP-002', name: 'Suresh Verma', date: '2024-03-08', category: 'Food', amount: 450, description: 'Overtime dinner', status: 'Pending', receipt: 'Y' },
  { id: 'CLM-003', empId: 'EMP-003', name: 'Priya Devi', date: '2024-03-02', category: 'Misc', amount: 2800, description: 'Office stationery purchase', status: 'Rejected', receipt: 'N' },
];

export default function Reimbursements() {
  const [claims, setClaims] = useState(initialClaims);
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar', 
    category: 'Travel & Lodging', 
    date: new Date().toISOString().split('T')[0], 
    amount: '', 
    description: ''
  });

  const handleAddClaim = (e) => {
    e.preventDefault();
    const newClaim = {
      id: `CLM-${(claims.length + 1).toString().padStart(3, '0')}`,
      empId: 'EMP-001',
      status: 'Pending',
      receipt: 'Y',
      ...formData,
      amount: parseFloat(formData.amount)
    };
    setClaims([newClaim, ...claims]);
    setShowAddModal(false);
    setFormData({ name: 'Rajesh Kumar', category: 'Travel & Lodging', date: new Date().toISOString().split('T')[0], amount: '', description: '' });
  };

  const updateStatus = (id, newStatus) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const filtered = claims.filter(c => activeTab === 'All' || c.status === activeTab);

  // Stats calculation
  const totalClaimed = claims.reduce((acc, c) => acc + c.amount, 0);
  const totalApproved = claims.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.amount, 0);
  const totalPending = claims.filter(c => c.status === 'Pending').reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-none mb-1">Reimbursements</h1>
          <p className="text-xs text-slate-500 font-medium">"Submit and manage business expense claims."</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary bg-[#2f6645] whitespace-nowrap">
          <Plus className="w-4 h-4" /> New Claim Request
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Claimed', val: `₹${totalClaimed.toLocaleString()}`, color: 'blue' },
          { label: 'Approved', val: `₹${totalApproved.toLocaleString()}`, color: 'emerald' },
          { label: 'Pending', val: `₹${totalPending.toLocaleString()}`, color: 'amber' },
          { label: 'Claims Count', val: claims.length, color: 'purple' }
        ].map((s, i) => (
          <div key={i} className="card p-5 border-l-4" style={{ borderLeftColor: s.color === 'emerald' ? '#10b981' : s.color === 'blue' ? '#3b82f6' : s.color === 'amber' ? '#f59e0b' : '#a855f7' }}>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-black text-slate-800">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === t ? 'bg-[#2f6645] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Search by ID or Reason..." className="input pl-10 bg-white" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Employee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category & Purpose</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Receipt</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-black text-[#2f6645] mb-0.5">{c.id}</p>
                    <p className="text-xs font-bold text-slate-900">{c.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-0.5">{c.category}</p>
                    <p className="text-xs font-medium text-slate-600 truncate max-w-[180px]">"{c.description}"</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {c.receipt === 'Y' ? (
                      <ImageIcon className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-[8px] font-black text-slate-300">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 leading-none">₹{c.amount.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{c.date}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      c.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {c.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(c.id, 'Approved')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100"><CheckCircle2 className="w-4 h-4" /></button>
                          <button onClick={() => updateStatus(c.id, 'Rejected')} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      <button onClick={() => setClaims(claims.filter(claim => claim.id !== c.id))} className="p-1.5 bg-slate-50 text-slate-400 rounded hover:bg-slate-200"><X className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in text-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#1e3a34] text-white">
              <h2 className="text-lg font-black uppercase tracking-widest">Submit Expense Claim</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 opacity-60 hover:opacity-100" /></button>
            </div>
            
            <form onSubmit={handleAddClaim} className="p-8 space-y-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Expense Category</label>
                <select className="select border-slate-200 bg-slate-50" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Travel & Lodging</option>
                  <option>Food & Meals</option>
                  <option>Client Entertainment</option>
                  <option>Supplies & Stationary</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Date of Bill</label>
                  <input required type="date" className="input border-slate-200 bg-slate-50 text-slate-800" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount (₹)</label>
                  <input required type="number" placeholder="Amt" className="input border-slate-200 bg-slate-50 text-slate-800" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reason / Description</label>
                <textarea rows="3" required placeholder="What was this expense for?..." className="input border-slate-200 bg-slate-50 resize-none py-3 text-slate-800" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 group hover:border-[#2f6645]/30 cursor-pointer transition-all">
                 <Camera className="w-6 h-6 text-slate-300 group-hover:text-[#2f6645]" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attach Bill Receipt</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary py-3 font-black text-[10px] tracking-[0.2em] uppercase">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3 bg-[#2f6645] font-black text-[10px] tracking-[0.2em] uppercase">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
