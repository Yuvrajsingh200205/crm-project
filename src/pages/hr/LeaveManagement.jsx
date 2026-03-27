import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { leaveAPI } from '../../api/leave';
import { employeeAPI } from '../../api/employee';
import { Calendar, Briefcase, Clock, CheckCircle2, XCircle, Plus, Search, TrendingUp, X, Info, ChevronDown, Loader2, UserPlus, FileText } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

const initialRequests = [];

const statusBadge = {
  'Approved': 'badge-green',
  'approved': 'badge-green',
  'Pending': 'badge-yellow',
  'pending': 'badge-yellow',
  'Rejected': 'badge-red',
  'rejected': 'badge-red',
};

export default function LeaveManagement() {
  const { userRole, userProfile, employees: globalEmployees } = useApp();

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
  const [userBalance, setUserBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [rejectionModal, setRejectionModal] = useState({ show: false, id: null, reason: '' });

  useEffect(() => {
    fetchLeavePolicies();
    if (userRole === 'admin') {
      fetchEmployees();
      fetchAllocations();
    }
    fetchRequests();
  }, [userRole]);

  const [nameCache, setNameCache] = useState({});

  const resolveMissingNames = async (reqs) => {
    const ids = [...new Set(reqs.map(r => r.userId || r.user_id))].filter(Boolean);
    const unknownIds = ids.filter(id => {
      const allPossible = [...employees, ...(globalEmployees || [])];
      return !allPossible.find(e => Number(e.id) === Number(id));
    });

    for (const id of unknownIds) {
      if (nameCache[id]) continue;
      try {
        const empInfo = await employeeAPI.getEmployeeById(id);
        const name = empInfo?.name || empInfo?.employee?.name || `User ${id}`;
        setNameCache(prev => ({ ...prev, [id]: name }));
      } catch (err) {
        console.warn(`Could not resolve name for ID ${id}:`, err);
      }
    }
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      let res;
      if (userRole === 'admin') {
        console.log('Fetching all leaves for admin...');
        res = await leaveAPI.getAllLeaves();
      } else if (userRole === 'employee' || userProfile?.id) {
        console.log('Fetching personal leaves for employee:', userProfile?.id);
        res = await leaveAPI.getEmployeeLeave(userProfile?.id || userProfile?.userId || 1);
      } else {
        console.warn('No userRole or Profile ID found yet.');
        return;
      }

      console.log('Leave API Response:', res);
      // Robust extraction of the leaves array
      const backendRequests = res?.leaves || res?.data?.leaves || (Array.isArray(res) ? res : (res?.data || []));
      setRequests(Array.isArray(backendRequests) ? backendRequests : []);
      
      // Background resolve for missing names
      if (backendRequests.length > 0) resolveMissingNames(backendRequests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to sync leave records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (allotData.userId) {
      fetchEmployeeBalance(allotData.userId);
    } else {
      setUserBalance(null);
    }
  }, [allotData.userId]);

  const fetchEmployeeBalance = async (userId) => {
    setIsBalanceLoading(true);
    try {
      const res = await leaveAPI.getEmployeeLeave(userId);
      // user provided example: { "type":"casual", "total":20 }
      setUserBalance(Array.isArray(res) ? res : [res]);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setUserBalance(null);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveAPI.approveLeave(id);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
      toast.success('Leave Approved!');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve leave");
    }
  };

  const handleReject = (id) => {
    setRejectionModal({ show: true, id, reason: '' });
  };

  const confirmReject = async () => {
    if (!rejectionModal.id) return;
    setIsSaving(true);
    try {
      await leaveAPI.rejectLeave(rejectionModal.id, rejectionModal.reason);
      setRequests(prev => prev.map(r => r.id === rejectionModal.id ? { ...r, status: 'Rejected' } : r));
      toast.error('Leave Rejected');
      setRejectionModal({ show: false, id: null, reason: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject leave");
    } finally {
      setIsSaving(false);
    }
  };

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
      // Re-use logic to avoid 403 for employees if needed, but normally policies are public
      const res = await (userRole === 'admin' ? leaveAPI.getAllLeaves() : leaveAPI.getEmployeeLeave(userProfile?.id || 1));
      const policies = Array.isArray(res) ? res : (res?.leaves || res?.data || []);
      setLeavePolicies(policies);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const currentUserId = formData.userId || userProfile?.id || userProfile?.userId;
      const payload = {
        userId: Number(currentUserId),
        type: formData.type.toLowerCase(),
        title: formData.title,
        reason: formData.reason
      };

      await leaveAPI.createLeave(payload);
      toast.success(`Leave request for "${payload.title}" submitted!`);

      fetchRequests(); // Refresh the real list from API
      setShowApplyModal(false);
      setFormData({ name: '', type: 'Casual', days: '1', reason: '', title: '', userId: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit leave request");
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = requests.filter(r => {
    const emp = employees.find(e => Number(e.id) === Number(r.userId));
    const empName = emp?.name || emp?.username || `User ${r.userId}`;
    const matchSearch = empName.toLowerCase().includes(search.toLowerCase()) ||
      (r.type || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.title || '').toLowerCase().includes(search.toLowerCase());

    const displayStatus = r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : 'Pending';
    return (activeTab === 'All' || displayStatus === activeTab) && matchSearch;
  });

  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'text-blue-500' },
    { label: 'Pending Approvals', value: requests.filter(r => r.status?.toLowerCase() === 'pending').length, color: 'text-purple-500' },
    { label: 'Leaves Approved', value: requests.filter(r => r.status?.toLowerCase() === 'approved').length, color: 'text-green-500' },
    { label: 'Leaves Rejected', value: requests.filter(r => r.status?.toLowerCase() === 'rejected').length, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-5 animate-fade-in relative pb-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
        <span>HR Management</span>
        <ChevronDown className="w-3 h-3 -rotate-90" />
        <span className="text-[#2f6645] font-bold">Leave Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">
            {userRole === 'admin' ? 'Review, approve and track employee time-off requests' : 'View your leave status and submit new requests'}
          </p>
        </div>

        {/* Action Controls based on Role */}
        <div className="flex items-center gap-2">
          {userRole === 'admin' ? (
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              <button
                onClick={() => setCurrentView('leave')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentView === 'leave' ? 'bg-[#2f6645] text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <FileText className="w-4 h-4" /> Reports
              </button>
              <button
                onClick={() => setCurrentView('allot')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentView === 'allot' ? 'bg-[#2f6645] text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <UserPlus className="w-4 h-4" /> Allot Leave
              </button>
            </div>
          ) : userRole === 'employee' ? (
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, userId: userProfile?.id || userProfile?.userId || '' }));
                setShowApplyModal(true);
              }}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#2f6645] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5" /> Request Leave
            </button>
          ) : null}
        </div>
      </div>

      {currentView === 'leave' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="card p-4 hover:shadow-lg transition-all border border-slate-100 bg-white rounded-2xl">
                {isLoading ? <Skeleton variant="badge" className="h-8 w-16 mb-0" /> : <p className={`text-2xl font-black ${s.color} tracking-tight`}>{s.value}</p>}
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="card overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-white rounded-2xl">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-2 rounded-xl text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-[#2f6645] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Search records..." className="input pl-9 h-11 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Employee', 'Leave Type', 'Duration', 'Reason', 'Applied On', 'Status', 'Actions'].map(h => (
                      <th key={h} className="table-header text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-4 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4"><div className="flex gap-2"><Skeleton variant="circle" /><Skeleton variant="text" className="w-24" /></div></td>
                        <td className="px-6 py-4"><Skeleton variant="badge" /></td>
                        <td className="px-6 py-4"><Skeleton variant="text" /></td>
                        <td className="px-6 py-4"><Skeleton variant="text" /></td>
                        <td className="px-6 py-4"><Skeleton variant="text" /></td>
                        <td className="px-6 py-4"><Skeleton variant="badge" /></td>
                        <td className="px-6 py-4"><Skeleton variant="button" className="w-12 h-8" /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan="7" className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No leave records found.</td></tr>
                  ) : filtered.map(req => {
                    const currentId = Number(req.userId || req.user_id);
                    // Search through local, global list and name cache
                    const allPossibleEmployees = [...employees, ...(globalEmployees || [])];
                    const emp = allPossibleEmployees.find(e => Number(e.id) === currentId);
                    
                    const isSelf = Number(userProfile?.id || userProfile?.userId) === currentId;
                    const cachedName = nameCache[currentId];
                    const empName = emp?.name || emp?.username || cachedName || (isSelf ? (userProfile?.name || userProfile?.username) : null) || `Staff #${currentId}`;
                    
                    const appliedDate = req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                    const statusStr = req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1).toLowerCase() : 'Pending';

                    return (
                      <tr key={req.id || Math.random()} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-[#2f6645] group-hover:text-white flex items-center justify-center font-black text-xs transition-all shadow-sm">
                              {empName.split(' ').map(n => n?.[0]).join('')}
                            </div>
                            <div>
                              <p className="text-slate-900 font-black group-hover:text-[#2f6645] transition-colors">{empName}</p>
                              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-0.5">ID: {req.userId || req.user_id || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700">{req.type || 'Casual'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900 font-black truncate max-w-[150px]">{req.title || 'Leave Request'}</p>
                          <p className="text-slate-400 text-[10px] uppercase font-bold mt-0.5">1 Day</p>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs max-w-[180px] font-medium truncate italic" title={req.reason}>"{req.reason || 'No reason'}"</td>
                        <td className="px-6 py-4 text-slate-400 text-[10px] font-bold uppercase">{appliedDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusBadge[statusStr.toLowerCase()] || 'bg-amber-100 text-amber-700'}`}>{statusStr}</span>
                        </td>
                        <td className="px-6 py-4">
                          {userRole === 'admin' && (statusStr === 'Pending') && (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleApprove(req.id)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-[#2f6645] hover:text-white shadow-sm transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                              <button onClick={() => handleReject(req.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white shadow-sm transition-all"><XCircle className="w-4 h-4" /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Allotment View (Admin only) */
        <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="card p-8 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-2xl">
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
                await leaveAPI.createLeaveAllocation(payload);
                toast.success(`Leave allocated successfully!`);
                setAllotData({ userId: '', sick: '0', annual: '0', other: '0', casual: '0', company: '0' });
                fetchAllocations();
              } catch (error) {
                toast.error("Failed to allot leave");
              } finally {
                setIsSaving(false);
              }
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2 lg:col-span-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Select Employee</label>
                  <div className="relative group/select">
                    <select required className="input h-14 bg-slate-50 border-slate-100 pr-10 cursor-pointer" value={allotData.userId} onChange={(e) => setAllotData({ ...allotData, userId: e.target.value })}>
                      <option value="">Select an employee...</option>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name || emp.username}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                {['sick', 'annual', 'casual', 'other', 'company'].map(type => (
                  <div key={type} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 capitalize">{type} Leave</label>
                    <input required type="number" className="input h-14 bg-slate-50 border-slate-100" value={allotData[type]} onChange={(e) => setAllotData({ ...allotData, [type]: e.target.value })} />
                  </div>
                ))}
                <div className="flex items-end">
                  <button type="submit" disabled={isSaving} className="h-14 w-full bg-[#2f6645] text-white rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    Allot Leaves
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Submit Leave Request</h2>
              <button onClick={() => setShowApplyModal(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Staff Member</label>
                {userRole === 'admin' ? (
                  <select required className="input h-14 bg-slate-50" value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })}>
                    <option value="">Choose Staff...</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name || emp.username}</option>)}
                  </select>
                ) : (
                  <input readOnly className="input h-14 bg-slate-100 font-bold" value={userProfile?.name || 'Self'} />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Title</label>
                  <input required className="input h-14 bg-slate-50" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Type</label>
                  <select className="input h-14 bg-slate-50" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option>Casual</option>
                    <option>Sick</option>
                    <option>Annual</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Reason</label>
                <textarea required rows="3" className="input p-5 bg-slate-50 resize-none" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
              </div>
              <button type="submit" disabled={isSaving} className="w-full py-4 bg-[#2f6645] text-white font-black rounded-2xl shadow-xl">
                {isSaving ? 'Submitting...' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModal.show && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setRejectionModal({ show: false, id: null, reason: '' })}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
               <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Reason for Rejection</h2>
               <button onClick={() => setRejectionModal({ show: false, id: null, reason: '' })} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="p-6 space-y-5">
               <textarea 
                  required 
                  rows="2" 
                  autoFocus
                  placeholder="Enter reason..."
                  className="input p-4 bg-slate-50 border-slate-200 text-sm focus:ring-[#2f6645]/10 focus:border-[#2f6645]" 
                  value={rejectionModal.reason} 
                  onChange={e => setRejectionModal({ ...rejectionModal, reason: e.target.value })} 
               />

              <div className="flex gap-3">
                <button 
                   onClick={() => setRejectionModal({ show: false, id: null, reason: '' })}
                   className="flex-1 py-3 text-slate-500 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all"
                >
                   Cancel
                </button>
                <button 
                   onClick={confirmReject} 
                   disabled={isSaving || !rejectionModal.reason.trim()} 
                   className="flex-[2] py-3 bg-red-500 text-white font-black rounded-xl text-xs shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                   Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
