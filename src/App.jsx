import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AppLayout from './layouts/AppLayout';
import Login from './modules/auth/pages/Login';
import { AppProvider } from './context/AppContext';

function AppContent() {
  const { isLoggedIn } = useSelector((state) => state.auth);

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
