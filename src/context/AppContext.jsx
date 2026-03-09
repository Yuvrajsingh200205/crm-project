import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
    const [activeModule, setActiveModule] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'warning', message: 'Material shortage on SWPL-BRGF project', time: '5m ago', read: false },
        { id: 2, type: 'info', message: 'RA-05 bill approved by Finance Manager', time: '1h ago', read: false },
        { id: 3, type: 'success', message: 'Payroll processed for February 2026', time: '2h ago', read: false },
        { id: 4, type: 'warning', message: 'GST return due in 3 days', time: '3h ago', read: true },
        { id: 5, type: 'error', message: 'TDS variance >5% on Bill Code 60', time: '1d ago', read: true },
    ]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <AppContext.Provider value={{
            activeModule, setActiveModule,
            sidebarOpen, setSidebarOpen,
            notifications, markAllRead,
        }}>
            {children}
        </AppContext.Provider>
    );
}
