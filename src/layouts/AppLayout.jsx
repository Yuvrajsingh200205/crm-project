import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { getPageComponent } from '../constants/navigation';
import { useApp } from '../hooks/useApp';

export default function AppLayout() {
    const { activeModule, sidebarOpen, userRole } = useApp();

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
                        {getPageComponent(activeModule)}
                    </div>
                </main>
            </div>
        </div>
    );
}
