import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

// Components
import BOQStats from '../../components/boq/BOQStats';
import BOQFilters from '../../components/boq/BOQFilters';
import BOQTable from '../../components/boq/BOQTable';
import BOQItemModal from '../../components/boq/BOQItemModal';

export default function BOQ() {
    const { projects, boqItems, setBoqItems, updateBOQItem } = useApp();

    // UI State
    const [search, setSearch] = useState('');
    const [selectedProject, setSelectedProject] = useState('SWPL-BRGF');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // 1. Filtered Data
    const filteredItems = useMemo(() => {
        return boqItems.filter(item => 
            item.id.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase())
        );
    }, [boqItems, search]);

    // 2. Stats Calculation
    const stats = useMemo(() => {
        const totalItems = boqItems.length;
        const reconciled = boqItems.filter(i => i.status === 'Reconciled').length;
        const overIssued = boqItems.filter(i => i.status === 'Over Issued').length;
        const totalValue = boqItems.reduce((sum, i) => sum + (i.billedQty * i.contractRate), 0);
        return { 
            totalItems, 
            reconciled, 
            overIssued, 
            totalValue: (totalValue / 100000).toFixed(1) // In Lakhs
        };
    }, [boqItems]);

    // 3. Handlers
    const handleAddItem = () => {
        setIsEditing(false);
        setFormData({ status: 'Reconciled', billedQty: 0, poQty: 0 });
        setIsModalOpen(true);
    };

    const handleEditItem = (item) => {
        setIsEditing(true);
        setFormData({ ...item });
        setIsModalOpen(true);
    };

    const handleDeleteItem = (id) => {
        if (window.confirm('Remove this line item from BOQ?')) {
            setBoqItems(prev => prev.filter(i => i.id !== id));
            toast.success("BOQ item removed");
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const promise = new Promise(r => setTimeout(r, 600));
        
        const data = {
            ...formData,
            contractRate: Number(formData.contractRate),
            subRate: Number(formData.subRate),
            poQty: Number(formData.poQty),
            billedQty: Number(formData.billedQty || 0),
        };

        if (isEditing) {
            updateBOQItem(data);
            toast.promise(promise, {
                loading: 'Updating BOQ line...',
                success: 'Item Reconciled!',
                error: 'Update failed',
            });
        } else {
            setBoqItems([data, ...boqItems]);
            toast.promise(promise, {
                loading: 'Adding new entry...',
                success: 'Item Enrolled in BOQ!',
                error: 'Addition failed',
            });
        }
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleExport = () => {
        toast.success("BOQ Excel exported successfully!");
    };

    return (
        <div className="space-y-5 animate-fade-in pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bill of Quantities</h1>
                    <p className="text-sm text-slate-500 mt-1">Material reconciliation & contract rate tracker</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleExport} className="btn-secondary flex items-center gap-1.5">
                        <Download className="w-4 h-4" /> Export Excel
                    </button>
                    <button className="btn-secondary flex items-center gap-1.5">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            {/* Content Sections */}
            <BOQFilters 
                projects={projects}
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
                search={search}
                onSearchChange={setSearch}
                onAddItem={handleAddItem}
            />

            <BOQStats 
                totalItems={stats.totalItems}
                reconciled={stats.reconciled}
                overIssued={stats.overIssued}
                totalValue={stats.totalValue}
            />

            <div className="flex items-center gap-5 px-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-slate-500">Reconciled (≤2% variance)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-500">Minor Variance (2-5%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs text-slate-500">Under Utilized (&gt;5%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-slate-500">Over Issued</span>
                </div>
            </div>

            <BOQTable 
                items={filteredItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
            />

            <BOQItemModal 
                isOpen={isModalOpen}
                isEditing={isEditing}
                formData={formData}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onInputChange={handleInputChange}
            />
        </div>
    );
}
