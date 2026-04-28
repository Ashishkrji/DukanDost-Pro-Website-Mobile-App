import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/store/useStore';
import { Button, Badge } from '@/components/ui';
import { Sparkles, Calendar, CreditCard, ChevronRight, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function PlanInfoBar() {
  const { user, subscriptionDetails } = useAuthStore();
  const { openUpgradePopup } = useStore();

  if (!user) return null;

  const isStarter = user.plan === 'Starter';
  const isBusiness = user.plan === 'Business';

  return (
    <div className={cn(
      "h-12 flex items-center px-6 gap-6 text-[11px] font-bold uppercase tracking-wider transition-all border-b shrink-0",
      isStarter ? "bg-slate-50 border-slate-100 text-slate-500" : 
      isBusiness ? "bg-[#0A0B1A] border-slate-800 text-white" : 
      "bg-orange-50 border-orange-100 text-orange-700"
    )}>
      {/* Plan Name */}
      <div className="flex items-center gap-2">
        <span className="opacity-60">Plan:</span>
        <Badge status={isStarter ? 'info' : isBusiness ? 'success' : 'warning'} className="text-[10px] py-0.5">
          {user.plan}
        </Badge>
      </div>

      {!isStarter && subscriptionDetails && (
        <>
          <div className="h-4 w-px bg-current opacity-10 hidden sm:block" />
          
          {/* Billing Cycle */}
          <div className="hidden sm:flex items-center gap-2">
            <CreditCard size={14} className="opacity-60" />
            <span className="opacity-60">Cycle:</span>
            <span>{subscriptionDetails.billingType}</span>
          </div>

          <div className="h-4 w-px bg-current opacity-10 hidden md:block" />

          {/* Renewal Date */}
          <div className="hidden md:flex items-center gap-2">
            <Calendar size={14} className="opacity-60" />
            <span className="opacity-60">Next Bill:</span>
            <span>{new Date(subscriptionDetails.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          {subscriptionDetails.cancelAtPeriodEnd && (
            <div className="flex items-center gap-2 text-red-500 animate-pulse">
              <AlertCircle size={14} />
              <span>Expires Soon</span>
            </div>
          )}
        </>
      )}

      {isStarter && (
        <div className="flex-1 flex items-center gap-2 text-[#FF6B00]">
          <Sparkles size={14} className="animate-pulse" />
          <span className="hidden sm:inline">Upgrade now to unlock 100+ premium features!</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isStarter ? (
          <Button 
            size="xs" 
            onClick={() => openUpgradePopup('Pro', 'All Premium Features')}
            className="bg-[#FF6B00] hover:bg-orange-600 text-white border-none h-8 px-4 font-bold rounded-lg"
          >
            Upgrade to Pro
          </Button>
        ) : (
          <Link to="/subscription">
            <Button 
              size="xs" 
              variant="secondary"
              className="h-8 px-4 flex items-center gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold rounded-lg"
            >
              Manage <ExternalLink size={12} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
