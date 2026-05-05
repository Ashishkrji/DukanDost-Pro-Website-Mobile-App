import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateUPILink } from '@/lib/upi';

interface UPIPaymentQRProps {
  upiId: string;
  name: string;
  amount: number;
  note?: string;
  className?: string;
}

const UPIPaymentQR: React.FC<UPIPaymentQRProps> = ({ upiId, name, amount, note, className }) => {
  const upiLink = generateUPILink(upiId, name, amount, note);

  return (
    <div className={`flex flex-col items-center p-4 bg-white rounded-xl shadow-lg border border-slate-100 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Scan to Pay</h3>
      
      <div className="p-2 bg-slate-50 rounded-lg mb-4">
        <QRCodeSVG 
          value={upiLink} 
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-medium">Paying To</p>
        <p className="text-lg font-bold text-slate-900 leading-tight">{name}</p>
        <p className="text-sm text-slate-500 font-mono mt-1">{upiId}</p>
      </div>

      <div className="mt-4 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full">
        <p className="text-orange-700 font-bold text-xl">₹{amount.toLocaleString('en-IN')}</p>
      </div>

      <p className="text-[10px] text-slate-400 mt-6 uppercase font-bold tracking-widest">Powered by DukanDost Pro</p>
    </div>
  );
};

export default UPIPaymentQR;
