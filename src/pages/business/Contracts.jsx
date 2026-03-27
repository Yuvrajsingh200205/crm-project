import React, { useState, useEffect } from 'react';
import { 
  FileBarChart, FileText, ClipboardList, TrendingUp, 
  Plus, Search, Download, Filter, 
  ChevronRight, X, Loader2, Save,
  Shield, Landmark, Calendar, Clock,
  CheckCircle2, AlertCircle, Briefcase, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const statusBadge = {
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Pending Signature': 'bg-amber-50 text-amber-600 border-amber-100',
  'Expired': 'bg-red-50 text-red-600 border-red-100',
  'Closed': 'bg-slate-50 text-slate-500 border-slate-200',
  'Terminated': 'bg-red-50 text-red-600 border-red-100',
};

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [formData, setFormData] = useState({
    contractId: '', party: '', project: '', 
    value: '', status: 'Active', startDate: '', endDate: ''
  });

  useEffect(() => {
    setTimeout(() => {
      setContracts([
        { id: 1, contractId: 'CON-2024-101', party: 'Bihari Developers', project: 'Amravati Power Grid', value: 85000000, status: 'Active', signDate: '2024-01-15', expDate: '2025-01-14' },
        { id: 2, contractId: 'CON-2024-102', party: 'Patna Electrials', project: 'Rural Electrification P2', value: 12500000, status: 'Pending Signature', signDate: '-', expDate: '2025-03-30' },
        { id: 3, contractId: 'CON-2023-085', party: 'Sanjay & Sons', project: 'Sitamarhi Substation', value: 4500000, status: 'Closed', signDate: '2023-06-10', expDate: '2024-03-10' },
        { id: 4, contractId: 'CON-2024-104', party: 'Gupta Infra', project: 'Darbhanga Smart Metering', value: 67000000, status: 'Active', signDate: '2024-02-01', expDate: '2025-01-31' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const stats = [
    { label: 'Active Contracts', value: contracts.filter(c => c.status === 'Active').length, icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Contract Value', value: `₹${(contracts.reduce((a, b) => a + b.value, 0) / 10000000).toFixed(1)}Cr`, icon: Landmark, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Expiring Soon', value: '3', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Pending Signature', value: '1', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const filtered = contracts.filter(c => 
    c.party.toLowerCase().includes(search.toLowerCase()) ||
    c.project.toLowerCase().includes(search.toLowerCase()) ||
    c.contractId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const newContract = { ...formData, id: Date.now(), value: Number(formData.value) };
      setContracts([newContract, ...contracts]);
      setIsSaving(false);
      setIsModalOpen(false);
      toast.success('Contract archived successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in dashboard-container">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase tracking-tighter">Contract Management</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-0.5 border-l-2 border-emerald-500 ml-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Legal Agreements, PBGs & Milestone Compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export Register</button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Archive Contract
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 group transition-all hover:bg-slate-50">
            <div className="flex justify-between items-center">
                <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-4">
                <p className="text-2xl font-black text-slate-800 tracking-tight">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="input pl-10 h-10 text-xs font-semibold" 
              placeholder="Search contracts, parties or project IDs..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-[10px] font-black uppercase text-emerald-600">
            Total Liability: ₹{(contracts.filter(c => c.status === 'Active').reduce((a, b) => a+b.value, 0) / 10000000).toFixed(1)}Cr
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#fcfdfe] border-b border-slate-200">
              <tr>
                <th className="table-header">Reference Details</th>
                <th className="table-header">Second Party / Project</th>
                <th className="table-header text-right">Contract Value</th>
                <th className="table-header">Validity Period</th>
                <th className="table-header text-center">Status</th>
                <th className="table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><Skeleton className="w-full h-4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((contract) => (
                <tr key={contract.id} className="table-row group">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-center text-emerald-700">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight leading-none mb-1">{contract.contractId}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{contract.signDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="font-bold text-slate-700 leading-none mb-1">{contract.party}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter truncate max-w-[200px]">{contract.project}</p>
                  </td>
                  <td className="table-cell text-right font-black text-slate-900 tracking-tight">₹{(contract.value / 100000).toFixed(1)}L</td>
                  <td className="table-cell whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-bold text-[10px] uppercase">Ends {new Date(contract.expDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    <span className={`badge ${statusBadge[contract.status]}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedContract(contract)}
                            className="px-2.5 py-1 bg-[#2f6645] text-white rounded-lg text-[10px] font-black hover:bg-[#244f35] transition-all uppercase shadow-lg shadow-emerald-910/10"
                        >
                        View
                        </button>
                        <button 
                            onClick={() => setSelectedContract(contract)}
                            className="px-2.5 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-black hover:bg-slate-50 transition-all uppercase border border-slate-100"
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

      {/* Action Slide-over */}
      {selectedContract && (
        <div className="fixed inset-0 z-[250] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedContract(null)}>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-slide-left flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase shadow-sm">{selectedContract.contractId}</div>
                    <button onClick={() => setSelectedContract(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"><X className="w-5 h-5" /></button>
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{selectedContract.party}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedContract.project}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/70 border-l-4 border-emerald-500 rounded-2xl">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Agreement Value</p>
                        <p className="text-xl font-black text-emerald-800 tracking-tight">₹{(selectedContract.value / 10000000).toFixed(1)} Cr</p>
                    </div>
                    <div className="p-4 bg-amber-50/70 border-l-4 border-amber-500 rounded-2xl">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Next Milestone</p>
                        <p className="text-xl font-black text-amber-800 tracking-tight text-[12px] uppercase">PBG Renewal</p>
                    </div>
                </div>

                <div>
                   <h3 className="section-title mb-4 flex items-center gap-2"><History className="w-4 h-4" /> Compliance Log</h3>
                   <div className="space-y-4">
                        {[
                            { date: '2024-03-20', type: 'Amendment', detail: 'Value increased by 10% for additional scope.' },
                            { date: '2024-02-15', type: 'PBG Received', detail: 'Bank guarantee submitted for ₹12.5L.' },
                        ].map((rev, i) => (
                            <div key={i} className="p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:shadow-md transition-all group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">{rev.type}</span>
                                    <span className="text-[9px] font-bold text-slate-300">{rev.date}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-700 leading-snug">{rev.detail}</p>
                            </div>
                        ))}
                   </div>
                </div>

                <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem]">
                    <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter"><FileText className="w-4 h-4" /> Contract Documents</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {['Master Agreement.pdf', 'PBG Draft.doc', 'Technical Annexure.pdf'].map(doc => (
                            <div key={doc} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer">
                                <span className="text-xs font-bold text-slate-600 truncate">{doc}</span>
                                <Download className="w-4 h-4 text-slate-300" />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-4 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-990/40 hover:bg-emerald-700 transition-all shadow-lg active:scale-95">Manage Milestones</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <FileBarChart className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-800 leading-none">Archive Legal Contract</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Input details for compliance tracking</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600 transition-all"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contract ID / Ref</label>
                        <input required className="input w-full h-12 rounded-xl text-sm" placeholder="e.g. CON-2024-X" value={formData.contractId} onChange={e => setFormData({...formData, contractId: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Party / Organization</label>
                        <input required className="input w-full h-12 rounded-xl text-sm" placeholder="Second Party Name" value={formData.party} onChange={e => setFormData({...formData, party: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name / Scope</label>
                    <input required className="input w-full h-12 rounded-xl text-sm" placeholder="Site Location or Scope of Work" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Agreement Value (₹)</label>
                        <input required className="input w-full h-12 rounded-xl text-sm font-black" placeholder="0.00" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                        <select className="input w-full h-12 rounded-xl text-sm font-bold appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option>Active</option>
                            <option>Pending Signature</option>
                            <option>Expired</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end pt-4 gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all">Cancel</button>
                    <button type="submit" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">Archive Contract</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
