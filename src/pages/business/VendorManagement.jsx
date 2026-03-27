import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Star, FileText, 
  CreditCard, Briefcase, MapPin, Search,
  Plus, Download, CheckCircle2, AlertTriangle, 
  X, Loader2, Save, MoreVertical, ExternalLink,
  ShieldCheck, ArrowRight, TrendingUp, History, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const statusBadge = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
  'Blacklisted': 'bg-red-50 text-red-600 border-red-100',
  'Pending KYC': 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Electrical', contact: '', email: '', 
    status: 'Active', location: 'Bihar'
  });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setVendors([
        { id: 1, name: 'Aditya Electricals', category: 'Cables & Conductors', rating: 4.8, billed: 1250000, status: 'Active', location: 'Patna' },
        { id: 2, name: 'Mehta Transformers', category: 'Heavy Machinery', rating: 4.5, billed: 8850000, status: 'Active', location: 'Gaya' },
        { id: 3, name: 'Sanjay & Sons', category: 'Civil Works', rating: 3.9, billed: 425000, status: 'On Hold', location: 'Banka' },
        { id: 4, name: 'Gupta Steel', category: 'Hardware', rating: 4.2, billed: 154000, status: 'Active', location: 'Munger' },
        { id: 5, name: 'Rapid Logistics', category: 'Transport', rating: 4.9, billed: 2250000, status: 'Active', location: 'Purnia' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const filtered = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Vendors', value: vendors.length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Rate', value: '94%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Avg Rating', value: '4.4', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Verified', value: '18', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const newVendor = { ...formData, id: Date.now(), rating: 0, billed: 0 };
      setVendors([newVendor, ...vendors]);
      setIsSaving(false);
      setIsModalOpen(false);
      toast.success('Vendor onboarded successfully');
      setFormData({ name: '', category: 'Electrical', contact: '', email: '', status: 'Active', location: 'Bihar' });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in dashboard-container">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase tracking-tighter">Vendor Management</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-0.5 border-l-2 border-emerald-600 ml-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Supplier Registry, Rating & Rate Contracts</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 font-black uppercase text-[10px] py-4 px-6 tracking-widest"><Download className="w-4 h-4" /> Export Registry</button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 font-black uppercase text-[10px] py-4 px-8 tracking-widest shadow-xl shadow-blue-900/10 active:scale-95">
            <Plus className="w-5 h-5" /> Onboard Vendor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 border-b-4 border-b-transparent hover:border-b-emerald-600 transition-all cursor-default">
            <div className="flex justify-between items-start">
              <div className={`${s.bg} p-2.5 rounded-2xl`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-800 tracking-tight">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Vendor List */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="input pl-10 h-11 text-xs font-semibold rounded-xl" 
              placeholder="Search by vendor name, category or region..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-500">Filters Active</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs box-border">
            <thead className="bg-[#fcfdfe] border-b border-slate-200">
              <tr>
                <th className="table-header py-5">Vendor Entity</th>
                <th className="table-header">Category</th>
                <th className="table-header">Performance</th>
                <th className="table-header text-right">Lifetime Billed</th>
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
              ) : filtered.map((vendor) => (
                <tr key={vendor.id} className="table-row hover:bg-slate-50 transition-all group">
                  <td className="table-cell">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[1rem] bg-slate-100/80 flex items-center justify-center font-black text-slate-400 text-xs shadow-inner">
                        {vendor.name[0]}
                      </div>
                      <div>
                        <p className="text-slate-900 font-black text-[13px] tracking-tight mb-1">{vendor.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3" /> {vendor.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 tracking-tighter">{vendor.category}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                        <div className="flex">
                            {[1,2,3,4,5].map(star => (
                                <Star key={star} className={`w-3 h-3 ${star <= Math.floor(vendor.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                            ))}
                        </div>
                        <span className="text-[11px] font-black text-slate-700 ml-1">{vendor.rating}</span>
                    </div>
                  </td>
                  <td className="table-cell text-right font-black text-slate-900 tracking-tight">₹{vendor.billed.toLocaleString()}</td>
                  <td className="table-cell text-center">
                    <span className={`badge ${statusBadge[vendor.status]} px-3 font-black text-[9px] uppercase`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedVendor(vendor)}
                            className="p-2 bg-white text-slate-300 rounded-xl hover:text-emerald-600 transition-all border border-slate-100 group-hover:border-emerald-100 group-hover:bg-emerald-50/50"
                        >
                        <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setSelectedVendor(vendor)}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg shadow-slate-900/10"
                        >
                        History
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Detail Slide-over */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[250] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedVendor(null)}>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-slide-left flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#2f6645] text-white flex items-center justify-center font-black text-lg shadow-xl shadow-emerald-990/20">
                        {selectedVendor.name[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{selectedVendor.name}</h2>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Verified Platinum Partner</span>
                    </div>
                </div>
                <button onClick={() => setSelectedVendor(null)} className="p-3 hover:bg-white rounded-2xl text-slate-300 hover:text-slate-600 transition-all"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="grid grid-cols-2 gap-5">
                    <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 leading-none">Total Invoiced</p>
                        <p className="text-2xl font-black text-emerald-800 tracking-tighter leading-none">₹{(selectedVendor.billed / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Active POs</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">04</p>
                    </div>
                </div>

                <div>
                   <h3 className="section-title mb-6 flex items-center gap-2 uppercase tracking-tighter font-black text-slate-800"><History className="w-4 h-4" /> Sourcing Audit</h3>
                   <div className="space-y-4 relative">
                        <div className="absolute left-[2.5px] top-4 bottom-4 w-[1px] bg-slate-100"></div>
                        {[
                            { date: '2024-03-25', activity: 'PO Issued', ref: 'PO-9912', value: '₹4.5L', status: 'In Transit' },
                            { date: '2024-03-10', activity: 'Quotation Accepted', ref: 'QTN-442', value: '₹3.2L', status: 'Completed' },
                            { date: '2024-02-15', activity: 'Vendor Onboarded', ref: '-', value: '-', status: 'Verified' },
                        ].map((log, i) => (
                            <div key={i} className="pl-6 group relative">
                                <div className="absolute left-[-2px] top-1.5 w-2 h-2 rounded-full border-2 border-white bg-emerald-600 group-first:bg-emerald-600 ring-2 ring-slate-50 group-first:ring-emerald-50"></div>
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:shadow-slate-100 transition-all cursor-default">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-black text-slate-800 leading-none">{log.activity}</p>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase leading-none">{log.date}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1 uppercase tracking-widest"><FileText className="w-3 h-3" /> {log.ref}</span>
                                        <span className="text-emerald-600 tracking-tight font-black">{log.value !== '-' && log.value}</span>
                                        <span className={`ml-auto uppercase text-[8px] px-1.5 py-0.5 rounded ${log.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-50 text-emerald-600'}`}>{log.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                   </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-32 h-32" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Preferred Vendor Controls</p>
                    <div className="space-y-3 relative z-10">
                        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#2f6645] transition-all group/btn">
                            <span className="text-xs font-black text-slate-700">Approve Rate Contract</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover/btn:translate-x-1 group-hover/btn:text-[#2f6645] transition-all" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#2f6645] transition-all group/btn">
                            <span className="text-xs font-black text-slate-700">Audit Compliance</span>
                            <ShieldCheck className="w-4 h-4 text-slate-300 group-hover/btn:translate-x-1 group-hover/btn:text-[#2f6645] transition-all" />
                        </button>
                    </div>
                    <button className="w-full mt-8 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-slate-900/40 hover:bg-slate-800 active:scale-95 transition-all">Download Full Dossier</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#2f6645]" /> Vendor Onboarding
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Legal Entity Name <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="e.g. Acme Services Ltd" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Primary Category <span className="text-red-500">*</span></label>
                    <select className="input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Electrical</option>
                      <option>Heavy Machinery</option>
                      <option>Cables & Conductors</option>
                      <option>Civil Works</option>
                      <option>Hardware</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Headquarters City <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="Location Name" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Compliance & Tax</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">GSTIN / PAN <span className="text-red-500">*</span></label>
                    <input required className="input w-full font-bold uppercase" placeholder="Enter identification" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 px-8">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Processing...' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
