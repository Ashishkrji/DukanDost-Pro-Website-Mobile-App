import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, CreditCard, BarChart3, MessageSquare, 
  Settings, LogOut, LayoutDashboard, Star, Sparkles, 
  Search, Filter, Download, Bell, HelpCircle, ChevronRight,
  TrendingUp, AlertCircle, Clock, CheckCircle2
} from 'lucide-react';
import { Card, Badge, Button, PageHeader } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cn } from '@/lib/utils';

// Import Section Components
import { 
  Overview, 
  UserManagement, 
  SubscriptionManagement, 
  PaymentManagement, 
  BusinessRequests, 
  AdminSettings,
  NotificationCenter
} from './sections';

const MENU_ITEMS = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'subscriptions', label: 'Subscription Plans', icon: Star },
  { id: 'payments', label: 'Payment Management', icon: CreditCard },
  { id: 'revenue', label: 'Revenue Analytics', icon: BarChart3 },
  { id: 'business', label: 'Business Requests', icon: Sparkles },
  { id: 'notifications', label: 'Notification Center', icon: Bell },
  { id: 'support', label: 'Support Tickets', icon: MessageSquare },
  { id: 'settings', label: 'Admin Settings', icon: Settings },
];

import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('admin_active_tab') || 'overview';
  });
  const { admin, isAdminAuthenticated, adminLogout } = useAdminAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('admin_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'users': return <UserManagement />;
      case 'subscriptions': return <SubscriptionManagement />;
      case 'payments': return <PaymentManagement />;
      case 'business': return <BusinessRequests />;
      case 'notifications': return <NotificationCenter />;
      case 'settings': return <AdminSettings />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* ── Admin Sidebar ── */}
      <aside className="w-72 bg-[#0A0B1A] flex flex-col shrink-0 border-r border-white/5">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center shadow-lg">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-none">Admin Panel</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">DukanDost Pro</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 py-6 space-y-1 custom-scrollbar">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                activeTab === item.id 
                  ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xs">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{admin?.fullName || 'Admin User'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{admin?.role === 'super_admin' ? 'Super Admin' : 'Platform Owner'}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            Logout System
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 text-slate-500">
            <span className="text-sm font-bold uppercase tracking-widest">{activeTab}</span>
            <ChevronRight size={14} />
            <span className="text-sm font-medium text-slate-400">Manage {activeTab.replace('-', ' ')} and system data</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">System Active</p>
                <p className="text-[10px] text-green-600 font-bold uppercase mt-1">Healthy</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Shield size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
