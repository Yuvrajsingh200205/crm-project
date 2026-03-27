import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Star, FileText, 
  CreditCard, Briefcase, MapPin, Search,
  Plus, Download, CheckCircle2, AlertTriangle, 
  X, Loader2, Save, MoreVertical, ExternalLink, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const statusBadge = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
  'Blacklisted': 'bg-red-50 text-red-600 border-red-100',
  'Pending KYC': 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function Subcontractors() {
  const [subs, setSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [formData, setFormData] = useState({
    name: '', expertise: 'Electrical', contact: '', email: '', 
    status: 'Active', location: 'Bihar'
  });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setSubs([
        { id: 1, name: 'JANKI ENTERPRISES', expertise: 'Lines & Poles', rating: 4.8, billed: 1250000, currentProject: 'SWPL-BRGF', status: 'Active', location: 'Lakhisarai' },
        { id: 2, name: 'GSAR POWER TECH', expertise: 'Substations', rating: 4.5, billed: 885000, currentProject: 'Gaya-Sub-2', status: 'Active', location: 'Patna' },
        { id: 3, name: 'JGD INFRA PROJECTS', expertise: 'Civil Works', rating: 3.9, billed: 425000, currentProject: 'Rural Electrification', status: 'On Hold', location: 'Banka' },
        { id: 4, name: 'JYESTHI CONSTRUCTIONS', expertise: 'Cabling', rating: 4.2, billed: 154000, currentProject: 'SWPL-BRGF', status: 'Active', location: 'Munger' },
        { id: 5, name: 'DARPAN POWER SOLUTIONS', expertise: 'Maintenance', rating: 4.9, billed: 332000, currentProject: 'AMC-Zone-1', status: 'Active', location: 'Jehanabad' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const filtered = subs.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.expertise.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Active Subs', value: subs.filter(s => s.status === 'Active').length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Billed', value: `₹${(subs.reduce((a, b) => a + b.billed, 0) / 100000).toFixed(1)}L`, icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Avg Rating', value: 4.6, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Pending KYC', value: 2, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const newSub = { ...formData, id: Date.now(), rating: 0, billed: 0, currentProject: 'Unassigned' };
      setSubs([newSub, ...subs]);
      setIsSaving(false);
      setIsModalOpen(false);
      toast.success('Subcontractor onboarded successfully');
      setFormData({ name: '', expertise: 'Electrical', contact: '', email: '', status: 'Active', location: 'Bihar' });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in dashboard-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">Subcontractors</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-0.5 border-l-2 border-[#2f6645] ml-0.5">Partner Management & Work Orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Work Orders
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Onboard Sub
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 group hover:border-emerald-200 transition-all cursor-default relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform ${s.color}`}>
               <s.icon className="w-16 h-16" />
            </div>
            <div className="flex justify-between items-start">
              <div className={`${s.bg} p-2.5 rounded-2xl`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-800 tracking-tight">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/20">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="input pl-11 bg-white border-slate-200 h-11 text-sm font-medium focus:ring-emerald-500/10 focus:border-[#2f6645]" 
              placeholder="Search by name, expertise or location..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header">Partner Details</th>
                <th className="table-header">Expertise</th>
                <th className="table-header">Performance</th>
                <th className="table-header text-right">Total Billed</th>
                <th className="table-header text-center whitespace-nowrap">Status</th>
                <th className="table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><Skeleton className="w-full h-4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((sub) => (
                <tr key={sub.id} className="table-row hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#2f6645] group-hover:text-white transition-all font-black uppercase text-[10px]">
                        {sub.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold">{sub.name}</p>
                        <div className="flex items-center gap-1 mt-0.5 opacity-60">
                          <MapPin className="w-2.5 h-2.5" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">{sub.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-[9px] font-black uppercase tracking-widest py-1 px-3 bg-white border border-slate-100 text-slate-500 rounded-lg">{sub.expertise}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(star => (
                             <Star key={star} className={`w-2.5 h-2.5 ${star <= Math.floor(sub.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-100 fill-slate-100'}`} />
                          ))}
                          <span className="text-[10px] font-bold text-slate-700 ml-1">{sub.rating}</span>
                       </div>
                       <p className="text-[9px] font-mono text-blue-500 uppercase tracking-tighter">Proj: {sub.currentProject}</p>
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    <p className="font-bold text-slate-700">₹{sub.billed.toLocaleString()}</p>
                  </td>
                  <td className="table-cell text-center">
                    <span className={`badge ${sub.status === 'Active' ? 'badge-green' : sub.status === 'On Hold' ? 'badge-yellow' : sub.status === 'Blacklisted' ? 'badge-red' : 'badge-blue'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedSub(sub)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors uppercase border border-emerald-100"
                        >
                        Verify
                        </button>
                        <button 
                            onClick={() => setSelectedSub(sub)}
                            className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-100 transition-colors uppercase border border-slate-100"
                        >
                        Orders
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#2f6645]" /> Onboard Subcontractor
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Organization Name <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="e.g. Sterling Power Infra Pvt Ltd" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Expertise / Domain <span className="text-red-500">*</span></label>
                    <select className="input w-full" value={formData.expertise} onChange={e => setFormData({...formData, expertise: e.target.value})}>
                      <option>Electrical Works</option>
                      <option>Civil & Foundations</option>
                      <option>Lines & Cabling</option>
                      <option>Substations</option>
                      <option>O&M Services</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Base Location <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="Bihar, Jharkhand, etc." value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Compliance & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Primary Contact <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      className="input w-full" 
                      placeholder="10 digit mobile number" 
                      value={formData.contact} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) setFormData({...formData, contact: val});
                      }} 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Initial Status <span className="text-red-500">*</span></label>
                    <select className="input w-full" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>Active</option>
                      <option>Pending KYC</option>
                      <option>On Hold</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 px-6">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Processing...' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Action Detail Modal (Slide-over) */}
      {selectedSub && (
        <div className="fixed inset-0 z-[250] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedSub(null)}>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-slide-left flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2f6645] text-white flex items-center justify-center shadow-lg shadow-emerald-200 font-black">
                        {selectedSub.name[0]}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{selectedSub.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedSub.expertise} • {selectedSub.location}</p>
                    </div>
                </div>
                <button onClick={() => setSelectedSub(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Visual Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</p>
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-lg font-black text-slate-800">{selectedSub.rating}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Cumulative Billed</p>
                        <p className="text-lg font-black tracking-tight">₹{selectedSub.billed.toLocaleString()}</p>
                    </div>
                </div>

                {/* Compliance Audit */}
                <div>
                   <h3 className="section-title mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance & Documents</h3>
                   <div className="grid grid-cols-1 gap-2">
                        {[
                            { name: 'GST Certificate', status: 'Verified', date: 'Mar 2026' },
                            { name: 'Pan Card', status: 'Verified', date: 'Mar 2026' },
                            { name: 'Work Experience', status: 'Under Review', date: 'Apr 2026' },
                            { name: 'Safety Certification', status: 'Pending', date: '-' },
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-slate-300" />
                                    <span className="text-xs font-bold text-slate-600">{doc.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{doc.status}</span>
                                    <Download className="w-3.5 h-3.5 text-slate-200 hover:text-slate-400 cursor-pointer" />
                                </div>
                            </div>
                        ))}
                   </div>
                </div>

                {/* Active Work Orders */}
                <div className="p-6 bg-[#2f6645]/5 rounded-[2rem] border border-[#2f6645]/10">
                    <h3 className="section-title mb-4 flex items-center gap-2 text-[#2f6645]"><Briefcase className="w-4 h-4" /> Active Work Orders</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#2f6645]/5">
                             <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-black text-slate-800 tracking-tight">SWPL-BRGF-LINE-001</p>
                                <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">On Schedule</span>
                             </div>
                             <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-tighter">Scope: 33KV Line Stringing (CKM 12.5)</p>
                             <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className="h-full bg-[#2f6645]" style={{ width: '45%' }}></div>
                             </div>
                        </div>
                        <button className="w-full py-4 bg-[#2f6645] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-[#244f35] transition-all">Issue New Work Order</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
