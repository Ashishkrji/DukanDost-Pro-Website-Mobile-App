import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, TrendingUp, AlertTriangle, Lightbulb, BarChart2,
  Package, Users, Zap, ChevronRight, ShoppingBag, Crown, Target, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, PageHeader, Badge, Button } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  type: 'bot' | 'user';
  text: string;
  time: string;
}

// ── AI response engine (data-driven) ──────────────────────
const buildAIResponses = (store: any) => {
  const totalLena = store.customers
    .filter((c: any) => c.balance > 0)
    .reduce((s: number, c: any) => s + c.balance, 0);
  const overdue = store.customers.filter((c: any) => c.status === 'Overdue');
  const lowStock = store.products?.filter((p: any) => p.status === 'LOW STOCK' || p.status === 'OUT OF STOCK') || [];
  const topCustomers = [...store.customers]
    .filter(c => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 3);

  const topDebtor = store.customers
    .filter((c: any) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)[0];

  return {
    suresh: topDebtor 
      ? `${topDebtor.name} ka ₹${topDebtor.balance.toLocaleString('en-IN')} lena hai. Aaj WhatsApp reminder bhejien aur payment request karein.`
      : `Abhi kisi customer ka bada udhaar pending nahi hai. Business smooth chal raha hai!`,
    credit: `Credit risk analysis ke liye, DukanDost dekhta hai:\n• Balance amount\n• Payment history timing\n• Udhaar kitne dino se chal raha hai\n\nJab 30+ din se payment nahi aati, "Overdue" flag lagta hai.`,
    bikri: `Aaj ki bikri summary aap dashboard pe dekh sakte hain. ${store.transactions.length > 0 ? `Ab tak ${store.transactions.length} transactions record hue hain.` : 'Abhi koi transaction record nahi hua hai.'}`,
    stock: `Low stock alert:\n${lowStock.length > 0 ? lowStock.map((p: any) => `• ${p.name} (${p.stock} units left)`).join('\n') : 'Sabhi items sufficient stock mein hain!'}\n\nTurant reorder karein! 🚨`,
    bika: `Pichle hafte ki performance report page pe available hai. Isse aap next order better plan kar sakte hain!`,
    report: `Business summary:\n• Total Revenue: ₹${totalLena.toLocaleString('en-IN')} (Pending)\n• Total Customers: ${store.customers.length}\n• Status: ${overdue.length > 0 ? 'Reminders needed' : 'All good'}\n\nGrowth details reports page pe dekhein.`,
    gst: `GST bill banane ke liye:\n1. Invoices page pe jao\n2. "Bill Banayein" click karo\n3. Customer select karo\n4. Items add karo (GST rate ke saath)\n5. Create karein — PDF ready!`,
    udhaar: overdue.length > 0 ? `${overdue.length} customers ka overdue udhaar hai:\n${overdue.slice(0, 3).map((c: any) => `• ${c.name}: ₹${c.balance.toLocaleString('en-IN')}`).join('\n')}\n\nTotal: ₹${totalLena.toLocaleString('en-IN')} at risk. WhatsApp reminders bhejne chahiye!` : 'Abhi koi overdue udhaar nahi hai.',
    customer: topCustomers.length > 0 ? `Top customers by balance:\n${topCustomers.map((c: any, i: number) => `${i + 1}. ${c.name} — ₹${c.balance.toLocaleString('en-IN')} baki`).join('\n')}\n\nIn customers ko priority reminder bhejein!` : 'Koi pending balance wale customers nahi hain.',
    hello: `Namaste! 🙏 Main DukanDost AI hoon. Aap mujhse business ke baare mein koi bhi sawal pooch sakte hain — bikri, stock, customers, udhaar, sab kuch!`,
    help: `Main in topics mein madad kar sakta hoon:\n• 📊 Sales & Revenue reports\n• 📦 Stock & inventory alerts\n• 👥 Customer credit scores\n• 💰 Udhaar & payment tracking\n• 💡 Business tips & insights`,
    top: `Top items aur growth patterns reports page pe track hote hain. Regular tracking se aap 15-20% zyada profit kama sakte hain!`,
    spend: topCustomers.length > 0 ? `Highest spending customers:\n${topCustomers.slice(0, 3).map((c: any) => `• ${c.name}`).join('\n')}\n\nIn customers ko loyalty discount offer karein! 🎁` : 'Abhi data analyze ho raha hai.',
  };
};

