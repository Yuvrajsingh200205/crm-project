import { useState, useMemo } from 'react';
import { Plus, MapPin, Building2, TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

// Sub-components
import ProjectStats from '../../components/projects/ProjectStats';
import ProjectFilters from '../../components/projects/ProjectFilters';
import ProjectTable from '../../components/projects/ProjectTable';
import ProjectModal from '../../components/projects/ProjectModal';
import ProjectDetailSidebar from '../../components/projects/ProjectDetailSidebar';

export default function ProjectMaster() {
    const { projects, setProjects, updateProject } = useApp();
    
    // Search & Filter State
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // UI Modal/Sidebar State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProj, setSelectedProj] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // 1. Filtered Projects List
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                                p.id.toLowerCase().includes(search.toLowerCase()) ||
                                p.client.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter]);

    // 2. Statistics Calculation
    const stats = useMemo(() => {
        const totalValue = projects.reduce((sum, p) => sum + (p.contractValue || 0), 0);
        return [
            { label: 'Total Projects', value: projects.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Sites', value: projects.filter(p => p.status === 'Active').length, icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Contract Value', value: `₹${(totalValue / 10000000).toFixed(2)}Cr`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg. Progress', value: `${projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
    }, [projects]);

    // 3. Handlers
    const handleOpenAdd = () => {
        setIsEditing(false);
        setFormData({ status: 'Active', category: 'Civil', progress: 0 });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (e, project) => {
        e.stopPropagation();
        setIsEditing(true);
        setFormData({ ...project });
        setIsModalOpen(true);
    };

    const handleViewDetails = (project) => {
        setSelectedProj(project);
        setIsDetailOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project?')) {
            setProjects(prev => prev.filter(p => p.id !== id));
            toast.success("Project deleted successfully");
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const promise = new Promise((resolve) => setTimeout(resolve, 800));

        const processedData = {
            ...formData,
            contractValue: Number(formData.contractValue || 0),
            advance: Number(formData.advance || 0),
            progress: Number(formData.progress || 0)
        };

        if (isEditing) {
            updateProject(processedData);
            toast.promise(promise, {
                loading: 'Updating project...',
                success: 'Project synchronized successfully!',
                error: 'Could not update project.',
            });
        } else {
            const newProj = {
                ...processedData,
                id: `PRJ-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
                tags: ['New']
            };
            setProjects([newProj, ...projects]);
            toast.promise(promise, {
                loading: 'Creating project...',
                success: 'New project enrolled successfully!',
                error: 'Could not create project.',
            });
        }
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDownloadReports = () => {
        toast.loading("Generating comprehensive project reports...", { duration: 2000 });
        setTimeout(() => toast.success("Reports downloaded successfully"), 2000);
    };

    const handleOpenGantt = () => {
        toast.loading("Initializing Gantt Scheduler...", { duration: 1500 });
        setTimeout(() => toast.success("Gantt view ready"), 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Project Master</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage and track all infrastructure projects</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleDownloadReports} className="btn-secondary hidden sm:flex items-center gap-2 border-2 border-slate-100 hover:border-green-500 hover:text-green-600">
                        <BarChart3 className="w-4 h-4" /> Reports
                    </button>
                    <button onClick={handleOpenAdd} className="btn-primary flex items-center gap-2 px-5 py-2.5 shadow-lg shadow-green-600/20 active:scale-95 transition-transform">
                        <Plus className="w-5 h-5" /> New Project
                    </button>
                </div>
            </div>

            {/* Optimized Components */}
            <ProjectStats stats={stats} />
            
            <ProjectFilters 
                search={search} 
                setSearch={setSearch} 
                statusFilter={statusFilter} 
                setStatusFilter={setStatusFilter} 
            />

            <ProjectTable 
                projects={filteredProjects}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onClearFilters={() => { setSearch(''); setStatusFilter('All'); }}
            />

            <ProjectModal 
                isOpen={isModalOpen}
                isEditing={isEditing}
                formData={formData}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onInputChange={handleInputChange}
            />

            <ProjectDetailSidebar 
                isOpen={isDetailOpen}
                project={selectedProj}
                onClose={() => setIsDetailOpen(false)}
                onEdit={(e, p) => { handleOpenEdit(e, p); setIsDetailOpen(false); }}
                onOpenGantt={handleOpenGantt}
            />
        </div>
    );
}
