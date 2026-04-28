import React from 'react';
import { useStore } from '@/store/useStore';
import { Modal, Button } from '@/components/ui';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpgradePopup = () => {
  const { upgradePopupOpen, closeUpgradePopup, upgradePlanNeeded, upgradeFeatureName } = useStore();
  const navigate = useNavigate();

  if (!upgradePopupOpen) return null;

  const handleUpgrade = () => {
    closeUpgradePopup();
    navigate('/subscription');
  };

  return (
    <Modal
      isOpen={upgradePopupOpen}
      onClose={closeUpgradePopup}
      title="Feature Locked"
      subtitle="Upgrade to Unlock"
      size="md"
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-orange-100 text-[#FF6B00] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        
        <h3 className="text-xl font-black text-slate-900 mb-2">
          {upgradeFeatureName ? `Unlock ${upgradeFeatureName}` : 'Unlock Premium Feature'}
        </h3>
        
        <p className="text-slate-500 text-sm font-medium mb-8">
          This feature is part of our <span className="font-bold text-[#FF6B00]">{upgradePlanNeeded}</span> plan. 
          Grow your business with professional tools.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <Check size={12} />
            </div>
            Unlimited {upgradeFeatureName || 'Feature Usage'}
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <Check size={12} />
            </div>
            Professional Business Reports
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <Check size={12} />
            </div>
            Priority Customer Support
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider" 
            onClick={handleUpgrade}
            iconRight={<ArrowRight size={16} />}
          >
            Upgrade to {upgradePlanNeeded}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-slate-500 font-bold"
            onClick={closeUpgradePopup}
          >
            Maybe Later
          </Button>
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={14} />
          Secure Razorpay Checkout
        </div>
      </div>
    </Modal>
  );
};
