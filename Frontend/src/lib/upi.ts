/**
 * Generates a standard UPI deep link for payment collection
 * Format: upi://pay?pa=address&pn=name&am=amount&cu=currency&tn=note
 */
export const generateUPILink = (pa: string, pn: string, am: number, tn: string = 'Payment to DukanDost') => {
  const params = new URLSearchParams({
    pa, // VPA (UPI ID)
    pn, // Payee Name
    am: am.toFixed(2), // Amount
    cu: 'INR',
    tn, // Transaction Note
  });
  return `upi://pay?${params.toString()}`;
};
