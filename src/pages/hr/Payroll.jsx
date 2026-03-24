import React, { useState, useEffect } from 'react';
import { 
  Download, CheckCircle, Clock, Users, IndianRupee, FileText, 
  ChevronDown, Plus, X, ArrowLeft, Building2, Wallet, TrendingUp, 
  ShieldCheck, Eye, Fingerprint, Calendar, CheckCircle2 
} from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

const initialSalaryData = [];

const salaryHistory = [
  { month: 'January 2026', gross: 58000, net: 51800, status: 'Paid', date: '2026-01-31' },
  { month: 'December 2025', gross: 58000, net: 51800, status: 'Paid', date: '2025-12-31' },
  { month: 'November 2025', gross: 56000, net: 50200, status: 'Paid', date: '2025-11-30' },
];

export default function Payroll() {
  const [salaries, setSalaries] = useState(initialSalaryData);
  const [view, setView] = useState('dashboard');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('February 2026');
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const [formData, setFormData] = useState({
    empId: '', name: '', designation: '', basic: 0, hra: 0, conv: 0, special: 0, epf: 0, esi: 0, tds: 0
  });

  const calculateSalary = (data) => {
    const gross = (Number(data.basic) || 0) + (Number(data.hra) || 0) + (Number(data.conv) || 0) + (Number(data.special) || 0);
    const deductions = (Number(data.epf) || 0) + (Number(data.esi) || 0) + (Number(data.tds) || 0) + 200;
    return { gross, net: gross - deductions };
  };

  const handeAddSalary = (e) => {
    e.preventDefault();
    const { gross, net } = calculateSalary(formData);
    const newEntry = { ...formData, gross, net, status: 'Processed', month: selectedMonth, id: Date.now().toString() };
    setSalaries([newEntry, ...salaries]);
    setShowAddModal(false);
    toast.success('Salary processed for ' + formData.name);
  };

  const totalGross = salaries.reduce((a, e) => a + (e.gross || 0), 0);
  const totalNet = salaries.reduce((a, e) => a + (e.net || 0), 0);

  // View 1: Payslip Template
  if (view === 'payslip' && selectedEmp) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-20 print:m-0 print:max-w-none print:pb-0">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page { size: auto; margin: 10mm; }
            body { background: white !important; }
            #payslip { 
              padding: 2.5rem !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .grid { gap: 1.5rem !important; }
            .py-10 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
            .mt-10 { margin-top: 1rem !important; }
            .mt-16 { margin-top: 2rem !important; }
            .p-10 { padding: 1.5rem !important; }
            .p-16 { padding: 2rem !important; }
            h1.text-5xl { font-size: 2.5rem !important; }
            .text-5xl { font-size: 2rem !important; }
          }
        ` }} />
        <div className="flex justify-between items-center print:hidden">
           <button onClick={() => setView('detail')} className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] hover:text-[#2f6645] transition-colors">
             <ArrowLeft className="w-4 h-4" /> Back to details
           </button>
           <button onClick={() => window.print()} className="btn-primary bg-[#2f6645] h-12 shadow-xl shadow-green-900/10 px-8">
             <Download className="w-4 h-4" /> Download PDF
           </button>
        </div>

        <div className="bg-white p-16 shadow-2xl rounded-3xl border border-slate-100 relative overflow-hidden print:shadow-none print:border-none print:p-8 print:m-0 print:rounded-none" id="payslip">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-20" />
           <div className="relative z-10">
             {/* Payslip Header */}
             <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10">
               <div className="space-y-4">
                 <div className="w-16 h-16 bg-[#1e3a34] rounded-2xl flex items-center justify-center text-white">
                   <Building2 className="w-8 h-8" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-900">CONSTRUCTION ERP SOLUTIONS</h2>
                   <p className="text-sm font-medium text-slate-500 italic max-w-xs">Civil Lines, Sector 44, Gurgaon, HR - 122003</p>
                 </div>
               </div>
               <div className="text-right">
                 <h1 className="text-5xl font-black text-slate-200 uppercase tracking-tighter">Payslip</h1>
                 <p className="text-[#2f6645] font-black uppercase text-xs tracking-widest mt-2 px-3 py-1 bg-emerald-50 rounded-lg inline-block">{selectedEmp.month}</p>
               </div>
             </div>

             {/* Employee Info */}
             <div className="grid grid-cols-2 gap-12 py-10 border-b border-slate-100">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee Details</h3>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-slate-900 uppercase">{selectedEmp.name}</p>
                    <p className="text-sm font-bold text-slate-500 uppercase">{selectedEmp.designation} • {selectedEmp.empId || selectedEmp.id}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Name</h3>
                    <p className="text-sm font-bold text-slate-700">HDFC BANK LTD</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account No</h3>
                    <p className="text-sm font-bold text-slate-700">**** 4432</p>
                  </div>
               </div>
             </div>

             {/* Table: Earnings & Deductions */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-10">
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm font-black text-slate-900 uppercase underline decoration-emerald-500 decoration-4 underline-offset-8">Earnings</h3>
                     <p className="text-xs font-bold text-slate-400">Total Earned</p>
                   </div>
                   <div className="space-y-4">
                      {[
                        { label: 'Basic Salary', val: selectedEmp.basic },
                        { label: 'House Rent Allowance (HRA)', val: selectedEmp.hra },
                        { label: 'Conveyance Allowance', val: selectedEmp.conv },
                        { label: 'Performance Bonus', val: selectedEmp.special },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                           <span className="font-medium text-slate-500">{item.label}</span>
                           <span className="font-bold text-slate-900">₹{item.val.toLocaleString()}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm font-black text-slate-900 uppercase underline decoration-red-500 decoration-4 underline-offset-8">Deductions</h3>
                     <p className="text-xs font-bold text-slate-400">Total Deducted</p>
                   </div>
                   <div className="space-y-4">
                      {[
                        { label: 'Provident Fund (EPF)', val: selectedEmp.epf },
                        { label: 'Employee ESI', val: selectedEmp.esi },
                        { label: 'Tax Deducted (TDS)', val: selectedEmp.tds },
                        { label: 'Professional Tax (PT)', val: selectedEmp.pt || 200 },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                           <span className="font-medium text-slate-500">{item.label}</span>
                           <span className="font-bold text-slate-900 text-red-600">₹{item.val?.toLocaleString() || '0'}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Totals */}
             <div className="mt-10 p-10 bg-slate-900 text-white rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] leading-none mb-3">Net Salary Payable</p>
                   <p className="text-3xl font-black tracking-tighter">₹{selectedEmp.net.toLocaleString()}</p>
                </div>
                <div className="text-center md:text-right space-y-2">
                   <p className="text-xs font-medium italic text-white/60">"Fifty One Thousand Eight Hundred Only"</p>
                   <div className="flex gap-4 justify-center md:justify-end">
                      <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase">Gross: ₹{selectedEmp.gross.toLocaleString()}</div>
                      <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase">Paid via Bank</div>
                   </div>
                </div>
             </div>

             <div className="mt-16 text-center">
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">This is a system generated payslip and does not require a signature.</p>
                <div className="flex items-center justify-center gap-4 mt-6">
                   <div className="w-12 h-1 bg-slate-100 rounded-full" />
                   <Building2 className="w-4 h-4 text-slate-200" />
                   <div className="w-12 h-1 bg-slate-100 rounded-full" />
                </div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // View 2: Employee Detail View
  if (view === 'detail' && selectedEmp) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
        <div className="flex items-center gap-4">
           <button onClick={() => setView('dashboard')} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#2f6645] hover:shadow-lg transition-all">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedEmp.name}</h2>
             <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{selectedEmp.designation} • {selectedEmp.empId || selectedEmp.id}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Basic Salary', val: `₹${selectedEmp.basic.toLocaleString()}`, icon: Wallet, color: 'blue' },
                   { label: 'Current Net', val: `₹${selectedEmp.net.toLocaleString()}`, icon: IndianRupee, color: 'emerald' },
                   { label: 'Total Paid YTD', val: '₹6.2L', icon: TrendingUp, color: 'purple' },
                 ].map((s, i) => (
                   <div key={i} className="card p-6 border-none shadow-xl shadow-slate-100/50 bg-white">
                      <div className={`p-3 rounded-2xl bg-${s.color}-50 text-${s.color}-600 w-fit mb-4`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
                      <p className="text-2xl font-black text-slate-900">{s.val}</p>
                   </div>
                 ))}
              </div>

              {/* History Timeline */}
              <div className="card p-8 bg-white border-none shadow-xl shadow-slate-100/50">
                 <div className="flex justify-between items-center mb-10">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider underline underline-offset-8 decoration-[#9ae66e] decoration-4">Salary History</h3>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-[#2f6645] transition-colors">
                      Latest First <ChevronDown className="w-3 h-3" />
                   </button>
                 </div>
                 
                 <div className="space-y-6">
                    {salaryHistory.map((hist, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:shadow-xl transition-all cursor-pointer" onClick={() => setView('payslip')}>
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#2f6645] shadow-sm border border-slate-100 transition-colors">
                             <FileText className="w-6 h-6" />
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-900">{hist.month}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: <span className="text-emerald-600">PAID</span> • {hist.date}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-12 text-right">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Credited</p>
                              <p className="text-lg font-black text-slate-800 tracking-tight">₹{hist.net.toLocaleString()}</p>
                           </div>
                           <button className="p-3 bg-white text-slate-400 rounded-xl group-hover:bg-[#2f6645] group-hover:text-white transition-all shadow-sm">
                              <Download className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6">
              {/* Quick Action Card */}
              <div className="card p-8 bg-[#1e3a34] text-white border-none shadow-2xl shadow-green-900/20 relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full scale-150 group-hover:scale-[1.8] transition-all duration-700" />
                 <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-6">
                       <ShieldCheck className="w-8 h-8 text-[#9ae66e]" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-2">Generate Payslip</h3>
                    <p className="text-xs text-white/50 mb-8 leading-relaxed">Create and share a professional digital payslip for the current month.</p>
                    <button 
                      onClick={() => setView('payslip')}
                      className="w-full py-4 bg-[#9ae66e] text-[#1e3a34] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                       View Payslip Now
                    </button>
                 </div>
              </div>

              {/* Composition Chart Mock */}
              <div className="card p-8 bg-white border-none shadow-xl shadow-slate-100/50">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Earning Composition</h3>
                 <div className="space-y-4">
                    {[
                      { l: 'BasePay', p: '60%', c: '#10b981' },
                      { l: 'Allowance', p: '25%', c: '#3b82f6' },
                      { l: 'Bonus', p: '15%', c: '#a855f7' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                           <span className="text-slate-500">{item.l}</span>
                           <span className="text-slate-900">{item.p}</span>
                         </div>
                         <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full rounded-full transition-all duration-1000" style={{ width: item.p, backgroundColor: item.c }} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // View 3: Dashboard
  return (
    <div className="space-y-8 animate-fade-in text-slate-800 pb-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-1">Payroll Management</h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2f6645]" /> Smart processing for the month of <span className="text-[#2f6645] font-black">{selectedMonth}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group/select">
            <select className="select w-44 bg-white pr-8 appearance-none py-3 font-bold text-xs" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              <option>February 2026</option>
              <option>January 2026</option>
              <option>March 2026</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within/select:text-[#2f6645]" />
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary bg-[#2f6645] shadow-xl shadow-green-900/10 h-14 px-8">
            <Plus className="w-5 h-5" /> Add Salary
          </button>
        </div>
      </div>

      {/* Main Stats Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 card p-8 bg-white border-none shadow-2xl shadow-slate-100/50 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-50 transition-all duration-700 group-hover:scale-150" />
          <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle cx="88" cy="88" r="75" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
              <circle cx="88" cy="88" r="75" fill="transparent" stroke="#10b981" strokeWidth="18" strokeDasharray="471" strokeDashoffset="118" />
              <circle cx="88" cy="88" r="75" fill="transparent" stroke="#3b82f6" strokeWidth="18" strokeDasharray="471" strokeDashoffset="350" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">₹2.4M</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Processed</p>
            </div>
          </div>
          <div className="flex-1 space-y-6 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 tracking-tight underline decoration-[#9ae66e] decoration-4 underline-offset-8">Financial Summary</h3>
              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-slate-800 px-3 py-1.5 rounded-xl">Month End</span>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: 'Total Payable', val: `₹${(totalNet/100000).toFixed(1)}L`, sub: 'After Deductions', color: 'emerald' },
                { label: 'Gross Amount', val: `₹${(totalGross/100000).toFixed(1)}L`, sub: 'Before Taxes', color: 'blue' },
                { label: 'PF Liability', val: '₹18.4K', sub: 'Retirement Acc.', color: 'purple' },
                { label: 'TDS/Tax', val: '₹6.2K', sub: 'Upcoming Challan', color: 'red' },
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <div className="flex items-baseline gap-2">
                    {isLoading ? (
                      <Skeleton variant="badge" className="h-6 w-16 mb-1" />
                    ) : (
                      <p className="text-2xl font-black text-slate-800 leading-none">{s.val}</p>
                    )}
                    <div className={`w-1.5 h-1.5 rounded-full bg-${s.color}-500`} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 italic">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 card p-8 bg-[#1e3a34] text-white border-none shadow-2xl shadow-green-900/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 opacity-10">
            <Fingerprint className="w-40 h-40 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#9ae66e]" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#9ae66e]">Security Status</h3>
            </div>
            <p className="text-xl font-black leading-tight mb-4">Banking & Compliance connection active.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                <CheckCircle className="w-3 h-3 text-[#9ae66e]" /> Provident Fund Sync Active
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                <CheckCircle className="w-3 h-3 text-[#9ae66e]" /> Form 16 Generation Enabled
              </div>
            </div>
          </div>
          <button className="relative z-10 mt-8 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Bank Advice
          </button>
        </div>
      </div>

      {/* Salary Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800">Active Salary Sheet</h3>
            <div className="flex gap-1">
              {['All', 'Processed', 'Pending'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === t ? 'bg-[#2f6645] text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs py-1.5 px-3">Preview All</button>
            <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Employee', 'Base Pay', 'Gross', 'Deductions', 'Net Credited', 'Month', 'Status', 'Record'].map(h => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell"><div className="flex gap-2"><Skeleton variant="circle" className="w-8 h-8" /><Skeleton variant="text" className="w-24" /></div></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="text" /></td>
                    <td className="table-cell"><Skeleton variant="badge" /></td>
                    <td className="table-cell text-right"><Skeleton variant="button" className="w-20" /></td>
                  </tr>
                ))
              ) : salaries.length === 0 ? (
                <tr><td colSpan="8" className="p-8 text-center text-slate-400 uppercase text-[10px] font-bold tracking-widest opacity-50">No processed records found</td></tr>
              ) : salaries.filter(s => activeTab === 'All' || s.status === activeTab).map((e, i) => (
                <tr key={i} className="table-row hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {e.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-slate-900 font-medium">{e.name}</p>
                        <p className="text-slate-400 text-xs">{e.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell text-slate-700 font-medium">₹{e.basic.toLocaleString()}</td>
                  <td className="table-cell text-slate-900 font-semibold">₹{e.gross.toLocaleString()}</td>
                  <td className="table-cell text-red-500 font-medium">₹{(e.gross - e.net).toLocaleString()}</td>
                  <td className="table-cell text-emerald-600 font-bold">₹{e.net.toLocaleString()}</td>
                  <td className="table-cell text-slate-500 text-xs">{e.month}</td>
                  <td className="table-cell">
                    <span className={`badge ${e.status === 'Processed' ? 'badge-green' : 'badge-yellow'}`}>{e.status}</span>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => { setSelectedEmp(e); setView('detail'); }}
                      className="p-1.5 bg-slate-100 text-slate-500 hover:bg-[#2f6645] hover:text-white rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Salary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#1e3a34] text-white">
              <div>
                <h2 className="text-base font-semibold">Create Salary Log</h2>
                <p className="text-xs text-white/60 mt-0.5">Process payment for {selectedMonth}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handeAddSalary} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Employee Name</label>
                  <input required placeholder="Full name" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Designation</label>
                  <input required placeholder="e.g. Senior Architect" className="input" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3">Earnings (Monthly)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[{ l: 'Basic Pay', key: 'basic' }, { l: 'HRA', key: 'hra' }, { l: 'Conveyance', key: 'conv' }, { l: 'Special/Bonus', key: 'special' }].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs text-slate-500">{item.l}</label>
                      <input type="number" required placeholder="0" className="input" value={formData[item.key]} onChange={e => setFormData({...formData, [item.key]: e.target.value})} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-3">Deductions (EPF/Tax)</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: 'PF Contribution', key: 'epf' }, { l: 'ESI', key: 'esi' }, { l: 'TDS / Tax', key: 'tds' }].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs text-slate-500">{item.l}</label>
                      <input type="number" required placeholder="0" className="input" value={formData[item.key]} onChange={e => setFormData({...formData, [item.key]: e.target.value})} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Estimated Net Salary</p>
                  <p className="text-xl font-bold text-emerald-600">₹{calculateSalary(formData).net.toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Submit & Process</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
