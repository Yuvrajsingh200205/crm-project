import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { leaveAPI } from '../../api/leave';
import { Calendar, Briefcase, Clock, CheckCircle2, XCircle, Plus, Search, TrendingUp, X, Info, ChevronDown, Loader2 } from 'lucide-react';

const initialRequests = [];

const statusBadge = {
  'Approved': 'badge-green',
  'Pending': 'badge-yellow',
  'Rejected': 'badge-red',
};

export default function LeaveManagement() {
  const [requests, setRequests] = useState(initialRequests);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', type: 'Annual Leave', start: '', end: '', days: '1', reason: '' });

  // State for leave policies from API
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLeavePolicies();
  }, []);

  const fetchLeavePolicies = async () => {
    setIsLoading(true);
    try {
      const res = await leaveAPI.getAllLeaves();
      // data expected to be: array of { type, total }
      const policies = Array.isArray(res) ? res : (res?.leaves || res?.data || []);
      setLeavePolicies(policies);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load leave configurations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // payload: { type: string, total: number }
      const payload = {
        type: formData.type.toLowerCase().replace(' leave', ''),
        total: Number(formData.days)
      };

      await leaveAPI.createLeave(payload);
      toast.success(`Leave type "${payload.type}" configured successfully!`);

      const newReq = {
        id: Date.now().toString(),
        empId: `EMP-0${Math.floor(Math.random() * 100)}`,
        status: 'Pending',
        appliedOn: new Date().toISOString().split('T')[0],
        ...formData
      };
      setRequests([newReq, ...requests]);
      fetchLeavePolicies(); // Refresh policies
      setShowApplyModal(false);
      setFormData({ name: '', type: 'Annual Leave', start: '', end: '', days: '1', reason: '' });
    } catch (error) {
      toast.error("Failed to save leave configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = requests.filter(r =>
    (activeTab === 'All' || r.status === activeTab) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = [
    { label: 'Annual Total', value: leavePolicies.find(p => p.type === 'annual')?.total || 0, color: 'text-green-500' },
    { label: 'Sick Total', value: leavePolicies.find(p => p.type === 'sick')?.total || 0, color: 'text-blue-500' },
    { label: 'Casual Total', value: leavePolicies.find(p => p.type === 'casual')?.total || 0, color: 'text-amber-500' },
    { label: 'Pending Requests', value: requests.filter(r => r.status === 'Pending').length, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-5 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review, approve and track employee time-off requests</p>
        </div>
        <button onClick={() => setShowApplyModal(true)} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Configure Leave Policy
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="card p-4">
            {isLoading ? <Skeleton variant="badge" className="h-8 w-16 mb-0" /> : <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>}
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === t ? 'bg-[#2f6645] text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search by name or type..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Employee', 'Leave Type', 'Duration', 'Reason', 'Applied On', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell"><div className="flex gap-2"><Skeleton variant="circle" /><Skeleton variant="text" className="w-24" /></div></td>
                    <td className="table-cell"><Skeleton variant="badge" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="badge" /></td>
                    <td className="table-cell"><Skeleton variant="button" className="w-12 h-8" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">No leave records found.</td></tr>
              ) : filtered.map(req => (
                <tr key={req.id} className="table-row hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {req.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-slate-900 font-medium text-sm">{req.name}</p>
                        <p className="text-slate-400 text-xs">{req.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><span className="badge badge-blue">{req.type}</span></td>
                  <td className="table-cell">
                    <p className="text-slate-900 font-semibold">{req.days} {req.days === 1 ? 'Day' : 'Days'}</p>
                    <p className="text-slate-400 text-xs">{req.start} → {req.end}</p>
                  </td>
                  <td className="table-cell text-slate-500 text-xs max-w-[180px] truncate">{req.reason}</td>
                  <td className="table-cell text-slate-500 text-xs">{req.appliedOn}</td>
                  <td className="table-cell">
                    <span className={`badge ${statusBadge[req.status] || 'badge-yellow'}`}>{req.status}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r)); toast.success('Leave Approved!'); }}
                        className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-[#2f6645] hover:text-white transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r)); toast.error('Leave Rejected'); }}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
              <div>
                <h2 className="text-base font-semibold">Configure Leave Policy</h2>
                <p className="text-xs text-white/60 mt-0.5">Define new leave type and its total allowance</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Reference Name</label>
                  <input required placeholder="e.g. System Admin" className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Leave Category</label>
                  <select className="input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Comp Off</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Total Days Allowance</label>
                <input required type="number" className="input" value={formData.days} onChange={e => setFormData({ ...formData, days: e.target.value })} />
              </div>
              <div className="space-y-1.5 opacity-50">
                <label className="text-xs font-semibold text-slate-600 italic">Note: Dates and reason are only for simulation during this policy configuration.</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Configuring...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
