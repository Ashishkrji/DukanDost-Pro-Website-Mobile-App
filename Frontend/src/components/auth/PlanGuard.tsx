import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button, Card } from '@/components/ui';
import { Shield, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlanGuardProps {
  feature: string;
  requiredPlan: 'Pro' | 'Business';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PlanGuard: React.FC<PlanGuardProps> = ({ 
  feature, 
  requiredPlan, 
  children, 
  fallback 
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const userPlan = user?.plan || 'Starter';
  
  const hasAccess = () => {
    if (requiredPlan === 'Pro') {
      return userPlan === 'Pro' || userPlan === 'Business';
    }
    if (requiredPlan === 'Business') {
      return userPlan === 'Business';
    }
    return true;
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
      <div className="w-20 h-20 bg-orange-100 text-[#FF6B00] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/10">
        <Lock size={32} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Unlock {feature}</h3>
      <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium mb-8">
        This premium feature is only available on our <span className="font-bold text-orange-600">{requiredPlan}</span> plan. 
        Upgrade today to supercharge your business!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="primary" 
          size="lg" 
          className="px-8"
          onClick={() => navigate('/subscription')}
          icon={<Sparkles size={18} />}
        >
          View Plans & Upgrade
        </Button>
        <Button 
          variant="secondary" 
          size="lg"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </Card>
  );
};