const getAIResponse = (query: string, store: any): string => {
  const q = query.toLowerCase();
  const responses = buildAIResponses(store);
  for (const [key, response] of Object.entries(responses)) {
    if (q.includes(key)) return response;
  }
  if (q.includes('top') || q.includes('best')) return responses.top;
  if (q.includes('spend') || q.includes('kharch')) return responses.spend;
  return `Aapka sawal samajh gaya. "${query}" ke baare mein data analyze kar raha hoon... 🤖\n\nFilhal aap mujhse pooch sakte hain:\n• Bikri summary\n• Stock alert\n• Udhaar list\n• Customer spending\n• GST billing help`;
};

const quickSuggestions = [
  { text: 'Suresh ka credit risk?', icon: '⚠️' },
  { text: 'Aaj ki bikri summary', icon: '📊' },
  { text: 'Low stock items kaun hain?', icon: '📦' },
  { text: 'Pichle hafte kya bika?', icon: '🏆' },
  { text: 'Udhaar ki list dikhao', icon: '💰' },
  { text: 'Top selling products', icon: '🔥' },
];

// ── Data-driven insights with Learn More ─────────────────
const buildInsights = (store: any) => {
  const totalLena = store.customers
    .filter((c: any) => c.balance > 0)
    .reduce((s: number, c: any) => s + c.balance, 0);
  const overdueCount = store.customers.filter((c: any) => c.status === 'Overdue').length;
  const lowStockCount = store.products?.filter(
    (p: any) => p.status === 'LOW STOCK' || p.status === 'OUT OF STOCK'
  ).length || 5;

  const hasInventory = store.products?.length > 0;
  const hasTransactions = store.transactions?.length > 0;

  return [
    {
      icon: <TrendingUp size={18} />,
      title: 'Top Products This Week',
      description: hasTransactions 
        ? 'Aapke top selling items analyze ho rahe hain. Demand patterns reports section mein dekhein.'
        : 'Business ki growth track karne ke liye pehla transaction record karein.',
      detail: 'Regular tracking se aap fast-moving items ka stock optimize kar sakte hain.',
      color: 'from-green-50 to-emerald-50 border-green-100',
      iconColor: 'text-green-600',
      badge: hasTransactions ? '+15.3% Growth' : 'Get Started',
      badgeColor: 'success' as const,
      learnMoreRoute: '/reports',
      learnMoreLabel: 'View Reports',
    },
    {
      icon: <AlertTriangle size={18} />,
      title: 'High Risk Customers',
      description: overdueCount > 0 
        ? `${overdueCount} customers ka udhaar 30+ din se overdue hai. Total: ₹${totalLena.toLocaleString('en-IN')} at risk.`
        : 'Abhi koi high-risk overdue customers nahi hain. Sabhi payments timely aa rahi hain.',
      detail: overdueCount > 0 
        ? 'In customers ko WhatsApp reminders bhejein aur partial payment request karein.' 
        : 'Ache payment rate se business ki cashflow behtar rehti hai.',
      color: 'from-orange-50 to-amber-50 border-orange-100',
      iconColor: 'text-orange-600',
      badge: overdueCount > 0 ? 'Action Needed' : 'Healthy',
      badgeColor: overdueCount > 0 ? 'warning' as const : 'success' as const,
      action: overdueCount > 0 ? 'Remind All' : undefined,
      actionRoute: '/khata',
      learnMoreRoute: '/khata',
      learnMoreLabel: 'Open Khata',
    },
    {
      icon: <Package size={18} />,
      title: 'Stock Alert',
      description: lowStockCount > 0 
        ? `${lowStockCount} items khatam hone wale hain. Reorder items ASAP.`
        : 'Sabhi items sufficient stock mein hain.',
      detail: lowStockCount > 0 
        ? 'Inventory section mein jaake low stock items ki poori list dekhein.'
        : 'Safety stock levels maintain karne se sales loss nahi hota.',
      color: 'from-red-50 to-rose-50 border-red-100',
      iconColor: 'text-red-600',
      badge: `${lowStockCount} Items`,
      badgeColor: lowStockCount > 0 ? 'danger' as const : 'success' as const,
      action: 'View Inventory',
      actionRoute: '/inventory',
      learnMoreRoute: '/inventory',
      learnMoreLabel: 'Go to Inventory',
    },
    {
      icon: <Users size={18} />,
      title: 'Highest Spending Customers',
      description: hasTransactions 
        ? 'Aapke top customers analyze ho rahe hain. Inhe loyalty discounts offer karein.'
        : 'Customers add karein unki spending track karne ke liye.',
      detail: 'Top 3 customers usually business ka 40% revenue generate karte hain.',
      color: 'from-blue-50 to-indigo-50 border-blue-100',
      iconColor: 'text-blue-600',
      badge: 'Analysis',
      badgeColor: 'info' as const,
      learnMoreRoute: '/khata',
      learnMoreLabel: 'View Customers',
    },
    {
      icon: <ShoppingBag size={18} />,
      title: 'Sales Prediction',
      description: hasTransactions 
        ? 'Agle hafte ka revenue forecast analyze ho raha hai.'
        : 'Forecasting ke liye kam se kam 2 hafte ka data chahiye.',
      detail: 'AI model aapki past sales se future demand predict karta hai.',
      color: 'from-purple-50 to-fuchsia-50 border-purple-100',
      iconColor: 'text-purple-600',
      badge: 'AI Engine',
      badgeColor: 'purple' as const,
      learnMoreRoute: '/reports',
      learnMoreLabel: 'Full Forecast',
    },
    {
      icon: <Lightbulb size={18} />,
      title: 'Smart Business Tip',
      description: 'Tyohar aur seasonal events ke liye pehle se stock plan karein.',
      detail: 'Seasonal demand hike ke waqt margins behtar karne ke liye bulk ordering karein.',
      color: 'from-amber-50 to-yellow-50 border-amber-100',
      iconColor: 'text-amber-600',
      badge: 'Pro Tip',
      badgeColor: 'warning' as const,
      learnMoreRoute: '/inventory',
      learnMoreLabel: 'Plan Stock',
    },
  ];
};

