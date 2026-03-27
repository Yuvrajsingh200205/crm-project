import React, { useState, useEffect } from 'react';
import { 
  Wrench, Truck, ShieldCheck, Activity, 
  Settings, Clock, Fuel, PenTool as Tool,
  Plus, Search, Download, CheckCircle2,
  AlertTriangle, Hammer, X, Loader2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const statusBadge = {
  'Operational': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Maintenance': 'bg-amber-50 text-amber-600 border-amber-100',
  'Breakdown': 'bg-red-50 text-red-600 border-red-100',
  'Standby': 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function EquipmentAssets() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: 'Machinery', regNo: '', operator: '', 
    status: 'Operational', lastService: '', fuelType: 'Diesel'
  });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setAssets([
        { id: 1, name: 'Tata Hitachi Excavator EX210', type: 'Heavy Machinery', regNo: 'MH-12-EQ-4521', operator: 'Rajesh Kumar', utilization: '78%', status: 'Operational', lastService: '2026-03-01' },
        { id: 2, name: 'Ashok Leyland Tipper 2518', type: 'Fleet', regNo: 'BR-01-GA-9980', operator: 'Suresh Yadav', utilization: '92%', status: 'Operational', lastService: '2026-02-15' },
        { id: 3, name: 'JCB 3DX Eco', type: 'Heavy Machinery', regNo: 'MH-14-BT-1122', operator: 'Amit Singh', utilization: '45%', status: 'Maintenance', lastService: '2026-03-20' },
        { id: 4, name: 'Diesel Generator 125KVA', type: 'Power', regNo: 'DG-CAT-008', operator: 'Self Operated', utilization: '12%', status: 'Standby', lastService: '2026-01-10' },
        { id: 5, name: 'Hydra Crane 15T', type: 'Heavy Machinery', regNo: 'MH-04-CR-7766', operator: 'Vikram Sahay', utilization: '0%', status: 'Breakdown', lastService: '2026-02-28' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const filtered = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.regNo.toLowerCase().includes(search.toLowerCase()) ||
    a.operator.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Assets', value: assets.length, icon: Truck, color: 'text-slate-500', bg: 'bg-slate-50' },
    { label: 'Operational', value: assets.filter(a => a.status === 'Operational').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Maintenance', value: assets.filter(a => a.status === 'Maintenance').length, icon: Hammer, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Utilization', value: '68%', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const newAsset = { ...formData, id: Date.now(), utilization: '0%' };
      setAssets([newAsset, ...assets]);
      setIsSaving(false);
      setIsModalOpen(false);
      toast.success('Equipment registered successfully');
      setFormData({ name: '', type: 'Machinery', regNo: '', operator: '', status: 'Operational', lastService: '', fuelType: 'Diesel' });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in dashboard-container">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Equipment & Assets</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 px-0.5 border-l-2 border-blue-500 ml-0.5">Fleet, Machinery & Maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Fuel className="w-4 h-4" /> Fuel Logs
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Asset
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 group hover:border-blue-200 transition-all cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
               <s.icon className={`w-16 h-16 ${s.color}`} />
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

      {/* Main Content */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
          <div className="flex-1 relative text-slate-400">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
            <input 
              className="input pl-11 bg-white border-slate-200 h-11 text-sm font-medium focus:ring-blue-500/10 focus:border-blue-500/50" 
              placeholder="Search by name, registration or operator..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header">Equipment / Asset</th>
                <th className="table-header">Reg No</th>
                <th className="table-header">Operator</th>
                <th className="table-header">Utilization</th>
                <th className="table-header">Last Service</th>
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
              ) : filtered.map((asset) => (
                <tr key={asset.id} className="table-row hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold">{asset.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{asset.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="font-mono font-bold text-blue-500">{asset.regNo}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                       <span className="text-[10px] font-bold text-slate-600 uppercase">{asset.operator}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2 max-w-[100px]">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: asset.utilization }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{asset.utilization}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium text-slate-500">{new Date(asset.lastService).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    <span className={`badge ${asset.status === 'Operational' ? 'badge-green' : asset.status === 'Maintenance' ? 'badge-yellow' : asset.status === 'Breakdown' ? 'badge-red' : 'badge-blue'}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedAsset(asset)}
                            className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition-colors uppercase border border-amber-100"
                        >
                        Service
                        </button>
                        <button 
                            onClick={() => setSelectedAsset(asset)}
                            className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold hover:bg-slate-100 transition-colors uppercase border border-slate-100"
                        >
                        Assign
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
                <Truck className="w-5 h-5 text-blue-600" /> Register Equipment
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Equipment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Equipment Name <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="e.g. Caterpillar Excavator 320D" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Category <span className="text-red-500">*</span></label>
                    <select className="input w-full" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option>Heavy Machinery</option>
                      <option>Fleet / Vehicle</option>
                      <option>Power Equipment</option>
                      <option>Tools & Implements</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Registration / Chassis No <span className="text-red-500">*</span></label>
                    <input required className="input w-full font-mono" placeholder="MH-01-XX-0000" value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Operational Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Primary Operator <span className="text-red-500">*</span></label>
                    <input required className="input w-full" placeholder="Assigned Personnel" value={formData.operator} onChange={e => setFormData({...formData, operator: e.target.value})} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Initial Status <span className="text-red-500">*</span></label>
                    <select className="input w-full" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option>Operational</option>
                      <option>Standby</option>
                      <option>Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 px-6">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Registering...' : 'Add to Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Detail Modal (Slide-over) */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[250] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedAsset(null)}>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-slide-left flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2f6645] text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{selectedAsset.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedAsset.regNo} • {selectedAsset.type}</p>
                    </div>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Health Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Utilization</p>
                        <p className="text-2xl font-black text-slate-800">{selectedAsset.utilization}</p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-600">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">Last Service</p>
                        <p className="text-lg font-black tracking-tight">{new Date(selectedAsset.lastService).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Maintenance Log */}
                <div>
                   <h3 className="section-title mb-4 flex items-center gap-2"><Tool className="w-4 h-4" /> Maintenance History</h3>
                   <div className="space-y-4">
                        {[
                            { date: '2026-03-01', type: 'Major Service', cost: '₹12,500', note: 'Engine oil, Filter change' },
                            { date: '2026-01-15', type: 'Repairs', cost: '₹4,200', note: 'Hydraulic leak fixed' },
                        ].map((log, i) => (
                            <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all">
                                <div className="flex justify-between mb-1">
                                    <p className="text-xs font-bold text-slate-700">{log.type}</p>
                                    <span className="text-xs font-black text-slate-400">{log.date}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium mb-2">{log.note}</p>
                                <div className="pt-2 border-t border-slate-50 flex justify-between">
                                    <span className="text-[8px] font-black text-slate-300 uppercase">Authorized Service</span>
                                    <span className="text-[10px] font-black text-emerald-600">{log.cost}</span>
                                </div>
                            </div>
                        ))}
                   </div>
                </div>

                {/* Assignment Form */}
                <div className="p-6 bg-[#2f6645]/5 rounded-[2rem] border border-[#2f6645]/10">
                    <h3 className="text-sm font-bold text-[#2f6645] mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Operational Control</h3>
                    <div className="space-y-4">
                        <select className="input h-12 w-full text-xs font-bold" defaultValue={selectedAsset.operator}>
                             <option>{selectedAsset.operator}</option>
                             <option>New Operator Assignment...</option>
                        </select>
                        <div className="flex gap-2">
                             <button className="flex-1 py-3 bg-white text-[#2f6645] text-[10px] font-black rounded-xl border border-emerald-100 shadow-sm hover:bg-white transition-all">Schedule Service</button>
                             <button className="flex-1 py-4 bg-[#2f6645] text-white text-[10px] font-black rounded-xl shadow-xl shadow-emerald-900/10 hover:bg-[#244f35] transition-all">Update Operations</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
