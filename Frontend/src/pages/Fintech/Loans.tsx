import { useState } from 'react';
import { ShieldCheck, IndianRupee, TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button, Card, PageHeader, Badge, StatCard, InputField, SelectField } from '@/components/ui';
import * as api from '@/services/api';

export default function Loans() {
  const { analytics, showToast } = useStore();
  const [step, setStep] = useState(1); // 1: Eligibility, 2: Application, 3: Success
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    tenure: '12',
    purpose: 'Business Expansion'
  });

  const isEligible = analytics.pl.totalSales > 100000;
  const maxLoanAmount = Math.floor(analytics.pl.totalSales * 0.3);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.applyForLoan({
        amount: Number(formData.amount),
        tenure: Number(formData.tenure),
        purpose: formData.purpose
      });
      if (res.success) {
        showToast('Loan application submitted!', 'success');
        setStep(3);
      }
    } catch {
      showToast('Submission failed. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader title="Business Loans (beta)" subtitle="Digital history par instant loan application." icon={<ShieldCheck size={20} className="text-blue-600" />} />

      {step === 1 && (
        <Card className="p-8 border-l-4 border-l-blue-600">
           <h3 className="text-xl font-bold">Eligibility Check</h3>
           {isEligible ? (
             <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase">Pre-Approved Limit</p>
                <p className="text-4xl font-black text-slate-900 mt-1">₹{maxLoanAmount.toLocaleString()}</p>
                <Button onClick={() => setStep(2)} className="mt-6 w-full" icon={<ArrowRight size={18} />}>Abhi Apply Karein</Button>
             </div>
           ) : (
             <p className="mt-4 text-slate-500">₹1,00,000+ ki sales record par loan eligibility milti hai.</p>
           )}
        </Card>
      )}

      {step === 2 && (
        <Card className="p-8 max-w-xl mx-auto">
           <h3 className="text-xl font-bold mb-6">Confirm Loan Details</h3>
           <div className="space-y-4">
              <InputField label="Amount (₹)" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder={`Max: ₹${maxLoanAmount}`} />
              <SelectField label="Tenure (Months)" value={formData.tenure} onChange={e => setFormData({...formData, tenure: e.target.value})} options={[{value:'6',label:'6 Months'},{value:'12',label:'12 Months'},{value:'24',label:'24 Months'}]} />
              <InputField label="Purpose" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
              
              <Button onClick={handleSubmit} className="w-full h-14 bg-blue-600" loading={submitting}>Confirm & Apply</Button>
           </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-12 text-center max-w-xl mx-auto">
           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
           <h3 className="text-2xl font-black">Submitted!</h3>
           <p className="text-slate-500 mt-2">Agli update 24-48 ghanton mein SMS/App par milegi.</p>
           <Button variant="secondary" onClick={() => setStep(1)} className="mt-8">Close</Button>
        </Card>
      )}
    </div>
  );
}