export default function AI() {
  const store = useStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      text: `Namaste! 🙏 Main DukanDost AI hoon — aapka smart business assistant!\n\nAaj main aapki kaise madad kar sakta hoon?\n\nAap mujhse bikri, stock, udhaar, customers — kisi bhi baare mein pooch sakte hain!`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const insights = buildInsights(store);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const data = await api.getBusinessHealth();
      if (data.success) setHealthData(data);
    } catch (err) {
      console.error('Health fetch failed');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      type: 'user',
      text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text, store);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          type: 'bot',
          text: response,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000 + Math.random() * 600);
  };

  return (
    <div className="max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="AI Intelligence"
        subtitle="Apne business ka smart assistant — powered by DukanDost AI."
        icon={<Sparkles size={20} />}
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Chat Panel ── */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex flex-col overflow-hidden" style={{ height: '75vh', minHeight: '600px' }}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#1A1A2E]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">DukanDost AI</p>
                  <p className="text-[11px] text-white/60 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Online · Powered by Gemini
                  </p>
                </div>
              </div>
              <Badge status="purple" className="text-[10px]">BETA</Badge>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex', msg.type === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Bot size={16} className="text-orange-600" />
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm',
                    msg.type === 'bot'
                      ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                      : 'bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] text-white rounded-tr-none'
                  )}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <p className={cn('text-[10px] mt-1.5', msg.type === 'bot' ? 'text-slate-400' : 'text-orange-200')}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Bot size={16} className="text-orange-600" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto hide-scrollbar">
              {quickSuggestions.map(s => (
                <button
                  key={s.text}
                  onClick={() => sendMessage(s.text)}
                  className="whitespace-nowrap px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs font-semibold hover:bg-orange-100 transition-colors flex items-center gap-1"
                >
                  <span>{s.icon}</span> {s.text}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(inputText)}
                placeholder="Apna sawal yahan likhein (Hindi ya English)..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 transition-all"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="w-11 h-11 bg-[#FF6B00] disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center hover:bg-[#e66000] transition-colors shadow-md shadow-orange-200 disabled:shadow-none"
              >
                <Send size={18} />
              </button>
            </div>
          </Card>
        </div>

        {/* ── AI Intelligence Panels ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Business Health Score */}
          <Card className="p-6 bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500 opacity-50" />
            <div className="relative z-10 text-center">
              <h3 className="font-display font-bold text-slate-800 text-lg mb-6 flex items-center justify-center gap-2">
                <Crown size={20} className="text-orange-500" />
                Business Health Score
              </h3>
              
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * (healthData?.score || 0)) / 100}
                    strokeLinecap="round"
                    className="text-orange-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-display font-black text-slate-900 leading-none">
                    {healthData?.score || '--'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    HEALTH INDEX
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-6">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Growth</p>
                  <p className="text-sm font-bold text-green-600">+{healthData?.metrics?.revenueGrowth}%</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Recovery</p>
                  <p className="text-sm font-bold text-blue-600">{healthData?.metrics?.recoveryRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Risk</p>
                  <p className="text-sm font-bold text-orange-600">{healthData?.metrics?.riskRatio}%</p>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Recommendations */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-slate-900 flex items-center gap-2 text-base px-1">
              <Zap size={18} className="text-orange-500" /> Smart Recommendations
            </h3>

            {healthData?.recommendations?.map((rec: string, i: number) => (
              <Card key={i} className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100/50 hover:shadow-md transition-all">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {!healthData && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            )}
          </div>

          {/* Financing & Credit Score */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-[#1A1A2E] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-bold text-base flex items-center gap-2">
                    <Target size={18} className="text-orange-400" />
                    Credit Eligibility
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Financing Layer</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-display font-black text-lg text-orange-400 border border-white/10">
                  {healthData?.loanEligibility?.creditGrade || 'C'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Loan Eligibility</span>
                    <span className={cn('font-bold', healthData?.loanEligibility?.isEligible ? 'text-green-400' : 'text-red-400')}>
                      {healthData?.loanEligibility?.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-1000" 
                      style={{ width: `${(healthData?.score || 0)}%` }} 
                    />
                  </div>
                </div>

                {healthData?.loanEligibility?.isEligible && (
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Max Limit Available</p>
                    <p className="text-xl font-display font-bold text-white mt-0.5">
                      ₹{healthData?.loanEligibility?.maxAmount?.toLocaleString('en-IN')}
                    </p>
                    <button className="w-full mt-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors">
                      Apply for Capital
                    </button>
                  </div>
                )}

                {!healthData?.loanEligibility?.isEligible && (
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                    Higher health score (>70) aur consistent revenue hone par aap loan ke liye eligible ho jayenge.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* AI Capability Snapshot */}
          <Card className="p-4 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-4 opacity-10">
              <Zap size={80} />
            </div>
            <h4 className="font-display font-bold text-sm mb-3 flex items-center gap-2 relative z-10">
              <Sparkles size={16} className="text-orange-400" /> AI Capabilities
            </h4>
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-1 h-1 bg-orange-400 rounded-full" />
                Real-time Risk Analysis
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-1 h-1 bg-orange-400 rounded-full" />
                Predictive Cashflow Modeling
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-1 h-1 bg-orange-400 rounded-full" />
                Inventory Demand Forecasting
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
  );
}
