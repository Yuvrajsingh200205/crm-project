import { useState, useMemo } from 'react';
import { Plus, ClipboardList, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastUtils';

// Sub-components
import WorkOrderStats from '../../components/workorders/WorkOrderStats';
import WorkOrderFilters from '../../components/workorders/WorkOrderFilters';
import WorkOrderTable from '../../components/workorders/WorkOrderTable';
import WorkOrderModal from '../../components/workorders/WorkOrderModal';
import WorkOrderDetailSidebar from '../../components/workorders/WorkOrderDetailSidebar';

export default function WorkOrders() {
    const { projects, workOrders, setWorkOrders, updateWorkOrder } = useApp();
    
    // UI States
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedWO, setSelectedWO] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // 1. Filtered Logic
    const filteredWOs = useMemo(() => {
        return workOrders.filter(wo => {
            const matchesSearch = wo.id.toLowerCase().includes(search.toLowerCase()) || 
                               wo.vendorName.toLowerCase().includes(search.toLowerCase()) ||
                               wo.projectId.toLowerCase().includes(search.toLowerCase()) ||
                               wo.projectName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filter === 'All' || wo.status === filter;
            return matchesSearch && matchesStatus;
        });
    }, [workOrders, search, filter]);

    // 2. Stats Calculation
    const stats = useMemo(() => {
        const totalVal = workOrders.reduce((sum, wo) => sum + wo.value, 0);
        return [
            { label: 'Total Value', value: `₹${(totalVal / 100000).toFixed(1)}L`, icon: ClipboardList, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Active Orders', value: workOrders.filter(wo => wo.status === 'Active').length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Approval', value: workOrders.filter(wo => wo.status === 'Pending Approval').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Execution Rate', value: `${workOrders.length ? Math.round(workOrders.reduce((s, wo) => s + wo.progress, 0) / workOrders.length) : 0}%`, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
    }, [workOrders]);

    // 3. Handlers
    const handleOpenAdd = () => {
        setIsEditing(false);
        setFormData({ status: 'Draft', type: 'Rate Contract', progress: 0, retention: 5 });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (e, wo) => {
        e.stopPropagation();
        setIsEditing(true);
        setFormData({ ...wo });
        setIsModalOpen(true);
    };

    const handleViewDetails = (wo) => {
        setSelectedWO(wo);
        setIsDetailOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        confirmToast('Delete this work order permanently?', () => {
            setWorkOrders(prev => prev.filter(wo => wo.id !== id));
            toast.success("Work Order discarded");
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const promise = new Promise(r => setTimeout(r, 1000));
        
        const project = projects.find(p => p.id === formData.projectId);
        const finalData = { 
            ...formData, 
            projectName: project ? project.name : 'Unknown Project',
            value: Number(formData.value),
            retention: Number(formData.retention),
            progress: Number(formData.progress)
        };

        if (isEditing) {
            updateWorkOrder(finalData);
            toast.promise(promise, {
                loading: 'Updating Order...',
                success: 'Work Order Authored!',
                error: 'Update Failed',
            });
        } else {
            const newWO = {
                ...finalData,
                id: `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(3, '0')}`,
                vendorId: `VEND-${Math.floor(100 + Math.random() * 900)}`
            };
            setWorkOrders([newWO, ...workOrders]);
            toast.promise(promise, {
                loading: 'Creating Order...',
                success: 'Work Order Dispatched!',
                error: 'Creation Failed',
            });
        }
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <ClipboardList className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Work Order Management</h1>
                        <p className="text-sm text-slate-500 mt-1">Allocation of scope & subcontracting control</p>
                    </div>
                </div>
                <button onClick={handleOpenAdd} className="btn-primary whitespace-nowrap flex items-center gap-1.5">
                    <Plus className="w-5 h-5" /> Issue New Order
                </button>
            </div>

            <WorkOrderStats stats={stats} />

            <WorkOrderFilters 
                search={search} 
                setSearch={setSearch} 
                filter={filter} 
                setFilter={setFilter} 
            />

            <WorkOrderTable 
                workOrders={filteredWOs}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
            />

            <WorkOrderModal 
                isOpen={isModalOpen}
                isEditing={isEditing}
                formData={formData}
                projects={projects}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onInputChange={handleInputChange}
            />

            <WorkOrderDetailSidebar 
                isOpen={isDetailOpen}
                workOrder={selectedWO}
                onClose={() => setIsDetailOpen(false)}
                onEdit={(e, wo) => { handleOpenEdit(e, wo); setIsDetailOpen(false); }}
            />
        </div>
    );
}
