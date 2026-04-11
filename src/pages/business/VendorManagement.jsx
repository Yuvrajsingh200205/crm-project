import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Star, FileText, 
  CreditCard, Briefcase, MapPin, Search,
  Plus, Download, CheckCircle2, AlertTriangle, 
  X, Loader2, Save, MoreVertical, ExternalLink,
  ShieldCheck, ArrowRight, TrendingUp, History, Filter, Trash2, Edit3,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

import { vendorAPI } from '../../api/vendor';

const statusBadge = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
  'Blacklisted': 'bg-red-50 text-red-600 border-red-100',
  'Pending KYC': 'bg-blue-50 text-blue-600 border-blue-100',
  'Pending': 'bg-blue-50 text-blue-600 border-blue-100',
  'active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'pending': 'bg-blue-50 text-blue-600 border-blue-100',
  'approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentVendorId, setCurrentVendorId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', headquater: '', complianceTax: '', 
    panOrgstin: '', status: 'Pending', value: ''
  });

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
        const res = await vendorAPI.getAllVendors();
        // The endpoint returns { vendors: [...] }
        const vendorData = res?.vendors || [];
        
        const normalized = vendorData.map(v => ({
            id: v.id,
            name: v.name || 'Unknown',
            category: v.category || 'N/A',
            rating: 4.0, // Defaulting rating as it's not in the response yet
            value: v.value || 'N/A', // Using the 'value' field from response
            status: v.status || 'pending',
            location: v.headquater || 'N/A',
            panOrgstin: v.panOrgstin || '',
            createdAt: v.createdAt
        }));
        
        // Sorting to show newest first
        setVendors(normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
        console.error("Failed to fetch vendors:", error);
        toast.error("Failed to load vendors.");
    } finally {
        setIsLoading(true); // Wait, should be false
        setTimeout(() => setIsLoading(false), 500); // Smooth transition
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filtered = vendors.filter(v => 
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.category?.toLowerCase().includes(search.toLowerCase()) ||
    v.location?.toLowerCase().includes(search.toLowerCase()) ||
    v.panOrgstin?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Registered Vendors', value: vendors.length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Approved', value: vendors.filter(v => v.status === 'approved').length, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending Docs', value: vendors.filter(v => v.status === 'pending').length, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Tax Verified', value: vendors.filter(v => v.panOrgstin).length, icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    
    // ALIGNING WITH THE PROVIDED API SCHEMA
    const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        headquater: formData.headquater.trim(),
        city: formData.headquater.trim(),
        complianceTax: formData.complianceTax.trim(),
        panOrgstin: formData.panOrgstin.trim(), // Use the new key provided
        status: formData.status.toLowerCase(),
        value: Number(formData.value) || 0
    };

    console.log('DEBUG: Sending Vendor Payload ->', payload);

    if (!payload.name || !payload.category || !payload.headquater || !payload.panOrgstin) {
        toast.error('Please fill all required fields');
        return;
    }

    setIsSaving(true);
    try {
        if (isEditing) {
            await vendorAPI.updateVendor(currentVendorId, payload);
            toast.success('Vendor updated successfully');
        } else {
            const res = await vendorAPI.createVendor(payload);
            console.log('DEBUG: API Response ->', res);
            toast.success('Vendor onboarded successfully');
        }
        
        await fetchVendors();
        setIsModalOpen(false);
        setIsEditing(false);
        setFormData({ name: '', category: '', headquater: '', complianceTax: '', panOrgstin: '', status: 'Pending', value: '' });
    } catch (error) {
        console.error('API Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        
        let errorMsg = 'Internal Server Error (500)';
        if (error.response?.data) {
            if (Array.isArray(error.response.data.errors)) {
                errorMsg = error.response.data.errors.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
            } else if (error.response.data.message) {
                errorMsg = error.response.data.message;
            } else {
                errorMsg = JSON.stringify(error.response.data);
            }
        }
        
        toast.error(`Server Error: ${errorMsg}`, { duration: 8000 });
    } finally {
        setIsSaving(false);
    }
  };

  const openEditModal = (vendor) => {
    setFormData({
        name: vendor.name,
        category: vendor.category,
        headquater: vendor.location,
        complianceTax: vendor.complianceTax || '',
        panOrgstin: vendor.gstinOrPan || vendor.panOrgstin || '',
        status: vendor.status,
        value: vendor.value || vendor.billed || ''
    });
    setCurrentVendorId(vendor.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setIsSaving(true);
    try {
        await vendorAPI.deleteVendor(id);
        toast.success('Vendor removed from system');
        await fetchVendors();
        setDeleteConfirm({ show: false, id: null, name: '' });
    } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete vendor');
    } finally {
        setIsSaving(false);
    }
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
                <th className="table-header">PAN / GSTIN</th>
                <th className="table-header text-right">Classification</th>
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
                  <td className="table-cell font-mono font-bold text-blue-500">
                    {vendor.panOrgstin}
                  </td>
                  <td className="table-cell text-right font-black text-slate-900 tracking-tight">
                    <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px]">{vendor.value}</span>
                  </td>
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
                            onClick={() => openEditModal(vendor)}
                            className="p-2 bg-white text-slate-300 rounded-xl hover:text-blue-600 transition-all border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/50"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setDeleteConfirm({ show: true, id: vendor.id, name: vendor.name })}
                            className="p-2 bg-white text-slate-300 rounded-xl hover:text-red-600 transition-all border border-slate-100 group-hover:border-red-100 group-hover:bg-red-50/50"
                        >
                            <Trash2 className="w-4 h-4" />
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
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 leading-none">Credit Value/Cat</p>
                        <p className="text-xl font-black text-emerald-800 tracking-tighter leading-none">{selectedVendor.value}</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Category</p>
                        <p className="text-xl font-black text-slate-800 tracking-tighter leading-none uppercase text-[12px]">{selectedVendor.category}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="section-title flex items-center gap-2 uppercase tracking-tighter font-black text-slate-800"><Briefcase className="w-4 h-4" /> Company Identity</h3>
                    <div className="grid grid-cols-1 gap-3">
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAN / GSTIN</span>
                             <span className="text-xs font-black text-slate-800 font-mono">{selectedVendor.panOrgstin}</span>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headquarters</span>
                             <span className="text-xs font-black text-slate-800 uppercase">{selectedVendor.location}</span>
                         </div>
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
                {isEditing ? <Edit3 className="w-5 h-5 text-blue-600" /> : <UserCheck className="w-5 h-5 text-[#2f6645]" />}
                {isEditing ? 'Update Vendor Details' : 'Vendor Onboarding'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setIsEditing(false); }} className="text-slate-400 hover:text-slate-700 transition-colors">
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
                    <input required className="input w-full" placeholder="e.g. cat-01 or Electrical" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Headquarters City <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="e.g. Delhi" value={formData.headquater} onChange={e => setFormData({...formData, headquater: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Compliance & Tax</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">GSTIN / PAN / PAN-OR-GSTIN <span className="text-red-500">*</span></label>
                    <input required className="input w-full font-bold uppercase" placeholder="Enter identification" value={formData.panOrgstin} onChange={e => setFormData({...formData, panOrgstin: e.target.value.toUpperCase()})} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Compliance Tax <span className="text-red-500">*</span></label>
                    <input required className="input w-full font-bold uppercase" placeholder="e.g. TAX-001" value={formData.complianceTax} onChange={e => setFormData({...formData, complianceTax: e.target.value.toUpperCase()})} />
                  </div>

                  <div className="space-y-1.5 leading-none">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendor Total Value <span className="text-red-500">*</span></label>
                    <input required type="number" className="input w-full h-11 font-black" placeholder="e.g. 50000" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                  </div>

                  <div className="space-y-1.5 leading-none">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Status <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select className="input w-full h-11 px-3 appearance-none bg-white pr-10 font-bold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="On Hold">On Hold</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => { setIsModalOpen(false); setIsEditing(false); }} className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={isSaving} className={`btn-primary flex items-center gap-2 px-8 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Processing...' : (isEditing ? 'Update Vendor' : 'Complete Onboarding')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Remove Vendor?</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Permanent Action</p>
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Are you sure you want to remove <span className="font-black text-slate-900 underline decoration-red-200">{deleteConfirm.name}</span> from your registry? This cannot be undone.
            </p>
            <div className="flex gap-3">
                <button 
                    onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => handleDelete(deleteConfirm.id)}
                    disabled={isSaving}
                    className="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-900/20 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Delete"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
