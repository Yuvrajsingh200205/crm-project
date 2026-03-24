import { 
  Calendar, Clock, UserCheck, UserX, AlertCircle, 
  ChevronLeft, ChevronRight, Search, Download, 
  MapPin, CheckCircle2, MoreHorizontal, Info, Plus, X, ChevronDown,
  Fingerprint, CalendarDays, ArrowLeft, Undo2, Eye
} from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

const initialAttendance = [];

export default function Attendance() {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    checkOut: '18:00',
    location: 'Head Office',
    status: 'Present'
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateRecord = () => {
    showToast('Attendance record updated successfully!', 'success');
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now().toString(),
      ...formData,
      checkIn: formatTime(formData.checkIn),
      checkOut: formatTime(formData.checkOut),
      workHours: calculateHours(formData.checkIn, formData.checkOut)
    };
    setAttendance([newLog, ...attendance]);
    setShowAddModal(false);
    // Reset form
    setFormData({
      empId: '', name: '', date: new Date().toISOString().split('T')[0],
      checkIn: '09:00', checkOut: '18:00', location: 'Head Office', status: 'Present'
    });
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const hour = hr % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const calculateHours = (start, end) => {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const diff = (eH * 60 + eM) - (sH * 60 + sM);
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const filteredAttendance = attendance.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (selectedEmployee) {
    const empLogs = attendance.filter(a => a.empId === selectedEmployee.empId);
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        {/* Header Section from Image */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Good afternoon, Admin!</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              Viewing attendance insights for <span className="text-[#2f6645] font-black">{selectedEmployee.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current time</p>
              <p className="text-2xl font-black text-slate-800 tracking-tighter">{currentTime}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
               <Clock className="w-6 h-6 border-2 border-slate-400 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Stats & Summary */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Attendance Composition (Donut Style) */}
              <div className="card p-6 bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Attendance Mix</h3>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                     Month <ChevronDown className="w-3 h-3" />
                   </div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="relative w-32 h-32 flex items-center justify-center">
                     {/* Mock Donut Chart using Circle CSS */}
                     <svg className="w-full h-full -rotate-90">
                       <circle cx="64" cy="64" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                       <circle cx="64" cy="64" r="50" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="314" strokeDashoffset="100" />
                       <circle cx="64" cy="64" r="50" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="314" strokeDashoffset="250" />
                       <circle cx="64" cy="64" r="50" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="314" strokeDashoffset="300" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <p className="text-xl font-black text-slate-900">88%</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">On Time</p>
                     </div>
                   </div>
                   <div className="flex-1 space-y-3">
                     {[
                       { label: 'In Office', val: '63%', color: 'bg-blue-500' },
                       { label: 'Remote', val: '22%', color: 'bg-teal-500' },
                       { label: 'Late', val: '5%', color: 'bg-amber-500' },
                       { label: 'Leaves', val: '10%', color: 'bg-red-500' },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className={`w-1 h-3 rounded-full ${item.color}`} />
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
                         </div>
                         <span className="text-xs font-black text-slate-900">{item.val}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Card 2: Work Timings (Bar Chart Style) */}
              <div className="card p-6 bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Working Hours</h3>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                     Weekly <ChevronDown className="w-3 h-3" />
                   </div>
                </div>
                <div className="flex items-end justify-between h-32 gap-3 mb-2">
                  {[
                    { h: '60%', last: '80%' }, { h: '90%', last: '70%' }, { h: '45%', last: '50%' },
                    { h: '75%', last: '60%' }, { h: '85%', last: '95%' }, { h: '65%', last: '40%' },
                    { h: '70%', last: '80%' }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                       <div className="w-full flex justify-center gap-0.5 h-full items-end">
                         <div className="w-1.5 bg-blue-100 rounded-t-sm" style={{ height: bar.last }} />
                         <div className="w-1.5 bg-blue-500 rounded-t-sm" style={{ height: bar.h }} />
                       </div>
                       
                       {/* Hover Tooltip Mock */}
                       <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl text-[8px] font-bold whitespace-nowrap">
                            <p>This week: 8.5 Hrs</p>
                            <p className="opacity-60 font-medium">Last week: 9.2 Hrs</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                    <span key={d} className="text-[9px] font-black text-slate-300 w-full text-center">{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row - Attendance History Grid */}
            <div className="card p-6 bg-white border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Attendance Matrix (Sep 2023)</h3>
                 <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors border border-slate-100"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors border border-slate-100"><ChevronRight className="w-4 h-4" /></button>
                 </div>
               </div>
               
               <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Check-in History</h4>
                 <div className="space-y-2">
                   {empLogs.length > 0 ? empLogs.map((log, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                           <CalendarDays className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-xs font-black text-slate-900">{log.date}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{log.location}</p>
                         </div>
                       </div>
                       <div className="flex flex-col sm:flex-row items-center gap-8">
                         <div className="text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase">In/Out</p>
                            <p className="text-[10px] font-bold text-slate-700">{log.checkIn} - {log.checkOut}</p>
                         </div>
                         <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                         }`}>
                           {log.status}
                         </div>
                       </div>
                     </div>
                   )) : (
                     <div className="text-center py-10 opacity-30">
                       <Info className="w-8 h-8 mx-auto mb-2" />
                       <p className="text-xs font-bold uppercase tracking-widest">No logs found</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column - Actions & Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Action Card: Adjust Attendance */}
            <div className="card p-6 bg-[#2f6645] text-white border-none shadow-xl shadow-green-900/10 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full scale-150 group-hover:scale-[1.6] transition-transform duration-700" />
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-[#9ae66e]" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#9ae66e]">Manual Marking</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-white/50 tracking-wider">Select Date</label>
                      <input type="date" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#9ae66e]/50" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-white/50 tracking-wider">Attendance Status</label>
                      <div className="relative group/select">
                        <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white appearance-none cursor-pointer">
                           <option className="text-slate-900">Present (On Time)</option>
                           <option className="text-slate-900">Late Arrival</option>
                           <option className="text-slate-900">Excused Absence</option>
                           <option className="text-slate-900">Work from Site</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none group-focus-within/select:text-[#9ae66e]" />
                      </div>
                    </div>
                    <button onClick={updateRecord} className="w-full py-3.5 bg-[#9ae66e] text-[#1e3a34] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Save Record
                    </button>
                 </div>
               </div>
            </div>

            {/* Profile Brief Card */}
            <div className="card p-6 bg-white border border-slate-100 shadow-sm text-center">
               <div className="flex flex-col items-center">
                 <div className="w-24 h-24 rounded-3xl bg-slate-100 mb-4 border-4 border-white shadow-lg overflow-hidden relative group">
                   <img src={`https://ui-avatars.com/api/?name=${selectedEmployee.name}&size=200&background=random`} alt="" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <Eye className="w-6 h-6 text-white" />
                   </div>
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedEmployee.name}</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-6">Staff ID: {selectedEmployee.empId}</p>
                 
                 <div className="w-full grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                   <button onClick={() => setSelectedEmployee(null)} className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-colors">
                     <ArrowLeft className="w-3.5 h-3.5" /> Back
                   </button>
                   <button className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 transition-colors">
                     <Download className="w-3.5 h-3.5" /> Export
                   </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 pb-10">
      {/* Top Section: Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 leading-none mb-1">Attendance Management</h1>
          <p className="text-sm text-slate-500 font-medium">Insights and manual logging for your entire workforce.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Server Time</p>
            <p className="text-lg font-black text-[#2f6645]">{currentTime}</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary bg-[#2f6645] shadow-xl shadow-green-900/10 h-14 px-8">
            <Plus className="w-5 h-5" /> Log Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Stats with Donut Idea */}
         <div className="md:col-span-8 card p-6 md:p-8 bg-white border-none shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center gap-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-50" />
           <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="440" strokeDashoffset="110" />
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray="440" strokeDashoffset="380" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-black text-slate-900 leading-none">85%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Present</p>
              </div>
           </div>
           
           <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Daily Status Mix</h3>
                <span className="text-[10px] font-black text-[#2f6645] uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Today</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Present Today', val: attendance.filter(a => a.status === 'Present').length, color: 'bg-emerald-500', sub: '+2 from avg' },
                  { label: 'Late Arrivals', val: attendance.filter(a => a.status === 'Late').length, color: 'bg-amber-500', sub: 'Action required' },
                  { label: 'On Leave', val: '00', color: 'bg-blue-500', sub: 'Planned' },
                  { label: 'Average Hours', val: '8.5', color: 'bg-purple-500', sub: 'Standard shift' },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{s.label}</span>
                    </div>
                    <p className="text-xl font-black text-slate-800 leading-none">{s.val}</p>
                    <p className="text-[8px] font-bold text-slate-400 italic">{s.sub}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Quick Summary Sidebar */}
        <div className="md:col-span-4 space-y-4">
           <div className="card p-6 bg-[#1e3a34] text-white border-none shadow-xl shadow-green-900/10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-[#9ae66e]" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Active Shift</p>
                    <p className="text-xs font-bold">General (09:00 - 18:00)</p>
                 </div>
              </div>
              <p className="text-[10px] leading-relaxed opacity-60 italic">"Ensure all manual logs are verified before EOD for accurate payroll processing."</p>
           </div>
           <button onClick={() => setShowAddModal(true)} className="w-full h-16 bg-[#9ae66e] text-[#1e3a34] rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Plus className="w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Add Manual Log</span>
           </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-surface-border bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Employee..." 
              className="input pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative group/select">
              <select className="select w-40 bg-white pr-8 appearance-none" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Late">Late Arrival</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645] transition-colors" />
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-secondary whitespace-nowrap"><Plus className="w-4 h-4" /> Manual Log</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="table-header">Employee</th>
                <th className="table-header">Date</th>
                <th className="table-header">Clock In</th>
                <th className="table-header">Clock Out</th>
                <th className="table-header">Duration</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton variant="circle" className="w-8 h-8" /><Skeleton variant="text" className="w-24" /></div></td>
                    <td className="px-6 py-4"><Skeleton variant="text" className="w-16" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" className="w-12" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" className="w-12" /></td>
                    <td className="px-6 py-4"><Skeleton variant="text" className="w-12" /></td>
                    <td className="px-6 py-4"><Skeleton variant="badge" /></td>
                    <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Skeleton variant="button" className="w-8 h-8" /><Skeleton variant="button" className="w-8 h-8" /></div></td>
                  </tr>
                ))
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                      <UserX className="w-12 h-12 text-slate-400" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">No records found for this period</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((row) => (
                <tr key={row.id} className="table-row group">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700 flex items-center justify-center font-bold text-[10px] transition-colors border border-transparent group-hover:border-emerald-100 shadow-sm">
                        {row.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none group-hover:text-[#2f6645] transition-colors">{row.name}</p>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-black tracking-widest">{row.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-bold text-slate-500 text-xs uppercase tracking-tighter">{row.date}</td>
                  <td className="table-cell font-black text-emerald-600 text-xs uppercase">{row.checkIn}</td>
                  <td className="table-cell font-black text-slate-600 text-xs uppercase">{row.checkOut}</td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400">09:00 → 18:00</span>
                      <span className="badge bg-slate-100 text-slate-700 w-fit">{row.workHours} Hrs</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      row.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedEmployee(row)}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-[#2f6645] hover:text-white shadow-sm transition-all active:scale-95"
                        title="View Detailed History"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setAttendance(attendance.filter(a => a.id !== row.id));
                          showToast('Attendance log deleted!', 'error');
                        }}
                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95 border-none shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
              <div>
                <h2 className="text-base font-semibold">Manual Attendance Log</h2>
                <p className="text-xs text-white/60 mt-0.5">Record Daily Shift</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddLog} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Employee Name</label>
                  <input required placeholder="e.g. Rajesh Kumar" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Employee ID</label>
                  <input required placeholder="e.g. EMP-001" className="input" value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Attendance Date</label>
                <input required type="date" className="input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">In-Time</label>
                  <input required type="time" className="input" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Out-Time</label>
                  <input required type="time" className="input" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Work Location</label>
                  <select className="input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                    <option>Head Office</option>
                    <option>Site-A</option>
                    <option>Site-B</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Present Status</label>
                  <select className="input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Present">Present</option>
                    <option value="Late">Late Arrival</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border ${
            toast.type === 'error' ? 'bg-red-900 text-red-100 border-red-700' : 'bg-[#1e3a34] text-white border-[#2f6645]'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-[#9ae66e]" />}
            <p className="text-sm font-bold uppercase tracking-widest">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
