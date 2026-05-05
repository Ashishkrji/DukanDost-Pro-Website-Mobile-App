import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render((decodedText) => {
      onScan(decodedText);
      scannerRef.current?.clear();
      onClose();
    }, (error) => {
      // console.warn(error);
    });

    return () => {
      scannerRef.current?.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Scan Barcode / QR</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold text-slate-500">✕</button>
        </div>
        <div id="reader" className="w-full"></div>
        <div className="p-4 text-center">
          <p className="text-xs text-slate-500">Product ka barcode ya QR code camera ke saamne laayein</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
