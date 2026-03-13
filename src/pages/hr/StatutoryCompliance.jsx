import { useState } from 'react';
import { 
  ShieldCheck, FileText, Landmark, ShieldAlert,
  Calendar, CheckCircle2, AlertCircle, Download,
  ExternalLink, Search, Info, TrendingDown,
  Lock, ArrowRight, X, Plus, ChevronDown, Eye
} from 'lucide-react';

const initialSummary = [
  { id: '1', title: 'EPF Contribution', month: 'February 2026', amount: '158400', status: 'Filed', filedOn: '2026-03-10', type: 'Monthly', bank: 'HDFC Bank', challanNo: 'CH-8829-X', items: [
    { label: 'Employer Share', val: '₹84,200' },
    { label: 'Employee Share', val: '₹74,200' }
  ]},
  { id: '2', title: 'ESIC Contribution', month: 'February 2026', amount: '42150', status: 'Filed', filedOn: '2026-03-12', type: 'Monthly', bank: 'ICICI Bank', challanNo: 'ES-9901-P', items: [
    { label: 'ESI Employer', val: '₹32,150' },
    { label: 'ESI Employee', val: '₹10,000' }
  ]},
  { id: '3', title: 'Professional Tax', month: 'February 2026', amount: '12400', status: 'Due Soon', filedOn: '-', type: 'Monthly', bank: '-', challanNo: '-', items: [] },
  { id: '4', title: 'TDS Payment', month: 'Q4 2025-26', amount: '284200', status: 'Pending', filedOn: '-', type: 'Quarterly', bank: '-', challanNo: '-', items: [] },
];

