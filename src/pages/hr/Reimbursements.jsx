import { useState } from 'react';
import { 
  Receipt, Wallet, History, CheckCircle2, XCircle, 
  Clock, Plus, Search, Filter, Camera, 
  FileText, ArrowUpRight, DollarSign, Image as ImageIcon, X, ChevronDown
} from 'lucide-react';

const initialClaims = [
  { id: 'CLM-001', empId: 'EMP-001', name: 'Rajesh Kumar', date: '2026-03-05', category: 'Travel & Lodging', amount: 1250, description: 'Client meeting at Site-A', status: 'Approved', receipt: 'Y', department: 'Operations' },
  { id: 'CLM-002', empId: 'EMP-002', name: 'Suresh Verma', date: '2026-03-08', category: 'Food & Meals', amount: 450, description: 'Overtime dinner during project peak', status: 'Pending', receipt: 'Y', department: 'Engineering' },
  { id: 'CLM-003', empId: 'EMP-003', name: 'Priya Devi', date: '2026-03-02', category: 'Supplies & Stationary', amount: 2800, description: 'Office stationery and printing paper', status: 'Rejected', receipt: 'N', department: 'Admin' },
  { id: 'CLM-004', empId: 'EMP-004', name: 'Amit Singh', date: '2026-03-10', category: 'Client Entertainment', amount: 4500, description: 'Dinner with VIP Client for North-End Project', status: 'Pending', receipt: 'Y', department: 'Sales' },
];

