import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

// Pages
import Dashboard from './pages/Dashboard';
import ProjectMaster from './pages/projects/ProjectMaster';
import WorkOrders from './pages/projects/WorkOrders';
import BOQ from './pages/projects/BOQ';
import ChartOfAccounts from './pages/finance/ChartOfAccounts';
import Invoicing from './pages/finance/Invoicing';
import AccountsPayable from './pages/finance/AccountsPayable';
import AccountsReceivable from './pages/finance/AccountsReceivable';
import TDSManagement from './pages/finance/TDSManagement';
import BankReconciliation from './pages/finance/BankReconciliation';
import JobCosting from './pages/finance/JobCosting';
import SiteManagement from './pages/projects/SiteManagement';
import ProgressTracking from './pages/projects/ProgressTracking';
import PlaceholderPage from './pages/PlaceholderPage';
import Vouchers from './pages/finance/Vouchers';
import InvoiceDetail from './pages/finance/InvoiceDetail';
import VoucherDetail from './pages/finance/VoucherDetail';
import GSTManagement from './pages/finance/GSTManagement';
import MaterialReconciliation from './pages/operations/MaterialReconciliation';
import Procurement from './pages/operations/Procurement';
import InventoryStore from './pages/operations/InventoryStore';
import EquipmentAssets from './pages/operations/EquipmentAssets';
import Subcontractors from './pages/operations/Subcontractors';
import EmployeeMaster from './pages/hr/EmployeeMaster';
import Attendance from './pages/hr/Attendance';
import LeaveManagement from './pages/hr/LeaveManagement';
import Payroll from './pages/hr/Payroll';
import StatutoryCompliance from './pages/hr/StatutoryCompliance';
import Reimbursements from './pages/hr/Reimbursements';
import EmployeeDetails from './pages/hr/EmployeeDetails';
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
  'work-orders': <WorkOrders />,
  'boq': <BOQ />,
  'site-management': <SiteManagement />,
  'progress-tracking': <ProgressTracking />,

  // Finance
  'chart-of-accounts': <ChartOfAccounts />,
  'vouchers': <Vouchers />,
  'invoicing': <Invoicing />,
  'accounts-payable': <AccountsPayable />,
  'accounts-receivable': <AccountsReceivable />,
  'gst-management': <GSTManagement />,
  'tds-management': <TDSManagement />,
  'bank-reconciliation': <BankReconciliation />,
  'job-costing': <JobCosting />,
  'invoice-detail': <InvoiceDetail />,
  'voucher-detail': <VoucherDetail />,

  // Operations
  'procurement': <Procurement />,
  'inventory': <InventoryStore />,
  'material-reconciliation': <MaterialReconciliation />,
  'equipment': <EquipmentAssets />,
  'subcontractors': <Subcontractors />,

  // HR
  'employee-master': <EmployeeMaster />,
  'attendance': <Attendance />,
  'leave-management': <LeaveManagement />,
  'payroll': <Payroll />,
  'statutory-compliance': <StatutoryCompliance />,
  'reimbursements': <Reimbursements />,
  'employee-details': <EmployeeDetails />,

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

import Login from './pages/Login';

function AppContent() {
  const { activeModule, sidebarOpen, isLoggedIn, userRole } = useApp();

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#eef2f0] text-slate-800 print:bg-white print:p-0">
      <div className="print:hidden">
        <Sidebar role={userRole} />
      </div>
      <div className={`transition-all duration-300 print:ml-0 print:pt-0 ${sidebarOpen ? 'md:ml-64 ml-0' : 'ml-0 md:ml-16'}`}>
        <div className="print:hidden">
          <Header />
        </div>
        <main className="pt-24 pb-12 px-4 md:px-8 min-h-screen w-full box-border print:pt-0 print:pb-0 print:px-0">
          <div key={activeModule} className="animate-fade-in max-w-7xl mx-auto print:max-w-none">
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
      <Toaster position="top-right" reverseOrder={false} />
      <AppContent />
    </AppProvider>
  );
}