export default function StatutoryCompliance() {
  const [data, setData] = useState(initialSummary);
  const [view, setView] = useState('dashboard'); // dashboard, detail
  const [selectedFiling, setSelectedFiling] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ title: '', month: 'February 2026', amount: '', status: 'Filed', type: 'Monthly', bank: 'HDFC Bank', challanNo: '' });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddField = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      filedOn: formData.status === 'Filed' ? new Date().toISOString().split('T')[0] : '-',
      items: []
    };
    setData([newEntry, ...data]);
    setShowAddModal(false);
    setFormData({ title: '', month: 'February 2026', amount: '', status: 'Filed', type: 'Monthly', bank: 'HDFC Bank', challanNo: '' });
    showToast('Compliance record added successfully!');
  };

  if (view === 'detail' && selectedFiling) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
        <div className="flex items-center gap-4">
           <button onClick={() => setView('dashboard')} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#2f6645] hover:shadow-lg transition-all">
             <ArrowRight className="w-5 h-5 rotate-180" />
           </button>
           <div>
             <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedFiling.title}</h2>
             <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{selectedFiling.month} • {selectedFiling.type}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <div className="card p-6 md:p-10 bg-white border-none shadow-2xl shadow-slate-100/50 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-20" />
                 <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3">Statutory Amount</p>
                           <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{parseInt(selectedFiling.amount).toLocaleString()}</p>
                       </div>
                       <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                         selectedFiling.status === 'Filed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {selectedFiling.status}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-slate-50">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Challan Number</p>
                          <p className="text-sm font-black text-slate-800 tracking-tight">{selectedFiling.challanNo}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Payment Date</p>
                          <p className="text-sm font-black text-slate-800 tracking-tight">{selectedFiling.filedOn}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Bank Name</p>
                          <p className="text-sm font-black text-slate-800 tracking-tight">{selectedFiling.bank}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Fiscal Year</p>
                          <p className="text-sm font-black text-slate-800 tracking-tight">2025-26</p>
                       </div>
                    </div>

                    <div className="mt-12 space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Breakup Details</h4>
                       <div className="space-y-4">
                          {selectedFiling.items?.length > 0 ? selectedFiling.items.map((it, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                               <span className="text-xs font-bold text-slate-600">{it.label}</span>
                               <span className="text-sm font-black text-slate-900">{it.val}</span>
                            </div>
                          )) : (
                            <p className="text-xs font-medium text-slate-400 italic">No breakup available for this record.</p>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="card p-8 bg-[#1e3a34] text-white border-none shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 scale-150 group-hover:scale-[1.8] transition-all duration-700" />
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                       <Download className="w-6 h-6 text-[#9ae66e]" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-2">Audit Receipt</h3>
                    <p className="text-xs text-white/50 mb-8 leading-relaxed">Download official government challan and filing confirmation for your records.</p>
                    <button className="w-full py-4 bg-[#9ae66e] text-[#1e3a34] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                       Download Challan
                    </button>
                 </div>
              </div>

              <div className="card p-8 bg-white border-none shadow-xl shadow-slate-100/50">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Verification Status</h3>
                 <div className="space-y-5">
                    {[
                      { l: 'KYC Sync', status: 'Verified', color: 'emerald' },
                      { l: 'Portal Match', status: 'Success', color: 'emerald' },
                      { l: 'Audit Status', status: 'Clear', color: 'blue' }
                    ].map((st, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-600">{st.l}</span>
                         <span className={`px-3 py-1 bg-${st.color}-50 text-${st.color}-700 rounded-full text-[9px] font-black uppercase`}>{st.status}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-1">Statutory Compliance</h1>
          <p className="text-sm text-slate-500 font-medium italic">"Ensuring full adherence to employee regulations and tax laws."</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary bg-[#2f6645] shadow-xl shadow-green-900/10 h-14 px-8">
          <Plus className="w-5 h-5" /> Record New Filing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Fiscal Tax paid', val: '₹8.42L', color: 'emerald', icon: Landmark, sub: 'YTD 2025-26' },
          { label: 'Pending Filings', val: data.filter(d => d.status !== 'Filed').length, color: 'amber', icon: AlertCircle, sub: 'Needs Attention' },
          { label: 'Compliance Index', val: '98%', color: 'blue', icon: ShieldCheck, sub: 'Risk Level: Low' },
          { label: 'Portal Sync', val: 'Active', color: 'purple', icon: TrendingDown, sub: 'PF/ESI Connected' }
        ].map((s, i) => (
          <div key={i} className="card p-6 border-none shadow-xl shadow-slate-100/30 bg-white hover:translate-y-[-4px] transition-all duration-300">
             <div className={`p-3 rounded-2xl bg-${s.color}-50 text-${s.color}-600 w-fit mb-4`}>
                <s.icon className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
             <p className="text-2xl font-black text-slate-900">{s.val}</p>
             <p className="text-[9px] font-bold text-slate-400 mt-2 italic">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card border-none shadow-2xl shadow-slate-100/50 bg-white overflow-hidden">
         <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/50">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Compliance Audit Trail</h3>
           <div className="relative group/select">
              <select className="select w-40 bg-white pr-8 appearance-none py-2 text-[10px] font-black uppercase tracking-widest">
                 <option>Monthly Filings</option>
                 <option>Quarterly Filings</option>
                 <option>Annual Reports</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645]" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {['Filing Description', 'Period', 'Amount', 'Status', 'Filing Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'Filed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                         <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-black text-slate-600">{item.month}</td>
                  <td className="px-6 py-6 text-sm font-black text-slate-900">₹{parseInt(item.amount).toLocaleString()}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.status === 'Filed' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Due Soon' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-400">{item.filedOn}</td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => { setSelectedFiling(item); setView('detail'); }}
                       className="p-3 bg-slate-100 text-[#2f6645] hover:bg-[#2f6645] hover:text-white rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-[#9ae66e]" />
            <p className="text-xs font-black uppercase tracking-[0.15em]">{toast}</p>
          </div>
        </div>
      )}

      {/* Add Filing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in text-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#1e3a34] text-white">
              <h2 className="text-lg font-black uppercase tracking-widest">Post Compliance Filing</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-7 h-7 opacity-60 hover:opacity-100" /></button>
            </div>
            
            <form onSubmit={handleAddField} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Filing Description</label>
                <input required placeholder="e.g. TDS Quarter 4 Payment" className="input bg-slate-50 border-slate-200 h-12" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Month/Period</label>
                  <input required placeholder="e.g. February 2026" className="input bg-slate-50 border-slate-200 h-12" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Amount Paid (₹)</label>
                  <input required type="number" placeholder="Enter Amount" className="input bg-slate-50 border-slate-200 h-12" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Filing Cycle</label>
                  <div className="relative group/select">
                    <select className="select bg-slate-50 border-slate-200 w-full pr-8 appearance-none h-12 text-sm font-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645]" />
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Bank/Gateway</label>
                  <div className="relative group/select">
                    <select className="select bg-slate-50 border-slate-200 w-full pr-8 appearance-none h-12 text-sm font-bold" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})}>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>SBI Online</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645]" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Challan Number</label>
                  <input required placeholder="CH-XXXX-X" className="input bg-slate-50 border-slate-200 h-12" value={formData.challanNo} onChange={e => setFormData({...formData, challanNo: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Filing Status</label>
                  <div className="relative group/select">
                    <select className="select bg-slate-50 border-slate-200 w-full pr-8 appearance-none h-12 text-sm font-bold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="Filed">Filed (Paid)</option>
                      <option value="Due Soon">Due Soon</option>
                      <option value="Pending">Pending Audit</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645]" />
                  </div>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary h-14 font-black text-[10px] tracking-widest uppercase rounded-2xl">Discard</button>
                <button type="submit" className="flex-1 btn-primary bg-[#2f6645] h-14 font-black text-[10px] tracking-widest uppercase rounded-2xl shadow-xl shadow-green-900/10">Submit Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
