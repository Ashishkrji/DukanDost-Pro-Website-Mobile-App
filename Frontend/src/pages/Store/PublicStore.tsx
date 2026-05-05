import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, Search, Plus, Minus, MessageCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Card, Badge, SearchInput } from '@/components/ui';
import * as api from '@/services/api';

export default function PublicStore() {
  const { shopId } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await api.getPublicCatalog(shopId!);
        if (res.shop) {
          setShop(res.shop);
          setProducts(res.products);
        } else {
          // Fallback for demo
          setShop({ name: 'DukanDost Pro Demo Shop', address: 'Main Market, City', phone: '9876543210' });
          const prodRes = await api.getProducts();
          if (prodRes.success) setProducts(prodRes.products);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchStoreData();
  }, [shopId]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    const existing = cart.find(item => item._id === id);
    if (existing?.qty === 1) {
      setCart(cart.filter(item => item._id !== id));
    } else {
      setCart(cart.map(item => item._id === id ? { ...item, qty: item.qty - 1 } : item));
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalAmount = totalAmount - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon({
        code: couponCode,
        orderValue: totalAmount,
        shopId: shopId!
      });
      setAppliedCoupon(res);
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const orderItems = cart.map(item => `${item.name} (x${item.qty}) - ₹${item.price * item.qty}`).join('\n');
    const msg = `Namaste! I want to order from your shop:\n\n${orderItems}\n\n*Total: ₹${totalAmount}*\n${appliedCoupon ? `*Discount: ₹${discountAmount}*\n*Final: ₹${finalAmount}*` : ''}`;
    window.open(`https://wa.me/${shop?.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleOnlinePayment = async () => {
    setPaymentLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      setPaymentLoading(false);
      return;
    }

    try {
      const orderData = await api.createPublicOrder({ 
        amount: finalAmount, 
        receipt: `receipt_${Date.now()}` 
      });

      if (!orderData.success) throw new Error('Order creation failed');

      const options = {
        key: 'rzp_test_SjHRe4H6PaME7v', // Use environment variable in production
        amount: orderData.order.amount,
        currency: "INR",
        name: shop?.name || "DukanDost Merchant",
        description: "Online Order Payment",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          const verifyData = await api.verifyPublicPayment({
            ...response,
            invoiceId: null // In a real flow, you'd create an invoice/order record first
          });

          if (verifyData.success) {
             alert('Payment Successful! Your order has been placed.');
             setCart([]);
          } else {
             alert('Payment verification failed.');
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#FF6B00",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert('Could not initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><ShoppingBag className="animate-bounce text-orange-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black">D</div>
               <h1 className="font-black text-slate-900 tracking-tight">{shop?.name}</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-widest border border-green-100">
                  <ShieldCheck size={12} /> Secure Checkout
               </div>
               <div className="relative">
                  <ShoppingCart className="text-slate-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                       {totalItems}
                    </span>
                  )}
               </div>
            </div>
         </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
         <div className="mb-8">
            <SearchInput 
               value={searchTerm} 
               onChange={setSearchTerm} 
               placeholder="Mithai, Sabzi, ya koi bhi product..." 
               className="w-full h-14 text-lg shadow-sm border-none"
            />
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
               <Card key={product._id} className="p-3 flex flex-col hover:shadow-lg transition-shadow border-none group relative overflow-hidden">
                  <div className="aspect-square bg-slate-100 rounded-xl mb-3 flex items-center justify-center text-slate-300 relative overflow-hidden">
                     <ShoppingBag size={40} className="group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black shadow-sm">₹{product.price}</Badge>
                     </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-[10px] text-slate-400 mb-3">{product.category}</p>
                  
                  <div className="mt-auto">
                     {cart.find(item => item._id === product._id) ? (
                        <div className="flex items-center justify-between bg-orange-50 rounded-lg p-1">
                           <button onClick={() => removeFromCart(product._id)} className="w-8 h-8 flex items-center justify-center text-orange-600 hover:bg-white rounded-md transition-colors">
                              <Minus size={16} />
                           </button>
                           <span className="font-black text-orange-600">{cart.find(item => item._id === product._id).qty}</span>
                           <button onClick={() => addToCart(product)} className="w-8 h-8 flex items-center justify-center text-orange-600 hover:bg-white rounded-md transition-colors">
                              <Plus size={16} />
                           </button>
                        </div>
                     ) : (
                        <Button onClick={() => addToCart(product)} size="sm" className="w-full bg-slate-900 hover:bg-orange-600 group">
                           Add <Plus size={14} className="ml-1 group-hover:rotate-90 transition-transform" />
                        </Button>
                     )}
                  </div>
               </Card>
            ))}
         </div>
      </main>

      {/* Floating Checkout */}
      {cart.length > 0 && (
         <div className="fixed bottom-6 left-4 right-4 z-40 animate-[slideUp_0.3s_ease] max-w-lg mx-auto">
            <Card className="p-4 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] border-none rounded-3xl">
               <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payable Amount</p>
                     <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black text-slate-900">₹{finalAmount}</p>
                        {discountAmount > 0 && (
                          <p className="text-xs text-slate-400 line-through">₹{totalAmount}</p>
                        )}
                     </div>
                  </div>
                  <div className="text-right">
                     <Badge className="bg-green-100 text-green-700 border-none mb-1">{totalItems} Items</Badge>
                     {appliedCoupon && (
                        <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                           Code: {appliedCoupon.code} applied
                        </p>
                     )}
                  </div>
               </div>

               {/* Coupon Section */}
               <div className="mb-4 px-2">
                  <div className="flex gap-2">
                     <input 
                        type="text" 
                        placeholder="Apply Coupon (e.g. SAVE10)" 
                        className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 transition-all uppercase"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                     />
                     <Button 
                        size="sm" 
                        onClick={handleApplyCoupon} 
                        disabled={couponLoading || !couponCode}
                        className="bg-slate-900 rounded-xl"
                     >
                        {couponLoading ? '...' : 'Apply'}
                     </Button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 mt-1 font-bold ml-1">{couponError}</p>}
               </div>
               
               <div className="flex gap-3">
                  <button 
                     onClick={handleWhatsAppOrder}
                     className="flex-[2] bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-95 shadow-lg"
                  >
                     <MessageCircle size={20} /> Order on WhatsApp
                  </button>
                  <button 
                     onClick={handleOnlinePayment}
                     disabled={paymentLoading}
                     className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-95 shadow-lg disabled:opacity-50"
                  >
                     {paymentLoading ? '...' : <CreditCard size={20} />} Pay
                  </button>
               </div>
            </Card>
         </div>
      )}
    </div>
  );
}
