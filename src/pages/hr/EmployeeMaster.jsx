import { useState } from 'react';
import { Plus, Search, Download, Upload, CheckCircle, Clock, XCircle, X } from 'lucide-react';

const initialEmployees = [
    { id: 'EMP-001', name: 'Rajesh Kumar', designation: 'Project Manager', department: 'Operations', doj: '2022-04-01', basic: 35000, gross: 58000, net: 52800, pf: 'Active', esi: false, pan: 'ABCPK1234Q', uan: '100567892345', type: 'Permanent', status: 'Active' },
    { id: 'EMP-002', name: 'Suresh Verma', designation: 'Senior Engineer', department: 'Civil', doj: '2021-07-15', basic: 28000, gross: 46000, net: 41500, pf: 'Active', esi: false, pan: 'DERPV5678R', uan: '100567892346', type: 'Permanent', status: 'Active' },
    { id: 'EMP-003', name: 'Priya Devi', designation: 'Site Engineer', department: 'Electrical', doj: '2023-01-10', basic: 22000, gross: 36000, net: 32400, pf: 'Active', esi: true, pan: 'GHIPD9012S', uan: '100567892347', type: 'Permanent', status: 'Active' },
    { id: 'EMP-004', name: 'Mohan Lal', designation: 'Store Keeper', department: 'Stores', doj: '2023-06-01', basic: 15000, gross: 21000, net: 18200, pf: 'Active', esi: true, pan: 'JKLML3456T', uan: '100567892348', type: 'Permanent', status: 'Active' },
    { id: 'EMP-005', name: 'Ankit Sharma', designation: 'Project Manager', department: 'Solar', doj: '2020-09-15', basic: 40000, gross: 68000, net: 61500, pf: 'Active', esi: false, pan: 'MNOAS7890U', uan: '100567892349', type: 'Permanent', status: 'Active' },
    { id: 'EMP-006', name: 'Ritu Singh', designation: 'HR Manager', department: 'HR', doj: '2022-02-01', basic: 30000, gross: 50000, net: 45200, pf: 'Active', esi: false, pan: 'PQRRS2345V', uan: '100567892350', type: 'Permanent', status: 'Active' },
    { id: 'EMP-007', name: 'Deepak Kumar', designation: 'Accountant', department: 'Finance', doj: '2021-11-20', basic: 25000, gross: 41000, net: 37100, pf: 'Active', esi: false, pan: 'STUVK6789W', uan: '100567892351', type: 'Permanent', status: 'Active' },
    { id: 'EMP-008', name: 'Sanya Mishra', designation: 'Site Supervisor', department: 'Interior', doj: '2024-01-15', basic: 18000, gross: 28000, net: 24800, pf: 'Active', esi: true, pan: 'WXYZM1234X', uan: '100567892352', type: 'Contract', status: 'Active' },
];

export default function EmployeeMaster() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [search, setSearch] = useState('');
    const [dept, setDept] = useState('All');
    const [selected, setSelected] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

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

    const handleAddEmployee = (e) => {
        e.preventDefault();
        const basic = parseFloat(formData.basic || 0);
        const gross = parseFloat(formData.gross || (basic * 1.5));
        const net = gross - (basic * 0.12); // simple mock calculation
        
        const newEmp = {
            id: `EMP-00${employees.length + 1}`,
            name: formData.name || '',
            designation: formData.designation || '',
            department: formData.department || 'Operations',
            doj: formData.doj || new Date().toISOString().split('T')[0],
            basic,
            gross,
            net,
            pf: formData.pf ? 'Active' : 'Inactive',
            esi: formData.esi || false,
            pan: formData.pan || '',
            uan: formData.uan || '',
            type: formData.type || 'Permanent',
            status: 'Active'
        };
        setEmployees([newEmp, ...employees]);
        setIsModalOpen(false);
        setFormData({});
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
                    <select className="select w-32 bg-white" value={dept} onChange={e => setDept(e.target.value)}>
                        {depts.map(d => <option key={d}>{d}</option>)}
                    </select>
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
                                <tr key={i} className="table-row cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setSelected(e)}>
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
                                    <td className="table-cell"><span className="badge badge-blue">{e.department}</span></td>
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
                                        <button className="btn-secondary text-xs py-1 px-3 border border-slate-200 bg-white hover:bg-slate-50 rounded">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Employee Detail Slide-over Panel */}
            {selected && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end z-40 transition-opacity" onClick={() => setSelected(null)}>
                    <div className="w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto animate-slide-in relative flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                            <h3 className="text-slate-900 font-bold text-lg">Employee Profile</h3>
                            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/50 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 flex-1">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xl font-bold shadow-sm">
                                    {selected.name.split(' ').map(n => n?.[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-bold text-lg">{selected.name}</h4>
                                    <p className="text-slate-500 text-sm font-medium">{selected.designation}</p>
                                    <p className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600 mt-2 border border-blue-100">
                                        {selected.id}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: 'Department', value: selected.department },
                                    { label: 'Date of Joining', value: selected.doj },
                                    { label: 'Employee Type', value: selected.type },
                                    { label: 'PAN Number', value: selected.pan, mono: true },
                                    { label: 'UAN (PF)', value: selected.uan, mono: true },
                                ].map((f, i) => (
                                    <div key={i} className="flex justify-between items-center py-1">
                                        <span className="text-slate-500 text-sm">{f.label}</span>
                                        <span className={`text-slate-900 text-sm font-medium ${f.mono ? 'font-mono text-xs' : ''}`}>{f.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 pt-5">
                                <p className="text-slate-800 text-sm font-bold mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-500" /> Salary Configuration
                                </p>
                                <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                                    {[
                                        { label: 'Basic Salary', value: `₹${selected.basic.toLocaleString()}` },
                                        { label: 'Gross Salary', value: `₹${selected.gross.toLocaleString()}` },
                                        { label: 'Employee PF (12%)', value: `₹${Math.round(selected.basic * 0.12).toLocaleString()}`, isDeduction: true },
                                        { label: 'Net Take-Home', value: `₹${selected.net.toLocaleString()}`, isNet: true },
                                    ].map((f, i) => (
                                        <div key={i} className={`flex justify-between items-center ${f.isNet ? 'border-t border-slate-200 pt-3 mt-3' : ''}`}>
                                            <span className="text-slate-600 text-sm">{f.label}</span>
                                            <span className={`text-sm font-semibold ${f.isNet ? 'text-emerald-600 text-base' : f.isDeduction ? 'text-amber-600' : 'text-slate-900'}`}>{f.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3 sticky bottom-0">
                            <button className="btn-secondary border border-slate-200 font-medium py-2.5 w-full justify-center">Edit Profile</button>
                            <button className="btn-primary font-medium py-2.5 w-full justify-center bg-emerald-500 hover:bg-emerald-600 border-transparent shadow-sm shadow-emerald-500/20">Generate Payslip</button>
                        </div>
                    </div>
                </div>
            )}

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
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                                        <input required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all" placeholder="e.g. Rahul Sharma" />
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
                                        <select required name="type" value={formData.type || 'Permanent'} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] outline-none transition-all bg-white">
                                            <option value="Permanent">Permanent</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Trainee">Trainee</option>
                                        </select>
                                    </div>
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
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#22c55e] text-white font-medium hover:bg-[#16a34a] shadow-sm shadow-[#22c55e]/20 transition-all">
                                    Enroll Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
