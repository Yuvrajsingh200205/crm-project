import { useState, useMemo, useEffect } from 'react';
import { Plus, MapPin, Building2, TrendingUp, BarChart3, DollarSign, Loader2 } from 'lucide-react';
import { projectAPI } from '../../api/project';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/toastUtils';

// Sub-components
import ProjectStats from '../../components/projects/ProjectStats';
import ProjectFilters from '../../components/projects/ProjectFilters';
import ProjectTable from '../../components/projects/ProjectTable';
import ProjectModal from '../../components/projects/ProjectModal';
import ProjectDetailSidebar from '../../components/projects/ProjectDetailSidebar';

export default function ProjectMaster() {
    // API State Managers
    const [projectsList, setProjectsList] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Search & Filter State
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // UI Modal/Sidebar State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProj, setSelectedProj] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // API Initialization hook
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoadingData(true);
        try {
            const res = await projectAPI.getAllProjects();
            // Map according to common backend frameworks responding array, or { data }, or { projects }
            const payloadArray = Array.isArray(res.data) ? res.data : (res.data?.projects || res.data?.data || []);
            setProjectsList(payloadArray);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load backend projects API");
        } finally {
            setIsLoadingData(false);
        }
    }

    // 1. Filtered Projects List
    const filteredProjects = useMemo(() => {
        return (projectsList || []).filter(p => {
            if (!p) return false;
            const matchName = p.name ? String(p.name).toLowerCase() : '';
            const matchCode = p.code ? String(p.code).toLowerCase() : '';
            const matchClient = p.client ? String(p.client).toLowerCase() : '';
            const query = search ? String(search).toLowerCase() : '';

            const passesSearch = matchName.includes(query) || matchCode.includes(query) || matchClient.includes(query);
            // Ignore status filter if 'All', otherwise match pending/approved etc
            const passesStatus = statusFilter === 'All' || p.status === statusFilter;
            return passesSearch && passesStatus;
        });
    }, [projectsList, search, statusFilter]);

    // 2. Statistics Calculation
    const stats = useMemo(() => {
        const _values = projectsList.reduce((sum, p) => sum + (Number(p.value) || 0), 0);
        const _progressSum = projectsList.reduce((s, p) => s + (Number(p.advancement) || 0), 0);
        const avgProg = projectsList.length ? Math.round(_progressSum / projectsList.length) : 0;
        const totalValueFormatted = (`₹${(_values / 100000).toFixed(2)}L`);

        return [
            { label: 'Total Projects', value: projectsList.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Projects', value: projectsList.filter(p => p.status === 'pending').length, icon: MapPin, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Contract Value', value: totalValueFormatted, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Avg. Advancement', value: `${avgProg}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ];
    }, [projectsList]);

    // 3. Handlers
    const handleOpenAdd = () => {
        setIsEditing(false);
        setFormData({ 
            process: 'RUNNING', status: 'pending', category: 'Civil', 
            advancement: 0, value: 0 
        });
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

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        confirmToast('Delete this project entry permanently?', async () => {
            try {
                await projectAPI.deleteProject(id);
                setProjectsList(prev => prev.filter(p => p.id !== id && p.code !== id));
                toast.success("Project deleted successfully");
            } catch(err) {
                toast.error("Failed to delete project");
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Process payload exact keys required by project schema
            const processedData = {
                code: formData.code,
                name: formData.name,
                client: formData.client,
                category: formData.category,
                value: Number(formData.value || 0),
                process: formData.process || 'RUNNING',
                status: formData.status || 'pending',
                location: formData.location,
                advancement: Number(formData.advancement || 0),
                startDate: formData.startDate,
                endDate: formData.endDate
            };

            if (isEditing && (formData.id || formData._id)) {
                const targetId = formData.id || formData._id;
                const res = await projectAPI.updateProject(targetId, processedData);
                const updated = res.data?.data || res.data?.project || res.data;
                setProjectsList(projectsList.map(p => (p.id === targetId || p._id === targetId) ? { ...p, ...updated } : p));
                toast.success('Project details updated successfully!');
            } else {
                const res = await projectAPI.createProject(processedData);
                const created = res.data?.data || res.data?.project || res.data || processedData;
                setProjectsList([created, ...projectsList]);
                toast.success('Project enrolled successfully!');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Could not save Project');
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDownloadReports = () => {
        toast.loading("Generating comprehensive project reports...", { duration: 2000 });
        setTimeout(() => toast.success("Reports downloaded successfully"), 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Project Master DB</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage infrastructure projects across all API endpoints</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleDownloadReports} className="btn-secondary hidden sm:flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Reports
                    </button>
                    <button onClick={handleOpenAdd} className="btn-primary whitespace-nowrap flex items-center gap-1.5">
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

            {isLoadingData ? (
                <div className="card w-full p-12 flex justify-center items-center text-slate-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Fetching projects remotely...
                </div>
            ) : (
                <ProjectTable 
                    projects={filteredProjects}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                    onClearFilters={() => { setSearch(''); setStatusFilter('All'); }}
                />
            )}

            <ProjectModal 
                isOpen={isModalOpen}
                isEditing={isEditing}
                formData={formData}
                isLoading={isSaving}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onInputChange={handleInputChange}
            />

            <ProjectDetailSidebar 
                isOpen={isDetailOpen}
                project={selectedProj}
                onClose={() => setIsDetailOpen(false)}
                onEdit={(e, p) => { handleOpenEdit(e, p); setIsDetailOpen(false); }}
                onOpenGantt={() => toast.success("Gantt view ready")}
            />
        </div>
    );
}
