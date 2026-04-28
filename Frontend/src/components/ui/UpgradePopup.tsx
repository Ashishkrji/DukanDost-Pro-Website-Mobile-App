import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Lock, Star, Crown } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface UpgradePopupProps {
  isOpen: boolean;
  onClose: () => void;
  planNeeded: 'Pro' | 'Business';
  featureName?: string;
}

export function UpgradePopup({ isOpen, onClose, planNeeded, featureName }: UpgradePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header / Banner */}
            <div className={`h-24 flex items-center justify-center relative ${planNeeded === 'Business' ? 'bg-[#0A0B1A]' : 'bg-[#FF6B00]'}`}>
              <div className="absolute top-4 right-4">
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl translate-y-8">
                {planNeeded === 'Business' ? <Crown className="text-primary" size={32} /> : <Star className="text-primary fill-primary" size={32} />}
              </div>
            </div>

            <div className="p-10 pt-14 text-center">
              <h3 className="font-display text-2xl font-black text-slate-900 mb-3">
                Upgrade Your Plan
              </h3>
              <p className="text-slate-500 font-medium mb-8">
                Unlock {featureName ? <span className="text-primary font-bold">{featureName}</span> : 'premium tools'} like GST Billing, Inventory Management, WhatsApp Reminders, Advanced Reports, and more.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={14} />
                  </div>
                  Unlimited Customers & Advanced Growth Tools
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-primary flex-shrink-0">
                    <Check size={14} />
                  </div>
                  GST Compliance & Multi-Shop Management
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/subscription" onClick={onClose}>
                  <Button className="w-full h-14 font-black uppercase tracking-widest text-[11px] rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-xl shadow-orange-100">
                    Upgrade to Pro
                  </Button>
                </Link>
                <Link to="/subscription" onClick={onClose}>
                  <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-[11px] rounded-2xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                    Get Business Plan
                  </Button>
                </Link>
              </div>
              
              <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Cancel anytime • Secure payments by Razorpay
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
