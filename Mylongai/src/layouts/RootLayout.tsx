import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { SystemProvider } from '../contexts/SystemContext';
import { Toaster } from '../components/ui/sonner';
import { ConnectionAlert } from '../common/ConnectionAlert';

export function RootLayout() {
  return (
    <AuthProvider>
      <SystemProvider>
        <div className="min-h-screen">
          <Outlet />
          <ConnectionAlert />
          <Toaster position="top-right" richColors />
        </div>
      </SystemProvider>
    </AuthProvider>
  );
}
