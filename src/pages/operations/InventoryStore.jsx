import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, Filter, Download, 
  ArrowUpRight, ArrowDownLeft, AlertCircle, 
  Layers, Warehouse, History, MoreVertical,
  ChevronRight, X, Loader2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const statusBadge = {
  'In Stock': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Low Stock': 'bg-amber-50 text-amber-600 border-amber-100',
  'Out of Stock': 'bg-red-50 text-red-600 border-red-100',
  'Damaged': 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function InventoryStore() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Electrical', quantity: '', unit: 'Nos', 
    reorderLevel: '', warehouse: 'Main Warehouse', rate: ''
  });

  useEffect(() => {
    // Simulated fetch for now, will connect to API later
    setTimeout(() => {
      setItems([
        { id: 1, name: 'PSC Pole 9M 400Kg', category: 'Structures', quantity: 45, unit: 'Nos', reorderLevel: 20, warehouse: 'Patna Yard', rate: 10500, status: 'In Stock' },
        { id: 2, name: 'ABC Cable 3X95+1X70', category: 'Cables', quantity: 1.2, unit: 'CKM', reorderLevel: 5, warehouse: 'Main Store', rate: 245000, status: 'Low Stock' },
        { id: 3, name: 'Stay Set Complete', category: 'Hardware', quantity: 0, unit: 'Sets', reorderLevel: 25, warehouse: 'Patna Yard', rate: 1250, status: 'Out of Stock' },
        { id: 4, name: 'Transformer 100KVA', category: 'Equipments', quantity: 4, unit: 'Nos', reorderLevel: 2, warehouse: 'Main Store', rate: 185000, status: 'In Stock' },
        { id: 5, name: 'HG Fuse Set', category: 'Hardware', quantity: 110, unit: 'Nos', reorderLevel: 50, warehouse: 'Gaya Branch', rate: 4225, status: 'In Stock' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || item.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const stats = [
    { label: 'Total Items', value: items.length, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Value', value: `₹${(items.reduce((a, b) => a + (b.quantity * b.rate), 0) / 100000).toFixed(1)}L`, icon: Warehouse, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Low Stock', value: items.filter(i => i.status === 'Low Stock').length, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Out of Stock', value: items.filter(i => i.status === 'Out of Stock').length, icon: X, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const newItem = {
        ...formData,
        id: Date.now(),
        quantity: Number(formData.quantity),
        rate: Number(formData.rate),
        status: Number(formData.quantity) > Number(formData.reorderLevel) ? 'In Stock' : 'Low Stock'
      };
      setItems([newItem, ...items]);
      setIsSaving(false);
      setIsModalOpen(false);
      toast.success('Inventory item added successfully');
      setFormData({ name: '', category: 'Electrical', quantity: '', unit: 'Nos', reorderLevel: '', warehouse: 'Main Warehouse', rate: '' });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in dashboard-container">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Inventory & Store</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-0.5 border-l-2 border-emerald-500 ml-0.5">Stock Management & Logistics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Material
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 group hover:border-emerald-200 transition-all cursor-default">
            <div className="flex justify-between items-start">
              <div className={`${s.bg} p-2.5 rounded-2xl`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">MTD</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-800 tracking-tight">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 bg-slate-50/50">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="input pl-10 h-10 text-xs font-medium" 
              placeholder="Search items, categories or codes..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-200/50 rounded-xl w-fit">
            {['all', 'structures', 'cables', 'hardware'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header">Item Details</th>
                <th className="table-header">Category</th>
                <th className="table-header">Stock Qty</th>
                <th className="table-header text-right">Avg Rate</th>
                <th className="table-header">Warehouse</th>
                <th className="table-header text-center whitespace-nowrap">Status</th>
                <th className="table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><Skeleton className="w-full h-4" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((item) => (
                <tr key={item.id} className="table-row hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-colors uppercase text-[10px] font-black">{item.name[0]}</div>
                      <div>
                        <p className="text-slate-900 font-bold">{item.name}</p>
                        <p className="text-[9px] font-mono text-blue-500 uppercase mt-0.5 tracking-wider">SKU-{item.name.replace(/\s+/g, '').slice(0, 6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">{item.category}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-slate-700">{item.quantity}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{item.unit}</span>
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    <p className="font-bold text-emerald-600 tracking-tighter">₹{item.rate.toLocaleString()}</p>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Warehouse className="w-3.5 h-3.5" />
                      <span className="font-medium">{item.warehouse}</span>
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    <span className={`badge ${item.status === 'In Stock' ? 'badge-green' : item.status === 'Low Stock' ? 'badge-yellow' : 'badge-red'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedItem(item)}
                            className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-100 transition-colors uppercase border border-slate-100"
                        >
                        Audit
                        </button>
                        <button 
                            onClick={() => setSelectedItem(item)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors uppercase border border-blue-100"
                        >
                        Stock +/-
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
                <Plus className="w-5 h-5 text-[#2f6645]" /> New Material Entry
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Material Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Material Name <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="e.g. Copper Wire 1.5mm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Category <span className="text-red-500">*</span></label>
                    <select className="input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Electrical</option>
                      <option>Structures</option>
                      <option>Cables</option>
                      <option>Hardware</option>
                      <option>Civil</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Warehouse Location <span className="text-red-500">*</span></label>
                    <select className="input w-full" value={formData.warehouse} onChange={e => setFormData({...formData, warehouse: e.target.value})}>
                      <option>Main Store</option>
                      <option>Patna Yard</option>
                      <option>Gaya Branch</option>
                      <option>Site Store - Alpha</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Stock & Valuation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Initial Quantity <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input required type="number" className="input flex-1" placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                      <select className="input w-24" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                        <option>Nos</option>
                        <option>Sets</option>
                        <option>CKM</option>
                        <option>Mtrs</option>
                        <option>Kg</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Avg Purchase Rate (₹) <span className="text-red-500">*</span></label>
                    <input required type="number" className="input w-full" placeholder="0.00" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 px-6">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Processing...' : 'Register Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Action Detail Modal (Slide-over) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[250] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-slide-left flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">{selectedItem.name[0]}</div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{selectedItem.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedItem.category} • {selectedItem.warehouse}</p>
                    </div>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all shadow-sm shadow-transparent hover:shadow-slate-200"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Visual Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
                        <p className="text-2xl font-black text-slate-800">{selectedItem.quantity} <span className="text-xs font-bold text-slate-400 uppercase">{selectedItem.unit}</span></p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Value</p>
                        <p className="text-2xl font-black text-emerald-600">₹{(selectedItem.quantity * selectedItem.rate).toLocaleString()}</p>
                    </div>
                </div>

                {/* Audit Trail */}
                <div>
                    <h3 className="section-title mb-4 flex items-center gap-2"><History className="w-4 h-4" /> Comprehensive Audit Log</h3>
                    <div className="space-y-4">
                        {[
                            { date: '2026-03-27 14:22', type: 'Stock In', qty: '+50', user: 'Admin User', ref: 'PO-9912' },
                            { date: '2026-03-25 09:15', type: 'Issuance', qty: '-12', user: 'Store Keeper', ref: 'ISS-4401' },
                            { date: '2026-03-20 16:45', type: 'Internal Trf', qty: '-5', user: 'Admin User', ref: 'TRF-001' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${log.type === 'Stock In' ? 'bg-emerald-500 ring-4 ring-emerald-50' : 'bg-red-400 ring-4 ring-red-50' } shadow-sm`}></div>
                                    <div className="w-[1px] flex-1 bg-slate-100 my-1 group-last:hidden"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-xs font-bold text-slate-700">{log.type}</p>
                                        <span className={`text-xs font-black ${log.qty.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{log.qty}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">By {log.user} • Ref: {log.ref}</p>
                                    <p className="text-[9px] text-slate-300 font-medium mt-1 uppercase tracking-widest">{log.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Adjustment Form */}
                <div className="p-6 bg-[#2f6645]/5 rounded-[2rem] border border-[#2f6645]/10">
                    <h3 className="text-sm font-bold text-[#2f6645] mb-4 flex items-center gap-2">Quick Adjustment</h3>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                             <button className="flex-1 py-3 bg-white border border-emerald-100 text-[#2f6645] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm shadow-emerald-900/5 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Stock In</button>
                             <button className="flex-1 py-3 bg-white border border-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm shadow-red-900/5 hover:bg-red-50 transition-all flex items-center justify-center gap-1.5"><X className="w-3.5 h-3.5" /> Issuance</button>
                        </div>
                        <input className="input h-12 w-full text-xs font-bold" placeholder="Enter adjustment qty..." />
                        <button className="w-full py-4 bg-[#2f6645] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-[#244f35] transition-all active:scale-95">Save Transaction</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
