import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, FileText, Landmark, AlertCircle, ArrowLeft, Download, CheckCircle2, Plus, Eye, ChevronDown, X } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

const initialSummary = [];

const statusBadge = {
  'Filed': 'badge-green',
  'Due Soon': 'badge-yellow',
  'Pending': 'badge-red',
};

export default function StatutoryCompliance() {
  const [data, setData] = useState(initialSummary);
  const [view, setView] = useState('dashboard');
  const [selectedFiling, setSelectedFiling] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', month: 'February 2026', amount: '', status: 'Filed', type: 'Monthly', bank: 'HDFC Bank', challanNo: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
    toast.success('Compliance record added!');
  };

  // Detail View
  if (view === 'detail' && selectedFiling) {
    return (
      <div className="space-y-5 animate-fade-in pb-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('dashboard')} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#2f6645] hover:border-[#2f6645] transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{selectedFiling.title}</h2>
            <p className="text-slate-500 text-sm">{selectedFiling.month} · {selectedFiling.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Statutory Amount</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">₹{parseInt(selectedFiling.amount).toLocaleString()}</p>
              </div>
              <span className={`badge ${statusBadge[selectedFiling.status] || 'badge-yellow'}`}>{selectedFiling.status}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-slate-100">
              {[
                { label: 'Challan No.', value: selectedFiling.challanNo },
                { label: 'Payment Date', value: selectedFiling.filedOn },
                { label: 'Bank', value: selectedFiling.bank },
                { label: 'Fiscal Year', value: '2025-26' },
              ].map((d, i) => (
                <div key={i}>
                  <p className="text-xs text-slate-400 font-medium">{d.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3">Breakup Details</p>
              <div className="space-y-2">
                {selectedFiling.items?.length > 0 ? selectedFiling.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm text-slate-600">{it.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{it.val}</span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 italic">No breakup available for this record.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5 bg-[#1e3a34] text-white">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-1">Download Receipt</h3>
              <p className="text-xs text-white/50 mb-4">Get official challan & filing confirmation.</p>
              <button className="w-full py-2.5 bg-emerald-400 text-[#1e3a34] rounded-lg text-sm font-semibold hover:bg-emerald-300 transition-colors">Download Challan</button>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold text-slate-500 mb-3">Verification Status</p>
              <div className="space-y-3">
                {[{ l: 'KYC Sync', s: 'Verified', c: 'badge-green' }, { l: 'Portal Match', s: 'Success', c: 'badge-green' }, { l: 'Audit Status', s: 'Clear', c: 'badge-blue' }].map((st, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{st.l}</span>
                    <span className={`badge ${st.c}`}>{st.s}</span>
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
    <div className="space-y-5 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Statutory Compliance</h1>
          <p className="text-slate-500 text-sm mt-1">EPF, ESIC, PT, TDS filing & compliance tracker</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Record New Filing
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Fiscal Tax Paid', value: '₹8.42 L', color: 'text-green-500' },
          { label: 'Pending Filings', value: data.filter(d => d.status !== 'Filed').length, color: 'text-amber-500' },
          { label: 'Compliance Index', value: '98%', color: 'text-blue-500' },
          { label: 'Portal Sync', value: 'Active', color: 'text-purple-500' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            {isLoading ? <Skeleton variant="badge" className="h-8 w-16 mb-1" /> : <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>}
            <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Compliance Audit Trail</h3>
          <select className="input w-36 text-xs">
            <option>Monthly Filings</option>
            <option>Quarterly Filings</option>
            <option>Annual Reports</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Filing Description', 'Period', 'Type', 'Amount', 'Status', 'Filed On', 'Actions'].map(h => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <Skeleton variant="circle" className="w-8 h-8 rounded-lg" />
                        <Skeleton variant="text" className="w-24" />
                      </div>
                    </td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="badge" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="badge" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="button" className="w-8 h-8" /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">No compliance records found.</td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="table-row hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.status === 'Filed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-slate-900 font-medium">{item.title}</p>
                    </div>
                  </td>
                  <td className="table-cell text-slate-600">{item.month}</td>
                  <td className="table-cell"><span className="badge badge-blue">{item.type}</span></td>
                  <td className="table-cell text-emerald-600 font-semibold">₹{parseInt(item.amount).toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={`badge ${statusBadge[item.status] || 'badge-yellow'}`}>{item.status}</span>
                  </td>
                  <td className="table-cell text-slate-500 text-xs">{item.filedOn}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => { setSelectedFiling(item); setView('detail'); }}
                      className="p-1.5 bg-slate-100 text-slate-500 hover:bg-[#2f6645] hover:text-white rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
              <div>
                <h2 className="text-base font-semibold">Post Compliance Filing</h2>
                <p className="text-xs text-white/60 mt-0.5">Record a new statutory payment</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddField} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Filing Description</label>
                <input required placeholder="e.g. TDS Quarter 4 Payment" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Month / Period</label>
                  <input required placeholder="e.g. February 2026" className="input" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Amount Paid (₹)</label>
                  <input required type="number" placeholder="Enter amount" className="input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Filing Cycle</label>
                  <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annual</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Bank / Gateway</label>
                  <select className="input" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})}>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>SBI Online</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Challan Number</label>
                  <input required placeholder="CH-XXXX-X" className="input" value={formData.challanNo} onChange={e => setFormData({...formData, challanNo: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Filing Status</label>
                  <select className="input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Filed">Filed (Paid)</option>
                    <option value="Due Soon">Due Soon</option>
                    <option value="Pending">Pending Audit</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Submit Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
