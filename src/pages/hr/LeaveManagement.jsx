import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { leaveAPI } from '../../api/leave';
import { employeeAPI } from '../../api/employee';
import { Calendar, Briefcase, Clock, CheckCircle2, XCircle, Plus, Search, TrendingUp, X, Info, ChevronDown, Loader2, UserPlus, FileText } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

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
  const [currentView, setCurrentView] = useState('leave'); // 'leave' or 'allot'
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', type: 'Annual Leave', start: '', end: '', days: '1', reason: '' });
  
  const [allotData, setAllotData] = useState({ userId: '', sick: '0', annual: '0', other: '0', casual: '0', company: '0' });

  // State for leave policies from API
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLeavePolicies();
    fetchEmployees();
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await leaveAPI.getAllLeaveAllocations();
      const backendAllocations = res?.leaveAllocations || (Array.isArray(res) ? res : (res?.data || res?.allocations || []));
      setAllocations(backendAllocations);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAllEmployees();
      const backendEmployees = res?.employees || (Array.isArray(res) ? res : (res?.data || []));
      setEmployees(backendEmployees);
    } catch (error) {
      console.error(error);
    }
  };

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
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => setCurrentView('leave')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentView === 'leave' ? 'bg-[#2f6645] text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <FileText className="w-4 h-4" /> Leave
          </button>
          <button 
            onClick={() => setCurrentView('allot')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentView === 'allot' ? 'bg-[#2f6645] text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <UserPlus className="w-4 h-4" /> Allot Leave
          </button>
        </div>
      </div>

      {currentView === 'leave' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="card p-4 hover:shadow-lg transition-all border border-slate-100">
                {isLoading ? <Skeleton variant="badge" className="h-8 w-16 mb-0" /> : <p className={`text-2xl font-black ${s.color} tracking-tight`}>{s.value}</p>}
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-[#2f6645] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
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
                      <th key={h} className="table-header text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
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
                    <tr><td colSpan="7" className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No leave records found.</td></tr>
                  ) : filtered.map(req => (
                    <tr key={req.id} className="table-row hover:bg-emerald-50/30 transition-colors group">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-[#2f6645] group-hover:text-white flex items-center justify-center font-black text-xs transition-all shadow-sm">
                            {req.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black group-hover:text-[#2f6645] transition-colors">{req.name}</p>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">{req.empId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700">{req.type}</span>
                      </td>
                      <td className="table-cell">
                        <p className="text-slate-900 font-black">{req.days} {req.days === 1 ? 'Day' : 'Days'}</p>
                        <p className="text-slate-400 text-[10px] uppercase font-bold mt-0.5">{req.start} → {req.end}</p>
                      </td>
                      <td className="table-cell text-slate-500 text-xs max-w-[180px] truncate italic">"{req.reason}"</td>
                      <td className="table-cell text-slate-400 text-[10px] font-bold uppercase">{req.appliedOn}</td>
                      <td className="table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusBadge[req.status] || 'bg-amber-100 text-amber-700'}`}>{req.status}</span>
                      </td>
                      <td className="table-cell">
                        {req.status === 'Pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r)); toast.success('Leave Approved!'); }}
                              className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-[#2f6645] hover:text-white shadow-sm transition-all active:scale-95"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r)); toast.error('Leave Rejected'); }}
                              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white shadow-sm transition-all active:scale-95"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
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
        </>
      ) : (
        <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Allot Form Card */}
           <div className="card p-8 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-[#2f6645]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Allot Employee Leave</h3>
                  <p className="text-sm text-slate-500">Directly assign leave balance to a specific staff member.</p>
                </div>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                try {
                  const payload = {
                    userId: Number(allotData.userId),
                    sick: Number(allotData.sick),
                    annual: Number(allotData.annual),
                    other: Number(allotData.other),
                    casual: Number(allotData.casual),
                    company: Number(allotData.company)
                  };
                  console.log('Sending Allotment Payload:', payload);
                  await leaveAPI.createLeaveAllocation(payload);
                  const emp = employees.find(e => e.id === Number(allotData.userId));
                  toast.success(`Leave allocated successfully for ${emp?.name || emp?.username || 'Employee'}!`);
                  setAllotData({ userId: '', sick: '0', annual: '0', other: '0', casual: '0', company: '0' });
                  fetchAllocations(); // Refresh the list
                } catch (error) {
                  console.error('Allotment error:', error.response?.data || error);
                  toast.error(error.response?.data?.message || "Failed to allot leave");
                } finally {
                  setIsSaving(false);
                }
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Employee Selection */}
                  <div className="space-y-2 lg:col-span-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Select Employee</label>
                    <div className="relative group/select">
                      <select 
                        required 
                        className="input appearance-none bg-slate-50 border-slate-100 h-14 pl-5 focus:bg-white transition-all cursor-pointer"
                        value={allotData.userId}
                        onChange={(e) => setAllotData({...allotData, userId: e.target.value})}
                      >
                        <option value="">Select an employee...</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name || emp.username} ({emp.mobileNumber || emp.id})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645]" />
                    </div>
                  </div>

                  {/* Sick Leave */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Sick Leave</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="10" 
                      className="input bg-slate-50 border-slate-100 h-14 pl-5 focus:bg-white transition-all shadow-sm"
                      value={allotData.sick}
                      onChange={(e) => setAllotData({...allotData, sick: e.target.value})}
                    />
                  </div>

                  {/* Annual Leave */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Annual Leave</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="10" 
                      className="input bg-slate-50 border-slate-100 h-14 pl-5 focus:bg-white transition-all shadow-sm"
                      value={allotData.annual}
                      onChange={(e) => setAllotData({...allotData, annual: e.target.value})}
                    />
                  </div>

                  {/* Casual Leave */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Casual Leave</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="10" 
                      className="input bg-slate-50 border-slate-100 h-14 pl-5 focus:bg-white transition-all shadow-sm"
                      value={allotData.casual}
                      onChange={(e) => setAllotData({...allotData, casual: e.target.value})}
                    />
                  </div>

                  {/* Other Leave */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Other Leave</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="0" 
                      className="input bg-slate-50 border-slate-100 h-14 pl-5 focus:bg-white transition-all shadow-sm"
                      value={allotData.other}
                      onChange={(e) => setAllotData({...allotData, other: e.target.value})}
                    />
                  </div>

                  {/* Company Leave */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Company Leave</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="20" 
                      className="input bg-slate-50 border-slate-100 h-14 pl-5 focus:bg-white transition-all shadow-sm"
                      value={allotData.company}
                      onChange={(e) => setAllotData({...allotData, company: e.target.value})}
                    />
                  </div>

                  <div className="flex items-end">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="h-14 w-full bg-[#2f6645] text-white rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-[0.15em] whitespace-nowrap"
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                      {isSaving ? 'Allocating...' : 'Allot Leaves'}
                    </button>
                  </div>
                </div>
              </form>
           </div>

           {/* Allotment List Table */}
           <div className="card overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                       <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase tracking-widest text-xs">Recent Allotments</h3>
                 </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Employee', 'Sick', 'Annual', 'Casual', 'Other', 'Company', 'Status'].map(h => (
                        <th key={h} className="table-header text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="table-row"><td colSpan="7" className="p-4"><Skeleton variant="text" /></td></tr>
                      ))
                    ) : allocations.length === 0 ? (
                      <tr><td colSpan="7" className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No previous allocations found.</td></tr>
                    ) : allocations.map((allot, i) => {
                      const emp = employees.find(e => Number(e.id) === Number(allot.userId));
                      return (
                        <tr key={i} className="table-row group hover:bg-slate-50/50 transition-colors">
                          <td className="table-cell">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-[#2f6645] group-hover:text-white flex items-center justify-center font-black text-xs transition-all shadow-sm">
                                {(emp?.name || emp?.username || 'E').split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-slate-900 font-black group-hover:text-[#2f6645] transition-colors">{emp?.name || emp?.username || 'Unknown Employee'}</p>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">User ID: {allot.userId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="table-cell">
                             <p className="text-slate-900 font-black">{allot.sick || 0}</p>
                          </td>
                          <td className="table-cell">
                             <p className="text-slate-900 font-black">{allot.annual || 0}</p>
                          </td>
                          <td className="table-cell">
                             <p className="text-slate-900 font-black">{allot.casual || 0}</p>
                          </td>
                          <td className="table-cell">
                             <p className="text-slate-900 font-black">{allot.other || 0}</p>
                          </td>
                          <td className="table-cell">
                             <p className="text-slate-900 font-black">{allot.company || 0}</p>
                          </td>
                          <td className="table-cell">
                             <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase">
                                <CheckCircle2 className="w-3.5 h-3.5" /> {allot.status || 'Active'}
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}

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
