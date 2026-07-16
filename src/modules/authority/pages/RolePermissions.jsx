import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, ChevronUp, Loader2, Save, Check } from 'lucide-react';
import { authorityAPI } from '../services';
import toast from 'react-hot-toast';

export default function RolePermissions() {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    
    const [selectedRole, setSelectedRole] = useState('');
    const [expandedModules, setExpandedModules] = useState({});
    const [moduleSubmodules, setModuleSubmodules] = useState({});
    const [loadingSubmodules, setLoadingSubmodules] = useState({});
    
    // selectedPermissions structure:
    // { [subModuleId]: { [permissionId]: true/false } }
    const [selectedPermissions, setSelectedPermissions] = useState({});
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const initData = async () => {
            try {
                setIsLoading(true);
                const [rolesData, modulesData, permissionsData] = await Promise.all([
                    authorityAPI.getRoles(),
                    authorityAPI.getModules(),
                    authorityAPI.getPermissions()
                ]);
                let filteredModules = modulesData ? JSON.parse(JSON.stringify(modulesData)) : [];
                // Filter Authority module to only include Role and Role Permission submodules
                const authModuleIdx = filteredModules.findIndex(m => m.name?.toLowerCase() === 'authority' || m.code?.toLowerCase() === 'authority');
                if (authModuleIdx >= 0 && filteredModules[authModuleIdx].submodules) {
                    filteredModules[authModuleIdx].submodules = filteredModules[authModuleIdx].submodules.filter(sub => {
                        const subName = sub.name?.toLowerCase() || '';
                        const subCode = sub.code?.toLowerCase() || '';
                        return subName.includes('role') || subCode.includes('role');
                    });
                }

                setRoles(rolesData || []);
                setModules(filteredModules);
                setPermissions(permissionsData || []);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                toast.error('Failed to load required data');
            } finally {
                setIsLoading(false);
            }
        };
        initData();
    }, []);

    // When role changes, we might want to fetch existing permissions for this role
    // For now, we just clear selections, or we can load them if API provides it.
    useEffect(() => {
        if (selectedRole) {
            fetchExistingPermissions(selectedRole);
        } else {
            setSelectedPermissions({});
        }
    }, [selectedRole]);

    const fetchExistingPermissions = async (roleId) => {
        try {
            const data = await authorityAPI.getRolePermissions(roleId);
            const newSelection = {};
            
            if (Array.isArray(data)) {
                data.forEach((moduleItem) => {
                    // If response is nested modules -> submodules -> permissions
                    if (moduleItem.submodules && Array.isArray(moduleItem.submodules)) {
                        moduleItem.submodules.forEach((submodule) => {
                            if (submodule.permissions && Array.isArray(submodule.permissions)) {
                                submodule.permissions.forEach((permission) => {
                                    const subId = submodule.id || submodule._id;
                                    const permId = permission.id || permission._id;
                                    if (!newSelection[subId]) {
                                        newSelection[subId] = {};
                                    }
                                    newSelection[subId][permId] = true;
                                });
                            }
                        });
                    } else if (moduleItem.subModuleId && moduleItem.permissionId) {
                        // Fallback for flat structure
                        if (!newSelection[moduleItem.subModuleId]) {
                            newSelection[moduleItem.subModuleId] = {};
                        }
                        newSelection[moduleItem.subModuleId][moduleItem.permissionId] = true;
                    }
                });
            }
            setSelectedPermissions(newSelection);
        } catch (error) {
            console.error('Error fetching existing permissions:', error);
            toast.error('Failed to load existing permissions for this role');
        }
    };

    const toggleModule = async (moduleId) => {
        const isExpanded = expandedModules[moduleId];
        setExpandedModules(prev => ({ ...prev, [moduleId]: !isExpanded }));

        // Fetch submodules if not already loaded
        if (!isExpanded && !moduleSubmodules[moduleId]) {
            try {
                setLoadingSubmodules(prev => ({ ...prev, [moduleId]: true }));
                let data = await authorityAPI.getSubmodulesByModuleId(moduleId);
                data = data || [];
                
                // Filter out unwanted submodules if this is the Authority module
                const moduleObj = modules.find(m => (m.id || m._id) === moduleId);
                if (moduleObj && (moduleObj.name?.toLowerCase() === 'authority' || moduleObj.code?.toLowerCase() === 'authority')) {
                    data = data.filter(sub => {
                        const subName = sub.name?.toLowerCase() || '';
                        const subCode = sub.code?.toLowerCase() || '';
                        return subName.includes('role') || subCode.includes('role');
                    });
                }
                
                setModuleSubmodules(prev => ({ ...prev, [moduleId]: data }));
            } catch (error) {
                console.error('Error fetching submodules:', error);
                toast.error('Failed to fetch submodules');
            } finally {
                setLoadingSubmodules(prev => ({ ...prev, [moduleId]: false }));
            }
        }
    };

    const togglePermission = (subModuleId, permissionId) => {
        setSelectedPermissions(prev => {
            const currentSubModulePerms = prev[subModuleId] || {};
            const isSelected = currentSubModulePerms[permissionId];
            
            return {
                ...prev,
                [subModuleId]: {
                    ...currentSubModulePerms,
                    [permissionId]: !isSelected
                }
            };
        });
    };

    const handleSelectAllSubmodule = (subModuleId, select) => {
        setSelectedPermissions(prev => {
            const newSubModulePerms = {};
            if (select) {
                permissions.forEach(p => {
                    newSubModulePerms[p.id || p._id] = true;
                });
            }
            return {
                ...prev,
                [subModuleId]: newSubModulePerms
            };
        });
    };

    const handleSave = async () => {
        if (!selectedRole) {
            toast.error('Please select a role first');
            return;
        }

        const payload = [];
        Object.entries(selectedPermissions).forEach(([subModuleId, perms]) => {
            Object.entries(perms).forEach(([permissionId, isSelected]) => {
                if (isSelected) {
                    payload.push({
                        roleId: parseInt(selectedRole, 10),
                        subModuleId: parseInt(subModuleId, 10),
                        permissionId: parseInt(permissionId, 10)
                    });
                }
            });
        });

        try {
            setIsSaving(true);
            await authorityAPI.saveRolePermissions(payload);
            toast.success('Role permissions saved successfully!');
        } catch (error) {
            console.error('Error saving role permissions:', error);
            toast.error('Failed to save role permissions');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-[#2f6645] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Role Permissions</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure access control for modules and submodules</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || !selectedRole}
                    className="btn-primary flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Permissions
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="max-w-md">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Role <span className="text-red-500">*</span></label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2f6645]/20 focus:border-[#2f6645] transition-all"
                    >
                        <option value="">-- Choose a Role --</option>
                        {roles.map(role => (
                            <option key={role.id || role._id} value={role.id || role._id}>
                                {role.name} ({role.code})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedRole && (
                <div className="space-y-4">
                    <h2 className="font-bold text-lg text-slate-800">Assign Permissions</h2>
                    {modules.map(module => {
                        const moduleId = module.id || module._id;
                        const isExpanded = expandedModules[moduleId];
                        const submodules = moduleSubmodules[moduleId] || [];
                        const isSubmodulesLoading = loadingSubmodules[moduleId];

                        return (
                            <div key={moduleId} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => toggleModule(moduleId)}
                                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-slate-800 text-left">{module.name}</span>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                </button>

                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                                        {isSubmodulesLoading ? (
                                            <div className="py-8 flex justify-center">
                                                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                                            </div>
                                        ) : submodules.length === 0 ? (
                                            <div className="py-8 text-center text-slate-500 text-sm">
                                                No submodules found for this module.
                                            </div>
                                        ) : (
                                            <div className="space-y-4 mt-4">
                                                {submodules.map(submodule => {
                                                    const subModuleId = submodule.id || submodule._id;
                                                    const subModulePerms = selectedPermissions[subModuleId] || {};
                                                    const isAllSelected = permissions.length > 0 && permissions.every(p => subModulePerms[p.id || p._id]);

                                                    return (
                                                        <div key={subModuleId} className="bg-white p-4 rounded-xl border border-slate-200">
                                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                                                <h4 className="font-semibold text-slate-700">{submodule.name}</h4>
                                                                <button
                                                                    onClick={() => handleSelectAllSubmodule(subModuleId, !isAllSelected)}
                                                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${isAllSelected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                                >
                                                                    {isAllSelected ? 'Deselect All' : 'Select All'}
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                                {permissions.map(permission => {
                                                                    const permissionId = permission.id || permission._id;
                                                                    const isSelected = !!subModulePerms[permissionId];
                                                                    return (
                                                                        <label 
                                                                            key={permissionId}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                togglePermission(subModuleId, permissionId);
                                                                            }}
                                                                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-[#2f6645] bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}
                                                                        >
                                                                            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#2f6645]' : 'bg-white border border-slate-300'}`}>
                                                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                                                            </div>
                                                                            <span className={`text-sm select-none truncate ${isSelected ? 'text-[#2f6645] font-medium' : 'text-slate-600'}`}>
                                                                                {permission.name}
                                                                            </span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
