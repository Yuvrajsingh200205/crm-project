import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, UserCheck, UserX, AlertCircle, 
  ChevronLeft, ChevronRight, Search, Download, 
  MapPin, CheckCircle2, MoreHorizontal, Info, Plus, X
} from 'lucide-react';

const initialAttendance = [
  { id: '1', empId: 'EMP-001', name: 'Rajesh Kumar', date: '2024-03-13', checkIn: '09:05 AM', checkOut: '06:15 PM', status: 'Present', workHours: '09:10', location: 'Head Office' },
  { id: '2', empId: 'EMP-002', name: 'Suresh Verma', date: '2024-03-13', checkIn: '09:35 AM', checkOut: '06:45 PM', status: 'Late', workHours: '09:10', location: 'Site-A' },
  { id: '3', empId: 'EMP-003', name: 'Priya Devi', date: '2024-03-13', checkIn: '08:55 AM', checkOut: '05:30 PM', status: 'Present', workHours: '08:35', location: 'Site-B' },
];

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl mb-1">Attendance Management</h1>
          <p className="text-slate-500 text-sm italic">"Log and track daily employee presence accurately."</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddModal(true)} className="btn-primary bg-[#2f6645] hover:shadow-emerald-900/20 shadow-lg">
            <Plus className="w-4 h-4" /> Log Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Present Today', value: attendance.filter(a => a.status === 'Present').length, color: 'emerald' },
          { label: 'Late', value: attendance.filter(a => a.status === 'Late').length, color: 'amber' },
          { label: 'On Leave', value: 0, color: 'blue' },
          { label: 'Total Logs', value: attendance.length, color: 'slate' }
        ].map((s, i) => (
          <div key={i} className="card p-5 border-l-4 border-spacing-2" style={{ borderLeftColor: s.color === 'emerald' ? '#10b981' : s.color === 'amber' ? '#f59e0b' : '#3b82f6' }}>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
            <p className="text-3xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
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
          <select className="select w-40 bg-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late Arrival</option>
          </select>
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
              {filteredAttendance.map((row) => (
                <tr key={row.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        {row.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{row.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">{row.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-slate-600">{row.date}</td>
                  <td className="table-cell font-bold text-emerald-600">{row.checkIn}</td>
                  <td className="table-cell font-bold text-slate-600">{row.checkOut}</td>
                  <td className="table-cell"><span className="badge bg-slate-100 text-slate-700">{row.workHours} Hrs</span></td>
                  <td className="table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      row.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" onClick={() => setAttendance(attendance.filter(a => a.id !== row.id))} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#1e3a34] text-white">
              <h2 className="text-xl font-black">Manual Attendance Log</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 opacity-60 hover:opacity-100" /></button>
            </div>
            
            <form onSubmit={handleAddLog} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 overflow-hidden">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Employee Name</label>
                  <input required placeholder="e.g. Rajesh Kumar" className="input bg-slate-50 border-slate-200" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Employee ID</label>
                  <input required placeholder="e.g. EMP-001" className="input bg-slate-50 border-slate-200" value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Attendance Date</label>
                <input required type="date" className="input bg-slate-50 border-slate-200" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">In-Time</label>
                  <input required type="time" className="input bg-slate-50 border-slate-200" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Out-Time</label>
                  <input required type="time" className="input bg-slate-50 border-slate-200" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Work Location</label>
                  <select className="select bg-slate-50 border-slate-200" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                    <option>Head Office</option>
                    <option>Site-A</option>
                    <option>Site-B</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Present Status</label>
                  <select className="select bg-slate-50 border-slate-200" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Present">Present</option>
                    <option value="Late">Late Arrival</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary py-3">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3 bg-[#2f6645]">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
