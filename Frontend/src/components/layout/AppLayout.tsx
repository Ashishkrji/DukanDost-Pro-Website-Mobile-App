import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useStore } from '../../store/useStore';
import Sidebar from './Sidebar';
import Header from './Header';
import { PlanInfoBar } from './PlanInfoBar';
import { UpgradePopup } from '../auth/UpgradePopup';

import { useEffect } from 'react';

export default function AppLayout() {
  const { isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex bg-[#F0F2F8] min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <PlanInfoBar />
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 mt-16 md:mt-28">
          <Outlet />
        </main>
      </div>
      
      <UpgradePopup />
    </div>
  );
}
