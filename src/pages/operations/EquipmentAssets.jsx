import { useState, useEffect } from 'react';
import { 
  Wrench, Truck, ShieldCheck, Activity, 
  Settings, Clock, Fuel, PenTool as Tool,
  Plus, Search, Download, CheckCircle2,
  AlertTriangle, Hammer, X, Loader2, Save,
  ChevronDown, Trash2, Edit3, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';
import { equipmentAPI } from '../../api/equipment';

const statusBadge = {
  'Operational': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
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
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const [formData, setFormData] = useState({
    equipmentName: '', 
    category: 'Earthmoving', 
    registrationOrChassisNo: '', 
    operationalAssignment: '', 
    primaryOperator: '', 
    initialStatus: 'Active'
  });

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
        const res = await equipmentAPI.getAllEquipments();
        const data = res?.equipments || res?.data?.equipments || res?.data || res || [];
        setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load asset registry.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'registrationOrChassisNo') {
        finalValue = value.toUpperCase();
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleOpenEdit = (asset) => {
    setCurrentId(asset.id);
    setFormData({
        equipmentName: asset.equipmentName || '',
        category: asset.category || 'Earthmoving',
        registrationOrChassisNo: asset.registrationOrChassisNo || '',
        operationalAssignment: asset.operationalAssignment || '',
        primaryOperator: asset.primaryOperator || '',
        initialStatus: asset.initialStatus || asset.status || 'Active'
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (asset) => {
    setDeleteConfirm({ show: true, id: asset.id, name: asset.equipmentName || asset.name });
  };

  const confirmDelete = async () => {
    setIsSaving(true);
    try {
        await equipmentAPI.deleteEquipment(deleteConfirm.id);
        toast.success('Asset removed successfully');
        fetchAssets();
        setDeleteConfirm({ show: false, id: null, name: '' });
    } catch (error) {
        console.error("Delete error:", error);
        toast.error('Failed to remove asset');
    } finally {
        setIsSaving(false);
    }
  };
  const filtered = assets.filter(a => 
    (a.equipmentName || a.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.registrationOrChassisNo || a.regNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.primaryOperator || a.operator || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Assets', value: assets.length, icon: Truck, color: 'text-slate-500', bg: 'bg-slate-50' },
    { label: 'Operational', value: assets.filter(a => (a.initialStatus || a.status) === 'Active' || (a.initialStatus || a.status) === 'Operational').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Maintenance', value: assets.filter(a => (a.initialStatus || a.status) === 'Maintenance').length, icon: Hammer, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Utilization', value: '45%', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        if (isEditing) {
            await equipmentAPI.updateEquipment(currentId, formData);
            toast.success('Equipment details updated');
        } else {
            await equipmentAPI.createEquipment(formData);
            toast.success('Equipment registered successfully');
        }
        fetchAssets();
        setIsModalOpen(false);
        setIsEditing(false);
        setFormData({ equipmentName: '', category: 'Earthmoving', registrationOrChassisNo: '', operationalAssignment: '', primaryOperator: '', initialStatus: 'Active' });
    } catch (error) {
        console.error("Save error:", error);
        toast.error('Failed to save asset details');
    } finally {
        setIsSaving(false);
    }
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
                        <p className="text-slate-900 font-bold">{asset.equipmentName || asset.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{asset.category || asset.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="font-mono font-bold text-blue-500 uppercase">{asset.registrationOrChassisNo || asset.regNo}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                       <span className="text-[10px] font-bold text-slate-600 uppercase">{asset.primaryOperator || asset.operator}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2 max-w-[100px]">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: asset.utilization || '45%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{asset.utilization || '45%'}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium text-slate-500">{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="table-cell text-center whitespace-nowrap">
                    <span className={`badge ${statusBadge[asset.initialStatus || asset.status]}`}>
                      {asset.initialStatus || asset.status}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => setSelectedAsset(asset)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent active:border-blue-100"
                        >
                        <Eye className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleOpenEdit(asset)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent active:border-amber-100"
                        >
                        <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(asset)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent active:border-red-100"
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
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
              <div>
                <h3 className="text-[10px] font-black tracking-[0.2em] text-blue-500 mb-6 uppercase">Asset Identification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Equipment / Machine Name <span className="text-red-500">*</span></label>
                    <input name="equipmentName" required className="input w-full h-12 font-bold" placeholder="e.g. Caterpillar Excavator 320D" value={formData.equipmentName} onChange={handleInputChange} />
                  </div>
                  
                  <div className="space-y-2 leading-none">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Equipment Category <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select name="category" className="input w-full h-12 appearance-none bg-white pr-10 font-bold" value={formData.category} onChange={handleInputChange}>
                            <option>Earthmoving</option>
                            <option>Heavy Machinery</option>
                            <option>Fleet / Vehicle</option>
                            <option>Power Equipment</option>
                            <option>Tools & Implements</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reg / Chassis Number <span className="text-red-500">*</span></label>
                    <input name="registrationOrChassisNo" required className="input w-full h-12 font-black uppercase tracking-widest bg-slate-50" placeholder="MH-01-XX-0000" value={formData.registrationOrChassisNo} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black tracking-[0.2em] text-blue-500 mb-6 uppercase">Operational Linkage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Site / Assignment <span className="text-red-500">*</span></label>
                    <input name="operationalAssignment" required className="input w-full h-12 font-bold" placeholder="Current Location / Project" value={formData.operationalAssignment} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Operator <span className="text-red-500">*</span></label>
                    <input name="primaryOperator" required className="input w-full h-12 font-bold" placeholder="Assigned Personnel" value={formData.primaryOperator} onChange={handleInputChange} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Status <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select name="initialStatus" className="input w-full h-12 appearance-none bg-white pr-10 font-black" value={formData.initialStatus} onChange={handleInputChange}>
                        <option>Active</option>
                        <option>Operational</option>
                        <option>Standby</option>
                        <option>Maintenance</option>
                        <option>Breakdown</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-4 sticky bottom-0 bg-white shadow-[0_-20px_20px_-10px_rgba(255,255,255,1)]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Discard</button>
                <button type="submit" disabled={isSaving} className="btn-primary min-w-[180px] h-14 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isEditing ? 'Update Registry' : 'Register Asset'}
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
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{selectedAsset.equipmentName || selectedAsset.name}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedAsset.registrationOrChassisNo || selectedAsset.regNo} • {selectedAsset.category || selectedAsset.type}</p>
                    </div>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Health Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Current Status</p>
                        <p className="text-xl font-black text-slate-800 uppercase leading-none mt-1">{selectedAsset.initialStatus || selectedAsset.status}</p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-600">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 font-mono text-blue-400">Registry Date</p>
                        <p className="text-lg font-black tracking-tight mt-1">{selectedAsset.createdAt ? new Date(selectedAsset.createdAt).toLocaleDateString() : 'N/A'}</p>
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

                {/* Deployment Mapping */}
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Operational Deployment</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Site</p>
                                <p className="text-sm font-bold text-slate-700">{selectedAsset.operationalAssignment || 'Unassigned'}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Operator</p>
                                <p className="text-sm font-bold text-slate-700">{selectedAsset.primaryOperator || selectedAsset.operator}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                             <button className="flex-1 py-3 bg-white text-blue-600 text-[10px] font-black rounded-xl border border-blue-100 shadow-sm hover:bg-white transition-all">Schedule Service</button>
                             <button className="flex-1 py-4 bg-blue-600 text-white text-[10px] font-black rounded-xl shadow-xl shadow-blue-900/10 hover:bg-blue-700 transition-all uppercase tracking-widest">Update Assignment</button>
                        </div>
                    </div>
                </div>
            </div>
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
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Remove Asset?</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Permanent Action</p>
                </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Are you sure you want to remove <span className="font-black text-slate-900 underline decoration-red-200">{deleteConfirm.name}</span> from the active fleet registry?
            </p>
            <div className="flex gap-3">
                <button 
                    onClick={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                >
                    Cancel
                </button>
                <button 
                    onClick={confirmDelete}
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
