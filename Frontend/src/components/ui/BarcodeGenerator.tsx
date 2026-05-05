import React, { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

interface BarcodeGeneratorProps {
  value: string;
  className?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ value, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        bwipjs.toCanvas(canvasRef.current, {
          bcid: 'code128',       // Barcode type
          text: value,            // Text to encode
          scale: 3,               // 3x scaling factor
          height: 10,             // Bar height, in millimeters
          includetext: true,      // Show human-readable text
          textxalign: 'center',   // Always good to set this
        });
      } catch (e) {
        console.error('Barcode generation error:', e);
      }
    }
  }, [value]);

  return (
    <div className={`flex flex-col items-center bg-white p-2 rounded shadow-sm ${className}`}>
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
};

export default BarcodeGenerator;
