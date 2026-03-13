import { useState } from 'react';
import { 
  ShieldCheck, FileText, Landmark, ShieldAlert,
  Calendar, CheckCircle2, AlertCircle, Download,
  ExternalLink, Search, Info, TrendingDown,
  Lock, ArrowRight, X, Plus
} from 'lucide-react';

const initialSummary = [
  { id: '1', title: 'EPF Contribution', month: 'Feb 2024', amount: '₹1,58,400', status: 'Filed', filedOn: '2024-03-10', type: 'Monthly' },
  { id: '2', title: 'ESIC Contribution', month: 'Feb 2024', amount: '₹42,150', status: 'Filed', filedOn: '2024-03-12', type: 'Monthly' },
  { id: '3', title: 'Professional Tax', month: 'Feb 2024', amount: '₹12,400', status: 'Due Soon', filedOn: '-', type: 'Monthly' },
];

export default function StatutoryCompliance() {
  const [data, setData] = useState(initialSummary);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', month: 'Mar 2024', amount: '', status: 'Filed', type: 'Monthly' });

  const handleAddField = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      amount: `₹${parseFloat(formData.amount).toLocaleString()}`,
      filedOn: formData.status === 'Filed' ? new Date().toISOString().split('T')[0] : '-'
    };
    setData([newEntry, ...data]);
    setShowAddModal(false);
    setFormData({ title: '', month: 'Mar 2024', amount: '', status: 'Filed', type: 'Monthly' });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1e3a34] text-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none mb-1">Statutory Compliance</h1>
            <p className="text-xs text-slate-500 font-medium">Regulatory filings, PF, ESI & TDS Management</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary bg-[#2f6645] whitespace-nowrap self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Record New Filing
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Main Table Area - Takes more space */}
        <div className="xl:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5 bg-emerald-50/30 border-emerald-100 flex justify-between items-center group hover:bg-emerald-50 transition-colors">
               <div>
                  <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Fiscal Year Tax</p>
                  <p className="text-2xl font-black text-slate-800">₹8.42L</p>
               </div>
               <Landmark className="w-10 h-10 text-emerald-200 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="card p-5 bg-amber-50/30 border-amber-100 flex justify-between items-center group hover:bg-amber-50 transition-colors">
               <div>
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Pending Items</p>
                  <p className="text-2xl font-black text-slate-800">{data.filter(d => d.status !== 'Filed').length}</p>
               </div>
               <AlertCircle className="w-10 h-10 text-amber-200 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/30 font-black text-[10px] text-slate-400 uppercase tracking-widest">
              Compliance Filing Records
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Filing Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors text-slate-800">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className={`w-4 h-4 ${item.status === 'Filed' ? 'text-emerald-500' : 'text-amber-500'}`} />
                          <div>
                            <p className="text-xs font-black">{item.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{item.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.month}</td>
                      <td className="px-6 py-4 text-xs font-black text-[#2f6645]">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          item.status === 'Filed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-[#2f6645] transition-all">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar deadlinse - Dynamic Layout */}
        <div className="space-y-6">
          <div className="card p-5 bg-[#1e3a34] text-white border-none shadow-xl">
             <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Upcoming Deadlines</h3>
             <div className="space-y-4">
                {[
                  { label: 'TDS Payment', date: 'Mar 15, 2024', status: 'Priority' },
                  { label: 'VAT/GST Return', date: 'Mar 20, 2024', status: 'Upcoming' }
                ].map((d, i) => (
                  <div key={i} className="border-l-2 border-[#9ae66e] pl-3 py-1">
                    <p className="text-xs font-bold">{d.label}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">{d.date}</p>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="card p-5 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quick Links</h4>
            <button className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs font-bold hover:bg-emerald-50 transition-all border-none">
              PF Portal <ExternalLink className="w-3 h-3 opacity-40" />
            </button>
            <button className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs font-bold hover:bg-emerald-50 transition-all border-none">
              GSTN Portal <ExternalLink className="w-3 h-3 opacity-40" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Filing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in text-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#2f6645] text-white">
              <h2 className="text-lg font-black uppercase tracking-widest">New Compliance Log</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 opacity-60 hover:opacity-100" /></button>
            </div>
            
            <form onSubmit={handleAddField} className="p-6 space-y-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Filing Category Name</label>
                <input required placeholder="e.g. TDS Quarter 4" className="input border-slate-200" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Month/Period</label>
                  <input required placeholder="e.g. Feb 2024" className="input border-slate-200" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount Paid (₹)</label>
                  <input required type="number" placeholder="Amt in digits" className="input border-slate-200" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Filing Cycle</label>
                  <select className="select border-slate-200" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annual</option>
                  </select>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Status</label>
                  <select className="select border-slate-200" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Filed">Filed (Compliant)</option>
                    <option value="Due Soon">Due Soon</option>
                    <option value="Pending">Pending Audit</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary font-black text-[10px] tracking-widest">Discard</button>
                <button type="submit" className="flex-1 btn-primary bg-[#2f6645] font-black text-[10px] tracking-widest">Post Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
