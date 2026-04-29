import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, ChevronDown, Wifi, User, Settings, CreditCard, LogOut, Mail, Check, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/authStore';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Toast, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': '🏠 Dashboard',
  '/khata': '📒 Digital Khata',
  '/invoices': '📄 Invoices & Billing',
  '/inventory': '📦 Inventory',
  '/payments': '💳 Payments & QR',
  '/reports': '📊 Reports',
  '/staff': '👥 Staff',
  '/ai': '🤖 AI Intelligence',
  '/store': '🛍️ Online Store',
  '/vouchers': '🎟️ Vouchers',
  '/community': '💬 Community',
  '/subscription': '⭐ Subscription',
  '/settings': '⚙️ Settings',
};

export default function Header() {
  const { 
    setSidebarOpen, toastMessage, toastType, hideToast, notifications, 
    markNotificationAsRead, markAllNotificationsAsRead, fetchNotifications,
    shops, currentShopId, setCurrentShop, fetchShops
  } = useStore();
  const { user: authUser, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  const currentShop = shops.find((s: any) => s._id === currentShopId) || shops[0] || { name: 'Main Shop' };

  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'Dashboard';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (shopRef.current && !shopRef.current.contains(event.target as Node)) {
        setShowShopMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    fetchNotifications();
    fetchShops();
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 md:top-12 right-0 left-0 md:left-64 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-30 flex items-center px-4 md:px-6 gap-3 shadow-sm">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Page Title & Date */}
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-[15px] font-bold text-slate-900 hidden sm:block">
            {pageTitle}
          </h2>
          <p className="text-[11px] text-slate-500 hidden sm:block">{today}</p>
        </div>

        {/* Shop Switcher */}
        <div className="relative hidden md:block" ref={shopRef}>
          <div 
            onClick={() => setShowShopMenu(!showShopMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-bold text-slate-700">{currentShop.name}</span>
            <ChevronDown className={cn("text-slate-400 transition-transform duration-200", showShopMenu && "rotate-180")} size={12} />
          </div>

          {showShopMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-3 bg-slate-50 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Shop</p>
              </div>
              <div className="p-1">
                {shops.length > 0 ? shops.map((shop: any) => (
                  <button
                    key={shop._id}
                    onClick={() => {
                      setCurrentShop(shop._id);
                      setShowShopMenu(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors",
                      currentShopId === shop._id || (!currentShopId && shop === shops[0])
                        ? "bg-orange-50 text-[#FF6B00] font-bold"
                        : "text-slate-600 hover:bg-slate-50 font-medium"
                    )}
                  >
                    {shop.name}
                    {(currentShopId === shop._id || (!currentShopId && shop === shops[0])) && <Check size={12} />}
                  </button>
                )) : (
                  <div className="p-3 text-center text-[10px] text-slate-400">
                    Main Shop
                  </div>
                )}
              </div>
              {authUser?.plan === 'Business' && (
                <div className="p-2 border-t border-slate-100">
                  <button className="w-full py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    + Add New Branch
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upgrade Prompt */}
        {authUser?.plan === 'Starter' && (
          <Link to="/subscription">
            <Button 
              size="sm" 
              className="hidden lg:flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E56000] text-white border-none shadow-lg shadow-orange-100"
            >
              <Star size={14} className="fill-white" />
              <span className="font-bold text-[11px] uppercase tracking-wider">Upgrade to Pro</span>
            </Button>
          </Link>
        )}

        {/* Search */}
        <div className="relative hidden lg:flex items-center">
          <Search size={16} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:border-orange-300 focus:bg-white transition-all w-48"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <Badge status="info" className="text-[10px]">{unreadCount} New</Badge>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={cn(
                        "p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50",
                        !notif.read && "bg-orange-50/30"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        )}>
                          {notif.type === 'success' ? <Check size={14} /> : <Mail size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{notif.title}</p>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell size={32} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No new notifications</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                <button 
                  onClick={() => markAllNotificationsAsRead()}
                  className="text-xs font-bold text-[#FF6B00] hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 px-2 py-1 rounded-xl transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
              {(authUser?.fullName || 'DD').substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{authUser?.fullName?.split(' ')[0] || 'User'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium flex items-center gap-1">
                <User size={10} className="text-orange-500" /> Profil Edit
              </p>
            </div>
            <ChevronDown className={cn("text-slate-400 hidden md:block transition-transform duration-200", showProfileMenu && "rotate-180")} size={14} />
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                <p className="text-sm font-bold text-slate-900 truncate">{authUser?.email}</p>
              </div>
              <div className="p-2">
                <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-[#FF6B00] rounded-xl transition-colors group">
                  <User size={18} className="text-slate-400 group-hover:text-[#FF6B00]" />
                  <span className="font-medium">My Profile</span>
                </Link>
                <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-[#FF6B00] rounded-xl transition-colors group">
                  <Settings size={18} className="text-slate-400 group-hover:text-[#FF6B00]" />
                  <span className="font-medium">Settings</span>
                </Link>
                <Link to="/subscription" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-[#FF6B00] rounded-xl transition-colors group">
                  <CreditCard size={18} className="text-slate-400 group-hover:text-[#FF6B00]" />
                  <span className="font-medium">Subscription</span>
                </Link>
                <div className="h-px bg-slate-100 my-2 mx-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={hideToast} />
      )}
    </>
  );
}
