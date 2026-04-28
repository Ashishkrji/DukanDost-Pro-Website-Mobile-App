import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import {
  LayoutDashboard, BookOpen, ReceiptText, Package, QrCode,
  Users, Sparkles, ShoppingBag, MessageSquare, Settings,
  LogOut, PlusCircle, Gift, Star, BarChart3, X, Store,
  ChevronRight, Bell, Lock, Shield
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useStore();
  const { user: authUser, logout } = useAuthStore();
  const { t } = useLanguageStore();

  const navSections = [
    {
      label: 'MAIN',
      items: [
        { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard, badge: null },
        { name: t('khata'), href: '/khata', icon: BookOpen, badge: null },
        { name: t('invoices'), href: '/invoices', icon: ReceiptText, badge: null },
        { name: t('inventory'), href: '/inventory', icon: Package, badge: null },
      ]
    },
    {
      label: 'PAYMENTS',
      items: [
        { name: t('payments'), href: '/payments', icon: QrCode, badge: null },
        { name: t('reports'), href: '/reports', icon: BarChart3, badge: null },
      ]
    },
    {
      label: 'BUSINESS',
      items: [
        { name: t('staff'), href: '/staff', icon: Users, badge: null },
        { name: t('ai'), href: '/ai', icon: Sparkles, badge: null },
        { name: t('store'), href: '/store', icon: ShoppingBag, badge: null },
        { name: 'WhatsApp Reminders', href: '/reminders', icon: Bell, badge: 'PREMIUM' },
        { name: t('vouchers'), href: '/vouchers', icon: Gift, badge: null },
        { name: t('community'), href: '/community', icon: MessageSquare, badge: null },
      ]
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: t('subscription'), href: '/subscription', icon: Star, badge: null },
        { name: t('settings'), href: '/settings', icon: Settings, badge: null },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-[#1A1A2E] flex flex-col z-50 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo / Brand */}
        <div className="px-4 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center shadow-lg">
              <Store size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-[15px] font-bold text-white leading-none tracking-tight">
                DukanDost Pro
              </h1>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">
                Digital Dukaan
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile Strip */}
        <div className="mx-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white font-bold text-sm">
              {(authUser?.fullName || 'DD').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{authUser?.fullName || 'User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{authUser?.businessName || 'Business'}</p>
            </div>
            <Bell size={16} className="text-slate-500 shrink-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5 custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] mb-2 px-2">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  
                  const userPlan = authUser?.plan || 'Starter';
                  const isProFeature = ['/inventory', '/staff', '/reports', '/vouchers'].some(p => item.href.startsWith(p));
                  const isBusinessFeature = ['/ai', '/store', '/reminders'].some(p => item.href.startsWith(p));
                  
                  const isLocked = (isProFeature && userPlan === 'Starter') || 
                                   (isBusinessFeature && (userPlan === 'Starter' || userPlan === 'Pro'));

                  const planNeeded = isBusinessFeature ? 'Business' : 'Pro';

                  const handleClick = (e: React.MouseEvent) => {
                    if (isLocked) {
                      e.preventDefault();
                      useStore.getState().openUpgradePopup(planNeeded, item.name);
                    } else {
                      setSidebarOpen(false);
                    }
                  };

                  return (
                    <Link
                      key={item.name}
                      to={isLocked ? '#' : item.href}
                      onClick={handleClick}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                        isActive
                          ? 'bg-[#FF6B00] text-white shadow-[0_4px_12px_rgba(255,107,0,0.35)]'
                          : 'text-slate-400 hover:bg-white/8 hover:text-white'
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                        )}
                      />
                      <span className="flex-1 truncate">{item.name}</span>
                      {isLocked ? (
                        <Lock size={12} className="text-slate-600" />
                      ) : item.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badge.includes('!')
                              ? 'bg-red-500 text-white'
                              : item.badge === 'NEW'
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-slate-300'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link to="/invoices/new" onClick={() => setSidebarOpen(false)}>
            <button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_4px_12px_rgba(255,107,0,0.35)] hover:shadow-[0_6px_16px_rgba(255,107,0,0.45)] transition-shadow active:scale-95">
              <PlusCircle size={16} />
              {t('createBill')}
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 text-sm hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={16} />
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
