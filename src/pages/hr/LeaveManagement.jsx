import { useState } from 'react';
import { 
  Calendar, Briefcase, Clock, CheckCircle2, XCircle, 
  Plus, Search, Filter, Mail, MoreVertical,
  ChevronRight, ArrowUpRight, TrendingUp, X, Info
} from 'lucide-react';

const initialRequests = [
  { id: '1', empId: 'EMP-001', name: 'Rajesh Kumar', type: 'Annual Leave', start: '2024-03-20', end: '2024-03-22', days: 3, reason: 'Family wedding', status: 'Pending', appliedOn: '2024-03-10' },
  { id: '2', empId: 'EMP-003', name: 'Priya Devi', type: 'Sick Leave', start: '2024-03-12', end: '2024-03-12', days: 1, reason: 'Medical appointment', status: 'Approved', appliedOn: '2024-03-11' },
];

export default function LeaveManagement() {
  const [requests, setRequests] = useState(initialRequests);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [formData, setFormData] = useState({
    name: '', type: 'Annual Leave', start: '', end: '', days: '1', reason: ''
  });

  const handleApplyLeave = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now().toString(),
      empId: `EMP-0${Math.floor(Math.random() * 100)}`,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      ...formData
    };
    setRequests([newReq, ...requests]);
    setShowApplyModal(false);
    setFormData({ name: '', type: 'Annual Leave', start: '', end: '', days: '1', reason: '' });
  };

  const filtered = requests.filter(r => activeTab === 'All' || r.status === activeTab);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-none mb-1">Leave Management</h1>
          <p className="text-xs text-slate-500 font-medium italic">"Review, approve and track employee time-off requests."</p>
        </div>
        <button onClick={() => setShowApplyModal(true)} className="btn-primary bg-[#2f6645] whitespace-nowrap">
          <Plus className="w-4 h-4" /> Apply Leave
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Annual Available', val: 14, color: 'emerald' },
          { label: 'Sick Available', val: 10, color: 'blue' },
          { label: 'Casual Available', val: 5, color: 'amber' },
          { label: 'Pending Apps', val: requests.filter(r => r.status === 'Pending').length, color: 'purple' }
        ].map((b, i) => (
          <div key={i} className={`card p-5 border-b-2`} style={{ borderBottomColor: b.color === 'emerald' ? '#10b981' : b.color === 'blue' ? '#3b82f6' : b.color === 'amber' ? '#f59e0b' : '#a855f7' }}>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{b.label}</p>
            <p className="text-2xl font-black text-slate-800">{b.val}</p>
          </div>
        ))}
      </div>

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
            <input placeholder="Filter by Name..." className="input pl-10 bg-white" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Reason</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-slate-900 leading-none">{req.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Applied: {req.appliedOn}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-700">{req.type}</p>
                    <p className="text-[10px] text-slate-400 italic truncate max-w-[150px]">"{req.reason}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-slate-900 leading-none">{req.days} Days</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase">{req.start} to {req.end}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setRequests(requests.map(r => r.id === req.id ? {...r, status: 'Approved'} : r))} className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100"><CheckCircle2 className="w-4 h-4" /></button>
                      <button onClick={() => setRequests(requests.map(r => r.id === req.id ? {...r, status: 'Rejected'} : r))} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in text-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#1e3a34] text-white">
              <h2 className="text-lg font-black uppercase tracking-widest">Apply For Leave</h2>
              <button onClick={() => setShowApplyModal(false)}><X className="w-6 h-6 opacity-60 hover:opacity-100" /></button>
            </div>
            
            <form onSubmit={handleApplyLeave} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Employee Name</label>
                  <input required placeholder="Enter your name" className="input bg-slate-50 border-slate-200" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Leave Category</label>
                  <select className="select bg-slate-50 border-slate-200" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Comp Off</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Start Date</label>
                  <input required type="date" className="input bg-slate-50 border-slate-200" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">End Date</label>
                  <input required type="date" className="input bg-slate-50 border-slate-200" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Number of Days</label>
                  <input required type="number" className="input bg-slate-50 border-slate-200" value={formData.days} onChange={e => setFormData({...formData, days: e.target.value})} />
                </div>
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-700 text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
                   <Info className="w-3 h-3" /> Balance will be checked!
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reason / Description</label>
                <textarea rows="3" required placeholder="Brief reason for time-off..." className="input bg-slate-50 border-slate-200 resize-none py-3" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 btn-secondary py-3">Discard</button>
                <button type="submit" className="flex-1 btn-primary py-3 bg-[#2f6645]">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
