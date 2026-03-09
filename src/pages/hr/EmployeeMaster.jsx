import { useState } from 'react';
import { Plus, Search, Download, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

const employees = [
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
    const [search, setSearch] = useState('');
    const [dept, setDept] = useState('All');
    const [selected, setSelected] = useState(null);

    const depts = ['All', ...new Set(employees.map(e => e.department))];
    const filtered = employees.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.includes(search);
        const matchDept = dept === 'All' || e.department === dept;
        return matchSearch && matchDept;
    });

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className="input pl-9" placeholder="Search by name or employee ID..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="select w-44" value={dept} onChange={e => setDept(e.target.value)}>
                    {depts.map(d => <option key={d}>{d}</option>)}
                </select>
                <button className="btn-secondary"><Upload className="w-4 h-4" /> Import</button>
                <button className="btn-primary"><Plus className="w-4 h-4" /> Add Employee</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: 'Total Employees', value: employees.length, color: 'text-blue-400' },
                    { label: 'Permanent', value: employees.filter(e => e.type === 'Permanent').length, color: 'text-green-400' },
                    { label: 'PF Active', value: employees.filter(e => e.pf === 'Active').length, color: 'text-purple-400' },
                    { label: 'ESI Covered', value: employees.filter(e => e.esi).length, color: 'text-yellow-400' },
                    { label: 'Gross Payroll', value: `₹${(employees.reduce((a, e) => a + e.gross, 0) / 100000).toFixed(1)}L`, color: 'text-orange-400' },
                ].map((s, i) => (
                    <div key={i} className="card p-3.5">
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {['Emp. ID', 'Name', 'Designation', 'Dept', 'DOJ', 'Gross Salary', 'PF/ESI', 'Type', 'Actions'].map(h => (
                                    <th key={h} className="table-header">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((e, i) => (
                                <tr key={i} className="table-row cursor-pointer" onClick={() => setSelected(e)}>
                                    <td className="table-cell font-mono text-blue-400 text-xs font-semibold">{e.id}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-slate-900 text-xs font-bold flex-shrink-0">
                                                {e.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-medium">{e.name}</p>
                                                <p className="text-slate-400 text-xs">{e.pan}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell text-slate-700">{e.designation}</td>
                                    <td className="table-cell"><span className="badge badge-blue">{e.department}</span></td>
                                    <td className="table-cell text-slate-400 text-xs">{e.doj}</td>
                                    <td className="table-cell">
                                        <p className="text-slate-900 font-semibold">₹{e.gross.toLocaleString()}</p>
                                        <p className="text-slate-400 text-xs">Net: ₹{e.net.toLocaleString()}</p>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex gap-1">
                                            <span className="badge badge-green">PF</span>
                                            {e.esi && <span className="badge badge-blue">ESI</span>}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${e.type === 'Permanent' ? 'badge-green' : 'badge-yellow'}`}>{e.type}</span>
                                    </td>
                                    <td className="table-cell" onClick={ev => ev.stopPropagation()}>
                                        <button className="btn-secondary text-xs py-1 px-2">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Employee Detail Panel */}
            {selected && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end z-50" onClick={() => setSelected(null)}>
                    <div className="w-96 h-full bg-white border-l border-slate-200 overflow-y-auto animate-slide-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                            <h3 className="text-slate-900 font-semibold">Employee Profile</h3>
                            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-900"><XCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-slate-900 text-xl font-bold">
                                    {selected.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-bold text-lg">{selected.name}</h4>
                                    <p className="text-slate-400 text-sm">{selected.designation}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{selected.id}</p>
                                </div>
                            </div>

                            {[
                                { label: 'Department', value: selected.department },
                                { label: 'Date of Joining', value: selected.doj },
                                { label: 'Employee Type', value: selected.type },
                                { label: 'PAN', value: selected.pan },
                                { label: 'UAN (PF)', value: selected.uan },
                            ].map((f, i) => (
                                <div key={i} className="flex justify-between">
                                    <span className="text-slate-400 text-sm">{f.label}</span>
                                    <span className="text-slate-900 text-sm font-medium">{f.value}</span>
                                </div>
                            ))}

                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Salary Details (Monthly)</p>
                                {[
                                    { label: 'Basic Salary', value: `₹${selected.basic.toLocaleString()}` },
                                    { label: 'Gross Salary', value: `₹${selected.gross.toLocaleString()}` },
                                    { label: 'Employee PF', value: `₹${Math.round(selected.basic * 0.12).toLocaleString()}` },
                                    { label: 'Net Take-Home', value: `₹${selected.net.toLocaleString()}` },
                                ].map((f, i) => (
                                    <div key={i} className={`flex justify-between py-2 ${i < 3 ? 'border-b border-slate-200/50' : ''}`}>
                                        <span className="text-slate-400 text-sm">{f.label}</span>
                                        <span className={`text-sm font-semibold ${f.label === 'Net Take-Home' ? 'text-green-400' : 'text-slate-900'}`}>{f.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button className="btn-primary flex-1">Edit Profile</button>
                                <button className="btn-secondary">Generate Payslip</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