export default function Reimbursements() {
  const [claims, setClaims] = useState(initialClaims);
  const [activeTab, setActiveTab] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar', 
    category: 'Travel & Lodging', 
    date: new Date().toISOString().split('T')[0], 
    amount: '', 
    description: ''
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddClaim = (e) => {
    e.preventDefault();
    const newClaim = {
      id: `CLM-${(claims.length + 1).toString().padStart(3, '0')}`,
      empId: 'EMP-001',
      status: 'Pending',
      receipt: 'Y',
      department: 'Operations',
      ...formData,
      amount: parseFloat(formData.amount) || 0
    };
    setClaims([newClaim, ...claims]);
    setShowAddModal(false);
    setFormData({ name: 'Rajesh Kumar', category: 'Travel & Lodging', date: new Date().toISOString().split('T')[0], amount: '', description: '' });
    showToast('Claim request submitted successfully!');
  };

  const updateStatus = (id, newStatus) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(`Claim ${id} ${newStatus.toLowerCase()}`);
  };

  const filtered = claims.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.id.toLowerCase().includes(search.toLowerCase()) ||
                         c.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalClaimed = claims.reduce((acc, c) => acc + c.amount, 0);
  const totalApproved = claims.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.amount, 0);
  const totalPending = claims.filter(c => c.status === 'Pending').reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-1">Reimbursements</h1>
          <p className="text-sm text-slate-500 font-medium italic">"Manage and track employee business expense claims."</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary bg-[#2f6645] shadow-xl shadow-green-900/10 h-14 px-8">
          <Plus className="w-5 h-5" /> New Claim Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Claimed', val: `₹${totalClaimed.toLocaleString()}`, color: 'blue', icon: Wallet, sub: 'All Time' },
          { label: 'Approved Claims', val: `₹${totalApproved.toLocaleString()}`, color: 'emerald', icon: CheckCircle2, sub: 'Processed' },
          { label: 'Pending Payout', val: `₹${totalPending.toLocaleString()}`, color: 'amber', icon: Clock, sub: 'Needs Review' },
          { label: 'Request Volume', val: claims.length, color: 'purple', icon: Receipt, sub: 'Active Claims' }
        ].map((s, i) => (
          <div key={i} className="card p-6 border-none shadow-xl shadow-slate-100/30 bg-white hover:translate-y-[-4px] transition-all duration-300">
             <div className={`p-3 rounded-2xl bg-${s.color}-50 text-${s.color}-600 w-fit mb-4`}>
                <s.icon className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
             <p className="text-2xl font-black text-slate-900">{s.val}</p>
             <p className="text-[9px] font-bold text-slate-400 mt-2 italic">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card border-none shadow-2xl shadow-slate-100/50 bg-white overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/50">
          <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-100 w-fit">
            {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === t ? 'bg-[#2f6645] text-white shadow-lg shadow-green-900/20' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search claims, names, or IDs..." 
              className="input pl-12 bg-white h-12 border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-green-50" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Employee</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category & Purpose</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Receipt</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-6 border-transparent border-l-4 group-hover:border-[#2f6645]">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#2f6645] flex items-center justify-center font-black text-xs group-hover:bg-[#2f6645] group-hover:text-white transition-all shadow-sm">
                          {c.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-[#2f6645] mb-0.5">{c.id}</p>
                          <p className="text-sm font-black text-slate-900">{c.name}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">{c.category}</p>
                    <p className="text-xs font-medium text-slate-600 truncate max-w-[200px]" title={c.description}>"{c.description}"</p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    {c.receipt === 'Y' ? (
                       <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all">
                          <ImageIcon className="w-4 h-4" />
                       </button>
                    ) : (
                      <span className="text-[9px] font-black text-slate-300 uppercase italic">Missing</span>
                    )}
                  </td>
                  <td className="px-6 py-6 transition-all group-hover:scale-105 origin-left">
                    <p className="text-base font-black text-slate-900 leading-none">₹{c.amount.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">{c.date}</p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200' : 
                      c.status === 'Rejected' ? 'bg-red-100 text-red-700 shadow-sm border border-red-200' : 
                      'bg-amber-100 text-amber-700 shadow-sm border border-amber-200'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2 transition-all">
                      {c.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(c.id, 'Approved')} title="Approve Claim" className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white shadow-sm transition-all active:scale-95"><CheckCircle2 className="w-5 h-5" /></button>
                          <button onClick={() => updateStatus(c.id, 'Rejected')} title="Reject Claim" className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white shadow-sm transition-all active:scale-95"><XCircle className="w-5 h-5" /></button>
                        </>
                      )}
                      <button onClick={() => setClaims(claims.filter(claim => claim.id !== c.id))} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 shadow-sm transition-all active:scale-95"><X className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                       <FileText className="w-12 h-12 mb-4" />
                       <p className="text-sm font-black uppercase tracking-widest">No claims found matching filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-[#9ae66e]" />
            <p className="text-xs font-black uppercase tracking-[0.15em]">{toast}</p>
          </div>
        </div>
      )}

      {/* New Claim Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in text-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#1e3a34] text-white">
              <h2 className="text-lg font-black uppercase tracking-widest">Submit Expense Claim</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-7 h-7 opacity-60 hover:opacity-100" /></button>
            </div>
            
            <form onSubmit={handleAddClaim} className="p-8 space-y-6">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Expense Category</label>
                <div className="relative group/select">
                  <select className="select border-slate-200 bg-slate-50 w-full pr-8 appearance-none h-12 font-bold text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Travel & Lodging</option>
                    <option>Food & Meals</option>
                    <option>Client Entertainment</option>
                    <option>Supplies & Stationary</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date of Bill</label>
                  <input required type="date" className="input border-slate-200 bg-slate-50 h-12" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Amount (₹)</label>
                  <input required type="number" placeholder="0.00" className="input border-slate-200 bg-slate-50 h-12" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Reason / Description</label>
                <textarea rows="3" required placeholder="Describe the purpose of this expense..." className="input border-slate-200 bg-slate-50 resize-none py-4 px-4 h-auto min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-3 group hover:border-[#2f6645]/40 hover:bg-[#2f6645]/5 cursor-pointer transition-all">
                 <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#2f6645]" />
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attach Proof / Receipt</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">PNG, JPG or PDF supported</p>
                 </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary h-14 font-black text-[10px] tracking-widest uppercase rounded-2xl">Discard</button>
                <button type="submit" className="flex-1 btn-primary bg-[#2f6645] h-14 font-black text-[10px] tracking-widest uppercase rounded-2xl shadow-xl shadow-green-900/10">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
