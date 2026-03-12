import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../pages/DashboardLayout';

export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}
