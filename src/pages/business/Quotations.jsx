import React, { useState, useEffect } from 'react';
import { 
  FileText, ClipboardList, PenTool, TrendingUp, 
  Plus, Search, Download, Filter, 
  ChevronRight, X, Loader2, Save,
  CheckCircle2, AlertCircle, Clock,
  DollarSign, FileCheck, FileEdit, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const statusBadge = {
  'Draft': 'bg-slate-50 text-slate-500 border-slate-200',
  'Pending Approval': 'bg-amber-50 text-amber-600 border-amber-100',
  'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Rejected': 'bg-red-50 text-red-600 border-red-100',
  'Revised': 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function Quotations() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [formData, setFormData] = useState({
    quoteId: `QTN-${Date.now().toString().slice(-4)}`, client: '', project: '', 
    value: '', status: 'Draft', createdAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setTimeout(() => {
      setQuotes([
        { id: 1, quoteId: 'QTN-2024-001', client: 'Global Infra Corp', project: 'Noida Office Substation', value: 4500000, status: 'Approved', version: 'V2', date: '2024-03-20' },
        { id: 2, quoteId: 'QTN-2024-002', client: 'Build-Rite Pvt Ltd', project: 'Mumbai Residential Wing', value: 12500000, status: 'Pending Approval', version: 'V1', date: '2024-03-24' },
        { id: 3, quoteId: 'QTN-2024-003', client: 'Reddy Builders', project: 'Hyderabad Warehouse', value: 850000, status: 'Draft', version: 'V1', date: '2024-03-26' },
        { id: 4, quoteId: 'QTN-2024-004', client: 'Urban Spaces', project: 'Bangalore Tech Park', value: 6700000, status: 'Revised', version: 'V3', date: '2024-03-25' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const stats = [
    { label: 'Active Quotes', value: quotes.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Quote Value', value: `₹${(quotes.reduce((a, b) => a + b.value, 0) / 10000000).toFixed(1)}Cr`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Approval Rate', value: '75%', icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Avg cycle', value: '4 days', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const filtered = quotes.filter(q => 
    q.client.toLowerCase().includes(search.toLowerCase()) ||
    q.project.toLowerCase().includes(search.toLowerCase()) ||
    q.quoteId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const newQuote = { ...formData, id: Date.now(), value: Number(formData.value), version: 'V1', date: formData.createdAt };
      setQuotes([newQuote, ...quotes]);
      setIsSaving(false);
      setIsModalOpen(false);
      toast.success('Quotation generated successfully');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in dashboard-container">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Quotation Management</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-0.5 border-l-2 border-amber-500 ml-0.5">Commercial Proposals & Costing Sheets</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Quotation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5">
            <div className={`${s.bg} w-10 h-10 rounded-2xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tight">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="input pl-10 h-10 text-xs font-medium" 
              placeholder="Search by QTN ID, Client or Project..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header">Quotation Details</th>
                <th className="table-header">Client & Project</th>
                <th className="table-header text-right">Quote Value</th>
                <th className="table-header text-center">Version</th>
                <th className="table-header text-center whitespace-nowrap">Status</th>
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
              ) : filtered.map((quote) => (
                <tr key={quote.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{quote.quoteId}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{quote.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="font-bold text-slate-700">{quote.project}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">{quote.client}</p>
                  </td>
                  <td className="table-cell text-right font-black text-slate-800">₹{(quote.value / 100000).toFixed(1)}L</td>
                  <td className="table-cell text-center font-bold text-slate-500">{quote.version}</td>
                  <td className="table-cell text-center">
                    <span className={`badge ${statusBadge[quote.status]}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedQuote(quote)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition-colors uppercase border border-amber-100"
                        >
                        Preview
                        </button>
                        <button 
                            onClick={() => setSelectedQuote(quote)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors uppercase border border-blue-100"
                        >
                        Revise
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Placeholder */}
      {selectedQuote && (
        <div className="fixed inset-0 z-[250] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedQuote(null)}>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-slide-left flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase shadow-sm">{selectedQuote.quoteId}</div>
                    <button onClick={() => setSelectedQuote(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"><X className="w-5 h-5" /></button>
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">{selectedQuote.project}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedQuote.client}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Value</p>
                        <p className="text-xl font-black text-emerald-800">₹{(selectedQuote.value / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xl font-black text-slate-800 uppercase tracking-tighter text-[14px]">{selectedQuote.status}</p>
                    </div>
                </div>

                <div>
                   <h3 className="section-title mb-4 flex items-center gap-2"><History className="w-4 h-4" /> Revision History</h3>
                   <div className="space-y-4">
                        {[
                            { ver: 'V2', date: '2024-03-20', change: 'Updated material rates for Copper cabling.' },
                            { ver: 'V1', date: '2024-03-15', change: 'Initial proposal' },
                        ].map((rev, i) => (
                            <div key={i} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-[#2f6645] uppercase">{rev.ver}</span>
                                    <span className="text-[9px] font-bold text-slate-300">{rev.date}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-600 leading-relaxed">{rev.change}</p>
                            </div>
                        ))}
                   </div>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-2xl">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 shadow-inner">
                            <Download className="w-5 h-5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase">Download PDF</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700 shadow-inner">
                            <FileCheck className="w-5 h-5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase">Approve</span>
                        </button>
                    </div>
                    <button className="w-full mt-6 py-4 bg-[#2f6645] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/40 hover:bg-[#244f35] transition-all">Revise Quotation</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
              <h2 className="text-lg font-black text-slate-800">Generate New Quotation</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 leading-none">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Client Name</label>
                        <input required className="input w-full h-11" placeholder="Search client..." value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                    </div>
                    <div className="space-y-1.5 leading-none">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Project Name</label>
                        <input required className="input w-full h-11" placeholder="Scope of work..." value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 leading-none">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Quote Value (₹)</label>
                        <input required className="input w-full h-11 font-black" placeholder="0.00" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                    </div>
                    <div className="space-y-1.5 leading-none">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                        <select className="input w-full h-11" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option>Draft</option>
                            <option>Pending Approval</option>
                            <option>Approved</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Discard</button>
                    <button type="submit" className="btn-primary px-10 py-3 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100">Create Quote</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
