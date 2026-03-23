import { useState } from 'react';
import { Plus, Search, Download, Upload, CheckCircle, Clock, XCircle, X, Eye, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { employeeAPI } from '../../api/employee';
import toast from 'react-hot-toast';
export default function EmployeeMaster() {
    const { setActiveModule, setSelectedEmployee, employees, setEmployees } = useApp();
    const [search, setSearch] = useState('');
    const [dept, setDept] = useState('All');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const depts = ['All', ...new Set(employees.map(e => e.department))];
    const filtered = employees.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
        const matchDept = dept === 'All' || e.department === dept;
        return matchSearch && matchDept;
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const basic = parseFloat(formData.basic || 0);
        const gross = parseFloat(formData.gross || (basic * 1.5));
        const net = gross - (basic * 0.12); // simple mock calculation
        
        try {
            // Build payload exactly as requested
            const payload = {
                name: formData.name || '',
                email: formData.email || '',
                department: formData.department || 'Operations',
                designation: formData.designation || '',
                dateOfJoining: formData.doj || new Date().toISOString().split('T')[0],
                sallery: gross,
                type: formData.type || 'employee',
                pancardNo: formData.pan || '',
                aadharNo: formData.aadhar || '',
                pancardUrl: "https://example.com/pancard/admin",
                aadharUrl: "https://example.com/aadhar/admin",
                pfDeduction: !!formData.pf,
                esiDeduction: !!formData.esi,
                isAdmin: !!formData.isAdmin,
                adminId: 1,
                uanNumber: formData.uan || '',
                age: parseInt(formData.age || 25, 10)
            };

            const response = await employeeAPI.createEmployee(payload);
            toast.success('Employee created successfully via API!');

            const newEmp = {
                id: response?.data?.id || `EMP-00${employees.length + 1}`,
                name: payload.name,
                designation: payload.designation,
                department: payload.department,
                doj: payload.dateOfJoining,
                basic,
                gross,
                net,
                pf: payload.pfDeduction ? 'Active' : 'Inactive',
                esi: payload.esiDeduction || false,
                pan: payload.pancardNo || '',
                uan: payload.uanNumber || '',
                type: payload.type || 'Permanent',
                status: 'Active'
            };
            setEmployees([newEmp, ...employees]);
            setIsModalOpen(false);
            setFormData({});
        } catch (error) {
            console.error('API Error:', error);
            toast.error(error.response?.data?.message || 'Failed to create employee via API.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-9 w-full" placeholder="Search by name or employee ID..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    <div className="relative group/select">
                        <select className="select w-32 bg-white pr-8 appearance-none" value={dept} onChange={e => setDept(e.target.value)}>
                            {depts.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-green-600 transition-colors" />
                    </div>
                    <button className="btn-secondary whitespace-nowrap"><Upload className="w-4 h-4 mr-1" /> Import</button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary whitespace-nowrap flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Employee
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: 'Total Employees', value: employees.length, color: 'text-blue-500' },
                    { label: 'Permanent', value: employees.filter(e => e.type === 'Permanent').length, color: 'text-green-500' },
                    { label: 'PF Active', value: employees.filter(e => e.pf === 'Active').length, color: 'text-purple-500' },
                    { label: 'ESI Covered', value: employees.filter(e => e.esi).length, color: 'text-amber-500' },
                    { label: 'Gross Payroll', value: `₹${(employees.reduce((a, e) => a + e.gross, 0) / 100000).toFixed(1)}L`, color: 'text-orange-500' },
                ].map((s, i) => (
                    <div key={i} className="card p-4">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Emp. ID', 'Name / PAN', 'Designation', 'Dept', 'DOJ', 'Salary (Gross/Net)', 'PF/ESI', 'Type', 'Actions'].map(h => (
                                    <th key={h} className="table-header whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="9" className="p-6 text-center text-slate-500">No employees found. Add a new one.</td></tr>
                            ) : filtered.map((e, i) => (
                                <tr key={i} className="table-row cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => {
                                    setSelectedEmployee(e);
                                    setActiveModule('employee-details');
                                }}>
                                    <td className="table-cell font-mono text-blue-500 text-xs font-semibold">{e.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0">
                                                {e.name.split(' ').map(n => n?.[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-medium whitespace-nowrap">{e.name}</p>
                                                <p className="text-slate-500 text-xs font-mono">{e.pan}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-700">{e.designation}</td>
                                    <td className="table-cell"><span className="badge badge-green">{e.department}</span></td>
                                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">{e.doj}</td>
                                    <td className="table-cell">
                                        <p className="text-slate-900 font-semibold">₹{e.gross.toLocaleString()}</p>
                                        <p className="text-slate-500 text-xs">Net: ₹{e.net.toLocaleString()}</p>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            {e.pf === 'Active' && <span className="badge badge-green">PF</span>}
                                            {e.esi && <span className="badge badge-blue">ESI</span>}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${e.type === 'Permanent' ? 'badge-green' : 'badge-yellow'}`}>{e.type}</span>
                                    </td>
                                    <td className="table-cell" onClick={ev => ev.stopPropagation()}>
                                        <button 
                                            onClick={() => {
                                                setSelectedEmployee(e);
                                                setActiveModule('employee-details');
                                            }}
                                            className="btn-secondary text-xs py-1 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded flex items-center gap-1.5"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Add Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                            <h2 className="text-lg font-bold text-slate-800">Enroll New Employee</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddEmployee} className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Personal & Job Details */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Employment Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                                        <input required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. Rahul Sharma" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500">*</span></label>
                                        <input required type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. rahul@crm.com" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-1">
                                        <label className="text-sm font-medium text-slate-700">Age <span className="text-red-500">*</span></label>
                                        <input required type="number" name="age" value={formData.age || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. 35" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Designation <span className="text-red-500">*</span></label>
                                        <input required name="designation" value={formData.designation || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. Site Engineer" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Department <span className="text-red-500">*</span></label>
                                        <input required name="department" value={formData.department || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. Civil" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Date of Joining (DOJ) <span className="text-red-500">*</span></label>
                                        <input required type="date" name="doj" value={formData.doj || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Employment Type <span className="text-red-500">*</span></label>
                                        <div className="relative group/select">
                                            <select required name="type" value={formData.type || 'Permanent'} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all bg-white appearance-none pr-8">
                                                <option value="Permanent">Permanent</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Trainee">Trainee</option>
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-green-600 transition-colors" />
                                        </div>
                                    </div>

                                    {formData.type === 'Trainee' && (
                                        <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-sm font-medium text-slate-700">Training Duration (Months) <span className="text-red-500">*</span></label>
                                            <input required type="number" name="duration" value={formData.duration || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. 6" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Compliance & Salary */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Salary & Statutory Info</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Basic Salary (₹) <span className="text-red-500">*</span></label>
                                        <input required type="number" name="basic" value={formData.basic || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. 20000" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Gross Salary (₹)</label>
                                        <input type="number" name="gross" value={formData.gross || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. 30000" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">PAN Number <span className="text-red-500">*</span></label>
                                        <input required name="pan" value={formData.pan || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all font-mono uppercase" placeholder="e.g. ABCDE1234F" maxLength={10} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Aadhar Number <span className="text-red-500">*</span></label>
                                        <input required name="aadhar" value={formData.aadhar || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all font-mono" placeholder="e.g. 867658495800" maxLength={12} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">UAN Number</label>
                                        <input name="uan" value={formData.uan || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all font-mono" placeholder="e.g. 1005671239" maxLength={12} />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 flex items-center gap-6 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" name="pf" checked={formData.pf || false} onChange={handleInputChange} className="w-4 h-4 text-[#22c55e] rounded border-slate-300 focus:ring-[#22c55e] transition-all" />
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">PF Applicable</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" name="esi" checked={formData.esi || false} onChange={handleInputChange} className="w-4 h-4 text-[#22c55e] rounded border-slate-300 focus:ring-[#22c55e] transition-all" />
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">ESI Applicable</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" name="isAdmin" checked={formData.isAdmin || false} onChange={handleInputChange} className="w-4 h-4 text-[#22c55e] rounded border-slate-300 focus:ring-[#22c55e] transition-all" />
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Is Admin</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className={`px-5 py-2.5 rounded-lg bg-[#22c55e] text-white font-medium hover:bg-[#16a34a] shadow-sm shadow-[#22c55e]/20 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                    {isLoading ? 'Enrolling...' : 'Enroll Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
