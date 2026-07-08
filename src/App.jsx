import { AppProvider } from './context/AppContext';
import { useApp } from './hooks/useApp';
import { Toaster } from 'react-hot-toast';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';

function AppContent() {
  const { isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return <Login />;
  }

  return <AppLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppContent />
    </AppProvider>
  );
}
