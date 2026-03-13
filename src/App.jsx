import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import ProjectMaster from './pages/projects/ProjectMaster';
import BOQ from './pages/projects/BOQ';
import PlaceholderPage from './pages/PlaceholderPage';
import Vouchers from './pages/finance/Vouchers';
import JobCosting from './pages/finance/JobCosting';
import GSTManagement from './pages/finance/GSTManagement';
import MaterialReconciliation from './pages/operations/MaterialReconciliation';
import Procurement from './pages/operations/Procurement';
import EmployeeMaster from './pages/hr/EmployeeMaster';
import Attendance from './pages/hr/Attendance';
import LeaveManagement from './pages/hr/LeaveManagement';
import Payroll from './pages/hr/Payroll';
import StatutoryCompliance from './pages/hr/StatutoryCompliance';
import Reimbursements from './pages/hr/Reimbursements';
import FinancialAnalytics from './pages/analytics/FinancialAnalytics';

import Tenders from './pages/business/Tenders';

import {
  FolderKanban, ClipboardList, MapPin, TrendingUp, GitBranch,
  BookOpen, FileText, Receipt, CreditCard, Landmark, Globe, Percent,
  Building, Package, Wrench, Users, UserCheck, Calendar, Shield, BarChart3,
  Briefcase, FileBarChart, Target, Activity
} from 'lucide-react';

const pageMap = {
  'dashboard': <Dashboard />,

  // Project Management
  'project-master': <ProjectMaster />,
  'work-orders': <PlaceholderPage title="Work Order Management" description="Create and track work orders against parent projects. Link BOQ items, assign contractors, track progress and billing milestones." icon={ClipboardList} />,
  'boq': <BOQ />,
  'site-management': <PlaceholderPage title="Site Management" description="Manage multiple project sites with daily reports, team attendance, material tracking, and safety compliance." icon={MapPin} />,
  'progress-tracking': <PlaceholderPage title="Progress Tracking" description="Monitor project execution with Gantt charts, S-curve analysis, and milestone tracking." icon={TrendingUp} />,

  // Finance
  'chart-of-accounts': <PlaceholderPage title="Chart of Accounts" description="Complete multi-level ledger structure — Assets, Liabilities, Income, Expenses with project cost centers." icon={BookOpen} />,
  'vouchers': <Vouchers />,
  'invoicing': <PlaceholderPage title="Invoicing & Billing" description="Generate progress invoices (RA Bills), calculate retention, GST invoices, and track payment milestones." icon={Receipt} />,
  'accounts-payable': <PlaceholderPage title="Accounts Payable" description="Manage vendor payments, TDS deductions, cheque printing, and NEFT/RTGS integration." icon={CreditCard} />,
  'accounts-receivable': <PlaceholderPage title="Accounts Receivable" description="Track customer outstanding, aging analysis (0-30, 30-60, 60-90, 90+ days), and collection reminders." icon={Landmark} />,
  'gst-management': <GSTManagement />,
  'tds-management': <PlaceholderPage title="TDS Management" description="Auto TDS calculation (194C, 194I, 194J), certificate generation (Form 16A), and quarterly returns." icon={Percent} />,
  'bank-reconciliation': <PlaceholderPage title="Bank Reconciliation" description="Auto-import bank statements, match transactions, track uncleared cheques across multiple bank accounts." icon={Building} />,
  'job-costing': <JobCosting />,

  // Operations
  'procurement': <Procurement />,
  'inventory': <PlaceholderPage title="Inventory & Store Management" description="Multi-location inventory tracking with FIFO/LIFO valuation, reorder alerts, and stock verification." icon={Package} />,
  'material-reconciliation': <MaterialReconciliation />,
  'equipment': <PlaceholderPage title="Equipment & Asset Management" description="Track machinery utilization, maintenance schedules, fuel logs, and depreciation." icon={Wrench} />,
  'subcontractors': <PlaceholderPage title="Subcontractor Management" description="Manage subcontractor work orders, rate contracts, billing, TDS, and performance ratings." icon={Users} />,

  // HR
  'employee-master': <EmployeeMaster />,
  'attendance': <Attendance />,
  'leave-management': <LeaveManagement />,
  'payroll': <Payroll />,
  'statutory-compliance': <StatutoryCompliance />,
  'reimbursements': <Reimbursements />,

  // Business Dev
  'crm': <PlaceholderPage title="CRM" description="Lead management, client interactions, opportunity pipeline, and win/loss analysis." icon={Target} />,
  'quotations': <PlaceholderPage title="Quotation Management" description="BOQ-based costing, margin calculation, revision tracking, and quote-to-order conversion." icon={FileText} />,
  'tenders': <Tenders />,
  'contracts': <PlaceholderPage title="Contract Management" description="Contract repository, milestone tracking, PBG management, and amendment handling." icon={FileBarChart} />,
  'vendor-management': <PlaceholderPage title="Vendor Management" description="Vendor rating, rate contracts, due diligence (PAN/GST), and preferred vendor list." icon={Users} />,

  // Compliance
  'legal-compliance': <PlaceholderPage title="Legal & Regulatory Compliance" description="Compliance calendar, license renewal reminders, and document repository for all statutory requirements." icon={Shield} />,
  'board-resolutions': <PlaceholderPage title="Board Resolutions & MCA Filings" description="AGM/EGM minutes, director management, MCA form filing (AOC-4, MGT-7), and statutory registers." icon={Landmark} />,
  'safety-quality': <PlaceholderPage title="Safety & Quality Compliance" description="Safety inspections, incident reporting, PPE tracking, and NCR management." icon={Activity} />,

  // Analytics
  'executive-dashboard': <PlaceholderPage title="Executive Dashboard" description="Real-time KPIs — revenue vs target, outstanding receivables, project profitability heatmap, and alerts." icon={BarChart3} />,
  'project-analytics': <PlaceholderPage title="Project Analytics" description="Progress vs timeline, cost overrun analysis, material trends, and change order impact." icon={TrendingUp} />,
  'financial-analytics': <FinancialAnalytics />,
  'hr-analytics': <PlaceholderPage title="HR Analytics" description="Headcount trends, attrition rates, payroll cost analysis, and compliance status dashboard." icon={Users} />,
  'custom-reports': <PlaceholderPage title="Custom Report Builder" description="Drag-and-drop report designer with filters, chart types, scheduled generation, and email distribution." icon={FileBarChart} />,
};

function AppContent() {
  const { activeModule, sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#eef2f0] text-slate-800">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64 ml-0' : 'ml-0 md:ml-16'}`}>
        <Header />
        <main className="pt-24 pb-12 px-4 md:px-8 min-h-screen w-full box-border">
          <div key={activeModule} className="animate-fade-in max-w-7xl mx-auto">
            {pageMap[activeModule] || <Dashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
